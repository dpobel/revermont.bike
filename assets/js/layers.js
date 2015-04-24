(function (global) {
    "use strict";

    var RB = global.RB = global.RB || {},
        attr = {attribution: '&copy; <a href="http://www.ign.fr/">IGN</a>'};

    function layerUrl(key, layer) {
        return "http://wxs.ign.fr/" + key
            + "/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&"
            + "LAYER=" + layer + "&STYLE=normal&TILEMATRIXSET=PM&"
            + "TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg";
    }

    RB.layers = function (ignApiKey, L, defaultLayer, layerReadyClass) {
        var res = {
                layers: {
                    "Fond neutre": L.tileLayer(
                        'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                        {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}
                    ),
                    "IGN Scan express": L.tileLayer(
                        layerUrl(ignApiKey, "GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.CLASSIQUE"),
                        attr
                    ),
                    "IGN Topo": L.tileLayer(
                        layerUrl(ignApiKey, "GEOGRAPHICALGRIDSYSTEMS.MAPS"),
                        attr
                    ),
                    "Photos aériennes": L.tileLayer(
                        layerUrl(ignApiKey, "ORTHOIMAGERY.ORTHOPHOTOS"),
                        attr
                    ),
                },
            };
        if ( !defaultLayer || !res.layers[defaultLayer] ) {
            defaultLayer = "IGN Scan express";
        }
        res.defaultLayer = defaultLayer && res.layers[defaultLayer];
        if ( layerReadyClass ) {
            res.defaultLayer.on('load', function () {
                global.document.body.classList.add(layerReadyClass);
            });
        }
        return res;
    };
})(window);
