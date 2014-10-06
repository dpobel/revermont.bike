{% extends "layouts/layout.swig" %}

{% block title %}{{ title }}{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %} - {% parent %}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block content %}
<div class="pure-g blog">
    <div itemscope itemtype="http://schema.org/Blog" class="pure-u-1 pure-u-md-3-4">
    <h1 class="icon-blog page-title"><span itemprop="name">{{ title }}</span>{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %}</h1>

    <section>
        <ul class="blog-posts">
        {% for post in pagination.files %}
            <li itemprop="blogPost" itemtype="http://schema.org/BlogPosting">
                <a href="{{ post.path|url }}" itemprop="url">
                    <span itemprop="name">{{ post.title }}</span>
                </a>
                <time datetime="{{ post.created.format() }}" itemprop="dateCreated" class="blog-list-date">{{ post.created.format(config.dateTimeFormat) }}</time>
            </li>
        {% endfor %}
        </ul>
    </section>

    {% include "pagination.swig" with pagination %}
    </div>
    <aside class="pure-u-1 pure-u-md-1-4 blog-sidebar">
        {{ blogsidebar|safe }}

        <h3>Tag cloud</h3>
        {% set totalPosts = posts.length %}
        {% set tags = tagsList|sort %}
        <ul class="tag-cloud">
        {% for keyword in tags -%}
            {% set info = tagsList[keyword] %}
            <li class="tag" style="font-size: {{ (1 + info.posts.length/totalPosts)|round(2) }}em"><a href="{{ info.path|url }}">{{ keyword }}</a></li>
        {%- endfor %}
        </ul>

        <h3>Partager sur les réseaux sociaux</h3>
        {% include "parts/share.swig" with {url: path, text: "Blog de " + config.shortTitle } %}
    </aside>
</div>
{% endblock %}
