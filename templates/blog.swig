{% extends "layouts/layout.swig" %}

{% block title %}{{ title }} (Page {{ pagination.num }}) &mdash; {% parent %}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block content %}
    <div class="pure-g">
        <div class="pure-u-1 pure-u-md-3-4">
            <h1>{{ title }} (Page {{ pagination.num }})</h1>

            <ul>
            {% for post in pagination.files %}
                <li>
                    <a href="{{ post.path|url }}">{{ post.title }}</a>
                </li>
            {% endfor %}
            </ul>

            {% include "pagination.swig" with pagination %}
        </div>
        <aside class="pure-u-1 pure-u-md-1-4">
            {{ sidebar|safe }}
        </aside>
    </div>
{% endblock %}
