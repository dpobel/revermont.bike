{% extends "layout.swig" %}

{% block title %}{{ title }} &mdash; {% parent %}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block content %}
    <h1>{{ title }}</h1>

    <ul>
    {% for track in collections.tracks %}
        <li>
            <a href="{{ track.path|url }}">{{ track.title }}</a>
        </li>
    {% endfor %}
    </ul>
{% endblock %}
