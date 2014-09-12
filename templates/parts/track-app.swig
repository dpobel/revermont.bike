    require(['trackMap'], function (trackMap) {
        var track = {
                title: "{{ title|e('js') }}",
                points: {{ points|json|safe }},
                elevation: {{ elevation|json|safe }},
                distance: {{ distance }},
                bounds: {{ bounds|json|safe }},
                color: "{{ color }}",
                loop: {{ loop }},
            };
        trackMap.init(track, {
            'ignApiKey': "{{ config.ignKey }}",
            'map': '.track-map',
            'container': '.track-app',
            'sidebar': '.track-sidebar',
            'profile': '.track-profile',
            'classes': {
                'appInitialized': 'is-track-app-initialized',
                'tab': 'track-sidebar-tabs-label',
                'tabFocused': 'is-tab-focused',
                'panelVisible': 'is-panel-visible',
            },
            'maxAutoZoom': 15,
            'style': {
                'color': '#0033ff',
                'pathOpacity': 0.6,
                'weight': 6,
            }
        });
    });

