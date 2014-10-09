
function buildInfoFilename(tag, basePath, ext) {
    return (basePath ? (basePath + '/' ) : "") + tag + '.' + ext;
}

module.exports = function (opts) {
    var basePath = '',
        ext = 'md';

    opts = opts || {};
    basePath = opts.basePath || basePath;
    ext = opts.ext || ext;

    basePath = basePath.replace(/\/*$/g, '');
    return function (files, metalsmith, done) {
        var tags = metalsmith.metadata().tagsList;

        Object.keys(tags).forEach(function (tag) {
            var fileObj = metalsmith.metadata().tagsList[tag],
                tagInfoFile = buildInfoFilename(tag, basePath, ext);

            if ( files[tagInfoFile] ) {
                Object.keys(files[tagInfoFile]).forEach(function (key) {
                    fileObj[key] = files[tagInfoFile][key];
                });
            }
        });
        done();
    };
};
