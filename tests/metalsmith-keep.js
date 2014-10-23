/* global describe, it */
var msKeep = require('../lib/metalsmith/keep'),
    assert = require('assert'),
    metalsmith = false;

describe('Metalsmith keep', function () {
    var pattern = '**/*.html',
        files = {
            'foo/fighters.html': {},
            'something.html': {},
            'from_nothing.json': {},
        };

    it('should keep the matching files', function (done) {
        msKeep(pattern)(files, metalsmith, function (err) {

            assert.ok(typeof err === 'undefined');
            assert.ok(typeof files['from_nothing.json'] === 'undefined');
            assert.ok(typeof files['foo/fighters.html'] === 'object');
            assert.ok(typeof files['something.html'] === 'object');
            done();
        });
    });
});
