{% extends "layout.swig" %}

{% block title %}{{ title }} &mdash; {% parent %}{% endblock %}

{% block content %}
    <h1>{{ title }}</h1>

    {{ contents|raw }}
{% endblock %}
