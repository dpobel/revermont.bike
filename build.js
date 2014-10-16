#! /usr/bin/env node

var argv = require('minimist')(process.argv.slice(2), {
        "string": ['destination', 'source', 'forecast', 'pooleapp', 'revision'],
        "boolean": ['help', 'h'],
    }),
    source, destination,
    metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    permalinks = require('metalsmith-permalinks'),
    metadata = require('metalsmith-metadata'),
    collections = require('metalsmith-collections'),
    ignore = require('metalsmith-ignore'),
    fileMetadata = require('metalsmith-filemetadata'),
    include = require('metalsmith-include'),
    paginate = require('metalsmith-paginate'),
    assets = require('metalsmith-assets'),
    tags = require('metalsmith-tags'),
    buildDate = require('metalsmith-build-date'),
    pooleApp = require('metalsmith-pooleapp'),
    define = require('metalsmith-define'),
    cleanCss = require('metalsmith-clean-css'),

    date = require('./lib/metalsmith/date'),
    gpxcleaner = require('./lib/metalsmith/gpxcleaner'),
    gpxparser = require('./lib/metalsmith/gpxparser'),
    profile = require('./lib/metalsmith/profile'),
    paginateTag = require('./lib/metalsmith/paginate-tag.js'),
    forecast = require('./lib/metalsmith/forecast.js'),
    autoinclude = require('./lib/metalsmith/autoinclude.js'),
    enrichTags = require('./lib/metalsmith/enrich-tags.js'),
    concat = require('./lib/metalsmith/concat.js'),

    nock = require('nock'),
    pjson = require('./package.json'),
    conf = require('./build.json'),
    pooleAppConf = conf.pooleApp,
    forecastConf = conf.forecast,
    jsFile = conf.assets + '/code.js',
    cssFile = conf.assets + '/style.css';

if ( argv.help || argv.h ) {
    console.log('build.js [--source srcDir] [--destination destDir] [--forecast-key apiKey]');
    console.log('--source srcDir: override the source directory defined in build.json');
    console.log('--destination destDir: override the destination directory defined in build.json');
    console.log('--revision assetRev: asset revision to use while building asset filename');
    console.log('--forecast apiKey: API for Forecast.io (if not provided, fake data are used)');
    console.log('--pooleapp apiSecret: API secret for PooleApp');
    process.exit(0);
}

console.log('Preparing the environment');
console.log(' - Configuring moment.js');
require('moment').locale(conf.lang);

console.log(' - Adding the custom Swig filters');
require('./lib/swig/filters')(require('swig'), conf);

source = conf.source;
destination = conf.destination;
if ( argv.source ) {
    source = argv.source;
}
if ( argv.destination ) {
    destination = argv.destination;
}
if ( argv.forecast ) {
    forecastConf.key = argv.forecast;
}
if ( argv.pooleapp ) {
    pooleAppConf.forms.comments.secret = argv.pooleapp;
} else {
    // no PooleApp secret, we configure nock to reply
    // with an empty structure
    nock('http://pooleapp.com/')
        .get('/data/' + pooleAppConf.forms.comments.secret + '.json')
        .reply(200, JSON.stringify({sessions: []}));
}
if ( argv.revision ) {
    jsFile = conf.assets + '/code-' + argv.revision + '.js';
    cssFile = conf.assets + '/style-' + argv.revision + '.css';
}

console.log();
console.log('Starting to build ' + pjson.name);
console.log('- Source: "' + __dirname + '/' + source + '"');
console.log('- Destination: "' + __dirname + '/' + destination + '"');
metalsmith(__dirname)
    .source(source)
    .use(date(conf.date))
    .use(tags(conf.tags))
    .use(enrichTags(conf.enrichTags))
    .use(forecast(forecastConf))
    .use(fileMetadata(conf.fileMetadata))
    .use(gpxcleaner(conf.gpxcleaner))
    .use(gpxparser())
    .use(profile(conf.profile))
    .use(markdown())
    .use(include())
    .use(autoinclude())
    .use(collections(conf.collections))
    .use(paginate(conf.paginate))
    .use(paginateTag(conf.paginateTag))
    .use(permalinks({relative: false}))
    .use(metadata(conf.metadata))
    .use(pooleApp(pooleAppConf))
    .use(buildDate())
    .use(assets({
        source: conf.assets,
        destination: conf.assets
    }))
    .use(concat({
        files: conf.concat.css,
        css: true,
        output: cssFile,
    }))
    .use(cleanCss({
        files: cssFile,
        cleanCSS: {
            keepSpecialComments: 0,
            noRebase: true,
        }
    }))
    .use(concat({
        files: conf.concat.js,
        output: jsFile,
    }))
    .use(define({
        jsFile: jsFile,
        cssFile: cssFile,
    }))
    .use(templates(conf.templateEngine))
    .use(ignore(conf.ignore))
    .destination(destination)
    .build(function (error, res) {
        if ( error ) {
            console.error("Build failed: " + error.message);
            console.log(error.stack);
            process.exit(1);
        }
        console.log('Build successful in ' + destination + ', wrote:');
        Object.keys(res).forEach(function (key) {
            console.log('- ' + key);
        });
    });
