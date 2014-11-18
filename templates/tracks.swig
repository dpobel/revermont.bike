{% extends "layouts/layout.swig" %}

{% block pageItemType %}http://www.schema.org/CollectionPage{% endblock %}

{% block title %}{{ long }}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block content %}
<div itemprop="mainContentOfPage">
    <h1 class="icon-tracks page-title">{{ long }}</h1>
    <div class="contents">{{ contents|safe }}</div>

    {% include "parts/map.swig" with {"label": "Voir tous les single tracks sur une carte"} %}

    <table class="pure-table pure-table-bordered pure-table-striped tracks-table">
    <thead>
        <tr>
            <th>Titre</th>
            <th>Distance</th>
            <th>Dénivelé</th>
            <th><abbr title="Altitude maximale">Alt. max</abbr></th>
            <th><abbr title="Altitude minimale">Alt. min</abbr></th>
        </tr>
    </thead>
    {% for track in tracks %}
    <tr>
        <td><a href="{{ track.path|url }}">{{ track.title }}</a></td>
        <td>{{ track.distance }}&nbsp;km</td>
        <td>{% if track.loop %}±{{ track.elevation.gain }}{% else %}+{{ track.elevation.gain }}/-{{ track.elevation.loss}}{% endif %}&nbsp;m</td>
        <td>{{ track.elevation.max }}&nbsp;m</td>
        <td>{{ track.elevation.min }}&nbsp;m</td>
    </tr>
    {% endfor %}
    </table>
</div>
{% endblock %}

{% block javascriptCode %}
    RB.globalMap("{{ "single-tracks/data.js"|url(true) }}?{{ tracks.metadata.maxDate }}", {
        'ignApiKey': "{{ config.ignKey }}",
        'photosUrl': "{{ "photos/data.js"|url(true) }}?{{ photos.metadata.maxDate }}",
        'selector': {
            'showMap': '.show-map',
            'hideMap': '.back-list',
            'map': '.global-map',
            'mapContainer': '.map-container',
        },
        'classes': {
            'displayed': 'global-map-displayed'
        },
        'style': {
            'pathOpacity': 1,
            'weight': 8,
        }
    });
{% endblock %}
