/* global describe, it, beforeEach */
var gpx = require('../lib/metalsmith/gpxparser'),
    assert = require('assert'),
    sinon = require('sinon');

describe('Metalsmith gpx', function () {
    var ms;

    beforeEach(function () {
        ms = {source: function () { return __dirname + '/fixtures/gpxparser'; }};
    });


    it('should ignore files without a "gpx" entry', function (done) {
        var files = {"testFile1": {}, "testFile2": {}},
            spy = sinon.spy(ms, 'source');

        gpx()(files, ms, function (err) {
            assert.ok(typeof err === 'undefined');
            assert.equal(
                0, Object.keys(files.testFile1).length,
                "files.testFile should be intact"
            );
            assert.equal(
                0, Object.keys(files.testFile2).length,
                "files.testFile should be intact"
            );
            assert.equal(
                0, spy.callCount, "The files should have been ignored"
            );
            done();
        });
    });


    describe('error handling', function () {
        it('should handle non existing gpx file', function (done) {
            var files = {'tracks/testFile.md': {'gpx': 'doesnotexist.gpx'}},
                spy = sinon.spy(ms, 'source');

            gpx()(files, ms, function (err) {
                assert.ok(err instanceof Error);
                assert.ok(spy.called);
                done();
            });
        });

        it('should handle invalid xml file', function (done) {
            var files = {'tracks/testFile.md': {'gpx': 'invalid.gpx'}},
                spy = sinon.spy(ms, 'source');

            gpx()(files, ms, function (err) {
                assert.ok(err instanceof Error);
                assert.ok(spy.called);
                done();
            });
        });
    });

    describe('color', function () {
        it('should generate a color', function (done) {
            var files = {'tracks/test1.md': {'gpx': 'test1.gpx'}};

            gpx()(files, ms, function (err) {
                var file = files['tracks/test1.md'],
                    color = file.color;

                assert.ok(typeof err === 'undefined');
                assert.ok(typeof color === 'string');
                assert.ok(color.match(/^#[0-9A-F]{6}$/i));
                done();
            });
        });
    });

    describe('parsing', function () {
        it('should parse a complete gpx file', function (done) {
            var files = {'tracks/test1.md': {'gpx': 'test1.gpx'}},
                spy = sinon.spy(ms, 'source');

            gpx()(files, ms, function (err) {
                var file = files['tracks/test1.md'],
                    bounds = file.bounds;

                assert.ok(typeof err === 'undefined');
                assert.ok(spy.called);

                assert.equal("Test 1", file.title);
                assert.equal("2014-05-23T07:53:00Z", file.created);
                assert.strictEqual(768.2, file.elevation.max);
                assert.strictEqual(200.1, file.elevation.min);
                assert.strictEqual(228, file.elevation.loss);
                assert.strictEqual(568, file.elevation.gain);
                assert.strictEqual(99.4, file.distance);

                assert.strictEqual(46.242022, bounds.minlat);
                assert.strictEqual(46.31515, bounds.maxlat);
                assert.strictEqual(5.364807, bounds.minlon);
                assert.strictEqual(5.405417, bounds.maxlon);

                assert.strictEqual(false, file.loop);
                done();
            });
        });

        it('should ignore points without elevation', function (done) {
            var files = {'tracks/test1.md': {'gpx': 'noele.gpx'}},
                spy = sinon.spy(ms, 'source');

            gpx()(files, ms, function (err) {
                var file = files['tracks/test1.md'],
                    bounds = file.bounds;

                assert.ok(typeof err === 'undefined');
                assert.ok(spy.called);

                assert.equal("Test 1", file.title);
                assert.equal("2014-05-23T07:53:00Z", file.created);
                assert.strictEqual(740.3, file.elevation.max);
                assert.strictEqual(200.1, file.elevation.min);
                assert.strictEqual(200, file.elevation.loss);
                assert.strictEqual(540, file.elevation.gain);
                assert.strictEqual(99.3, file.distance);

                assert.strictEqual(46.242022, bounds.minlat);
                assert.strictEqual(46.31515, bounds.maxlat);
                assert.strictEqual(5.364807, bounds.minlon);
                assert.strictEqual(5.405417, bounds.maxlon);
                done();
            });
        });


        it('should handle a gpx without bounds', function (done) {
            var files = {'tracks/test1.md': {'gpx': 'nobounds.gpx'}},
                spy = sinon.spy(ms, 'source');

            gpx()(files, ms, function (err) {
                var file = files['tracks/test1.md'],
                    bounds = file.bounds;

                assert.ok(typeof err === 'undefined');
                assert.ok(spy.called);

                assert.equal("Test 1", file.title);
                assert.equal("2014-05-23T07:53:00Z", file.created);
                assert.strictEqual(768.2, file.elevation.max);
                assert.strictEqual(200.1, file.elevation.min);
                assert.strictEqual(228, file.elevation.loss);
                assert.strictEqual(568, file.elevation.gain);
                assert.strictEqual(99.4, file.distance);

                assert.strictEqual(46.250508, bounds.minlat);
                assert.strictEqual(47, bounds.maxlat);
                assert.strictEqual(5.317694, bounds.minlon);
                assert.strictEqual(6, bounds.maxlon);
                done();
            });
        });

        it('should fallback to the metadata name if the track name is not set', function (done) {
            var files = {'tracks/test1.md': {'gpx': 'metadataname.gpx'}},
                spy = sinon.spy(ms, 'source');

            gpx()(files, ms, function (err) {
                var file = files['tracks/test1.md'];

                assert.ok(typeof err === 'undefined');
                assert.ok(spy.called);

                assert.equal("Metadata name", file.title);
                done();
            });
        });

        it('should keep the title if name is defined', function (done) {
            var title = 'no name?',
                files = {
                    'tracks/test1.md': {'title': title, 'gpx': 'noname.gpx'}
                },
                spy = sinon.spy(ms, 'source');

            gpx()(files, ms, function (err) {
                var file = files['tracks/test1.md'];

                assert.ok(typeof err === 'undefined');
                assert.ok(spy.called);

                assert.equal(title, file.title);
                done();
            });
        });

        it('should keep the created property is time not defined', function (done) {
            var files = {
                    'tracks/test1.md': {'gpx': 'notime.gpx'}
                },
                spy = sinon.spy(ms, 'source');

            gpx()(files, ms, function (err) {
                var file = files['tracks/test1.md'];

                assert.ok(typeof err === 'undefined');
                assert.ok(spy.called);

                assert.ok(typeof file.title === 'undefined');
                done();
            });
        });

        it('should detect whether the track is a loop', function (done) {
            var files = {
                    'tracks/test1.md': {'gpx': 'loop.gpx'}
                },
                spy = sinon.spy(ms, 'source');

            gpx()(files, ms, function (err) {
                var file = files['tracks/test1.md'];

                assert.ok(typeof err === 'undefined');
                assert.ok(spy.called);

                assert.strictEqual(true, file.loop);
                done();
            });
        });

        it('should ignore points without elevation when detecting a loop', function (done) {
            var files = {
                    'tracks/test1.md': {'gpx': 'loop_noele.gpx'}
                },
                spy = sinon.spy(ms, 'source');

            gpx()(files, ms, function (err) {
                var file = files['tracks/test1.md'];

                assert.ok(typeof err === 'undefined');
                assert.ok(spy.called);

                assert.strictEqual(true, file.loop);
                done();
            });
        });
    });
});
