module.exports = function (swig, config) {
    var trimLeadingSlashes = new RegExp("^/{1,}"),
        assetDir = config.assets.replace(trimLeadingSlashes, '').replace(/\/{1,}$/, '');

    swig.setFilter('url', function (path) {
        if ( path.charAt(0) !== '/' ) {
            path = '/' + path;
        }

        if ( path.charAt(path.length - 1) !== '/' ) {
            path = path + '/';
        }
        return path;
    });

    swig.setFilter('asset', function (path) {
        return '/' + assetDir + '/' + path.replace(trimLeadingSlashes, '');
    });
};
