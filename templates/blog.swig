{% extends "layouts/layout.swig" %}

{% block title %}{{ title }}{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %} - {% parent %}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block content %}
    <h1>{{ title }}{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %}</h1>

    <ul>
    {% for post in pagination.files %}
        <li>
            <a href="{{ post.path|url }}">{{ post.title }}</a>
        </li>
    {% endfor %}
    </ul>

    {% include "pagination.swig" with pagination %}
{% endblock %}
