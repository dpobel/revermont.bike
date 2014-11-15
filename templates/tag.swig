{% extends "layouts/layout.swig" %}

{% block pageItemType %}http://www.schema.org/ItemPage{% endblock %}

{% block title %}{% if title %}{{ title }}{% else %}{{ tag }}{% endif %}{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %} - {% parent %}{% endblock %}

{% block content %}
<div class="pure-g tag-page" itemprop="mainContentOfPage" itemscope itemtype="{% if latlon %}http://www.schema.org/Place{% else %}http://www.schema.org/Article{% endif %}">
    <div class="pure-u-1 pure-u-md-3-4">
    <h1 class="icon-tag page-title">{% if title -%}
        <span itemprop="name">{{ title }}</span>
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
            <div itemprop="description" class="contents pure-u-1{% if latlon %} pure-u-md-2-5{% endif %}">{{ contents|safe }}</div>
        </article>
        {% endif %}

        {% if latlon %}
        <div itemscope itemprop="geo" itemtype="http://www.schema.org/GeoCoordinates">
            <meta itemprop="latitude" content="{{ latlon[0] }}">
            <meta itemprop="longitude" content="{{ latlon[1] }}">
        </div>
        {% endif %}

        {% if pagination.num == 1 and photos.length %}
        <h2>Photos de &laquo;&nbsp;{% if title %}{{ title }}{% else %}{{ tag }}{% endif %}&nbsp;&raquo;</h2>
        <div class="pure-g gallery" itemprop="photo">
            {% for photo in photos %}
                {% include "parts/photo_gallery.swig" with {photo: photo} %}
            {% endfor %}
        </div>
        {% endif %}

        {% if posts.length %}
        <h2>Au sujet de &laquo;&nbsp;{% if title %}{{ title }}{% else %}{{ tag }}{% endif %}&nbsp;&raquo;</h2>

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
        {% endif %}

        {% include "pagination.swig" with pagination %}
    </section>
    </div>
    <aside class="pure-u-1 pure-u-md-1-4 sidebar">
        <h3>Tag cloud</h3>
        {% include "parts/cloud.swig" %}
    </aside>
</div>
{% endblock %}

{% block javascriptCode %}
{% if latlon %}
    RB.tagMap({
        'ignApiKey': "{{ config.ignKey }}",
        'layerReadyClass': "{{ screenshot.layerReadyClass }}",
        'popup': {% if popup %}true{% else %}false{% endif %},
        'title': {{ title|json|safe }},
        'point': {{ latlon|json|safe }},
        'map': '.map-tag',
        'zoom': {% if zoom %}{{ zoom }}{% else %}10{% endif %},
        'photosUrl': "{{ "photos/data.js"|url(true) }}?{{ photos.metadata.maxDate }}"
    });
{% endif %}
{% if pagination.num == 1 and photos.length %}
    RB.fitGallery({
        container: '.gallery',
        elements: '.gallery-photo',
    });
{% endif %}
{% endblock %}
