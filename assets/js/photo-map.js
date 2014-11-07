/* global domready, L */
(function (global, domReady, L) {
    "use strict";

    var config, map,
        RB = global.RB = global.RB || {},
        doc = global.document;

    function _init() {
        var layers = RB.layers(config.ignApiKey, L);

        map = L.map(doc.querySelector(config.map), {
            zoom: config.zoom,
            center: config.latlon,
            layers: [layers.defaultLayer],
            fullscreenControl: true,
        });
        RB.photos(config.photosUrl, map);
        L.control.layers(layers.layers, {}, {position: 'topleft'}).addTo(map);
    }

    RB.photoMap = function (conf) {
        config = conf;
        domReady(_init);
    };
})(window, domready, L);
