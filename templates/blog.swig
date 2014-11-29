{% extends "layouts/layout.swig" %}

{% block pageItemType %}http://www.schema.org/CollectionPage{% endblock %}

{% block title %}{{ long }}{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block breadcrumb %}
    {% include "parts/breadcrumb.swig" with {
        struct: [
            {path: "/", name: "VTT dans le Revermont"},
            {path: false, name: title},
        ]
    } %}
{% endblock %}

{% block content %}
<div class="pure-g blog">
    <div itemprop="mainContentOfPage" itemscope itemtype="http://schema.org/Blog" class="pure-u-1 pure-u-md-3-4">
    <h1 class="icon-blog page-title"><span itemprop="name">{{ long }}</span>{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %}</h1>

    <section>
        <ul class="item-list">
        {% for post in pagination.files %}
            <li itemprop="blogPost" itemscope itemtype="http://schema.org/BlogPosting">
                <a href="{{ post.path|url }}" itemprop="url">
                    <span itemprop="name">{{ post.title }}</span>
                </a>
                <time datetime="{{ post.created.format() }}" itemprop="dateCreated" class="item-list-date">{{ post.created.format(config.dateTimeFormat) }}</time>
            </li>
        {% endfor %}
        </ul>
    </section>

    {% include "pagination.swig" with pagination %}
    </div>
    <aside class="pure-u-1 pure-u-md-1-4 sidebar">
        {{ blogsidebar|safe }}

        <h3>Partager sur les réseaux sociaux</h3>
        {% include "parts/share.swig" with {url: path, text: "Blog de " + config.shortTitle } %}

        <h3>Tag cloud</h3>
        {% include "parts/cloud.swig" %}
    </aside>
</div>
{% endblock %}
