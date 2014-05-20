{% extends "layouts/layout.swig" %}

{% block title %}{{ title }} / Blog &mdash; {% parent %}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block content %}
    <div class="pure-g">
        <div class="pure-u-1 pure-u-md-3-4">
            <h1>{{ title }}</h1>

            <time>{{ created.format(config.dateFormat) }} &mdash; {{ updated.format(config.dateFormat) }}</time>

            {{ contents|raw }}
        </div>
        <aside class="pure-u-1 pure-u-md-1-4">
            {{ sidebar|safe }}
        </aside>
    </div>
{% endblock %}
