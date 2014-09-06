/* global define */
define(['domReady', 'leaflet'], function (domReady, L) {
    "use strict";

    var config, map, tracks,
        doc = window.document;

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
        var layers;

        layers = {
            "Noir et blanc": L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '
                    + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
            }),
            "IGN Topo": L.tileLayer("http://wxs.ign.fr/" + config.ignApiKey
                    + "/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&"
                    + "LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS&STYLE=normal&TILEMATRIXSET=PM&"
                    + "TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg", {
                attribution: '&copy; <a href="http://www.ign.fr/">IGN</a>',
            }),
        };

        map = L.map(doc.querySelector(config.selector.map), {
            layers: [layers["Noir et blanc"]]
        });
        map.fitBounds(_getBounds());
        L.control.layers(layers, {}, {position: 'topleft'}).addTo(map);

        Object.keys(tracks).forEach(function (name) {
            var track = tracks[name],
                line = L.polyline(track.points, {
                    color: track.color,
                    opacity: config.style.pathOpacity,
                    weight: config.style.weight,
                });
            line.on('click', function (e) {
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

    return {
        init: function (data, conf) {
            tracks = data;
            config = conf;
            domReady(_init);
        },
    };
});
