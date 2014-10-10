{% extends "layouts/layout.swig" %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block title %}{{ title }} - {% parent %}{% endblock %}

{% block content %}
    <article>
        <h1 class="icon-{{ forecast.daily.icon }} page-title">{{ title }}</h1>

        <p>
            {{ forecast.daily.summary }}<br>
            <em>Dernière mise à jour le <time>{{ updated.format(config.dateTimeFormat) }}</time></em>
        </p>
        <div class="forecast pure-g">
            {% for i,day in forecast.daily.days %}
            <div class="pure-u-1 pure-u-sm-1-2 pure-u-md-1-4">
                {% include "parts/forecast-day.swig" with {day: day, dayOffset: i} %}
            </div>
            {% endfor %}
        </div>
    </article>
{% endblock %}
