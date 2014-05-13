{% extends "layout.swig" %}

{% block menu %}{% set section = 'a-propos' %}{% parent %}{% endblock %}

{% block title %}{{ title }} &mdash; {% parent %}{% endblock %}

{% block content %}
    <h1>{{ title }}</h1>

    {{ contents|raw }}
{% endblock %}
