/* global describe, it, beforeEach */
var enrichTags = require('../lib/metalsmith/enrich-tags'),
    assert = require('assert');

describe('Metalsmith enrich tags', function () {
    var files,
        metadata,
        metalsmith = {metadata: function () { return metadata; }};

    beforeEach(function () {
        files = {
            'tag1.md': {
                'addition': 'tag1.md',
            },
            'dir/tag1.md': {
                'addition': 'dir/tag1.md',
            },
            'tag1.html': {
                'addition': 'tag1.html',
            }
        };
        metadata = {
            tagsList: {
                'tag1': {'tag': 'tag1'},
                'notEnriched': {'tag': 'notEnriched'},
            },
        };
    });

    it('should add data to the tag page object', function () {
        enrichTags()(files, metalsmith, function () {
            assert.equal(2, Object.keys(metadata.tagsList.tag1).length);
            assert.equal("tag1", metadata.tagsList.tag1.tag);
            assert.equal("tag1.md", metadata.tagsList.tag1.addition);
        });
    });

    it('should take the basePath parameter into account', function () {
        enrichTags({basePath: 'dir'})(files, metalsmith, function () {
            assert.equal(2, Object.keys(metadata.tagsList.tag1).length);
            assert.equal("tag1", metadata.tagsList.tag1.tag);
            assert.equal("dir/tag1.md", metadata.tagsList.tag1.addition);
        });
    });

    it('should take the basePath parameter into account and clean trailing slashes', function () {
        enrichTags({basePath: 'dir/////'})(files, metalsmith, function () {
            assert.equal(2, Object.keys(metadata.tagsList.tag1).length);
            assert.equal("tag1", metadata.tagsList.tag1.tag);
            assert.equal("dir/tag1.md", metadata.tagsList.tag1.addition);
        });
    });

    it('should take the ext parameter into account', function () {
        enrichTags({ext: 'html'})(files, metalsmith, function () {
            assert.equal(2, Object.keys(metadata.tagsList.tag1).length);
            assert.equal("tag1", metadata.tagsList.tag1.tag);
            assert.equal("tag1.html", metadata.tagsList.tag1.addition);
        });
    });

    it('should keep intact tag page object without additional data', function () {
        enrichTags()(files, metalsmith, function () {
            assert.equal(1, Object.keys(metadata.tagsList.notEnriched).length);
            assert.equal("notEnriched", metadata.tagsList.notEnriched.tag);
        });
    });
});
