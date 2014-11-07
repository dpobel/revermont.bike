/* global domready, L */
(function (global, domReady, L) {
    "use strict";

    var RB = global.RB = global.RB || {};

    function addPhotos(photos, map) {
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
                    markerColor: 'red',
                    extraClasses: 'map-icon',
                })
            }).addTo(map);
            marker.on('click', function () {
                map.openPopup(photo.popup, photo.latlon);
            });
        });
    }

    RB.photos = function (dataUrl, map) {
        var req = new XMLHttpRequest();

        req.open('GET', dataUrl, true);
        req.onreadystatechange = function (e) {
            if ( req.readyState === 4 && req.status === 200 ) {
                addPhotos(JSON.parse(req.responseText), map);
            }
        };
        req.send(null);
    };
})(window, domready, L);
