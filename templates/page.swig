{% extends "layouts/layout.swig" %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block title %}{{ title }} &mdash; {% parent %}{% endblock %}

{% block content %}
    <h1 class="simple-page-title">{{ title }}</h1>

    {{ contents|safe }}
{% endblock %}
