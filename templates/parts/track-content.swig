<article class="pure-g track-app">
    <div class="pure-u-1">
        <h1 class="icon-{{ section }} page-title">{{ title }}</h1>
    </div>
    <div class="pure-u-1 pure-u-md-11-24 pure-u-lg-3-5">
        <noscript>JavaScript est requis pour afficher la carte</noscript>
        <div class="track-map"></div>
    </div>
    <div class="pure-u-1 pure-u-md-13-24 pure-u-lg-2-5 track-sidebar">
        <ul class="track-sidebar-tabs">
            <li class="track-sidebar-tabs-item">
                <a href="#profile" class="track-sidebar-tabs-label is-tab-focused icon-profile">Profil</a>
            </li><!--
            --><li class="track-sidebar-tabs-item">
                <a href="#description" class="track-sidebar-tabs-label icon-description">Description</a>
            </li><!--
            --><li class="track-sidebar-tabs-item">
                <a href="#tools" class="track-sidebar-tabs-label icon-tools">Outils</a>
            </li>
        </ul>

        <div class="track-sidebar-panel is-panel-visible" id="profile">
            <h2 class="track-sidebar-panel-name icon-profile">Profil</h2>

            <div class="rickshaw_graph track-profile"><div class="track-profile-tooltip"><div class="track-profile-tooltip-info" data-tpl="Alt.:&nbsp;%alt%&nbsp;m"></div></div><div class="track-profile-chart">{{ profile|safe }}</div></div>
            {% include "track-data.swig" %}
        </div>

        <div class="track-sidebar-panel" id="description">
            <h2 class="track-sidebar-panel-name icon-description">Description</h2>
            {{ contents|safe }}

            <p>Mots-clés&nbsp;:</p>
            <ul class="content-tags">
            {% for tag in tags %}
                <li class="content-tags-item icon-tag"><a href="{{ tagsList[tag].path|url }}">{{ tag }}</a></li>
            {% endfor %}
            </ul>
        </div>

        <div class="track-sidebar-panel" id="tools">
            <h2 class="track-sidebar-panel-name icon-tools">Outils</h2>
            
            <p>
                <a class="pure-button button-highlight icon-print" href="#pdf">Export PDF</a>
                <a class="pure-button button-highlight icon-download" href="{{ gpx }}">Télécharger le fichier GPX</a>
            </p>
        </div>
    </div>
</article>
