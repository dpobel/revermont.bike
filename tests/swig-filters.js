/* global describe, it, before, beforeEach */
var sinon = require('sinon'),
    assert = require('assert'),
    sassert = sinon.assert,
    moment = require('moment'),
    filter = require('../lib/swig/filters');

describe('Swig filters', function () {
    var baseUri = 'http://vtt.revermont.bike',
        config = {assets: '/assets/', baseUri: baseUri};

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

    describe('ext_url filter', function () {
        it('define the ext_url filter', function () {
            var swig = {setFilter: function () {}},
                spy = sinon.spy(swig, "setFilter");

            spy.withArgs('ext_url');
            filter(swig, config);

            sassert.calledOnce(spy.withArgs('ext_url'));
            sassert.calledWith(spy, 'ext_url', sinon.match.func);
        });

        describe('behavior', function () {
            var extUrlFunc,
                swig = {setFilter: function (name, func) {
                    if ( name === 'ext_url' ) {
                        extUrlFunc = func;
                    }
                }};

            before(function () {
                filter(swig, config);
            });

            it('should handle the baseUri trailing slashes', function () {
                var path = '/mont/myon/';

                config.baseUri = baseUri + '/////';
                assert.equal(baseUri + path, extUrlFunc(path));
            });

            it('should add a trailing slash', function () {
                var path = '/mont/myon';

                assert.equal(baseUri + path + '/', extUrlFunc(path));
            });

            it('should not add a trailing slash', function () {
                var path = '/mont/myon';

                assert.equal(baseUri + path, extUrlFunc(path, true));
            });

            it('should add a slash between the baseUri and the path', function () {
                var path = 'mont/myon/';

                assert.equal(baseUri + '/' + path, extUrlFunc(path));
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

    describe('rssify filter', function () {
        it('define the rssify filter', function () {
            var swig = {setFilter: function () {}},
                spy = sinon.spy(swig, "setFilter");

            spy.withArgs('rssify');
            filter(swig, config);

            sassert.calledOnce(spy.withArgs('rssify'));
            sassert.calledWith(spy, 'rssify', sinon.match.func);
        });

        describe('behavior', function () {
            var rssifyFunc,
                swig = {setFilter: function (name, func) {
                    if ( name === 'rssify' ) {
                        rssifyFunc = func;
                    }
                }};

            before(function () {
                filter(swig, config);
            });

            it('should transform the link', function () {
                var html = '<a href="/mont/myon">Mont Myon</a>';

                assert.equal(
                    '<a href="' + baseUri + '/mont/myon">Mont Myon</a>',
                    rssifyFunc(html)
                );
            });

            it('should transform the image', function () {
                var html = '<img src="/mont/myon.jpg">';

                assert.equal(
                    '<img src="' + baseUri + '/mont/myon.jpg">',
                    rssifyFunc(html)
                );
            });

            it('should handle the baseUri trailing slashes', function () {
                var html = '<a href="/mont/myon">Mont Myon</a>';

                config.baseUri += '//////';
                assert.equal(
                    '<a href="' + baseUri + '/mont/myon">Mont Myon</a>',
                    rssifyFunc(html)
                );
            });

            it('should handle multiple links and images', function () {
                var html = '<a href="/mont/myon">Mont Myon</a><a href="/mont/myon">Mont Myon</a><a href="/mont/myon">Mont Myon</a><img src="/mont/myon.jpg"><img src="/mont/myon.jpg">',
                    expected = '<a href="' + baseUri + '/mont/myon">Mont Myon</a><a href="' + baseUri + '/mont/myon">Mont Myon</a><a href="' + baseUri + '/mont/myon">Mont Myon</a><img src="' + baseUri + '/mont/myon.jpg"><img src="' + baseUri + '/mont/myon.jpg">';

                assert.equal(expected, rssifyFunc(html));
            });
        });
    });

    describe('autolink flter', function () {
        it('define the autolink filter', function () {
            var swig = {setFilter: function () {}},
                spy = sinon.spy(swig, "setFilter");

            spy.withArgs('autolink');
            filter(swig, config);

            sassert.calledOnce(spy.withArgs('autolink'));
            sassert.calledWith(spy, 'autolink', sinon.match.func);
        });

        describe('behavior', function () {
            var autolink,
                swig = {setFilter: function (name, func) {
                    if ( name === 'autolink' ) {
                        autolink = func;
                    }
                }};

            beforeEach(function () {
                filter(swig, config);
            });

            it('should transform http links', function () {
                var input = 'http://vtt.revermont.bike/',
                    expected = '<a href="http://vtt.revermont.bike/">vtt.revermont.bike</a>';

                assert.equal(expected, autolink(input));
            });

            it('should transform links without scheme', function () {
                var input = 'vtt.revermont.bike/',
                    expected = '<a href="http://vtt.revermont.bike/">vtt.revermont.bike</a>';

                assert.equal(expected, autolink(input));
            });

            it('should ignore email address', function () {
                var input = 'spamme@example.com',
                    expected = input;

                assert.equal(expected, autolink(input));
            });
        });
    });

    describe('nl2br filter', function () {
        it('define the nl2br filter', function () {
            var swig = {setFilter: function () {}},
                spy = sinon.spy(swig, "setFilter");

            spy.withArgs('nl2br');
            filter(swig, config);

            sassert.calledOnce(spy.withArgs('nl2br'));
            sassert.calledWith(spy, 'nl2br', sinon.match.func);
        });

        describe('behavior', function () {
            var nl2br,
                swig = {setFilter: function (name, func) {
                    if ( name === 'nl2br' ) {
                        nl2br = func;
                    }
                }};

            beforeEach(function () {
                filter(swig, config);
            });

            it('should transform newline in br tag', function () {
                var input = 'PJ Harvey\nGood fortune',
                    expected = 'PJ Harvey<br>Good fortune';

                assert.equal(expected, nl2br(input));
            });

            it('should limit the number of br tags', function () {
                var input = 'PJ Harvey\n\n\n\n\n\nGood fortune',
                    expected = 'PJ Harvey<br><br>Good fortune';

                assert.equal(expected, nl2br(input));
            });

            it('should handle \r\n', function () {
                var input = 'PJ Harvey\r\n\r\nGood fortune',
                    expected = 'PJ Harvey<br><br>Good fortune';

                assert.equal(expected, nl2br(input));
            });
        });
    });

    describe('parse_date filter', function () {
        it('define the parse_date filter', function () {
            var swig = {setFilter: function () {}},
                spy = sinon.spy(swig, "setFilter");

            spy.withArgs('parse_date');
            filter(swig, config);

            sassert.calledOnce(spy.withArgs('parse_date'));
            sassert.calledWith(spy, 'parse_date', sinon.match.func);
        });

        describe('behavior', function () {
            var parseDate,
                swig = {setFilter: function (name, func) {
                    if ( name === 'parse_date' ) {
                        parseDate = func;
                    }
                }};

            beforeEach(function () {
                filter(swig, config);
            });

            it('should return a moment object', function () {
                assert.ok(moment.isMoment(parseDate('2014-09-24T21:31:19.293Z')));
            });
        });
    });
});
