/* global describe, it, beforeEach, afterEach */
var gpxcleaner = require('../lib/metalsmith/gpxcleaner'),
    fs = require('fs'),
    events = require('events'),
    stream = require('stream'),
    libxmljs = require('libxmljs'),
    assert = require('assert'),
    sinon = require('sinon'),
    nsConfig = {"gpx": "http://www.topografix.com/GPX/1/1"};

describe('Metalsmith gpxcleaner', function () {
    var fixturesDir = __dirname + '/fixtures/gpxcleaner/';

    it('should ignore non gpx files', function (done) {
        var f1 = {}, f2 = {},
            files = {"file1.md": f1, "file2.md": f2};

        gpxcleaner()(files, false, function (err) {
            assert.strictEqual(f1, files['file1.md']);
            assert.strictEqual(f2, files['file2.md']);
            done();
        });
    });

    it('should handle invalid GPX file', function (done) {
        var files = {'invalid.gpx': {contents: "I'm wrong :)"}};

        gpxcleaner()(files, false, function (err) {
            assert.ok(err instanceof Error);
            done();
        });
    });

    describe('Removing elements', function () {
        var testRemoval = function (path, xpath, count, done) {
                var files = {},
                    fullpath = fixturesDir + path;

                fs.readFile(fullpath, function (err, content) {
                    files[path] = {contents: content};

                    gpxcleaner()(files, false, function (err) {
                        var doc = libxmljs.parseXmlString(files[path].contents);

                        assert.equal(count, doc.find(xpath, nsConfig).length);
                        done();
                    });
                });
            };

        it('should remove the "extensions" element', function (done) {
            testRemoval('tracks/extensions.gpx', '//gpx:extensions', 0, done);
        });

        it('should remove the "time" elements', function (done) {
            testRemoval('tracks/time.gpx', '//gpx:time', 0, done);
        });

        it('should remove points without an "ele" element', function (done) {
            testRemoval('tracks/noelevations.gpx', '//gpx:trkpt', 2, done);
        });
    });

    describe('Fixing the gpx', function () {
        it('should fix the elevations', function (done) {
            var files = {}, path = 'tracks/fixelevations.gpx',
                fullpath = fixturesDir + path;

            fs.readFile(fullpath, function (err, content) {
                files[path] = {contents: content};

                gpxcleaner()(files, false, function (err) {
                    var doc = libxmljs.parseXmlString(files[path].contents),
                        elevations = doc.find('//gpx:ele', nsConfig);

                    elevations.forEach(function (ele) {
                        assert.equal(350, parseInt(ele.text()));
                    });
                    assert.equal(2, elevations.length);
                     
                    done();
                });
            });
        });

        describe('convolution', function () {
            it('should do 2 convolutions', function (done) {
                var files = {}, path = 'tracks/convolution.gpx',
                    fullpath = fixturesDir + path;

                fs.readFile(fullpath, function (err, content) {
                    files[path] = {contents: content};

                    gpxcleaner()(files, false, function (err) {
                        var doc = libxmljs.parseXmlString(files[path].contents),
                            elevations = doc.find('//gpx:ele', nsConfig);

                        fs.readFile(fixturesDir + 'tracks/convolution_result.gpx', function (err, content) {
                            var result = libxmljs.parseXmlString(content),
                                resEle = result.find('//gpx:ele', nsConfig);

                            assert.equal(resEle.length, elevations.length);
                            resEle.forEach(function (ele, i) {
                                assert.equal(resEle[i].text(), elevations[i].text());
                            });

                        });
                        done();
                    });
                });
            });
        });

        describe('gpsbabel call', function () {
            var spawn, eventEmitter;

            beforeEach(function () {
                eventEmitter = new events.EventEmitter();
                eventEmitter.stdin = new stream.Writable();
                eventEmitter.stdout = new stream.Readable();

                eventEmitter.stdin._write = function () {};
                eventEmitter.stdout._read = function () {};

                spawn = sinon.stub(require('child_process'), 'spawn');
                spawn.returns(eventEmitter);
            });

            afterEach(function () {
                spawn.restore();
            });

            function testGpsBabel(limit, localLimit, done) {
                var files = {}, path = 'tracks/2001.gpx',
                    fullpath = fixturesDir + path,
                    stdinWriteStub, newContent, doc, newName = 'New GPX name';

                fs.readFile(fullpath, function (err, content) {
                    files[path] = {contents: content};
                    if ( localLimit ) {
                        files[path].limit = localLimit;
                    }

                    stdinWriteStub = sinon.stub(eventEmitter.stdin, "write", function (string, callback) {
                        assert.equal(
                            libxmljs.parseXmlString(content).toString(), string,
                            "The XML should have been written to the stdin of gpsbabel"
                        );
                        callback();
                    });

                    gpxcleaner(limit ? {limit: limit} : undefined)(files, false, function (err) {
                        var params, flags, simplifyOpt, newDoc;

                        assert.ok(spawn.calledOnce, "spawn should have been called once");
                        assert.ok(spawn.calledWith('gpsbabel'), "gpsbabel command should have been called");

                        params = spawn.getCall(0).args[1];
                        flags = spawn.getCall(0).args[2];

                        assert.ok(Array.isArray(params));
                        params.forEach(function (param) {
                            var l = 2000;

                            if ( localLimit ) {
                                l = localLimit;
                            } else if ( limit ) {
                                l = limit;
                            }
                            if ( param === 'simplify,count=' + l ) {
                                simplifyOpt = true;
                            }
                        });

                        assert.ok(simplifyOpt, "The simplify option should have been passed");

                        assert.ok(Array.isArray(flags.stdio));
                        assert.equal('pipe', flags.stdio[0], "stdin should set up to be used");
                        assert.equal('pipe', flags.stdio[1], "stdout should set up to be used");
                        // we don't care about the 3rd element of stdio

                        assert.ok(stdinWriteStub.calledOnce, "should have written to stdin");
                        assert.doesNotThrow(
                            function () {newDoc = libxmljs.parseXmlString(files[path].contents.toString());},
                            "contents property should contain a valid XML"
                        );

                        assert.equal(
                            newName, newDoc.get('//gpx:name', nsConfig).text(),
                            "contents property should contain the result of gpsbabel"
                        );

                        done();
                    });

                    doc = libxmljs.parseXmlString(content.toString());
                    doc.get('//gpx:name', nsConfig).text(newName);
                    newContent = doc.toString();

                    eventEmitter.stdout.emit('data', newContent.substr(0, 10));
                    eventEmitter.stdout.emit('data', newContent.substr(10));
                    eventEmitter.emit('close');
                });
            }

            it('should leave small file alone', function (done) {
                var files = {}, path = 'tracks/1999.gpx',
                    fullpath = fixturesDir + path;

                fs.readFile(fullpath, function (err, content) {
                    files[path] = {contents: content};

                    gpxcleaner()(files, false, function (err) {
                        var doc = libxmljs.parseXmlString(files[path].contents);

                        assert.equal(1999, doc.find('//gpx:ele', nsConfig).length);
                        done();
                    });
                });
            });

            it('should take the configured limit into account', function (done) {
                testGpsBabel(500, undefined, done);
            });

            it('should take the limit in file', function (done) {
                testGpsBabel(500, 200, done);
            });

            it('should call gpsbabel', function (done) {
                testGpsBabel(undefined, undefined, done);
            });

            it('should handle stdin writing error', function (done) {
                var files = {}, path = 'tracks/2001.gpx',
                    fullpath = fixturesDir + path,
                    stdinWriteStub;

                fs.readFile(fullpath, function (err, content) {
                    files[path] = {contents: content};

                    stdinWriteStub = sinon.stub(eventEmitter.stdin, "write", function (string, callback) {
                        callback(new Error("stdin error"));
                    });

                    gpxcleaner()(files, false, function (err) {
                        assert.ok(stdinWriteStub.calledOnce, "should have written to stdin");
                        assert.ok(err instanceof Error);
                        done();
                    });
                });
            });

            it('should handle gpsbabel errors', function (done) {
                var files = {}, path = 'tracks/2001.gpx',
                    fullpath = fixturesDir + path;

                fs.readFile(fullpath, function (err, content) {
                    files[path] = {contents: content};

                    gpxcleaner()(files, false, function (err) {
                        assert.ok(err instanceof Error);
                        done();
                    });

                    eventEmitter.emit('error', 1);
                });
            });

            it('should handle gpsbabel exit code', function (done) {
                var files = {}, path = 'tracks/2001.gpx',
                    fullpath = fixturesDir + path;

                fs.readFile(fullpath, function (err, content) {
                    files[path] = {contents: content};

                    gpxcleaner()(files, false, function (err) {
                        assert.ok(err instanceof Error);
                        done();
                    });

                    eventEmitter.emit('close', 1);
                });
            });
        });
    });
});
