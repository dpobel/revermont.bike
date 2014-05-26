{% extends "layouts/layout.swig" %}

{% block title %}{{ title }} &mdash; {% parent %}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block content %}
    <h1>{{ title }}</h1>

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
