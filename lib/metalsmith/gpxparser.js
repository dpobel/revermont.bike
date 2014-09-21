/**
 * Metalsmith plugin to parse a gpx file.
 *
 * For now, it sets:
 * - the `title` from the track name and metadata name
 * - the creation date (`created`) if the GPX has one
 * - an `elevation` object containing the max and min altitude and the total gain
 *   and loss
 * - a `bounds` object containing the minimun and maximum latitude and longitude
 * - a boolean `loop` property
 * - a `points` array with the complete list of points in the GPX file
 * - a `color` property with an auto generated color string
 */
var libxmljs = require('libxmljs'),
    async = require('async'),
    path = require('path'),
    gen = require('color-generator'),

    nsConfig = {"gpx": "http://www.topografix.com/GPX/1/1"},
    ELEVATION_MIN_DIFF = 2,
    COORD_SAME_POINT_DIFF = 0.001;

function _deg2rad(deg) {
    return deg * Math.PI / 180;
}

function _dist2d(a, b) {
    var R = 6371000,
        dLat = _deg2rad(b.lat - a.lat),
        dLon = _deg2rad(b.lon - a.lon),
        r = Math.sin(dLat/2) *
            Math.sin(dLat/2) +
            Math.cos(_deg2rad(a.lat)) *
            Math.cos(_deg2rad(b.lat)) *
            Math.sin(dLon/2) *
            Math.sin(dLon/2);

    return R * 2 * Math.atan2(Math.sqrt(r), Math.sqrt(1-r));
}

function _dist3d(a, b) {
    var planar = _dist2d(a, b),
        height = Math.abs(b.ele - a.ele);

    return Math.sqrt(Math.pow(planar, 2) + Math.pow(height, 2));
}

function setTitle(fileObj, doc) {
    var nameElt = doc.get('//gpx:metadata/gpx:name', nsConfig);

    if ( !nameElt ) {
        nameElt = doc.get('/gpx:gpx/gpx:trk/gpx:name', nsConfig);
    }

    if ( nameElt ) {
        fileObj.title = nameElt.text();
    }
}

function setTime(fileObj, doc) {
    var timeElt = doc.get('//gpx:metadata/gpx:time', nsConfig);

    if ( timeElt ) {
        fileObj.created = timeElt.text();
    }
    // TODO default value ?
}

function setColor(fileObj, doc) {
    fileObj.color = gen(1, 1.5).hexString();
}

function setBounds(fileObj, doc) {
    var boundsElt = doc.get('//gpx:bounds', nsConfig),
        bounds = {maxlat: -90, minlat: 90, maxlon: -90, minlon: 90};

    if ( boundsElt ) {
        Object.keys(bounds).forEach(function (attr) {
            bounds[attr] = parseFloat(boundsElt.attr(attr).value());
        });
        fileObj.bounds = bounds;
        return true;
    }
    return false;
}

function parsePoints(fileObj, doc, trackPoints, elevationMinDiff) {
    var foundBounds,
        bounds = {maxlat: -90, minlat: 90, maxlon: -90, minlon: 90},
        points = [],
        distance = 0, prev,
        elevation = {loss: 0, gain: 0, min: 10000, max: 0};

    foundBounds = setBounds(fileObj, doc);

    trackPoints.forEach(function (point) {
        var floatPoint = {
                lon: parseFloat(point.attr('lon').value()),
                lat: parseFloat(point.attr('lat').value()),
                ele: parseFloat(point.get('gpx:ele', nsConfig).text()),
                dst: 0
            },
            diff;

        if ( !foundBounds ) {
            bounds.minlat = Math.min(bounds.minlat, floatPoint.lat);
            bounds.maxlat = Math.max(bounds.maxlat, floatPoint.lat);

            bounds.minlon = Math.min(bounds.minlon, floatPoint.lon);
            bounds.maxlon = Math.max(bounds.maxlon, floatPoint.lon);
        }

        points.push(floatPoint);

        if ( prev ) {
            diff = floatPoint.ele - prev.ele;
            if ( Math.abs(diff) > elevationMinDiff ) {
                if ( diff > 0 ) {
                    elevation.gain += diff;
                } else {
                    elevation.loss += -1 * diff;
                }
            } else {
                floatPoint.ele = prev.ele;
            }
            distance += _dist3d(prev, floatPoint);
            floatPoint.dst = parseFloat((distance / 1000).toFixed(2));
        }

        elevation.min = Math.min(elevation.min, floatPoint.ele);
        elevation.max = Math.max(elevation.max, floatPoint.ele);

        prev = floatPoint;
    });

    if ( !foundBounds ) {
        fileObj.bounds = bounds;
    }
    fileObj.points = points;
    fileObj.distance = parseFloat((distance / 1000).toFixed(1));
    elevation.loss = Math.round(elevation.loss);
    elevation.gain = Math.round(elevation.gain);
    fileObj.elevation = elevation;
}

function setIsLoop(fileObj) {
    var start = fileObj.points[0],
        end = fileObj.points[fileObj.points.length - 1];

    fileObj.loop = (
        Math.abs(start.lat - end.lat) < COORD_SAME_POINT_DIFF
        && Math.abs(end.lon - end.lon) < COORD_SAME_POINT_DIFF
    );
}

function parseGpx(files, filePath, basePath, opts, done) {
    var fileObj = files[filePath],
        gpxObj = files[basePath + '/' + fileObj.gpx],
        jsObjPath = basePath + '/data.js',
        doc, trackPoints;

    if ( !gpxObj ) {
        done(new Error("Reference gpx files not found: " +  basePath + '/' + fileObj.gpx));
        return;
    }

    try {
        doc = libxmljs.parseXmlString(gpxObj.contents);
    } catch(e) {
        done(e);
        return;
    }

    setTitle(fileObj, doc);
    setTime(fileObj, doc);
    setColor(fileObj, doc);

    trackPoints = doc.find('//gpx:trkpt[gpx:ele]', nsConfig);
    parsePoints(fileObj, doc, trackPoints, opts.elevationMinDiff);

    setIsLoop(fileObj, doc, trackPoints);
    fileObj.dataUrl = jsObjPath;
    files[jsObjPath] = {
        template: false,
        permalink: false,
        contents: JSON.stringify({
            title: fileObj.title,
            points: fileObj.points,
            elevation: fileObj.elevation,
            bounds: fileObj.bounds,
            distance: fileObj.distance,
            loop: fileObj.loop,
        }),
    };
    done();
}

module.exports = function (opts) {
    opts = opts || {};
    return function (files, metalsmith, done) {
        var tasks = [];
        Object.keys(files).forEach(function (filePath) {
            var elevationMinDiff = ELEVATION_MIN_DIFF;

            if ( files[filePath].elevationMinDiff ) {
                elevationMinDiff = files[filePath].elevationMinDiff;
            } else if ( opts.elevationMinDiff ) {
                elevationMinDiff = opts.elevationMinDiff;
            }
            if ( files[filePath].gpx ) {
                tasks.push(function (cb) {
                    parseGpx(
                        files, filePath,
                        path.dirname(filePath), {
                            elevationMinDiff: elevationMinDiff,
                        }, cb
                    );
                });
            }
        });
        async.parallel(tasks, done);
    };
};
