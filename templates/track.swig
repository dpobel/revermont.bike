{% extends "layouts/layout.swig" %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block title %}{{ title }} - Sentier VTT - {% parent %}{% endblock %}

{% block content %}
    {% include "parts/track-content.swig" %}
{% endblock %}

{% block javascriptCode %}
    {% include "parts/track-app.swig" %}
{% endblock %}
