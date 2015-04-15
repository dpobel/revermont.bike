{% extends "layouts/layout.swig" %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block title %}{{ title }} - Randonnée VTT dans le Revermont{% endblock %}

{% block breadcrumb %}
    {% include "parts/breadcrumb.swig" with {
        struct: [
            {path: "/", name: "VTT dans le Revermont"},
            {path: "/randonnees/", name: "Circuits de randonnées"},
            {path: false, name: title, current: path},
        ]
    } %}
{% endblock %}

{% block content %}
    {% include "parts/track-content.swig" %}
{% endblock %}

{% block javascriptCode %}
    {% include "parts/track-app.swig" %}
{% endblock %}

{% block meta %}
{% parent %}
{% include "parts/twitter-card.swig" with {
    type: "summary_large_image",
    site: config.twitter,
    creator: "@dpobel",
    title: title,
    description: contents|striptags|shorten(200),
    src: path + '/' +  screenshot.filename,
} %}
{% endblock %}
