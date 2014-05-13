{% extends "layout.swig" %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block title %}{{ title }} &mdash; {% parent %}{% endblock %}

{% block content %}
    <h1>{{ title }}</h1>
    {{ path }}
    <br>
    {{ gpx }}
    <br>
    {{ contents|raw }}
{% endblock %}
