{% extends "layouts/layout.swig" %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block title %}{{ title }} - Sentier VTT - {% parent %}{% endblock %}

{% block content %}
    {% include "parts/track-content.swig" %}
{% endblock %}

{% block javascriptCode %}
    {% include "parts/track-app.swig" %}
{% endblock %}

{% block meta %}
{% include "parts/twitter-card.swig" with {
    type: "summary_large_image",
    site: config.twitter,
    creator: "@dpobel",
    title: title,
    description: contents|striptags|shorten(200),
    src: profile,
} %}
{% endblock %}
