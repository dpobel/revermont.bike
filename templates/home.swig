{% extends "layouts/layout.swig" %}

{% block pageTitle %}
    <div class="home-banner">
        <h1 class="home-banner-title">
            <span class="home-banner-text">{{ config.title }}</span>
        </h1>
    </div>
{% endblock %}

{% block content %}
<div itemscope itemtype="http://schema.org/WebSite">
    <meta itemprop="url" content="{{ '/'|ext_url }}"/>
    <meta itemprop="name" content="{{ config.title }}"/>
    <div itemprop="description">{{ contents|safe }}</div>
    <div class="pure-g home-blocks">
        <div class="pure-u-1 pure-u-sm-1 pure-u-md-1-2 home-block home-block-treks">
            <h2 class="icon-treks home-block-title">Derniers circuits VTT</h2>
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

            <p><a href="{{ "randonnees"|url }}" class="pure-button button-highlight icon-treks">Les traces GPS des circuits VTT</a></p>
        </div>
        <div class="pure-u-1 pure-u-sm-1 pure-u-md-1-2 home-block home-block-tracks">
            <h2 class="icon-tracks home-block-title">Derniers single tracks</h2>
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

            <p><a href="{{ "single-tracks"|url }}" class="pure-button button-highlight icon-tracks">Les traces GPS des single tracks</a></p>
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
        <div class="pure-u-1 pure-u-sm-1 pure-u-md-1-2 home-block home-block-forecast">
            <h2 class="icon-{{ forecast.daily.icon }} home-block-title">Météo dans le Revermont</h2>

            <div class="forecast pure-g">
                <div class="pure-u-1-2 pure-u-md-1 pure-u-lg-1-2">
                    {% include "parts/forecast-day.swig" with {day: forecast.daily.days[0], dayOffset: 0} %}
                </div>
                <div class="pure-u-1-2 pure-u-md-1 pure-u-lg-1-2">
                    {% include "parts/forecast-day.swig" with {day: forecast.daily.days[1], dayOffset: 1} %}
                </div>
            </div>
            <p><a href="{{ "meteo"|url }}" class="pure-button button-highlight icon-{{ forecast.daily.icon }}">Prévision météo à 8 jours dans le Revermont</a></p>
        </div>
    </div>
</div>
{% endblock %}

{% block meta %}
{% parent %}
{% include "parts/twitter-card.swig" with {
    type: "summary",
    site: "@" + config.twitter,
    creator: "@dpobel",
    title: title,
    description: metaDescription
} %}
<meta name="google-site-verification" content="N0E1TuQgF7sr_Y_EsGFQAzGKDN1KAvNNb35GhpmFS1w" />
{% endblock %}
