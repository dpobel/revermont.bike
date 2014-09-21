/* global casper, __utils__ */
casper.test.begin('Track page', function suite(test) {
    var viewport = {width: 1280, height: 1024},
        url = 'http://127.0.0.1:9001/sentiers/single-du-grillerin/';

    casper.start(url, function () {
        casper.viewport(viewport.width, viewport.height);
    });

    casper.then(function () {
        test.comment('Title and menu');
        test.assertTitleMatch(/^Single du Grillerin .*/, "The title starts with 'Single du Grillerin'");
        test.assertTitleMatch(/^.*Sentier VTT.*/, "The title contains 'Sentier VTT'");
        test.assertElementCount('.site-menu .pure-menu-selected', 1, "One element is selected in the menu");
        test.assertEquals(
            this.fetchText('.site-menu .pure-menu-selected'),
           "Sentiers",
           "'Sentiers' is selected in the menu"
        );
    });

    casper.then(function () {
        var path = casper.evaluate(function () {
                return __utils__.findAll('.track-map path');
            }),
            marker = casper.evaluate(function () {
                return __utils__.findAll('.track-map .leaflet-marker-icon');
            });

        test.comment('Map');
        test.assertVisible('.track-map', "The map is visible");
        test.assertEqual(path.length, 1, "The map displays one path");
        test.assertEqual(marker.length, 1, "The map displays one marker");
    });

    function assertTabIsVisible(test, tabName, tabId) {
        test.assertEvalEquals(function () {
            return __utils__.findOne('.track-sidebar-tabs-label.is-tab-focused').textContent;
        }, tabName, "The '" + tabName + "' tab is focused");
        test.assertVisible(tabId, "The '" + tabId + "' panel is visible");
    }

    casper.then(function () {
        test.comment('Default tabs state');
        assertTabIsVisible(test, 'Profil', '#profile');
    });

    casper.then(function () {
        this.click('a[href="#description"]');
        test.comment('Description tab');
        assertTabIsVisible(test, 'Description', '#description');

        test.assertElementCount(
            '#description .content-tags-item a', 2,
            "The tags are displayed"
        );
    });

    casper.then(function () {
        this.click('a[href="#tools"]');
        test.comment('Tools tab');
        assertTabIsVisible(test, 'Outils', '#tools');

        test.assertElementCount(
            '#tools .icon-print', 1,
            "A link to print the page is displayed"
        );
        test.assertElementCount(
            '#tools a[href="grillerin.gpx"]', 1,
            "A link to download the GPX file is displayed"
        );
    });

    casper.then(function () {
        var data = [],
            profileCoords,
            coordMarkerBefore, coordMarkerAfter;
            

        casper.click('a[href="#profile"]');
        test.comment('Profile tab');

        assertTabIsVisible(test, 'Profil', '#profile');

        test.assertExists('img.track-profile-chart', "The profile is displayed as an image");
        test.assert(casper.resourceExists(/profile.png$/), "The profile has been loaded");

        data = casper.evaluate(function () {
            return __utils__.findAll('.track-data tbody tr');
        });

        test.assertEquals(data.length, 5, "The table displays 5 rows");

        profileCoords = casper.evaluate(function () {
            var bounds = __utils__.getElementBounds('.track-profile-chart');

            return {
                x: bounds.left + 20,
                y: bounds.top + 20
            };
        });

        coordMarkerBefore = casper.getElementBounds('.leaflet-marker-icon');
        casper.mouse.move(profileCoords.x, profileCoords.y);
        coordMarkerAfter = casper.getElementBounds('.leaflet-marker-icon');

        test.assertVisible('.track-profile-tooltip', "The track tooltip is visible");

        test.assertNot(
            (coordMarkerBefore.top == coordMarkerAfter.top
             && coordMarkerBefore.left == coordMarkerAfter.left),
            "The marker has moved"
        );
    });

    casper.run(function () {
        test.done();
    });
});
