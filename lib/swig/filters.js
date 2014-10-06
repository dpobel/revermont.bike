var autolink = require('autolinker'),
    moment = require('moment');

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

    swig.setFilter('autolink', function (input) {
        return autolink.link(input, {
            newWindow: false,
            stripPrefix: true,
            email: false,
            twitter: false
        });
    });

    swig.setFilter('nl2br', function (input) {
        return input
                .replace(/\r\n/g, "\n")
                .replace(/\n\n(\n)+/g, "\n\n")
                .replace(/\n/g, "<br>");
    });

    swig.setFilter('parse_date', function (input) {
        return moment(input);
    });

    swig.setFilter('shorten', function (input, size) {
        var ellipsis = '...';

        if ( (input.length - ellipsis.length) > size ) {
            return input.substr(0, size - ellipsis.length) + ellipsis;
        }
        return input;
    });

    swig.setFilter('round', function (input, decimals) {
        return parseFloat(input).toFixed(decimals);
    });
};
