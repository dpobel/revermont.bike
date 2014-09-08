{% extends "layouts/layout.swig" %}

{% block pageTitle %}
    <div class="home-banner">
        <h1 class="home-banner-title">
            <span class="home-banner-text">{{ config.title }}</span>
        </h1>
    </div>
{% endblock %}

{% block content %}
    {{ contents|safe }}
    <div class="pure-g home-blocks">
        <div class="pure-u-1 pure-u-sm-1 pure-u-md-1-2 home-block home-block-treks">
            <h2 class="icon-treks home-block-title">Dernières randonnées</h2>
            <table class="pure-table pure-table-bordered pure-table-striped tracks-table">
            <thead>
                <tr>
                    <th>Titre</th>
                    <th>Distance</th>
                    <th>Dénivelé</th>
                </tr>
            </thead>
            {% for trek in collections.lastTreks %}
            <tr>
                <td><a href="{{ trek.path|url }}">{{ trek.title }}</a></td>
                <td>{{ trek.distance }}&nbsp;km</td>
                <td>{% if trek.loop %}±{{ trek.elevation.gain }}{% else %}+{{ trek.elevation.gain }}/-{{ trek.elevation.loss}}{% endif %}&nbsp;m
            </tr>
            {% endfor %}
            </table>

            <p><a href="{{ "randonnees"|url }}" class="pure-button button-highlight icon-treks">Toutes les randonnées</a></p>
        </div>
        <div class="pure-u-1 pure-u-sm-1 pure-u-md-1-2 home-block home-block-tracks">
            <h2 class="icon-tracks home-block-title">Derniers sentiers</h2>
            <table class="pure-table pure-table-bordered pure-table-striped tracks-table">
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

            <p><a href="{{ "sentiers"|url }}" class="pure-button button-highlight icon-tracks">Tous les sentiers</a></p>
        </div>
        <div class="pure-u-1 pure-u-sm-1 pure-u-md-1-2 home-block home-block-blog">
            <h2 class="icon-blog home-block-title">Derniers billets de blog</h2>
            <ul class="home-block-blog-list">
            {% for post in collections.lastPosts %}
                <li class="home-block-blog-item">
                    <a class="home-block-blog-link" href="{{ post.path|url }}">{{ post.title }}</a>
                </li>
            {% endfor %}
            </ul>

            <p><a href="{{ "posts"|url }}" class="pure-button button-highlight icon-blog">Le blog</a></p>
        </div>
        <div class="pure-u-1 pure-u-sm-1 pure-u-md-1-2 home-block home-block-meteo">
            <h2 class="icon-meteo home-block-title">Météo dans le Revermont</h2>

        </div>
    </div>
{% endblock %}
