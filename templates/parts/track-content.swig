<article class="pure-g track-app" itemscope itemtype="http://schema.org/Map">
    <div class="pure-u-1">
        <h1 class="icon-{{ section }} page-title" itemprop="name">{{ title }}</h1>
    </div>
    <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-3-5">
        <noscript>JavaScript est requis pour afficher la carte</noscript>
        <div class="track-map"></div>
    </div>
    <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-2-5 track-sidebar">
        <ul class="track-sidebar-tabs"><!--
            --><li class="track-sidebar-tabs-item">
                <a href="#profile" class="track-sidebar-tabs-label is-tab-focused icon-profile">Profil</a>
            </li><!--
            --><li class="track-sidebar-tabs-item">
                <a href="#description" class="track-sidebar-tabs-label icon-description">Description</a>
            </li><!--
            {% if video %}
            --><li class="track-sidebar-tabs-item">
                <a href="#video" class="track-sidebar-tabs-label icon-video">Vidéo</a>
            </li><!--
            {% endif %}
            {% if direction %}
            --><li class="track-sidebar-tabs-item">
                <a href="#direction" class="track-sidebar-tabs-label icon-direction">S'y rendre</a>
            </li><!--
            {% endif %}
        --></ul>

        <div class="track-sidebar-panel is-panel-visible" id="profile">
            <h2 class="page-subtitle icon-profile">Profil</h2>

            <div class="track-profile"><div class="track-profile-tooltip"><div class="track-profile-tooltip-info" data-tpl="Alt.:&nbsp;%alt%&nbsp;m"></div></div><img src="{{ profile|url(true) }}" class="track-profile-chart" alt="Profil altimétrique de {{ title }}" itemprop="image"></div>
            {% include "track-data.swig" %}

            <p>
                <a class="pure-button button-highlight icon-download" href="{{ gpx }}">Télécharger le fichier GPX</a>
            </p>
            <h3>Partager sur les réseaux sociaux</h3>

            {% include "share.swig" with {url: path, text: title} %}

        </div>

        <div class="track-sidebar-panel" id="description">
            <h2 class="page-subtitle icon-description">Description</h2>
            <img itemprop="image" alt="Carte" src="{{ screenshot.filename }}" hidden>
            <div itemprop="text" class="contents">{{ contents|safe }}</div>

            <p>Mots-clés&nbsp;:</p>
            <ul class="content-tags" itemprop="keywords">
            {% for tag in tags %}
                <li class="content-tags-item icon-tag"><a href="{{ tagsList[tag].path|url }}">{{ tag }}</a></li>
            {% endfor %}
            </ul>
        </div>

        {% if video %}
        <div class="track-sidebar-panel" id="video">
            <h2 class="page-subtitle icon-video">Vidéo</h2>

            {{ video|safe }}
        </div>
        {% endif %}

        {% if direction %}
        <div class="track-sidebar-panel" id="direction">
            <h2 class="page-subtitle icon-direction">Comment s'y rendre&nbsp;?</h2>
            
            <div class="contents">{{ direction|safe }}</div>
        </div>
        {% endif %}
    </div>
    <div class="pure-u-1">
        {% include "comments.swig" %}
    </div>
</article>
