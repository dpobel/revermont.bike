/* global describe, it, beforeEach, afterEach */
var msShot = require('../lib/metalsmith/screenshot'),
    assert = require('assert'),
    sinon = require('sinon'),
    async = require('async'),
    path = require('path');

describe('Metalsmith screenshot', function () {
    var shotClass = 'shot',
        opts = {
            viewport: {width: 500, height: 300},
            host: "myhost",
            base: "/base/",
            port: 9000,
            selector: "." + shotClass,
            format: "jpg",
            filename: "map.jpg",
            concurrency: 2,
            urlHash: "simplified-map",
            layerReadyClass: "default-layer-loaded",
            transitionWaitTime: 500
        },
        metalsmith = false;

    it('should limit the concurrency of the screenshot processes', function (done) {
        var parallelLimit = sinon.stub(async, 'parallelLimit', function (tasks, concurrency, cb) {
                cb();
            });
        msShot(opts)({}, metalsmith, function (err) {
            assert.ifError(err);
            assert.equal(opts.concurrency, parallelLimit.args[0][1]);
            parallelLimit.restore();
            done();
        });
    });

    it('should delete all files', function (done) {
        var files = {
                "file1": {contents: ""},
                "file2": {contents: ""}
            };

        msShot(opts)(files, metalsmith, function (err) {
            assert.ifError(err);
            assert.ok(typeof files.file1 === 'undefined');
            assert.ok(typeof files.file2 === 'undefined');
            done();
        });
    });

    describe('casper', function () {
        var path1 = 'something/from/nothing/index.html',
            path2 = 'foo/fighters.html',
            stdout = 'stdout',
            stderr = 'stderr',
            exec, files;

        beforeEach(function () {
            exec = sinon.stub(require('child_process'), 'execFile');
            files = {};
            files[path1] = {
                contents: "<div class='" + shotClass + "'>Yes!</div>",
            };
            files[path2] = {
                contents: "<div class='not-shot'>No!</div>",
            };
        });

        afterEach(function () {
            exec.restore();
        });
        it('should take and store a screenshot', function (done) {
            exec.callsArgWith(2, false, stdout, "");

            msShot(opts)(files, metalsmith, function (err) {
                var screen1 = path.dirname(path1) + '/' + opts.filename,
                    screen2 = path.dirname(path2) + '/' + opts.filename;

                assert.equal("node_modules/.bin/casperjs", exec.args[0][0]);
                assert.deepEqual([
                    path.resolve('lib/metalsmith/utils/screenshot.js'),
                    'http://' + opts.host + ":" + opts.port + opts.base + path1 + '#' + opts.urlHash,
                    opts.viewport.width,
                    opts.viewport.height,
                    opts.selector,
                    opts.layerReadyClass,
                    opts.format,
                    opts.transitionWaitTime,
                ], exec.args[0][1]);

                assert.ifError(err);
                assert.ok(typeof files.file1 === 'undefined');
                assert.ok(typeof files.file2 === 'undefined');

                assert.ok(typeof files[screen1] !== 'undefined');
                assert.ok(typeof files[screen2] === 'undefined');

                assert.equal(new Buffer(stdout, "base64").toString('ascii'), files[screen1].contents.toString('ascii'));
                done();
            });
        });

        it('should handle the error', function (done) {
            exec.callsArgWith(2, true, stdout, stderr);

            msShot(opts)(files, metalsmith, function (err) {
                assert.ok(typeof err !== 'undefined');
                done();
            });
        });
    });
});
