module.exports = function () {
    return function (files, metalsmith, done) {
        var tagsList = metalsmith.metadata().tagsList;

        Object.keys(tagsList).forEach(function (tag) {
            var tagObject = tagsList[tag];

            tagObject.weight = tagObject.posts.length;
            tagObject.photos = tagObject.photos || [];
            tagObject.posts.forEach(function (file, i) {
                if ( file.photo ) {
                    tagObject.photos.push(file);
                }
            });
        });
        done();
    };
};
