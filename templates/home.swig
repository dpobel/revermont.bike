{% extends "layouts/layout.swig" %}

{% block content %}
    <h1>{{ config.title }}</h1>

    <div class="pure-g">
        <div class="pure-u-1 pure-u-md-1-2">
            <h2>Dernières traces</h2>
            <ul>
            {% for track in collections.lastTracks %}
                <li><a href="{{ track.path|url }}">{{ track.title }}</a></li>
            {% endfor %}
            </ul>
            <p><a href="{{ "tracks"|url }}">Toutes les traces</a></p>
        </div>
        <div class="pure-u-1 pure-u-md-1-2">
            <h2>Derniers billets de blog</h2>
            <ul>
            {% for post in collections.lastPosts %}
                <li><a href="{{ post.path|url }}">{{ post.title }}</a></li>
            {% endfor %}
            </ul>
            <p><a href="{{ "posts"|url }}">Le blog</a></p>
        </div>
    </div>
{% endblock %}
