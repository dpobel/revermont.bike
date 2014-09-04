{% extends "layouts/layout.swig" %}

{% block title %}{{ tag }} &mdash; {% parent %}{% endblock %}

{% block content %}
    <h1 class="simple-page-title">Pages tagguées &laquo;&nbsp;{{ tag }}&nbsp;&raquo;{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %}</h1>

    <section class="posts-list full-list">
        <ul>
        {% for post in pagination.files %}
            <li>
                <a href="{{ post.path|url }}">
                    {{ post.title }}
                    <time>{{ post.created.format(config.dateFormat) }}</time>
                </a>
            </li>
        {% endfor %}
        </ul>
    </section>

    {% include "pagination.swig" with pagination %}
{% endblock %}
