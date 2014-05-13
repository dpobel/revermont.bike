var Matcher = require('minimatch').Minimatch;

/**
 * Defines a section depending a pattern
 *
 * @param opts {Object}
 * @param opts.default {String} the default section when no pattern matches
 * @param opts.rules {Array} array of rules to set the section, each item of the
 * array should be a literal object containing a `pattern` entry and a `section`
 * entry
 * @return {Function}
 */
module.exports = function plugin(opts) {
    var opts = opts || {},
        def = opts["default"] || undefined,
        rules = opts.rules || [],
        matchers = {};

    rules.forEach(function (rule) {
        matchers[rule.section] = new Matcher(rule.pattern);
    });

    return function (files, metalsmith, done) {
        Object.keys(files).forEach(function (file) {
            files[file].section = def;
            Object.keys(matchers).forEach(function (section) {
                if ( matchers[section].match(file) ) {
                    files[file].section = section;
                }
            });
        });
        done();
    };
};
