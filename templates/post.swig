{% extends "layouts/layout.swig" %}

{% block title %}{{ title }} / Blog &mdash; {% parent %}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block content %}
    <article class="pure-g blog-post">
        <div class="pure-u-1 pure-u-md-3-4 blog-post-content">
            <h1 class="simple-page-title">{{ title }}</h1>
            <div>{{ contents|safe }}</div>
        </div>
        <aside class="pure-u-1 pure-u-md-1-4 blog-post-meta">
            <p>Publié le <time>{{ created.format(config.dateFormat) }}</time></p>
        {% if updated %}
            <p>Dernière mise à jour le<br><time>{{ updated.format(config.dateFormat) }}</time></p>
        {% endif %}
        {% if tags %}
            <p>Mots-clés&nbsp;:</p>
            <ul class="tags-list">
            {% for tag in tags %}
                <li class="tag"><a href="{{ tagsList[tag].path|url }}">{{ tag }}</a></li>
            {% endfor %}
            </ul>
        {% endif %}
        </aside>
    </article>
{% endblock %}
