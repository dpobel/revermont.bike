{% extends "layouts/layout.swig" %}

{% block pageItemType %}http://www.schema.org/ContactPage{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block title %}{{ title }} - {% parent %}{% endblock %}

{% block breadcrumb %}
    {% include "parts/breadcrumb.swig" with {
        struct: [
            {path: "/", name: "VTT dans le Revermont"},
            {path: false, name: title, current: path},
        ]
    } %}
{% endblock %}

{% block content %}
    <article>
        <h1 class="icon-contact page-title">{{ title }}</h1>
        <div>{{ contents|safe }}</div>
    </article>
{% endblock %}
