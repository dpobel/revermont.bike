{% extends "layout.swig" %}

{% block title %}{{ title }} &mdash; {% parent %}{% endblock %}

{% block content %}
    <h1>{{ title }}</h1>

    <ul>
    {% for post in collections.posts %}
        <li>
            <a href="/{{ post.path }}">{{ post.title }}</a>
        </li>
    {% endfor %}
    </ul>


{% endblock %}
