/* global describe, it, beforeEach */
var msMaxDate = require('../lib/metalsmith/collections-maxdate'),
    moment = require('moment'),
    assert = require('assert');

describe('Metalsmith collections maxdate', function () {
    var maxDate = moment(1000000),
        middle = moment(500000),
        epoch = moment(0),
        files, metadata,
        metalsmith = {
            metadata: function () {
                return metadata;
            }
        };

    beforeEach(function () {
        files = [
            {created: maxDate, updated: epoch},
            {created: epoch, updated: middle},
            {created: "not_a_moment_object"},
            {},
        ];

        metadata = {
            collections: {
                files: files,
            }
        };
    });
    
    it('should add the max date to the collection metadata', function (done) {
        msMaxDate({
            dateProperties: ['created', 'updated'],
            collections: ['files']
        })(false, metalsmith, function (err) {
            assert.ok(typeof err === 'undefined');
            assert.ok(typeof files.metadata === 'object');
            assert.equal(maxDate.unix(), files.metadata.maxDate);
            done();
        });
    });

    it('should ignore others collections', function (done) {
        msMaxDate({
            dateProperties: ['created', 'updated'],
            collections: []
        })(false, metalsmith, function (err) {
            assert.ok(typeof err === 'undefined');
            assert.ok(typeof files.metadata === 'undefined');
            done();
        });
    });

    it('should use the dateProperties configuration', function (done) {
        msMaxDate({
            dateProperties: ['updated'],
            collections: ['files']
        })(false, metalsmith, function (err) {
            assert.ok(typeof err === 'undefined');
            assert.ok(typeof files.metadata === 'object');
            assert.equal(middle.unix(), files.metadata.maxDate);
            done();
        });
    });

    it('should handle collections without dates', function (done) {
        msMaxDate({
            dateProperties: [],
            collections: ['files']
        })(false, metalsmith, function (err) {
            assert.ok(typeof err === 'undefined');
            assert.ok(typeof files.metadata === 'undefined');
            done();
        });
    });

});
