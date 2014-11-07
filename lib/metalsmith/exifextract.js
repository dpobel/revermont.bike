var ExifImage = require('exif').ExifImage,
    path = require('path'),
    moment = require('moment'),
    async = require('async');

function dms2decimal(coord) {
    return (coord[0] + coord[1]/60 + coord[2]/3600);
}

function photoPath(filePath, files) {
    return path.dirname(filePath) + '/' + files[filePath].photo;
}

module.exports = function () {
    return function (files, metalsmith, done) {
        var tasks = [],
            metadata = metalsmith.metadata();

        metadata.geoimages = [];
        Object.keys(files).forEach(function (filePath) {
            var fileObj = files[filePath];

            if ( fileObj.photo ) {
                tasks.push(function (cb) {
                    new ExifImage({image: files[photoPath(filePath, files)].contents}, function (error, exifData) {
                        var gps, image;

                        if ( error ) {
                            return cb(error);
                        }
                        gps = exifData.gps;
                        if ( !fileObj.latlon && gps.GPSLatitude && gps.GPSLongitude ) {
                            fileObj.latlon = [
                                dms2decimal(gps.GPSLatitude),
                                dms2decimal(gps.GPSLongitude),
                            ];
                        }
                        if ( fileObj.latlon ) {
                            metadata.geoimages.push(fileObj);
                        }
                        image = exifData.image;
                        if ( image.ModifyDate ) {
                            if ( !fileObj.created ) {
                                fileObj.created = moment(image.ModifyDate, "YYYY:MM:DD HH:mm:ss");
                            }
                            if ( !fileObj.updated ) {
                                fileObj.updated = moment(image.ModifyDate, "YYYY:MM:DD HH:mm:ss");
                            }
                        }
                        cb();
                    });
                });
            }
        });
        async.parallelLimit(tasks, 2, done);
    };
};
