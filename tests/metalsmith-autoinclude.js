/* global describe, it */
var msAutoInclude = require('../lib/metalsmith/autoinclude'),
    assert = require('assert'),
    metalsmith = false;

describe('Metalsmith profile', function () {
    it('should ignore files with the autoinclude property', function (done) {
        var files = {'file1': {}, 'file2': undefined};

        msAutoInclude()(files, metalsmith, function () {
            assert.equal(0, Object.keys(files.file1).length);
            assert.ok(typeof files.file2 === 'undefined');
            done();
        });
    });

    it('should include the existing file indicated by the autoinclude property', function (done) {
        var files = {
                'path/to/file1/index.md': {
                    'autoinclude': ['partial1', 'partial2'],
                },
                'path/to/file1/partial1': {
                    'contents': '1',
                },
                'path/to/file1/partial2': {
                    'contents': '2',
                },
            };

        msAutoInclude()(files, metalsmith, function () {
            var file = files['path/to/file1/index.md'];

            assert.equal("1", file.partial1);
            assert.equal("2", file.partial2);
            done();
        });
    });

    it('should ignore non existing autoincluded file', function (done) {
        var files = {
                'path/to/file1/index.md': {
                    'autoinclude': ['partial1', 'partial2'],
                },
                'path/to/file1/partial1': {
                    'contents': '1',
                },
            };

        msAutoInclude()(files, metalsmith, function () {
            var file = files['path/to/file1/index.md'];

            assert.equal("1", file.partial1);
            assert.ok(typeof file.partial2 === 'undefined');
            done();
        });
    });

    it('should remove the included files from the list', function (done) {
        var files = {
                'path/to/file1/index.md': {
                    'autoinclude': ['partial1', 'partial2'],
                },
                'path/to/file1/partial1': {
                    'contents': '1',
                },
                'path/to/file1/partial2': {
                    'contents': '2',
                },
            };

        msAutoInclude()(files, metalsmith, function () {
            var file = files['path/to/file1/index.md'];

            assert.ok(typeof file !== 'undefined');
            assert.ok(typeof files['path/to/file1/partial1'] === 'undefined');
            assert.ok(typeof files['path/to/file1/partial2'] === 'undefined');
            done();
        });
    });
});
