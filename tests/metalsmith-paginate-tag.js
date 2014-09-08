/* global describe, it, beforeEach */
var paginateTag = require('../lib/metalsmith/paginate-tag'),
    assert = require('assert'),

    toArray = require('lodash.toarray');

describe('Metalsmith tag', function () {
    var files,
        metadata,
        metalsmith = {metadata: function () { return metadata; }};

    beforeEach(function () {
        files = {
            "post/1": {},
            "post/2": {},
            "post/3": {},
            "post/4": {},
            "post/5": {},
            "post/6": {},
            "post/7": {},
            "post/8": {},
            "post/9": {},
            "post/10": {},
            "post/11": {},
        };
        metadata = {
            tagsList: {
                awesomeTag: {
                    path: "tags/awesomeTag.html",
                    posts: toArray(files),
                }
            }
        };
    });

    function _testPagination(perPage) {
        var pagination = metadata.tagsList.awesomeTag.pagination,
            pagination2;

        assert.ok(typeof pagination === "object", "The tag should be paginated");
        assert.ok(Array.isArray(pagination.files), "The files tagged should be available");
        assert.strictEqual(undefined, pagination.prev, "The first page should not have a previous one");
        assert.equal(2, pagination.total, "The total number of page should be 2");
        assert.equal(1, pagination.num, "The page number should 1");
        assert.equal(perPage, pagination.files.length, "The first page should get `perPage` documents");
        assert.equal(2, Object.keys(pagination.pages).length, "Two pages should be generated");
        assert.strictEqual(metadata.tagsList.awesomeTag, pagination.pages["1"], "Page 1 should refer to the tag page");
        assert.strictEqual(pagination.next, pagination.pages["2"], "Page 2 should point to a newly generated document");

        pagination2 = pagination.next.pagination;

        assert.ok(typeof files[pagination.next.path] === "object", "The new document should be registered with the files");

        assert.ok(typeof pagination2 === "object");
        assert.ok(Array.isArray(pagination2.files), "The page 2 should have some documents");
        assert.strictEqual(undefined, pagination2.next, "The page 2 should be the last");
        assert.equal(2, pagination2.total, "The total number of page should be 2");
        assert.equal(2, pagination2.num, "The page number should 2");
        assert.equal(metadata.tagsList.awesomeTag.posts.length - perPage, pagination2.files.length, "The page 2 should have the remaining documents");
        assert.ok(pagination.pages === pagination2.pages, "The `pages` property is the same accross paginations object");
    }

    it('should paginate a tag containing less than perPage posts', function () {
        metadata.tagsList.awesomeTag.posts.pop();
        metadata.tagsList.awesomeTag.posts.pop();
        metadata.tagsList.awesomeTag.posts.pop();

        paginateTag()(files, metalsmith, function () {
            var pagination = metadata.tagsList.awesomeTag.pagination;

            assert.ok(typeof pagination === "object", "The tag should be paginated");
            assert.ok(Array.isArray(pagination.files, "The files tagged should be available"));
            assert.strictEqual(undefined, pagination.prev, "The page should not have a previous one");
            assert.strictEqual(undefined, pagination.next, "The page should not have a next one");
            assert.equal(1, pagination.total, "The total number of page should be 1");
            assert.equal(1, pagination.num, "The page number should be 1");
            assert.equal(metadata.tagsList.awesomeTag.posts.length, pagination.files.length, "All the post should be available in `files`");
            assert.equal(1, Object.keys(pagination.pages).length, "One page should be generated");
            assert.strictEqual(metadata.tagsList.awesomeTag, pagination.pages["1"], "Page 1 should refer to the tag page");
        });
    });

    it('should paginate a tag containing more than perPage posts', function () {
        paginateTag()(files, metalsmith, function () {
            _testPagination(10);
        });
    });

    it('should take the perPage options into account', function () {
        var perPage = 8;
        paginateTag({perPage: perPage})(files, metalsmith, function () {
            _testPagination(perPage);
        });
    });

});
