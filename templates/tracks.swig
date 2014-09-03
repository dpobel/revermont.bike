{% extends "layouts/layout.swig" %}

{% block title %}{{ title }} &mdash; {% parent %}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block meta %}
    <script src="{{ "lib/leaflet/leaflet.js"|asset() }}"></script>
    <script src="{{ "js/global-map.js"|asset() }}"></script>
{% endblock %}

{% block content %}
    <h1 class="simple-page-title">{{ title }}</h1>

    <p class="tools"><a href="#maps" class="bubble icon-map show-map">Voir toutes les traces sur une carte</a></p>
    <div class="global-map"><div class="map-tools"><a href="#" class="bubble icon-list back-list">Retour à la liste</a></div><div class="map-container"></div></div>

    <script>
    (function () {
        RB.globalMap.init({
            'ignApiKey': "{{ config.ignKey }}",
            'selector': {
                'showMap': '.show-map',
                'hideMap': '.back-list',
                'map': '.global-map',
                'mapContainer': '.map-container',
            },
            'classes': {
                'displayed': 'global-map-displayed'
            },
            'tracks': {
            {% for track in tracks %}
                "{{ track.title|e('js') }}": {
                    'bounds': {{ track.bounds|json|safe }},
                    'distance': {{ track.distance }},
                    'elevation': {{ track.elevation|json|safe }},
                    'color': "{{ track.color|e('js') }}",
                    'description': {% filter json %}{% include "track_popup.swig" with track %}{% endfilter %},
                    'points': {{ track.points|filter_points(config.tracksListSteps)|json|safe }}
                },
            {% endfor %}
            },
            'style': {
                'pathOpacity': 1,
                'weight': 8,
            }
        });
    })();</script>

    <table class="tracks-full-list pure-table pure-table-bordered pure-table-striped">
    <thead>
        <tr>
            <th>Titre</th>
            <th>Distance</th>
            <th>Dénivelé</th>
            <th><abbr title="Altitude maximale">Alt. max</abbr></th>
            <th><abbr title="Altitude minimale">Alt. min</abbr></th>
        </tr>
    </thead>
    {% for track in pagination.files %}
    <tr>
        <td><a href="{{ track.path|url }}">{{ track.title }}</a></td>
        <td>{{ track.distance }}&nbsp;km</td>
        <td>{% if track.loop %}±{{ track.elevation.gain }}{% else %}+{{ track.elevation.gain }}/-{{ track.elevation.loss}}{% endif %}&nbsp;m
        <td>{{ track.elevation.max }}&nbsp;m</td>
        <td>{{ track.elevation.min }}&nbsp;m</td>
    </tr>
    {% endfor %}
    </table>

    {% include "pagination.swig" with pagination %}
{% endblock %}
