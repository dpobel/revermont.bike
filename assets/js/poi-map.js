/* global domready, L */
(function (global, domReady, L) {
    "use strict";

    var config, map, marker,
        RB = global.RB = global.RB || {},
        defaultCenter = [46.260317, 5.447662],
        doc = global.document;

    function _init() {
        var layers = RB.layers(config.ignApiKey, L, "IGN Topo"),
            layersControl;

        map = L.map(doc.querySelector(config.map), {
            zoom: config.zoom,
            center: defaultCenter,
            layers: [layers.defaultLayer],
            fullscreenControl: true,
        });
        marker = L.marker(defaultCenter, {opacity: 0}).addTo(map);
        layersControl = L.control.layers(layers.layers, {}, {position: 'topleft'}).addTo(map);
        L.control.scale({imperial: false}).addTo(map);
        updateMap();
    }

    function updateMap() {
        var params = doc.location.hash.replace(/^#/, '').split('/'),
            config = {};

        params.forEach(function (val) {
            var tmp = val.split('='),
                paramName = tmp[0],
                paramValue = tmp[1];
            
            config[paramName] = paramValue;
        });
        map.panTo([config.lat, config.lon]);
        marker.setLatLng([config.lat, config.lon]).setOpacity(1);
    }

    global.onhashchange = updateMap;

    RB.poiMap = function (conf) {
        config = conf;
        domReady(_init);
    };
})(window, domready, L);
