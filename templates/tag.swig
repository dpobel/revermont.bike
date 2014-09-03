{% extends "layouts/layout.swig" %}

{% block title %}{{ tag }} &mdash; {% parent %}{% endblock %}

{% block content %}
    <h1 class="simple-page-title">{{ tag }}</h1>

    <section class="posts-list full-list">
        <ul>
        {% for post in posts %}
            <li>
                <a href="{{ post.path|url }}">
                    {{ post.title }}
                    <time>{{ post.created.format(config.dateFormat) }}</time>
                </a>
            </li>
        {% endfor %}
        </ul>
    </section>

{% endblock %}
