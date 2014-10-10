/* global define */
define(['domReady', 'leaflet', 'leaflet.fullscreen'], function (domReady, L) {
    "use strict";

    var config, map,
        doc = window.document;

    function _init() {
        var layers;

        layers = {
            "IGN Scan express": L.tileLayer("http://wxs.ign.fr/" + config.ignApiKey
                    + "/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&"
                    + "LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.CLASSIQUE&STYLE=normal&TILEMATRIXSET=PM&"
                    + "TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg", {
                attribution: '&copy; <a href="http://www.ign.fr/">IGN</a>',
            }),
            "IGN Topo": L.tileLayer("http://wxs.ign.fr/" + config.ignApiKey
                    + "/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&"
                    + "LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS&STYLE=normal&TILEMATRIXSET=PM&"
                    + "TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg", {
                attribution: '&copy; <a href="http://www.ign.fr/">IGN</a>',
            }),
        };

        map = L.map(doc.querySelector(config.map), {
            zoom: config.zoom,
            center: config.point,
            layers: [layers["IGN Scan express"]],
            fullscreenControl: true,
        });
        if ( config.popup ) {
            L.popup()
                .setContent(config.title)
                .setLatLng(config.point)
                .addTo(map);
        }
        L.control.layers(layers, {}, {position: 'topleft'}).addTo(map);
    }

    return {
        init: function (conf) {
            config = conf;
            domReady(_init);
        },
    };
});
