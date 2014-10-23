var minimatch = require('minimatch');

module.exports = function (pattern) {
    return function (files, metalsmith, done) {
        Object.keys(files).forEach(function (filePath) {
            if ( !minimatch(filePath, pattern) ) {
                delete files[filePath];
            }
        });
        done();
    };
};
