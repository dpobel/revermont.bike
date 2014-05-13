{% extends "layout.swig" %}

{% block title %}{{ title }} &mdash; {% parent %}{% endblock %}

{% block content %}
    <h1>{{ title }}</h1>

    <ul>
    {% for track in collections.tracks %}
        <li>
            <a href="/{{ track.path }}">{{ track.title }}</a>
        </li>
    {% endfor %}
    </ul>
{% endblock %}
