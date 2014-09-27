{% extends "layouts/layout.swig" %}

{% block title %}{{ title }}{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %} - {% parent %}{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block content %}
    <div itemscope itemtype="http://schema.org/Blog">
    <h1 class="icon-blog page-title"><span itemprop="name">{{ title }}</span>{% if pagination.num != 1 %} (Page {{ pagination.num }}){% endif %}</h1>

    <section>
        <ul>
        {% for post in pagination.files %}
            <li itemprop="blogPost" itemtype="http://schema.org/BlogPosting">
                <a href="{{ post.path|url }}" itemprop="url">
                    <span itemprop="name">{{ post.title }}</span>
                </a>
            </li>
        {% endfor %}
        </ul>
    </section>

    {% include "pagination.swig" with pagination %}
    </div>
{% endblock %}
