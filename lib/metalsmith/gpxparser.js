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
    fs = require('fs'),
    gen = require('color-generator'),

    nsConfig = {"gpx": "http://www.topografix.com/GPX/1/1"},
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

function setBounds(fileObj, doc, trackPoints) {
    var boundsElt = doc.get('//gpx:bounds', nsConfig),
        bounds = {maxlat: -90, minlat: 90, maxlon: -90, minlon: 90};

    if ( boundsElt ) {
        Object.keys(bounds).forEach(function (attr) {
            bounds[attr] = parseFloat(boundsElt.attr(attr).value());
        });
    } else {
        trackPoints.forEach(function (point) {
            bounds.minlat = Math.min(bounds.minlat, parseFloat(point.attr("lat").value()));
            bounds.maxlat = Math.max(bounds.maxlat, parseFloat(point.attr("lat").value()));

            bounds.minlon = Math.min(bounds.minlon, parseFloat(point.attr("lon").value()));
            bounds.maxlon = Math.max(bounds.maxlon, parseFloat(point.attr("lon").value()));
        });
    }

    fileObj.bounds = bounds;
}

function setPoints(fileObj, doc, trackPoints) {
    var points = [];
    trackPoints.forEach(function (point) {
        var ele = point.get('gpx:ele', nsConfig);

        points.push({
            lon: parseFloat(point.attr('lon').value()),
            lat: parseFloat(point.attr('lat').value()),
            ele: parseFloat(ele.text())
        });
    });
    fileObj.points = points;
}

function setDistance(fileObj, doc, trackPoints) {
    var distance = 0, prev;

    trackPoints.forEach(function (point) {
        var p = {
                lat: parseFloat(point.attr('lat').value()),
                lon: parseFloat(point.attr('lon').value()),
                ele: parseFloat(point.get('gpx:ele', nsConfig).text()),
            };

        if ( prev ) {
            distance += _dist3d(prev, p);
        }
        prev = p;
    });

    fileObj.distance = parseFloat((distance / 1000).toFixed(1));
}

function setElevation(fileObj, doc, trackPoints) {
    var elevation = {loss: 0, gain: 0, min: 10000, max: 0},
        prev;

    // TODO introduce some smoothing to avoid huge error
    // on gain/loss computing
    trackPoints.forEach(function (point) {
        var ele = point.get('gpx:ele', nsConfig),
            diff, alt;

        alt = parseFloat(ele.text());
        elevation.min = Math.min(elevation.min, alt);
        elevation.max = Math.max(elevation.max, alt);
        if ( prev ) {
            diff = alt - prev;
            if ( diff > 0 ) {
                elevation.gain += diff;
            } else {
                elevation.loss += -1 * diff;
            }
        }
        prev = alt;
    });
    elevation.loss = Math.round(elevation.loss);
    elevation.gain = Math.round(elevation.gain);
    fileObj.elevation = elevation;
}

function setIsLoop(fileObj, doc, trackPoints) {
    var start = trackPoints[0],
        end = trackPoints[trackPoints.length - 1];

    fileObj.loop = (
        Math.abs(start.attr('lat').value() - end.attr('lat').value()) < COORD_SAME_POINT_DIFF
        && Math.abs(end.attr('lon').value() - end.attr('lon').value()) < COORD_SAME_POINT_DIFF
    );
}

function parseGpx(fileObj, basePath, done) {
    fs.readFile(basePath + '/' + fileObj.gpx, function (err, content) {
        var doc, trackPoints;

        if ( err ) {
            done(err);
            return;
        }
        try {
            doc = libxmljs.parseXmlString(content);
        } catch(e) {
            done(e);
            return;
        }

        setTitle(fileObj, doc);
        setTime(fileObj, doc);
        setColor(fileObj, doc);

        trackPoints = doc.find('//gpx:trkpt[gpx:ele]', nsConfig);
        setBounds(fileObj, doc, trackPoints);
        setDistance(fileObj, doc, trackPoints);
        setElevation(fileObj, doc, trackPoints);
        setIsLoop(fileObj, doc, trackPoints);
        setPoints(fileObj, doc, trackPoints);

        done();
    });
}

module.exports = function (opts) {
    return function (files, metalsmith, done) {
        var tasks = [];
        Object.keys(files).forEach(function (filePath) {
            if ( files[filePath].gpx ) {
                tasks.push(function (cb) {
                    parseGpx(files[filePath], metalsmith.source() + '/' + path.dirname(filePath), cb);
                });
            }
        });
        async.parallel(tasks, done);
    };
};
