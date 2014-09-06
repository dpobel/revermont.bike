/* global describe, it, before, before */
var sinon = require('sinon'),
    assert = require('assert'),
    sassert = sinon.assert,
    filter = require('../lib/swig/filters');

describe('Swig filters', function () {
    var config = {assets: '/assets/'};

    describe('filter_points filter', function () {
        it('define the filter_points filter', function () {
            var swig = {setFilter: function () {}},
                spy = sinon.spy(swig, "setFilter");

            spy.withArgs('filter_points');
            filter(swig, config);

            sassert.calledOnce(spy.withArgs('filter_points'));
            sassert.calledWith(spy, 'filter_points', sinon.match.func);
        });


        describe('behavior', function () {
            var filterFunc,
                points = [
                    {lon: 0, lat: 0, ele: 0},
                    {lon: 1, lat: 1, ele: 1},
                    {lon: 2, lat: 2, ele: 2},
                    {lon: 3, lat: 3, ele: 3},
                    {lon: 4, lat: 4, ele: 4},
                    {lon: 5, lat: 5, ele: 5},
                    {lon: 6, lat: 6, ele: 6},
                    {lon: 7, lat: 7, ele: 7},
                    {lon: 8, lat: 8, ele: 8},
                    {lon: 9, lat: 9, ele: 9},
                ],
                swig = {setFilter: function (name, func) {
                    if ( name === 'filter_points' ) {
                        filterFunc = func;
                    }
                }};

            function _testFilter(step, expectedCount) {
                var result, i;

                result = filterFunc(points, step);
                assert.equal(expectedCount, result.length);

                for (i = 0; i != expectedCount; i++) {
                    assert.ok(!result[i].ele, "The `ele` property should be removed");
                    assert.deepEqual(
                        {lon: i * step, lat: i * step}, result[i],
                        "The values at index " + i + " should contain " + i * step
                    );
                }
            }

            before(function () {
                filter(swig, config);
            });

            it('should filter points with a step of 3', function () {
                _testFilter(3, 4);
            });

            it('should filter points with a step of 2', function () {
                _testFilter(2, 5);
            });

            it('should filter points with a step of 7', function () {
                _testFilter(7, 2);
            });
        });
    });

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

            it('should not add a trailing slash', function () {
                var path = 'mont/myon';

                assert.equal('/' + path, urlFunc(path, true));
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
