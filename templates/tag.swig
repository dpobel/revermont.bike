{% extends "layouts/layout.swig" %}

{% block title %}{{ tag }}{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %} - {% parent %}{% endblock %}

{% block content %}
    <h1 class="icon-tag page-title">Pages tagguées &laquo;&nbsp;{{ tag }}&nbsp;&raquo;{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %}</h1>

    <section>
        <ul>
        {% for post in pagination.files %}
            <li>
                <a href="{{ post.path|url }}">
                    {{ post.title }}
                </a>
            </li>
        {% endfor %}
        </ul>
    </section>

    {% include "pagination.swig" with pagination %}
{% endblock %}
