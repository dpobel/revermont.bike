{% extends "layouts/layout.swig" %}

{% block title %}{{ title }} / Blog &mdash; {% parent %}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block content %}
    <article class="pure-g blog-post" itemscope itemtype="http://schema.org/BlogPosting">
        <div class="pure-u-1 pure-u-md-3-4 blog-post-content">
            <h1 class="icon-blog page-title" itemprop="name">{{ title }}</h1>
            <div itemprop="articleBody" class="contents">{{ contents|safe }}</div>

            {% include "parts/comments.swig" %}
        </div>
        <aside class="pure-u-1 pure-u-md-1-4 sidebar">
            <p>Publié le <time datetime="{{ created.format() }}" itemprop="dateCreated">{{ created.format(config.dateTimeFormat) }}</time></p>
        {% if updated %}
            <p>Dernière mise à jour le<br><time datetime="{{ created.format() }}" itemprop="dateModified">{{ updated.format(config.dateTimeFormat) }}</time></p>
        {% endif %}
        {% if tags %}
            <h3>Mots-clés&nbsp;:</h3>
            <ul class="content-tags" itemprop="keywords">
            {% for tag in tags %}
                <li class="content-tags-item icon-tag"><a href="{{ tagsList[tag].path|url }}">{{ tag }}</a></li>
            {% endfor %}
            </ul>
        {% endif %}

            <h3>Partager sur les réseaux sociaux</h3>
            {% include "parts/share.swig" with {url: path, text: title} %}
        </aside>
    </article>
{% endblock %}

{% block meta %}
{% include "parts/twitter-card.swig" with {
    type: "summary",
    site: "@" + config.twitter,
    creator: "@dpobel",
    title: title,
    description: contents|striptags|shorten(200)
} %}
{% endblock %}
