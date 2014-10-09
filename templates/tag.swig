{% extends "layouts/layout.swig" %}

{% block title %}{% if title %}{{ title }}{% else %}{{ tag }}{% endif %}{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %} - {% parent %}{% endblock %}

{% block content %}
<div class="pure-g tag-page">
    <div class="pure-u-1 pure-u-md-3-4">
    <h1 class="icon-tag page-title">{% if title -%}
        {{ title }}
    {%- else -%}
        Pages tagguées &laquo;&nbsp;{{ tag }}&nbsp;&raquo;
    {%- endif %}
    {% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %}
    </h1>

    <section>
        {% if pagination.num == 1 and contents %}
        <article class="pure-g">
            {% if latlon %}
            <div class="map-tag pure-u-1 pure-u-md-3-5"></div>
            {% endif %}
            <div class="contents pure-u-1{% if latlon %} pure-u-md-2-5{% endif %}">{{ contents|safe }}</div>
        </article>

        <h2>Au sujet de &laquo;&nbsp;{% if title %}{{ title }}{% else %}{{ tag }}{% endif %}&nbsp;&raquo;</h2>
        {% endif %}

        <ul class="item-list">
        {% for post in pagination.files %}
            <li class="icon-{{ post.section }}">
                <a href="{{ post.path|url }}">
                    {{ post.title }}
                </a>
                <time datetime="{{ post.created.format() }}" class="item-list-date">{{ post.created.format(config.dateFormat) }}</time>
            </li>
        {% endfor %}
        </ul>

        {% include "pagination.swig" with pagination %}
    </section>
    </div>
    <aside class="pure-u-1 pure-u-md-1-4 sidebar">
        {{ blogsidebar|safe }}

        <h3>Tag cloud</h3>
        {% include "parts/cloud.swig" %}
    </aside>
</div>
{% endblock %}

{% block javascriptCode %}
{% if latlon %}
    require(['tagMap'], function (tagMap) {
        tagMap.init({
            'ignApiKey': "{{ config.ignKey }}",
            'popup': {% if popup %}true{% else %}false{% endif %},
            'title': {{ title|json|safe }},
            'point': {{ latlon|json|safe }},
            'map': '.map-tag',
            'zoom': {% if zoom %}{{ zoom }}{% else %}10{% endif %},
        });
    });
{% endif %}
{% endblock %}
