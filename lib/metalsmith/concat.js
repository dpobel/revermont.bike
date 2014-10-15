var rework = require('rework'),
    reworkUrl = require('rework-plugin-url'),
    path = require('path'),
    url = require('url');

module.exports = function (opts) {
    return function (files, metalsmith, done) {
        var concatHash = {};

        files[opts.output] = {contents: ""};
        opts.files.forEach(function (value) {
            concatHash[value] = "";
        });

        Object.keys(files).forEach(function (filename) {
            if ( concatHash[filename] === "" ) {
                concatHash[filename] = files[filename].contents.toString();
                delete files[filename];
            }
        });
        opts.files.forEach(function (value) {
            var dir = '/' + path.dirname(value);

            if ( opts.css ) {
                files[opts.output].contents += rework(concatHash[value])
                    .use(reworkUrl(function (urlValue) {
                        var struct = url.parse(urlValue);
                        if ( urlValue.indexOf(dir) === -1 && urlValue.charAt(0) !== '/' && urlValue.charAt(0) !== '#' && !struct.protocol ) {
                            return dir + '/' + urlValue;
                        }
                        return urlValue;
                    })).toString();
            } else {
                files[opts.output].contents += concatHash[value];
            }
        });
        done();
    };
};
