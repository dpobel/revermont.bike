{% extends "layouts/layout.swig" %}

{% block title %}{{ tag }}{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %} - {% parent %}{% endblock %}

{% block content %}
<div class="pure-g tag-page">
    <div class="pure-u-1 pure-u-md-3-4">
    <h1 class="icon-tag page-title">Pages tagguées &laquo;&nbsp;{{ tag }}&nbsp;&raquo;{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %}</h1>

    <section>
        <ul class="item-list">
        {% for post in pagination.files %}
            <li class="icon-{{ post.section }}">
                <a href="{{ post.path|url }}">
                    {{ post.title }}
                </a>
                <time datetime="{{ post.created.format() }}" class="item-list-date">{{ post.created.format(config.dateTimeFormat) }}</time>
            </li>
        {% endfor %}
        </ul>
    </section>
    </div>
    <aside class="pure-u-1 pure-u-md-1-4 sidebar">
        {{ blogsidebar|safe }}

        <h3>Tag cloud</h3>
        {% include "parts/cloud.swig" with {totalPosts: collections.posts.length, tagsList: tagsList} %}
    </aside>

    {% include "pagination.swig" with pagination %}
</div>
{% endblock %}
