/**
 * Metalsmith plugin to apply automatic cleaning on GPX files
 *
 * It does:
 *  - remove the extensions element that gpsbabel does not handle correctly
 *  - fix the elevations (50m offset)
 *  - limit the number of points by calling gpsbabel
 *  - remove the time elements
 *  - remove the point without elevations
 *  - smooth the elevations (convolution in 2 passes)
 */
var libxmljs = require('libxmljs'),
    async = require('async'),
    child = require('child_process'),

    nsConfig = {"gpx": "http://www.topografix.com/GPX/1/1"},
    elevationFix = 50,
    defaultPointsLimit = 2000,
    convolutionPass = 2;

function _removeElement(elt) {
    elt.remove();
}

function removeExtensions(doc) {
    doc.find('//gpx:extensions', nsConfig).forEach(_removeElement);
}

function removeNoElevationPoints(doc) {
    doc.find('//gpx:trkpt[not(gpx:ele)]', nsConfig).forEach(_removeElement);
}

function removeTime(doc) {
    doc.find('//gpx:trkpt/gpx:time', nsConfig).forEach(_removeElement);
}

function fixElevation(doc) {
    doc.find('//gpx:ele', nsConfig).forEach(function (ele) {
        ele.text(parseFloat(ele.text()) - elevationFix);
    });
}

function limitSize(doc, limit, callback) {
    var gpsbabel, xml = '';

    if ( doc.find('//gpx:ele', nsConfig).length > limit ) {
        gpsbabel = child.spawn("gpsbabel", [
            "-t",
            "-i",
            "gpx",
            "-f",
            "-",
            "-x",
            "simplify,count=" + limit,
            "-o",
            "gpx,gpxver=1.1",
            "-F",
            "-"
        ], {stdio: ['pipe', 'pipe', process.stderr]});

        gpsbabel.on('error', function (code) {
            callback(new Error("gpsbabel error:" + code));
        });

        gpsbabel.stdout.on('data', function (data) {
            xml += data;
        });

        gpsbabel.on('close', function (code) {
            var err;

            if ( code ) {
                err = new Error("gpsbabel error: " + code);
            } else {
                doc = libxmljs.parseXmlString(xml);
            }
            callback(err, doc);
        });

        gpsbabel.stdin.write(doc.toString(), function (err) {
            if (err) {
                callback(err);
            }
            gpsbabel.stdin.end();
        });
    } else {
        callback(false, doc);
    }
}

function _convoluate(doc) {
    var step = 9,
        norm = 231,
        coefs = [-21, 14, 39, 54, 59, 54, 39, 14, -21],
        elevations = doc.find('//gpx:ele', nsConfig),
        start = (step -1) / 2,
        end = elevations.length - start - 1;

    elevations.forEach(function (ele, index) {
        var sum = 0;

        if ( index < start || index > end ) {
            elevations[index].text(parseFloat(ele.text()).toFixed(1));
            return;
        }

        coefs.forEach(function (coef, i) {
            sum += coef * parseFloat(elevations[i + index - start].text());
        });
        elevations[index].text((sum / norm).toFixed(1));
    });
}

function convoluate(doc, pass) {
    for (var i = pass; i !== 0; --i) {
        _convoluate(doc);
    }
}

function getNodeValue(doc, xpath) {
    var elt;

    elt = doc.get(xpath, nsConfig);
    return elt ? elt.text() : undefined;
}

function docGetMetadata(doc) {
    return {
        name: getNodeValue(doc, '/gpx:gpx/gpx:metadata/gpx:name'),
        desc: getNodeValue(doc, '/gpx:gpx/gpx:metadata/gpx:desc'),
        keywords: getNodeValue(doc, '/gpx:gpx/gpx:metadata/gpx:keywords'),
        time: getNodeValue(doc, '/gpx:gpx/gpx:metadata/gpx:time'),
    };
}

function docSetMetadata(doc, metadata) {
    var metadataElt = doc.get('/gpx:gpx/gpx:metadata', nsConfig);

    if ( !metadataElt ) {
        metadataElt = doc.root().node('metadata');
    }

    Object.keys(metadata).forEach(function (tag) {
        var elt;

        if ( metadata[tag] ) {
            elt = doc.get('/gpx:gpx/gpx:metadata/gpx:' + tag, nsConfig);
            if ( elt ) {
                elt.text(metadata[tag]);
            } else {
                metadataElt.node(tag, metadata[tag]);
            }
        }
    });
}

function cleanGpx(fileObj, pointsLimit, done) {
    var doc, metadata;

    try {
        doc = libxmljs.parseXmlString(fileObj.contents);
    } catch(e) {
        done(e);
        return;
    }

    // workaround an issue in gpsbabel where it removes most metadata
    // and overwrite the time node value.
    // getting the metadata here so that we can set it after
    // running gpsbabel
    metadata = docGetMetadata(doc);
    removeExtensions(doc);
    limitSize(doc, pointsLimit, function (err, doc) {
        if ( err ) {
            return done(err);
        }
        docSetMetadata(doc, metadata);
        fixElevation(doc);
        removeTime(doc);
        removeNoElevationPoints(doc);
        convoluate(doc, convolutionPass);
        fileObj.contents = doc.toString();
        done();
    });
}

module.exports = function (opts) {
    opts = opts || {};

    return function (files, metalsmith, done) {
        var tasks = [];
        Object.keys(files).forEach(function (filePath) {
            var pointsLimit = opts.limit || defaultPointsLimit;

            if ( filePath.match(/.*\.gpx$/i) ) {
                if ( files[filePath].limit ) {
                    pointsLimit = files[filePath].limit;
                }
                tasks.push(function (cb) {
                    cleanGpx(files[filePath], pointsLimit, cb);
                });
            }
        });
        async.parallel(tasks, done);
    };
};
