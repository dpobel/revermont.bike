{% extends "layouts/layout.swig" %}

{% block pageItemType %}http://www.schema.org/CollectionPage{% endblock %}

{% block title %}{{ long }} - {% parent %}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block content %}
<div itemprop="mainContentOfPage">
    <h1 class="icon-treks page-title">{{ long }}</h1>
    <div class="contents">{{ contents|safe }}</div>

    {% include "parts/map.swig" with {"label": "Voir toutes les randonnées sur une carte"} %}

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
    {% for trek in treks %}
    <tr>
        <td><a href="{{ trek.path|url }}">{{ trek.title }}</a></td>
        <td>{{ trek.distance }}&nbsp;km</td>
        <td>{% if trek.loop %}±{{ trek.elevation.gain }}{% else %}+{{ trek.elevation.gain }}/-{{ trek.elevation.loss}}{% endif %}&nbsp;m</td>
        <td>{{ trek.elevation.max }}&nbsp;m</td>
        <td>{{ trek.elevation.min }}&nbsp;m</td>
    </tr>
    {% endfor %}
    </table>
</div>
{% endblock %}

{% block javascriptCode %}
    RB.globalMap("{{ "randonnees/data.js"|url(true) }}?{{ treks.metadata.maxDate }}", {
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
