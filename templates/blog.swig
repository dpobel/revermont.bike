{% extends "layout.swig" %}

{% block title %}{{ title }} (Page {{ pagination.num }}) &mdash; {% parent %}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block content %}
    <h1>{{ title }} (Page {{ pagination.num }})</h1>

    <ul>
    {% for post in pagination.files %}
        <li>
            <a href="{{ post.path|url }}">{{ post.title }}</a>
        </li>
    {% endfor %}
    </ul>

    <ul class="pure-paginator">
        <li><a class="pure-button prev" href="{{ pagination.prev.path|url }}"{% if not pagination.prev %} disabled="disabled"{% endif %}>&#171;</a></li>
        {% for page, object in pagination.pages %}
        <li><a class="pure-button" href="{{ object.path|url }}">{{ page }}</a></li>
        {% endfor %}
        <li><a class="pure-button next" href="{{ pagination.next.path|url }}"{% if not pagination.next %} disabled="disabled"{% endif %}>&#187;</a></li>
    </ul>

    <aside>
        {{ sidebar|safe }}
    </aside>

{% endblock %}
