/* global describe, it, beforeEach */
var msTagStruct = require('../lib/metalsmith/tag-struct'),
    assert = require('assert');

describe('Metalsmith tag struct', function () {
    var tagsList = {},
        metalsmith = {
            metadata: function () {
                return {tagsList: tagsList};
            }
        };

    beforeEach(function () {
        tagsList.tag = {
            "posts": [
                {}, {photo: "photo.jpg"}, {photo: "photo2.jpg"},
            ]
        };
    });

    it('should store the weight of the tags', function (done) {
        msTagStruct()({}, metalsmith, function (err) {
            assert.ok(typeof err === 'undefined');
            assert.equal(3, tagsList.tag.weight);
            done();
        });
    });

    it('should put the photos in the dedicated property', function (done) {
        msTagStruct()({}, metalsmith, function (err) {
            var photos = tagsList.tag.photos;

            assert.ok(typeof err === 'undefined');
            assert.ok(typeof photos === 'object');
            assert.ok(2, photos.length);
            done();
        });
    });
});
