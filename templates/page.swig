{% extends "layouts/layout.swig" %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block title %}{{ title }} - {% parent %}{% endblock %}

{% block content %}
    <article>
        <h1 class="icon-{{ icon }} page-title">{{ title }}</h1>
        <div class="contents">{{ contents|safe }}</div>
        {% if created %}
        <footer>
            Publié le <time>{{ created.format(config.dateFormat) }}</time>
        {% if updated %}
            &mdash; Dernière mise à jour le <time>{{ updated.format(config.dateFormat) }}</time>
        {% endif %}
        </footer>
        {% endif %}
    </article>
{% endblock %}
