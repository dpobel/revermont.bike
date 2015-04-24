/* global domready, L */
(function (global, domReady, L) {
    "use strict";

    var config, map, tracks,
        RB = global.RB = global.RB || {},
        doc = global.document;

    function _showMap(e) {
        doc.body.classList.add(config.classes.displayed);
    }

    function _hideMap(e) {
        doc.body.classList.remove(config.classes.displayed);
    }

    function _getBounds() {
        var minLat = 90, minLon = 90, maxLat = -90, maxLon = -90;

        Object.keys(tracks).forEach(function (name) {
            var bounds = tracks[name].bounds;

            minLat = Math.min(bounds.minlat, minLat);
            minLon = Math.min(bounds.minlon, minLon);
            maxLat = Math.max(bounds.maxlat, maxLat);
            maxLon = Math.max(bounds.maxlon, maxLon);
        });

        return [[minLat, minLon], [maxLat, maxLon]];
    }

    function _initMap() {
        var layers = RB.layers(config.ignApiKey, L, "Fond neutre"),
            layersControl;

        map = L.map(doc.querySelector(config.selector.map), {
            layers: [layers.defaultLayer]
        });
        map.fitBounds(_getBounds());
        layersControl = L.control.layers(layers.layers, {}, {position: 'topleft'}).addTo(map);
        L.control.scale({imperial: false}).addTo(map);
        RB.photos(config.photosUrl, map, [], layersControl);

        Object.keys(tracks).forEach(function (name) {
            var track = tracks[name],
                line = L.polyline(track.points, {
                    color: track.color,
                    opacity: config.style.pathOpacity,
                    weight: config.style.weight,
                });
            line.on('click', function (e) {
                line.bringToFront();
                L.popup()
                    .setLatLng(e.latlng)
                    .setContent(track.description)
                    .openOn(map);
            });
            line.addTo(map);
        });

        if ( doc.location.hash === '#maps' ) {
            _showMap();
        }
    }

    function _init() {
        doc.querySelector(config.selector.showMap).addEventListener('click', _showMap);
        doc.querySelector(config.selector.hideMap).addEventListener('click', _hideMap);

        _initMap();
    }

    RB.globalMap = function (dataUrl, conf) {
        var req = new XMLHttpRequest();

        config = conf;
        req.open('GET', dataUrl, true);
        req.onreadystatechange = function (e) {
            if ( req.readyState === 4 && req.status === 200 ) {
                tracks = JSON.parse(req.responseText);
                domReady(_init);
            }
        };
        req.send(null);
    };
})(window, domready, L);
