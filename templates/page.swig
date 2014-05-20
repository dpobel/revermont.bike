{% extends "layouts/layout.swig" %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block title %}{{ title }} &mdash; {% parent %}{% endblock %}

{% block content %}
    <div class="pure-g">
        <div class="pure-u-1">
            <h1>{{ title }}</h1>

            {{ contents|raw }}
        </div>
    </div>
{% endblock %}
