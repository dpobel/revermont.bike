var path = require('path'),
    async = require('async'),
    gm = require('gm');

function buildPath(filePath, fileName) {
    return path.dirname(filePath) + '/' + fileName;
}

function buildVariationFilePath(filePath, variationName) {
    var ext = path.extname(filePath),
        baseFilename = path.basename(filePath, ext);
    
    return buildPath(filePath, baseFilename + '_' + variationName + ext);
}

function registerVariation(buffer, variations, variationName, name, fullpath, cb) {
    gm(buffer)
        .size(function (err, size) {
            variations[variationName] = {
                name: name,
                fullpath: fullpath,
                width: size.width,
                height: size.height,
                size: buffer.length,
            };
            cb();
        });
}

function writeVariation(err, filePath, files, variationName, variationFilePath, buffer, cb) {
    if ( err ) {
        return cb(err);
    }
    files[variationFilePath] = {
        contents: buffer,
        path: variationFilePath
    };
    registerVariation(buffer, files[filePath].variations, variationName, path.basename(variationFilePath), variationFilePath, cb);
}

function generateVariation(filePath, files, variationName, settings, variations, cb) {
    var origFilePath = variations.original.fullpath,
        ratio, origRatio, origWidth, origHeight,
        variationFilePath = buildVariationFilePath(origFilePath, variationName),
        gmObj;

    if ( settings.width && settings.height ) {
        ratio = settings.width / settings.height;
        gmObj = gm(files[origFilePath].contents);

        origWidth = variations.original.width;
        origHeight = variations.original.height;
        origRatio = origWidth / origHeight;
        if ( origRatio < ratio ) {
            gmObj.resize(settings.width)
                .crop(settings.width, settings.height, 0, (settings.width/origWidth * origHeight - settings.height)/2)
                .toBuffer(function (err, buffer) {
                    writeVariation(err, filePath, files, variationName, variationFilePath, buffer, cb);
                });
        } else if ( origRatio > ratio ) {
            gmObj.resize(null, settings.height)
                .crop(settings.width, settings.height, (settings.height/origHeight * origWidth - settings.width)/2, 0)
                .toBuffer(function (err, buffer) {
                    writeVariation(err, filePath, files, variationName, variationFilePath, buffer, cb);
                });
        } else {
            gmObj.resize(settings.width)
                .toBuffer(function (err, buffer) {
                    writeVariation(err, filePath, files, variationName, variationFilePath, buffer, cb);
                });
        }
    } else if ( settings.width ) {
        gm(files[origFilePath].contents)
            .resize(settings.width)
            .toBuffer(function (err, buffer) {
                writeVariation(err, filePath, files, variationName, variationFilePath, buffer, cb);
            });
    } else if ( settings.height ) {
        gm(files[origFilePath].contents)
            .resize(null, settings.height)
            .toBuffer(function (err, buffer) {
                writeVariation(err, filePath, files, variationName, variationFilePath, buffer, cb);
            });
    } else {
        cb(new Error("Wrong settings for the variation " + variationName));
    }
}

module.exports = function (opts) {
    opts = opts || {};
    opts.variations = opts.variations || {};
    return function (files, metalsmith, done) {
        var originalTasks = [], tasks = [];

        Object.keys(files).forEach(function (filePath) {
            var fileObj = files[filePath],
                originalFullPath,
                variations;
    
            if ( !fileObj.photo ) {
                return;
            }
            originalFullPath = buildPath(filePath, fileObj.photo);
            variations = fileObj.variations = {};
            originalTasks.push(function (cb) {
                registerVariation(files[originalFullPath].contents, variations, "original", fileObj.photo, originalFullPath, cb);
            });

            Object.keys(opts.variations).forEach(function (variationName) {
                tasks.push(function (cb) {
                    generateVariation(
                        filePath,
                        files,
                        variationName,
                        opts.variations[variationName],
                        variations,
                        cb
                    );
                });
            });
        });
        async.parallelLimit(originalTasks, 2, function (error) {
            if ( error ) {
                return done(error);
            }
            async.parallelLimit(tasks, 2, done);
        });
    };
};
