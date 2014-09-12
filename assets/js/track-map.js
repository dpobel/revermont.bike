/* global define */
define(['domReady', 'leaflet'], function (domReady, L) {
    "use strict";

    var config, map, track,
        doc = window.document;

    function _getBounds() {
        var bounds = track.bounds;

        return [[bounds.minlat, bounds.minlon], [bounds.maxlat, bounds.maxlon]];
    }

    function _initApp() {
        var container = doc.querySelector(config.container),
            map = doc.querySelector(config.map);
        
        map.style.height = window.innerHeight * 0.9 + "px";

        _initSidebar();
        _initMap();
        container.classList.add(config.classes.appInitialized);
    }

    function _initSidebar() {
        var sidebar = doc.querySelector(config.sidebar);

        sidebar.addEventListener('click', function (e) {
            if ( e.target.classList.contains(config.classes.tab) ) {
                e.preventDefault();
                _switchTab(sidebar, e.target);
            }
        });
    }

    function _switchTab(sidebar, tab) {
        if ( tab.classList.contains(config.classes.tabFocused) ) {
            return;
        }

        sidebar.querySelector('.' + config.classes.tabFocused).classList.remove(config.classes.tabFocused);
        tab.classList.add(config.classes.tabFocused);

        sidebar.querySelector('.' + config.classes.panelVisible).classList.remove(config.classes.panelVisible);
        sidebar.querySelector(tab.getAttribute('href')).classList.add(config.classes.panelVisible);
    }

    function _initMap() {
        var layer, line,
            start = {lat: track.points[0].lat, lon: track.points[0].lon};

        layer = L.tileLayer("http://wxs.ign.fr/" + config.ignApiKey
                    + "/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&"
                    + "LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS&STYLE=normal&TILEMATRIXSET=PM&"
                    + "TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg", {
            attribution: '&copy; <a href="http://www.ign.fr/">IGN</a>',
        });

        map = L.map(doc.querySelector(config.map), {
            layers: [layer],
        });
        map.fitBounds(_getBounds());
        console.log(map.getZoom(), config.maxAutoZoom);
        if ( map.getZoom() > config.maxAutoZoom ) {
            map.setZoom(config.maxAutoZoom, {animated: true});
        }

        line = L.polyline(track.points, {
            color: config.style.color,
            opacity: config.style.pathOpacity,
            weight: config.style.weight,
        });
        line.addTo(map);
        L.marker(start, {
            title: "Départ",
        }).addTo(map);
    }

    return {
        init: function (data, conf) {
            track = data;
            config = conf;
            domReady(_initApp);
        },
    };
});
