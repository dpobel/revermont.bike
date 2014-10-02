var path = require('path');

function resolvePartialPath(files, basePath, partial)
{
    var paths = Object.keys(files), i, filePath;

    for (i = 0; i != paths.length; i++) {
        filePath = paths[i];
        if ( filePath.indexOf(basePath + '/' + partial) !== -1 ) {
            return filePath;
        }
    }
    return false;
}

function autoInclude (files, filePath, cb) {
    var file = files[filePath],
        basePath = path.dirname(filePath);

    file.autoinclude.forEach(function (partial) {
        var partialFilePath = resolvePartialPath(files, basePath, partial);

        if ( partialFilePath ) {
            file[partial] = files[partialFilePath].contents;
            delete files[partialFilePath];
        }
    });
}

module.exports = function () {
    return function (files, metalsmith, done) {
        Object.keys(files).forEach(function (filePath) {
            var file = files[filePath];

            if ( file && file.autoinclude ) {
                autoInclude(files, filePath, done);
            }
        });
        done();
    };
};
