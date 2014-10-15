/* global describe, it, beforeEach */
var msConcat = require('../lib/metalsmith/concat'),
    assert = require('assert'),
    metalsmith = false;

describe('Metalsmith concat', function () {
    var files,
        output = 'style.css';

    beforeEach(function () {
        files = {
            'css1.css': {contents: "/* css1 */"},
            'css2.css': {contents: "/* css2 */"},
            'foobar.md': {contents: "/* foobar */"},
            'assets/relative.css': {contents: "*{background: url(relative.gif);}"},
            'assets/absolute.css': {contents: "*{background: url(/absolute.gif);}"},
            'assets/protocol.css': {contents: "*{background: url(http://revermont.bike/style.css);}"},
        };
    });

    it('should concatenate the given files', function () {
        msConcat({output: output, files: ['css1.css', 'css2.css']})(files, metalsmith, function () {
            assert.ok(typeof files[output] === 'object');
            assert.equal(
                files[output].contents,
                "/* css1 *//* css2 */"
            );
        });
    });

    it('should remvove the files', function () {
        msConcat({output: output, files: ['css1.css', 'css2.css']})(files, metalsmith, function () {
            assert.ok(typeof files['css1.css'] === 'undefined');
            assert.ok(typeof files['css2.css'] === 'undefined');
            assert.ok(typeof files['foobar.md'] !== 'undefined');
        });
    });

    it('should ensure the order', function () {
        msConcat({output: output, files: ['css2.css', 'css1.css']})(files, metalsmith, function () {
            assert.ok(typeof files[output] === 'object');
            assert.equal(
                files[output].contents,
                "/* css2 *//* css1 */"
            );
        });
    });

    describe('rewrite css', function () {
        it('should rewrite urls in the css code', function () {
            msConcat({output: output, css: true, files: ['assets/relative.css']})(files, metalsmith, function () {
                assert.ok(
                    files[output].contents.indexOf("/assets/relative.gif") !== -1
                );
            });
        });

        it('should ignore absolute path in the css code', function () {
            msConcat({output: output, css: true, files: ['assets/protocol.css']})(files, metalsmith, function () {
                assert.ok(
                    files[output].contents.indexOf("assets") === -1
                );
            });
        });

        it('should ignore absolute URI in the css code', function () {
            msConcat({output: output, css: true, files: ['assets/absolute.css']})(files, metalsmith, function () {
                assert.ok(
                    files[output].contents.indexOf("/assets/absolute.gif") === -1
                );
            });
        });
    });
});
