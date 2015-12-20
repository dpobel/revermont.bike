var async = require('async'),
    Rickshaw = require('rickshaw'),
    jsdom = require('jsdom'),
    fs = require('fs'),
    os = require('os'),
    path = require('path'),
    phantom = require('phantomjs').path,
    exec = require('child_process').execFile,
    Imagemin = require('imagemin');

function convertProfileToPng(fileObj, filePath, files, conf, html, done) {
    var tmpHtmlFile = os.tmpdir() + '/' + filePath.replace(/\//g, '-') + fileObj.gpx + '.htm',
        pngPath = path.dirname(filePath) + '/profile.png';

    fs.writeFile(tmpHtmlFile, html, function (err) {
        var args = [
                path.resolve(__dirname, 'utils/svg2png.js'),
                tmpHtmlFile,
                conf.width,
                conf.height,
            ];

        if ( err ) {
            done(err);
            return;
        }

        exec(phantom, args, function (err, stdout, stderr) {
            if ( err ) {
                fs.unlink(tmpHtmlFile, done);
                return;
            }

            new Imagemin()
                .src(new Buffer(stdout, 'base64'))
                .run(function (err, imageFiles) {
                    if ( err ) {
                        done(err);
                        return;
                    }
                    files[pngPath] = {
                        permalink: false,
                        contents: imageFiles[0].contents,
                    };
                    fileObj.profile = pngPath;
                    fs.unlink(tmpHtmlFile, done);
                });
        });
    });
}

function htmlRickshaw() {
    var html = '<html><link rel="stylesheet" href="';
   
    html += require.resolve('rickshaw').replace(/\.js$/, '.css');
    html += '"><style>html, body {margin: 0}</style><body><div></div></body></html>';
    return html;
}

function generateProfile(fileObj, filePath, files, conf, done) {
    var data = [], ele,
        html = htmlRickshaw();

    fileObj.points.forEach(function (point) {
        if ( ele && point.ele != ele ) {
            data.push({
                x: point.dst,
                y: point.ele,
            });
        }
        ele = point.ele;
    });

    jsdom.env({
        html: html,
        done: function (err, window) {
            var graph,
                elt = window.document.querySelector('div');

            graph = new Rickshaw.Graph({
                element: elt,
                min: fileObj.elevation.min - conf.offsetMin,
                max: fileObj.elevation.max + conf.offsetMax,
                series: [{
                    color: conf.color,
                    stroke: conf.strokeColor,
                    data: data,
                }],
                renderer: conf.renderer,
                stroke: conf.stroke,
                width: conf.width,
                height: conf.height,
                interpolation: conf.interpolation
            });

            new Rickshaw.Graph.Axis.X({
                graph: graph,
            });
            new Rickshaw.Graph.Axis.Y({
                graph: graph,
            });
            graph.render();

            convertProfileToPng(
                fileObj, filePath, files, conf,
                window.document.documentElement.outerHTML, done
            );
        }
    });
}

module.exports = function (opts) {
    return function (files, metalsmith, done) {
        var tasks = [];

        Object.keys(files).forEach(function (filePath) {
            if ( files[filePath].points ) {
                tasks.push(function (cb) {
                    generateProfile(files[filePath], filePath, files, opts, cb);
                });
            }
        });
        
        async.parallel(tasks, done);
    };
};
