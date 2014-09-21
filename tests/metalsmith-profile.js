/* global describe, it */
var msProfile = require('../lib/metalsmith/profile'),
    isPng = require('is-png'),
    pngSize = require('png-size'),
    assert = require('assert'),
    metalsmith = false;

describe('Metalsmith profile', function () {
    var conf = {
            "width": 500,
            "height": 200,
            "offsetMin": 20,
            "offsetMax": 50,
            "interpolation": "basis",
            "stroke": true,
            "strokeColor": "#5284E5",
            "color": "lightblue",
            "renderer": "area"
        };
    it('should ignore files with a `points` property', function (done) {
        var nopoints = {},
            files = {
                'nopoints': nopoints,
            };

        msProfile(conf)(files, metalsmith, function (err) {
            assert.ok(typeof err === 'undefined');
            assert.strictEqual(nopoints, files.nopoints);
            assert.equal(1, Object.keys(files).length);
            done();
        });
    });

    it('should generate a PNG profile in the same directory', function (done) {
        var fileDir = 'dir/subdir/track/',
            filePath = fileDir + 'index.md',
            profilePath = fileDir + 'profile.png',
            files = {};
        
        files[filePath] = {
            points: [
                {dst: 0, ele: 200},
                {dst: 1, ele: 220},
                {dst: 3, ele: 240},
            ],
            elevation: {min: 200, max: 240},
        };
        msProfile(conf)(files, metalsmith, function () {
            var size;

            assert.equal(profilePath, files[filePath].profile);
            assert.ok(isPng(files[profilePath].contents));
            
            size = pngSize(files[profilePath].contents);
            assert.equal(conf.width, size.width);
            assert.equal(conf.height, size.height);
            done();
        });
    });
});
