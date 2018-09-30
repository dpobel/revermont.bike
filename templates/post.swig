{% extends "layouts/layout.swig" %}

{% block pageItemType %}http://www.schema.org/ItemPage{% endblock %}

{% block title %}{{ title }} / Blog VTT dans le Revermont{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block breadcrumb %}
    {% include "parts/breadcrumb.swig" with {
        struct: [
            {path: "/", name: "VTT dans le Revermont"},
            {path: "/posts/", name: "Blog"},
            {path: false, name: title, current: path},
        ]
    } %}
{% endblock %}

{% block content %}
    <article class="pure-g blog-post" itemscope itemtype="http://schema.org/BlogPosting">
        <div class="pure-u-1 pure-u-md-3-4 blog-post-content">
            <h1 class="icon-blog page-title" itemprop="name">{{ title }}</h1>
            <div itemprop="articleBody" class="contents">{{ contents|safe }}</div>
        </div>
        <aside class="pure-u-1 pure-u-md-1-4 sidebar">
            <p>Publié le <time datetime="{{ created.format() }}" itemprop="dateCreated">{{ created.format(config.dateTimeFormat) }}</time></p>
        {% if updated %}
            <p>Dernière mise à jour le<br><time datetime="{{ updated.format() }}" itemprop="dateModified">{{ updated.format(config.dateTimeFormat) }}</time></p>
        {% endif %}
        {% if tags %}
            <h3>Mots-clés&nbsp;:</h3>
            {% include "parts/keywords.swig" with {tags: tags} %}
        {% endif %}

            <h3>Partager sur les réseaux sociaux</h3>
            {% include "parts/share.swig" with {url: path, text: title} %}

            {{ blogsidebar|safe }}
        </aside>
    </article>
{% endblock %}

{% block meta %}
{% parent %}
{% include "parts/twitter-card.swig" with {
    type: "summary",
    site: "@" + config.twitter,
    creator: "@dpobel",
    title: title,
    description: contents|striptags|shorten(200),
    src: contents|extract_image()
} %}
{% endblock %}
