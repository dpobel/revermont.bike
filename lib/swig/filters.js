module.exports = function (swig, config) {
    var trimLeadingSlashes = new RegExp("^/{1,}"),
        assetDir = config.assets.replace(trimLeadingSlashes, '').replace(/\/{1,}$/, ''),
        url = function (path, noAppendSlash) {
            if ( path.charAt(0) !== '/' ) {
                path = '/' + path;
            }

            if ( !noAppendSlash && path.charAt(path.length - 1) !== '/' ) {
                path = path + '/';
            }
            return path;
        };

    swig.setFilter('url', url);

    swig.setFilter('ext_url', function (path, noAppendSlash) {
        return config.baseUri.replace(/\/+$/, '') + url(path, noAppendSlash);
    });

    swig.setFilter('asset', function (path) {
        return '/' + assetDir + '/' + path.replace(trimLeadingSlashes, '');
    });

    swig.setFilter('filter_points', function (points, step) {
        var res = [];

        points.forEach(function (value, i) {
            if ( i%step === 0) {
                res.push({lon: value.lon, lat: value.lat});
            }
        });
        return res;
    });

    swig.setFilter('rssify', function (input) {
        return input.replace(/(src|href)=(['"])\/([^\/])/g, '$1=$2' + config.baseUri.replace(/\/+$/, '') + '/' + '$3');
    });
};
