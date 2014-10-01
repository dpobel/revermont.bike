/* global casper, __utils__ */
casper.test.begin('Tracks global map page', function suite(test) {
    var viewport = {width: 1280, height: 1024},
        url = 'http://127.0.0.1:9001/single-tracks/';

    function fetchTracksList(casper) {
        return casper.evaluate(function () {
            var trs = __utils__.findAll('.tracks-table tbody tr'),
                tracks = [];

            trs.forEach(function (tr) {
                var track = {name: "", link: ""},
                    a = tr.querySelector('td a');

                track.name = a.textContent;
                track.link = a.getAttribute('href');
                tracks.push(track);
            });

            return tracks;
        });
    }

    casper.start(url, function () {
        casper.viewport(viewport.width, viewport.height);
    });

    casper.then(function () {
        test.comment('Title and menu');
        test.assertTitleMatch(/^Single tracks dans le Revermont .*/, "The title starts with 'Single tracks dans le Revermont'");
        test.assertElementCount('.site-menu .pure-menu-selected', 1, "One element is selected in the menu");
        test.assertEquals(
            this.fetchText('.site-menu .pure-menu-selected'),
           "Single tracks",
           "'Single tracks' is selected in the menu"
        );
    });

    casper.then(function () {
        var tracks = fetchTracksList(casper);

        test.comment('Tracks list');
        test.assertElementCount('.tracks-table', 1, "The list of tracks is displayed");
        test.assertEquals(tracks.length, 2, "The tracks list has 2 entries");
        // TODO test the actual tracks ?
    });

    casper.then(function () {
        var mapBounds = this.getElementBounds('.global-map');

        test.comment('Map and show map button initial state');
        test.assertVisible('.show-map', "The show map button is visible");
        test.assertEquals(
            this.fetchText('.show-map'), "Voir tous les single tracks sur une carte",
            "The shop map button is labelled with 'Voir tous les single-tracks sur une carte'"
        );

        test.assertEquals(mapBounds.width, viewport.width, "The map width is the viewport width");
        test.assertEquals(mapBounds.height, viewport.height, "The map height is the viewport height");
        //test.assertNotVisible('.global-map', "The map is hidden");
        //does not work, the map is hidden by putting it outside of the viewport
        test.assertEquals(mapBounds.left, viewport.width, "The map left position is the viewport width");
    });

    casper.then(function () {
        test.comment('Showing the map');
        this.click('.show-map');

        test.assertUrlMatch(url + '#maps', "'#maps' is added to the URL");

        casper.waitFor(function () {
            return casper.getElementBounds('.global-map').left === 0;
        }, function () {
            var mapBounds = casper.getElementBounds('.global-map');

            test.assertEquals(mapBounds.width, viewport.width, "The map width is the viewport width");
            test.assertEquals(mapBounds.height, viewport.height, "The map height is the viewport height");
            //test.assertVisible('.global-map', "The map is hidden");
            //does not really work, the map was hidden by putting it outside of the viewport
            test.assertEquals(mapBounds.left, 0, "The map left position is 0");
        });
    });

    casper.then(function () {
        var tracksList = fetchTracksList(casper),
            paths = casper.evaluate(function () {
                return __utils__.findAll('path');
            }),
            colors = casper.evaluate(function () {
                return __utils__.findAll('path').map(function (p) {
                    return p.getAttribute('color');
                }).filter(function (value, i, colors) {
                    return colors.indexOf(value) !== -1;
                });
            });

        test.comment('Map content consistent with the tracks list');
        test.assertEquals(paths.length, tracksList.length, "A path is created per track (" + tracksList.length + " tracks)");
        test.assertEquals(colors.length, tracksList.length, "Each path has a different color");

        test.assertNotVisible('.leaflet-popup', "No popup is shown by default");
        casper.evaluate(function () {
            __utils__.findAll('path').forEach(function (p, i) {
                p.setAttribute('id', 'leaflet-path' + i);
            });
        });
        tracksList.forEach(function (track, i) {
            casper.click('#leaflet-path' + i);
            test.assertVisible('.leaflet-popup', "A popup is shown when clicking on the path");
            test.assertEquals(
                casper.fetchText('.leaflet-popup .track-popup-title a'),
                track.name,
               "The popup for the track " + i + " has the '" + track.name + "' as title"
            );
            test.assertElementCount(
                '.leaflet-popup a[href="' + track.link + '"]', 2,
                "The popup has 2 links to the track page"
            );
        });
    });

    casper.then(function () {
        var backListBounds = this.getElementBounds('.back-list');

        test.comment('Back to list button');
        test.assertEquals(
            this.fetchText('.back-list'), "Retour à la liste",
            "The back to list button is labelled with 'Retour à la liste'"
        );

        test.assert((function () {
            return (
                (backListBounds.left > 0 ) &&
                (backListBounds.left + backListBounds.width < viewport.width) &&
                (backListBounds.top > 0 ) &&
                (backListBounds.top + backListBounds.height < viewport.height )
            );
        })(), "The back to list button is in the viewport");

        casper.click('.back-list');
        test.assertUrlMatch(url, "'#maps' is removed from the url");

        casper.waitFor(function () {
            return casper.getElementBounds('.global-map').left === viewport.width;
        }, function () {
            var mapBounds = casper.getElementBounds('.global-map');

            test.assertEquals(mapBounds.left, viewport.width, "The map is outside of the viewport");
        });

    });

    casper.run(function () {
        test.done();
    });
});
