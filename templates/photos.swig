{% extends "layouts/layout.swig" %}

{% block title %}{{ long }}{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %} - {% parent %}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block content %}
<div>
    <h1 class="icon-photo page-title">{{ long }}{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %}</h1>

    <section class="pure-g gallery">
    {% for photo in pagination.files %}
        <div class="pure-u gallery-photo" data-width="{{ photo.variations.list.width }}">
            <a href="{{ photo.path|url }}" class="gallery-photo-link" style="height: {{ photo.variations.list.height }}px">
            <img src="{{ photo.variations.list.fullpath|url(true) }}" alt="{{ photo.title }}" width="{{ photo.variations.list.width }}" height="{{ photo.variations.list.height }}">
            </a>
        </div>
    {% endfor %}
    </section>

    {% include "pagination.swig" with pagination %}
</div>
{% endblock %}

{% block javascriptCode %}
    RB.fitGallery({
        container: '.gallery',
        elements: '.gallery-photo',
    });
{% endblock %}
