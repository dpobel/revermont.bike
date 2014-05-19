/* global describe, it, before, before */
var sinon = require('sinon'),
    assert = require('assert'),
    sassert = sinon.assert,
    filter = require('../lib/swig/filters');

describe('Swig filters', function () {
    var config = {assets: '/assets/'};

    describe('url filter', function () {
        it('define the url filter', function () {
            var swig = {setFilter: function () {}},
                spy = sinon.spy(swig, "setFilter");

            spy.withArgs('url');
            filter(swig, config);

            sassert.calledOnce(spy.withArgs('url'));
            sassert.calledWith(spy, 'url', sinon.match.func);
        });

        describe('behavior', function () {
            var urlFunc,
                swig = {setFilter: function (name, func) {
                    if ( name === 'url' ) {
                        urlFunc = func;
                    }
                }};

            before(function () {
                filter(swig, config);
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

    describe('asset filter', function () {
        it('define the asset filter', function () {
            var swig = {setFilter: function () {}},
                spy = sinon.spy(swig, "setFilter");

            spy.withArgs('asset');
            filter(swig, config);

            sassert.calledOnce(spy.withArgs('asset'));
            sassert.calledWith(spy, 'asset', sinon.match.func);
        });

        describe('behavior', function () {
            var urlFunc,
                swig = {setFilter: function (name, func) {
                    if ( name === 'asset' ) {
                        urlFunc = func;
                    }
                }};


            it('should add the configured asset prefix', function () {
                var path = 'pure/pure.css';

                filter(swig, config);
                assert.equal('/assets/' + path, urlFunc(path));
            });

            it('should add the configured asset prefix handle leading slashes', function () {
                var path = 'pure/pure.css';

                filter(swig, {'assets': '////assets'});
                assert.equal('/assets/' + path, urlFunc(path));
            });

            it('should add the configured asset prefix handle trailing slashes', function () {
                var path = 'pure/pure.css';

                filter(swig, {'assets': 'assets////'});
                assert.equal('/assets/' + path, urlFunc(path));
            });

            it('should add the configured asset prefix handle leading path slashes', function () {
                var prefix = '////',
                    path = 'pure/pure.css',
                    badPath = prefix + path;

                filter(swig, config);
                assert.equal('/assets/' + path, urlFunc(badPath));
            });
        });
    });
});
