#! /usr/bin/env node

var argv = require('minimist')(process.argv.slice(2), {
        "string": ['revision'],
        "boolean": ['help', 'h'],
    }),
    source, destination,
    metalsmith = require('metalsmith'),
    cleanCss = require('metalsmith-clean-css'),
    uglify = require('metalsmith-uglify'),
    htmlMinifier = require('metalsmith-html-minifier'),
    imagemin = require('metalsmith-imagemin'),

    pjson = require('./package.json'),
    conf = require('./build.json'),
    jsFile = conf.assets + '/code.js',
    cssFile = conf.assets + '/style.css';

if ( argv.help || argv.h ) {
    console.log('optimize.js [--revision assetRev]');
    console.log('--revision assetRev: asset revision to use while building asset filename');
    process.exit(0);
}
if ( argv.revision ) {
    jsFile = conf.assets + '/code-' + argv.revision + '.js';
    cssFile = conf.assets + '/style-' + argv.revision + '.css';
}

source = conf.destination;
destination = conf.destination;

console.log();
console.log('Starting to optimize ' + pjson.name);
console.log('- Source: "' + __dirname + '/' + source + '"');
console.log('- Destination: "' + __dirname + '/' + destination + '"');
metalsmith(__dirname)
    .source(source)
    .clean(false)
    .use(imagemin({
        optimizeLevel: 9,
    }))
    .use(cleanCss({
        files: cssFile,
        cleanCSS: {
            keepSpecialComments: 0,
            noRebase: true,
        }
    }))
    .use(uglify({
        filter: jsFile,
        concat: jsFile,
    }))
    .use(htmlMinifier())
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
