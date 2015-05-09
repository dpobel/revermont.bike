{% extends "layouts/layout.swig" %}

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
    <div class="poi-map" style="height: 400px;"><div>
</article>
{% endblock %}

{% block javascriptCode %}
RB.poiMap({
    'ignApiKey': "{{ config.ignKey }}",
    'map': '.poi-map',
    'zoom': 15,
});
{% endblock %}

