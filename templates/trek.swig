{% extends "layouts/layout.swig" %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block title %}{{ title }} &mdash; {% parent %}{% endblock %}

{% block content %}
    <h1>{{ title }}</h1>
    <time>{{ created.format(config.dateFormat) }}</time>

    {{ bounds|json }}

    <br>
    Loop: {{ loop }}
    <br>
    Elevation: {{ elevation|json }}
    <br>
    Distance: {{ distance }}km

    {{ contents|raw }}
{% endblock %}
