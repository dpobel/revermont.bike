{% extends "layout.swig" %}

{% block title %}{{ title }} / Blog &mdash; {% parent %}{% endblock %}

{% block menu %}{% set section = 'blog' %}{% parent %}{% endblock %}

{% block content %}
    <h1>{{ title }}</h1>

    {{ contents|raw }}
{% endblock %}
