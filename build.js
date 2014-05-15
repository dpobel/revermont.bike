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

    pjson = require('./package.json'),
    conf = require('./build.json');

console.log('Starting to build ' + pjson.name + '...');
metalsmith(__dirname)
    .source(conf.source)
    .use(markdown())
    .use(include())
    .use(permalinks())
    .use(collections(conf.collections))
    .use(fileMetadata(conf.fileMetadata))
    .use(metadata(conf.metadata))
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
