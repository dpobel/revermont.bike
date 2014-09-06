define(function () {
    return {
        {% for track in collections[exportCollection] %}
        "{{ track.title|e('js') }}": {
            'bounds': {{ track.bounds|json|safe }},
            'distance': {{ track.distance }},
            'elevation': {{ track.elevation|json|safe }},
            'color': "{{ track.color|e('js') }}",
            'description': {% filter json %}{% include "track_popup.swig" with track %}{% endfilter %},
            'points': {{ track.points|filter_points(config.tracksListSteps)|json|safe }}
        },
        {% endfor %}
    };
});
