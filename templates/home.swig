{% extends "layouts/layout.swig" %}

{% block pageTitle %}
    <div class="home-title">
        <h1>
            <span class="title-text">{{ config.title }}</span>
        </h1>
    </div>
{% endblock %}

{% block content %}
    {{ contents|safe }}
    <div class="pure-g">
        <div class="pure-u-1 pure-u-md-1-2 last-tracks">
            <h2>Dernières traces</h2>
            <table class="pure-table pure-table-bordered pure-table-striped">
            <thead>
                <tr>
                    <th>Titre</th>
                    <th>Distance</th>
                    <th>Dénivelé</th>
                </tr>
            </thead>
            {% for track in collections.lastTracks %}
            <tr>
                <td><a href="{{ track.path|url }}">{{ track.title }}</a></td>
                <td>{{ track.distance }}&nbsp;km</td>
                <td>{% if track.loop %}±{{ track.elevation.gain }}{% else %}+{{ track.elevation.gain }}/-{{ track.elevation.loss}}{% endif %}&nbsp;m
            </tr>
            {% endfor %}
            </table>

            <p><a href="{{ "traces"|url }}" class="icon-tracks bubble">Toutes les traces</a></p>
        </div>
        <div class="pure-u-1 pure-u-md-1-2 last-posts posts-list">
            <h2>Derniers billets de blog</h2>
            <ul>
            {% for post in collections.lastPosts %}
                <li>
                    <a href="{{ post.path|url }}">
                        {{ post.title }}
                        <time>{{ post.created.format(config.dateFormat) }}</time>
                    </a>
                </li>
            {% endfor %}
            </ul>
            <p><a href="{{ "posts"|url }}" class="icon-blog bubble">Le blog</a></p>
        </div>
    </div>
{% endblock %}
