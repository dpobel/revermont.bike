var cp = require('child_process'),
    path = require('path'),
    cheerio = require('cheerio'),
    async = require('async');

function doScreenshot(filePath, screenPath, files, opts, cb) {
    var args = [
            path.resolve(__dirname, 'utils/screenshot.js'),
            'http://' + opts.host + ":" + opts.port + opts.base + filePath + '#' + opts.urlHash,
            opts.viewport.width,
            opts.viewport.height,
            opts.selector,
            opts.layerReadyClass,
            opts.format,
            opts.transitionWaitTime,
        ];

    cp.execFile("node_modules/.bin/casperjs", args, function (err, stdout, stderr) {
        if ( err ) {
            console.error('stdout:', stdout, 'stderr:', stderr, 'args', args);
            return cb(err);
        }
        files[screenPath] = {
            contents: new Buffer(stdout, 'base64'),
        };
        cb();
    });
}

function screenshot(fileObj, filePath, files, opts, cb) {
    var $ = cheerio.load(fileObj.contents.toString()),
        screenPath;

    delete files[filePath];
    if ( $(opts.selector).length ) {
        screenPath = path.dirname(filePath) + '/' + opts.filename;
        return doScreenshot(filePath, screenPath, files, opts, cb);
    }
    cb();
}

module.exports = function (opts) {
    return function (files, metalsmith, done) {
        var tasks = [];

        Object.keys(files).forEach(function (filePath) {
            tasks.push(function (cb) {
                screenshot(files[filePath], filePath, files, opts, cb);
            });
        });

        async.parallelLimit(tasks, opts.concurrency, done);
    };
};
