
function setMaxDate(collection, properties) {
    var values = [];

    collection.forEach(function (file) {

        properties.forEach(function (property) {
            if ( file[property] ) {
                values.push(file[property].unix());
            }
        });
    });
    if ( values.length ) {
        collection.metadata = collection.metadata || {};
        collection.metadata.maxDate = Math.max.apply(null, values);
    }
}

module.exports = function (opts) {
    return function (files, metalsmith, done) {
        var collections = metalsmith.metadata().collections;

        opts.collections.forEach(function (identifier) {
            setMaxDate(collections[identifier], opts.dateProperties);
        });
        done();
    };
};
