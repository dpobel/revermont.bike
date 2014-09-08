var clone = require('lodash.clone'),
    path = require('path');

module.exports = function (opts) {
    opts = opts || {};
    var perPage = opts.perPage || 10;

    return function (files, metalsmith, done) {
        var tagsList = metalsmith.metadata().tagsList;

        Object.keys(tagsList).forEach(function (tag) {
            var tagObject = tagsList[tag], i, prev,
                basePath = tagObject.path.substr(0, tagObject.path.lastIndexOf(path.extname(tagObject.path))),
                numPages = Math.ceil(tagObject.posts.length / perPage),
                pageTagObject = tagObject,
                pages = {};

            for (i = 0; i != numPages; i++) {
                if ( prev ) {
                    pageTagObject = clone(pageTagObject, false);
                    prev.pagination.next = pageTagObject;
                    pageTagObject.path = basePath + "/" + (i+1) + "/index.html";
                    pageTagObject.pagination = clone(prev.pagination, false);
                    files[pageTagObject.path] = pageTagObject;
                }
                pages[(i+1).toString()] = pageTagObject;
                pageTagObject.pagination = {
                    prev: prev,
                    total: numPages,
                    num: i+1,
                    files: tagObject.posts.slice(i * perPage, (i + 1) * perPage),
                    pages: pages,
                };
                prev = pageTagObject;
            }
        });

        done();
    };
};
