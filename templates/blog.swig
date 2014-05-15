{% extends "layout.swig" %}

{% block title %}{{ title }} &mdash; {% parent %}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block content %}
    <h1>{{ title }}</h1>

    <ul>
    {% for post in collections.posts %}
        <li>
            <a href="/{{ post.path }}">{{ post.title }}</a>
        </li>
    {% endfor %}
    </ul>

    <aside>
        {{ sidebar|safe }}
    </aside>

{% endblock %}
