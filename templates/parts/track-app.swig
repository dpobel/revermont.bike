RB.trackMap("{{ dataUrl|url(true) }}", {
    'ignApiKey': "{{ config.ignKey }}",
    'map': '.track-map',
    'container': '.track-app',
    'sidebar': '.track-sidebar',
    'profile': '.track-profile',
    'profileTooltip': '.track-profile-tooltip',
    'profileTooltipInfo': '.track-profile-tooltip-info',
    'profileChart': '.track-profile-chart',
    'classes': {
        'appInitialized': 'is-track-app-initialized',
        'tab': 'track-sidebar-tabs-label',
        'tabFocused': 'is-tab-focused',
        'panelVisible': 'is-panel-visible',
        'mouseTracked': 'is-mouse-tracked',
        'tooltipOnLeft': 'is-tooltip-on-left',
    },
    'maxAutoZoom': 15,
    'style': {
        'color': '#0033ff',
        'pathOpacity': 0.6,
        'weight': 6,
    }
});
