#! /usr/bin/env node

var metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    permalinks = require('metalsmith-permalinks'),
    metadata = require('metalsmith-metadata'),
    collections = require('metalsmith-collections'),
    ignore = require('metalsmith-ignore'),
    fileMetadata = require('metalsmith-filemetadata'),
    include = require('metalsmith-include'),
    paginate = require('metalsmith-paginate'),

    date = require('./lib/metalsmith/date'),
    gpxparser = require('./lib/metalsmith/gpxparser'),

    pjson = require('./package.json'),
    conf = require('./build.json');

console.log('Preparing the environment');
console.log(' - Configuring moment.js');
require('moment').lang(conf.lang);

console.log(' - Adding the custom Swig filters');
require('./lib/swig/filters')(require('swig'), conf);

console.log();
console.log('Starting to build ' + pjson.name + '...');
metalsmith(__dirname)
    .source(conf.source)
    .use(fileMetadata(conf.fileMetadata))
    .use(gpxparser())
    .use(markdown())
    .use(include())
    .use(collections(conf.collections))
    .use(paginate(conf.paginate))
    .use(permalinks({relative: false}))
    .use(metadata(conf.metadata))
    .use(date(conf.date))
    .use(templates(conf.templateEngine))
    .use(ignore(conf.ignore))
    .destination(conf.destination)
    .build(function (error, res) {
        if ( error ) {
            console.error("Build failed: " + error.message);
            process.exit(1);
        }
        console.log('Build successful in ' + conf.destination + ', wrote:');
        Object.keys(res).forEach(function (key) {
            console.log('- ' + key);
        });
    });
