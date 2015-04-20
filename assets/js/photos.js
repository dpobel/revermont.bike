/* global domready, L */
(function (global, domReady, L) {
    "use strict";

    var RB = global.RB = global.RB || {};

    function compLatLon (ll1, ll2) {
        return (ll1[0] === ll2[0] && ll1[1] === ll2[1]);
    }

    function addPhotos(photos, map, centerLatLon, layersControl) {
        var photosLayer = L.layerGroup();

        photos.forEach(function (photo) {
            var marker;

            if ( !photo.latlon ) {
                return;
            }
            // TODO: only create the markers for the photos which are "closed"
            // to the current map bounds and handle the markers list on the
            // dragend and zoomend events
            marker = L.marker(photo.latlon, {
                title: "Afficher la prévisualisation",
                icon: L.AwesomeMarkers.icon({
                    icon: 'photo',
                    prefix: 'icon',
                    markerColor: compLatLon(centerLatLon, photo.latlon) ? 'blue' : 'red',
                    extraClasses: 'map-icon',
                })
            }).addTo(photosLayer);
            marker.on('click', function () {
                map.openPopup(photo.popup, photo.latlon);
            });
        });
        photosLayer.addTo(map);
        if ( layersControl ) {
            layersControl.addOverlay(photosLayer, "Photos");
        }
    }

    RB.photos = function (dataUrl, map, centerLatLon, layersControl) {
        var req = new XMLHttpRequest();

        req.open('GET', dataUrl, true);
        req.onreadystatechange = function (e) {
            if ( req.readyState === 4 && req.status === 200 ) {
                addPhotos(JSON.parse(req.responseText), map, centerLatLon, layersControl);
            }
        };
        req.send(null);
    };
})(window, domready, L);
