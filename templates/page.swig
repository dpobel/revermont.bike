{% extends "layouts/layout.swig" %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block title %}{{ title }} &mdash; {% parent %}{% endblock %}

{% block content %}
    <article>
        <h1 class="simple-page-title">{{ title }}</h1>
        <div class="content">{{ contents|safe }}</div>
        {% if created %}
        <footer class="content-meta">
            Publié le <time>{{ created.format(config.dateFormat) }}</time>
        {% if updated %}
            &mdash; Dernière mise à jour le <time>{{ updated.format(config.dateFormat) }}</time>
        {% endif %}
        </footer>
        {% endif %}
    </article>
{% endblock %}
