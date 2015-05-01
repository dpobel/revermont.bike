#! /usr/bin/env node

var argv = require('minimist')(process.argv.slice(2), {
        "boolean": ['help', 'h'],
    }),
    source, destination,
    metalsmith = require('metalsmith'),
    ignore = require('metalsmith-ignore'),
    copy = require('metalsmith-assets'),
    photoVariation = require('./lib/metalsmith/photovariation.js'),

    pjson = require('./package.json'),
    conf = require('./build.json');

if ( argv.help || argv.h ) {
    console.log('pregeneratevariations.js');
    process.exit(0);
}

source = conf.source;
destination = conf.cache;

console.log();
console.log('Starting to pre-generate the image variation ' + pjson.name);
console.log('- Source: "' + __dirname + '/' + source + '"');
console.log('- Destination: "' + __dirname + '/' + destination + '"');
metalsmith(__dirname)
    .source(source)
    .ignore([
        'src/include/*', 'src/posts/*', 'src/randonnees/*',
        'src/sandbox/*', 'src/single-tracks/*', '*.json', '*.xml',
        'favicon*', '*.js', '*.gpx', '*.conf'
    ])
    .clean(false)
    .use(copy({
        source: conf.cache,
        destination: ".",
    }))
    .use(photoVariation(conf.photoVariation))
    .use(ignore([
        "**/*.md",
    ]))
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
