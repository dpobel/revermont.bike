/* global describe, it, beforeEach, afterEach */
var msVariation = require('../lib/metalsmith/photovariation'),
    async = require('async'),
    assert = require('assert'),
    gm = require('gm'),
    sinon = require('sinon'),
    metalsmith = false;

describe('Metalsmith photovariation', function () {
    it('should ignore object without a photo property', function (done) {
        var files = {
                'file1': {},
            };

        msVariation()(files, metalsmith, function (err) {
            assert.ok(typeof err === 'undefined');
            assert.equal(0, Object.keys(files.file1).length);
            done();
        });
    });

    describe('original variation', function () {
        var file = {'photo': 'photo.jpg'},
            files = {
                'dir/sub/dir/file1': file,
                'dir/sub/dir/photo.jpg': {'contents': new Buffer("test")},
            };

        describe('error handling', function () {
            var parallel,
                error = new Error();

            beforeEach(function () {
                parallel = sinon.stub(async, "parallelLimit");
                parallel.yields(error);
            });

            afterEach(function () {
                parallel.restore();
            });

            it('should handle the error while creating the original variations', function (done) {
                msVariation()(files, metalsmith, function (err) {
                    assert.strictEqual(err, error);
                    assert.equal(0, Object.keys(file.variations).length);
                    done();
                });
            });
        });

        describe('normal execution', function () {
            var size,
                foundSize = {'width': 42, 'height': 4242};

            beforeEach(function () {
                size = sinon.stub(gm.prototype, "size");
            });

            afterEach(function () {
                size.restore();
            });

            it('should add the original variation with the size of the image', function (done) {
                size.yields(false, foundSize);
                msVariation()(files, metalsmith, function (err) {
                    assert.ok(typeof err === 'undefined');
                    assert.ok(typeof file.variations.original === 'object');
                    assert.equal(file.photo, file.variations.original.name);
                    assert.equal('dir/sub/dir/photo.jpg', file.variations.original.fullpath);
                    assert.equal(foundSize.width, file.variations.original.width);
                    assert.equal(foundSize.height, file.variations.original.height);
                    assert.equal(4, file.variations.original.size);
                    done();
                });
            });
        });
    });

    describe('configured variations', function () {
        var file = {'photo': 'photo.jpg'},
            files = {
                'dir/sub/dir/file1': file,
                'dir/sub/dir/photo.jpg': {'contents': new Buffer("test")},
            },
            size, resize, toBuffer,
            originalSize = {'width': 420, 'height': 4242},
            variationSize = {"width": 0, 'height': 0};

        beforeEach(function () {
            toBuffer = sinon.stub(gm.prototype, "toBuffer");
            resize = sinon.stub(gm.prototype, "resize");
            resize.returnsThis();
            size = sinon.stub(gm.prototype, "size");
            size.onCall(0).yields(false, originalSize);
            size.onCall(1).yields(false, variationSize);
        });

        afterEach(function () {
            size.restore();
            toBuffer.restore();
            resize.restore();
        });

        describe('error handling', function () {
            it('should handle a bad variation configuration', function (done) {
                msVariation({variations: {'bad': {}}})(files, metalsmith, function (err) {
                    assert.ok(typeof err !== 'undefined');
                    assert.ok(err instanceof Error);
                    done();
                });
            });
        });

        describe('width', function () {
            var variationName = 'width',
                width = 50,
                conf = {variations: {}};
        
            conf.variations[variationName] = {'width': width};

            it('should handle the error while resizing the image', function (done) {
                var error = new Error();
                toBuffer.yields(error);

                msVariation(conf)(files, metalsmith, function (err) {
                    assert.ok(typeof err !== 'undefined');
                    assert.strictEqual(error, err);
                    done();
                });
            });

            it('should create a new image resized by width', function (done) {
                var imageContents = new Buffer("test");

                variationSize.width = width;
                variationSize.height = 120;
                toBuffer.yields(false, imageContents);

                msVariation(conf)(files, metalsmith, function (err) {
                    var path = 'dir/sub/dir/photo_' + variationName + '.jpg',
                        imageObj = files[path];

                    assert.ok(typeof err === 'undefined');
                    assert.ok(typeof imageObj === 'object');
                    assert.strictEqual(imageContents, imageObj.contents);
                    assert.equal(path, imageObj.path);

                    assert.ok(typeof file.variations[variationName] === 'object');
                    assert.equal('photo_' + variationName + '.jpg', file.variations[variationName].name);
                    assert.equal(path, file.variations[variationName].fullpath);
                    assert.equal(variationSize.width, file.variations[variationName].width);
                    assert.equal(variationSize.height, file.variations[variationName].height);
                    assert.equal(4, file.variations[variationName].size);
                    done();
                });
            });
        });

        describe('height', function () {
            var variationName = 'height',
                height = 50,
                conf = {variations: {}};
        
            conf.variations[variationName] = {'height': height};

            it('should handle the error while resizing the image', function (done) {
                var error = new Error();
                toBuffer.yields(error);

                msVariation(conf)(files, metalsmith, function (err) {
                    assert.ok(typeof err !== 'undefined');
                    assert.strictEqual(error, err);
                    done();
                });
            });

            it('should create a new image resized by height', function (done) {
                var imageContents = new Buffer("test");

                variationSize.width = 120;
                variationSize.height = height;
                toBuffer.yields(false, imageContents);

                msVariation(conf)(files, metalsmith, function (err) {
                    var path = 'dir/sub/dir/photo_' + variationName + '.jpg',
                        imageObj = files[path];

                    assert.ok(typeof err === 'undefined');
                    assert.ok(typeof imageObj === 'object');
                    assert.strictEqual(imageContents, imageObj.contents);
                    assert.equal(path, imageObj.path);

                    assert.ok(typeof file.variations[variationName] === 'object');
                    assert.equal('photo_' + variationName + '.jpg', file.variations[variationName].name);
                    assert.equal(path, file.variations[variationName].fullpath);
                    assert.equal(variationSize.width, file.variations[variationName].width);
                    assert.equal(variationSize.height, file.variations[variationName].height);
                    assert.equal(4, file.variations[variationName].size);
                    done();
                });
            });
        });

        describe('width and height', function () {
            var variationName = 'wh',
                crop,
                height = 40, width = 50,
                conf = {variations: {}};
        
            conf.variations[variationName] = {'height': height, 'width': width};

            beforeEach(function () {
                crop = sinon.stub(gm.prototype, "crop");
                crop.returnsThis();
            });

            afterEach(function () {
                crop.restore();
            });

            it('should resize by width and crop', function (done) {
                var imageContents = new Buffer("test");

                originalSize.width = 500;
                originalSize.height = 600;
                variationSize.width = width;
                variationSize.height = height;
                toBuffer.yields(false, imageContents);

                msVariation(conf)(files, metalsmith, function (err) {
                    var path = 'dir/sub/dir/photo_' + variationName + '.jpg',
                        imageObj = files[path];

                    assert.ok(typeof err === 'undefined');
                    assert.ok(typeof imageObj === 'object');
                    assert.strictEqual(imageContents, imageObj.contents);
                    assert.equal(path, imageObj.path);

                    assert.ok(resize.calledWithExactly(width));
                    assert.ok(crop.calledWithExactly(width, height, 0, 10));

                    assert.ok(typeof file.variations[variationName] === 'object');
                    assert.equal('photo_' + variationName + '.jpg', file.variations[variationName].name);
                    assert.equal(path, file.variations[variationName].fullpath);
                    assert.equal(variationSize.width, file.variations[variationName].width);
                    assert.equal(variationSize.height, file.variations[variationName].height);
                    assert.equal(4, file.variations[variationName].size);
                    done();
                });

            });

            it('should resize by height and crop', function (done) {
                var imageContents = new Buffer("test");

                originalSize.width = 600;
                originalSize.height = 400;
                variationSize.width = width;
                variationSize.height = height;
                toBuffer.yields(false, imageContents);

                msVariation(conf)(files, metalsmith, function (err) {
                    var path = 'dir/sub/dir/photo_' + variationName + '.jpg',
                        imageObj = files[path];

                    assert.ok(typeof err === 'undefined');
                    assert.ok(typeof imageObj === 'object');
                    assert.strictEqual(imageContents, imageObj.contents);
                    assert.equal(path, imageObj.path);

                    assert.ok(resize.calledWithExactly(null, height));
                    assert.ok(crop.calledWithExactly(width, height, 5, 0));

                    assert.ok(typeof file.variations[variationName] === 'object');
                    assert.equal('photo_' + variationName + '.jpg', file.variations[variationName].name);
                    assert.equal(path, file.variations[variationName].fullpath);
                    assert.equal(variationSize.width, file.variations[variationName].width);
                    assert.equal(variationSize.height, file.variations[variationName].height);
                    assert.equal(4, file.variations[variationName].size);
                    done();
                });
            });

            it('should resize by width', function (done) {
                var imageContents = new Buffer("test");

                originalSize.width = 500;
                originalSize.height = 400;
                variationSize.width = width;
                variationSize.height = height;
                toBuffer.yields(false, imageContents);

                msVariation(conf)(files, metalsmith, function (err) {
                    var path = 'dir/sub/dir/photo_' + variationName + '.jpg',
                        imageObj = files[path];

                    assert.ok(typeof err === 'undefined');
                    assert.ok(typeof imageObj === 'object');
                    assert.strictEqual(imageContents, imageObj.contents);
                    assert.equal(path, imageObj.path);

                    assert.ok(resize.calledWithExactly(width));
                    assert.equal(0, crop.callCount);

                    assert.ok(typeof file.variations[variationName] === 'object');
                    assert.equal('photo_' + variationName + '.jpg', file.variations[variationName].name);
                    assert.equal(path, file.variations[variationName].fullpath);
                    assert.equal(variationSize.width, file.variations[variationName].width);
                    assert.equal(variationSize.height, file.variations[variationName].height);
                    assert.equal(4, file.variations[variationName].size);
                    done();
                });

            });
        });
    });
});
