{% extends "layout.swig" %}

{% block title %}{{ title }} / Blog &mdash; {% parent %}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block content %}
    <h1>{{ title }}</h1>

    <time>{{ created.format(config.dateFormat) }} &mdash; {{ updated.format(config.dateFormat) }}</time>

    {{ contents|raw }}

    <aside>
        {{ sidebar|safe }}
    </aside>
{% endblock %}
