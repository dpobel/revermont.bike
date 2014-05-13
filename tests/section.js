/* global describe, it */
var assert = require('assert'),
    section = require('../lib/metalsmith/section');

describe('Section plugin', function () {
    var files = {
            "file1": {},
            "file2": {},
        };

    it('should set the section to undefined', function () {
        var func = section();

        func(files, undefined, function () {
            assert.equal(undefined, files.file1.section);
            assert.equal(undefined, files.file2.section);
        });
    });

    it('should set the default section', function () {
        var def = 'standard',
            func = section({"default": def});

        func(files, undefined, function () {
            assert.equal(def, files.file1.section);
            assert.equal(def, files.file2.section);
        });
    });

    it('should set the default section if the pattern does not match', function () {
        var def = 'standard',
            func = section({
                "default": def,
                "rules": [
                    {"pattern": "a*", "section": 'not standard'}
                ]
            });

        func(files, undefined, function () {
            assert.equal(def, files.file1.section);
            assert.equal(def, files.file2.section);
        });
    });

    it('should set the section if the pattern matches', function () {
        var sect = 'standard',
            func = section({
                "rules": [
                    {"pattern": "f*", "section": sect}
                ]
            });

        func(files, undefined, function () {
            assert.equal(sect, files.file1.section);
            assert.equal(sect, files.file2.section);
        });
    });

    it('should set the section if the pattern matches', function () {
        var def = 'standard',
            sect = 'other',
            func = section({
                "default": def,
                "rules": [
                    {"pattern": "*1", "section": sect}
                ]
            });

        func(files, undefined, function () {
            assert.equal(sect, files.file1.section);
            assert.equal(def, files.file2.section);
        });
    });

});
