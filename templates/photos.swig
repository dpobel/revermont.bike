{% extends "layouts/layout.swig" %}

{% block title %}{{ long }}{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %} - {% parent %}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block content %}
<div>
    <h1 class="icon-photo page-title">{{ long }}{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %}</h1>

    <section class="pure-g gallery">
    {% for photo in pagination.files %}
        {% include "parts/photo_gallery.swig" with {photo: photo} %}
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
