/* global describe, it, beforeEach, afterEach */
var msForecast = require('../lib/metalsmith/forecast'),
    ForecastIo = require('forecastio'),
    moment = require('moment'),
    sinon = require('sinon'),
    assert = require('assert');

describe('Metalsmith forecast', function () {
    var data = JSON.parse(require('fs').readFileSync(__dirname + '/fixtures/forecast/forecast.json')),
        options = {
            key: "buddy holly!",
            units: "si",
            lang: "fr",
            lat: 45,
            lon: 5,
            url: 'weather_entry',
            title: "Weather!",
            fixture: __dirname + "/../forecast.json",
        },
        metalsmith = {
            metadata: function () {
                return metadata;
            }
        },
        forecastStub, metadata, files;
    
    beforeEach(function () {
        metadata = {};
        files = {};
        forecastStub = sinon.stub(ForecastIo.prototype, "forecast");
    });

    afterEach(function () {
        forecastStub.restore();
    });

    it('should pass the options the Forecast API', function (done) {
        forecastStub.yields(false, data);

        msForecast(options)(files, metalsmith, function (err) {
            var args = forecastStub.args[0],
                callOptions = args[2];

            assert.ok(!err);
            assert.ok(forecastStub.called);
            assert.equal(options.key, forecastStub.thisValues[0].apiKey);
            assert.equal(options.lat, args[0]);
            assert.equal(options.lon, args[1]);
            assert.equal(options.units, callOptions.units);
            assert.equal(options.lang, callOptions.lang);
            done();
        });
    });

    it('should handle forecast API errors', function (done) {
        var error = new Error();

        forecastStub.yields(error, null);

        msForecast(options)(files, metalsmith, function (err) {
            assert.ok(err);
            done();
        });
    });

    it('should create an entry in the files list', function (done) {
        forecastStub.yields(false, data);

        msForecast(options)(files, metalsmith, function () {
            var page;

            assert.ok(typeof files[options.url] !== undefined);
            page = files[options.url];

            assert.equal(options.title, page.title);
            assert.ok(typeof page.forecast !== undefined);
            assert.ok(moment().unix() - page.updated.unix() <= 1);
            assert.equal("", page.contents);
            done();
        });
    });

    it('should add the forecast structure to the metadata', function (done) {
        forecastStub.yields(false, data);

        msForecast(options)(files, metalsmith, function () {
            var page = files[options.url];

            assert.strictEqual(page.forecast, metadata.forecast);
            done();
        });
    });

    it('should parse/filter the data provided by the forecast API', function (done) {
        forecastStub.yields(false, data);

        msForecast(options)(files, metalsmith, function () {
            var fc = metadata.forecast;

            assert.equal(1, Object.keys(fc).length);
            assert.ok(typeof fc.daily !== undefined);
            assert.equal(3, Object.keys(fc.daily).length);

            assert.equal(data.daily.icon, fc.daily.icon);
            assert.equal(data.daily.summary, fc.daily.summary);

            assert.equal(data.daily.data.length, fc.daily.days.length);

            fc.daily.days.forEach(function (day, i) {
                var exp = data.daily.data[i];

                assert.equal(8, Object.keys(day).length);
                assert.equal(Math.round(exp.temperatureMax), day.temperatureMax);
                assert.equal(Math.round(exp.temperatureMin), day.temperatureMin);
                assert.equal(Math.round(exp.windSpeed), day.windSpeed);
                assert.equal(Math.round(exp.precipProbability * 100), day.precipProbability);
                assert.equal(exp.time, day.time.unix());
            });

            done();
        });
    });

    it('should use the fixture file if no key is provided', function () {
        delete options.key;

        msForecast(options)(files, metalsmith, function (err) {
            assert.ok(typeof err === 'undefined');
            assert.equal(0, forecastStub.callCount);
            assert.notEqual(0, metadata.forecast.daily.days.length);
        });

    });
});
