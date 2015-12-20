/* global describe, it, beforeEach, afterEach */
var msExif = require('../lib/metalsmith/exifextract'),
    exif = require('exif'),
    sinon = require('sinon'),
    assert = require('assert');

describe('Metalsmith exifextract', function () {
    var metadata = {},
        metalsmith = {
            metadata: function () {
                return metadata;
            }
        };

    it('should leave files without photo', function (done) {
        var files = {
                file1: {},
            };

        msExif()(files, metalsmith, function (err) {
            assert.equal(0, metadata.geoimages.length);
            assert.ifError(err);
            done();
        });
    });

    describe('exif data', function () {
        var load, file, files, exifData, date,
            format = "YYYY:MM:DD HH:mm:ss";


        beforeEach(function () {
            load = sinon.stub(exif.ExifImage.prototype, "loadImage");
            file = {'photo': 'photo.jpg'};
            files = {
                'dir/subdir/file': file,
                'dir/subdir/photo.jpg': {"contents": "image blob"},
            };
            date = '2014:10:30 11:12:13';
            exifData = {
                gps: {
                    GPSLatitude: [45, 30, 1800],
                    GPSLongitude: [46, 120, 7200],
                },
                image: {
                    ModifyDate: date,
                },
            };
        });

        afterEach(function () {
            load.restore();
        });

        it('should read the exif data', function () {
            delete exifData.image.ModifyDate;
            delete exifData.gps.GPSLatitude;
            delete exifData.gps.GPSLongitude;
            load.yields(false, exifData);

            msExif()(files, metalsmith, function (err) {
                assert.ifError(err);
                assert.ok(typeof file.latlon === 'undefined');
                assert.equal(0, metadata.geoimages.length);
            });

        });

        it('should read the GPS coordinates', function () {
            delete exifData.image.ModifyDate;
            load.yields(false, exifData);

            msExif()(files, metalsmith, function (err) {
                assert.ifError(err);
                assert.ok(Array.isArray(file.latlon));
                assert.equal(46, file.latlon[0]);
                assert.equal(50, file.latlon[1]);
                assert.equal(1, metadata.geoimages.length);
                assert.strictEqual(file, metadata.geoimages[0]);
            });
        });

        it('should not override the object latlon property', function () {
            var lat = 30, lon = 31;

            file.latlon = [lat, lon];
            load.yields(false, exifData);

            msExif()(files, metalsmith, function (err) {
                assert.ifError(err);
                assert.ok(Array.isArray(file.latlon));
                assert.equal(lat, file.latlon[0]);
                assert.equal(lon, file.latlon[1]);
                assert.equal(1, metadata.geoimages.length);
                assert.strictEqual(file, metadata.geoimages[0]);
            });
        });

        it('should read the date', function () {
            load.yields(false, exifData);

            msExif()(files, metalsmith, function (err) {
                assert.ifError(err);
                assert.equal(date, file.created.format(format));
                assert.equal(date, file.updated.format(format));
            });
        });

        it('should not override the created property', function () {
            var existing = "2012-01-05";

            file.created = existing;
            load.yields(false, exifData);
            msExif()(files, metalsmith, function (err) {
                assert.ifError(err);
                assert.equal(existing, file.created);
                assert.equal(date, file.updated.format(format));
            });
        });

        it('should not override the updated property', function () {
            var existing = "2012-01-05";

            file.updated = existing;
            load.yields(false, exifData);
            msExif()(files, metalsmith, function (err) {
                assert.ifError(err);
                assert.equal(existing, file.updated);
                assert.equal(date, file.created.format(format));
            });
        });

        it('should handle exif reading error', function () {
            var error = new Error();

            load.yields(error);
            msExif()(files, metalsmith, function (err) {
                assert.strictEqual(error, err);
            });
        });
    });
});
