#! /usr/bin/env node

var metalsmith = require('metalsmith'),
    argv = require('minimist')(process.argv.slice(2), {
        "string": ['directory', 'port'],
        "boolean": ['help', 'h'],
    }),
    conf = require('./build.json'),
    source = conf.destination,
    destination = conf.destination,

    keep = require('./lib/metalsmith/keep'),
    screenshot = require('./lib/metalsmith/screenshot');

if ( argv.help || argv.h ) {
    console.log('screenshot.js [--dir directory] [--url url]');
    console.log('--dir dir: the directory where to find the HTML files and to put the screenshots');
    console.log('--port port: the port on which the web server is running');
    process.exit(0);
}

console.log();
console.log('Generating the screenshot');
console.log('- Source: "' + __dirname + '/' + source + '"');
console.log('- Destination: "' + __dirname + '/' + destination + '"');

if ( argv.dir ) {
    source = destination = argv.dir;
}
if ( argv.port ) {
    conf.screenshot.port = argv.port;
}
console.log('- Port: ' + conf.screenshot.port);

metalsmith(__dirname)
    .clean(false)
    .source(source)
    .destination(destination)
    .use(keep('**/*.html'))
    .use(screenshot(conf.screenshot))
    .build(function (error, files) {
        if ( error ) {
            console.error(error.message);
            console.log(error.stack);
            process.exit(1);
        }
        console.log('Generated:');
        Object.keys(files).forEach(function (filePath) {
            console.log('- ' + filePath);
        });
    });
