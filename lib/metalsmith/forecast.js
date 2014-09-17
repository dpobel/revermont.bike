var ForecastIo = require('forecastio'),
    moment = require('moment'),

    dailyFields = [
        'icon', 'temperatureMax', 'temperatureMin', 'summary', 'windSpeed',
        'windBearing', 'precipProbability'
    ];

function parseWeather(data) {
    var weather = {daily: {days: [], summary: "", icon: ""}};

    weather.daily.icon = data.daily.icon;
    weather.daily.summary = data.daily.summary;

    data.daily.data.forEach(function (d) {
        var day = {};

        dailyFields.forEach(function (f) {
            day[f] = d[f];
        });
        day.temperatureMax = Math.round(day.temperatureMax);
        day.temperatureMin = Math.round(day.temperatureMin);
        day.windSpeed = Math.round(day.windSpeed);
        day.precipProbability = Math.round(100 * day.precipProbability);
        day.time = moment(d.time, "X");
        weather.daily.days.push(day);
    });
    return weather;
}

function handleResponse(metalsmith, files, opts, err, weather, done) {
    var metadata = metalsmith.metadata();

    if ( err ) {
        return done(err);
    }
    weather  = parseWeather(weather);
    files[opts.url] = {
        title: opts.title,
        contents: "",
        updated: moment(),
        forecast: weather,
    };
    metadata.forecast = weather;
    done();

}

module.exports = function (opts) {
    return function (files, metalsmith, done) {
        var options = {
                units: opts.units,
                lang: opts.lang,
            }, forecast;

        if ( opts.key ) {
            forecast = new ForecastIo(opts.key);
            forecast.forecast(opts.lat, opts.lon, options, function (err, weather) {
                require('fs').writeFileSync(opts.fixture, JSON.stringify(weather, undefined, 2));
                handleResponse(metalsmith, files, opts, err, weather, done);
            });
        } else {
            require('fs').readFile(opts.fixture, function (err, data) {
                handleResponse(metalsmith, files, opts, err, JSON.parse(data), done);
            });
        }
    };
};
