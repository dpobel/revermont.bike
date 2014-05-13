#! /usr/bin/env node

var metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    permalinks = require('metalsmith-permalinks'),
    metadata = require('metalsmith-metadata'),
    collections = require('metalsmith-collections'),
    ignore = require('metalsmith-ignore'),

    pjson = require('./package.json'),
    conf = require('./build.json');

console.log('Starting to build ' + pjson.name + '...');
metalsmith(__dirname)
    .source(conf.source)
    .use(markdown())
    .use(permalinks())
    .use(collections({
        tracks: {
            pattern: 'tracks/*/index.html'
        },
        posts: {
            pattern: 'posts/*/index.html'
        }
    }))
    .use(metadata({
        config: 'config.json',
    }))
    .use(templates('swig'))
    .use(ignore('**/*.json'))
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
