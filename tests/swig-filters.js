/* global describe, it, before */
var sinon = require('sinon'),
    assert = require('assert'),
    sassert = sinon.assert,
    filter = require('../lib/swig/filters');

describe('Swig filters', function () {
    describe('url filter', function () {
        it('define the url filter', function () {
            var swig = {setFilter: function () {}},
                spy = sinon.spy(swig, "setFilter");

            spy.withArgs('url');
            filter(swig);

            sassert.calledOnce(spy.withArgs('url'));
            sassert.calledWith(spy, 'url', sinon.match.func);
        });

        describe('behavior', function () {
            var urlFunc,
                swig = {setFilter: function (name, func) { urlFunc = func; }};

            before(function () {
                filter(swig);
            });

            it('should add a leading slash', function () {
                var path = 'mont/myon/';

                assert.equal('/' + path, urlFunc(path));
            });

            it('should add a trailing slash', function () {
                var path = '/mont/myon';

                assert.equal(path + '/', urlFunc(path));
            });

            it('should keep the path intact', function () {
                var path = '/mont/myon/';

                assert.equal(path, urlFunc(path));
            });
        });
    });
});
