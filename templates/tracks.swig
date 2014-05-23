{% extends "layouts/layout.swig" %}

{% block title %}{{ title }} &mdash; {% parent %}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block content %}
    <h1>{{ title }}</h1>

   <table class="tracks-full-list pure-table pure-table-bordered pure-table-stripped">
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

    {% if pagination.total > 1 %}
        <ul class="pure-paginator">
            <li><a class="pure-button prev" href="{{ pagination.prev.path|url }}"{% if not pagination.prev %} disabled="disabled"{% endif %}>&#171;</a></li>
            {% for page, object in pagination.pages %}
            <li><a class="pure-button" href="{{ object.path|url }}">{{ page }}</a></li>
            {% endfor %}
            <li><a class="pure-button next" href="{{ pagination.next.path|url }}"{% if not pagination.next %} disabled="disabled"{% endif %}>&#187;</a></li>
        </ul>
    {% endif %}

{% endblock %}
