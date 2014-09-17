{% set tr = "transform: rotate(" + day.windBearing + "deg);" %}
<div class="forecast-day-block">
    <h2 class="forecast-day icon-{{ day.icon }}">
    {% if dayOffset == 0 %}
        Aujourd'hui {{ day.time.format('dddd') }}
    {% elseif dayOffset == 1 %}
        Demain {{ day.time.format('dddd') }}
    {% else %}
        {{ day.time.format('dddd')|capitalize }}
    {% endif %}
    </h2>
    <p class="pure-g forecast-numbers">
        <span class="forecast-temperature pure-u-1-2"><i class="icon-temperature"></i>{{ day.temperatureMin }}&nbsp;°C/{{ day.temperatureMax }}&nbsp;°C</span>
        <span class="forecast-wind pure-u-1-2"><i class="icon-wind-direction"
            style="{% for prefix in ['', '-ms-', '-moz-', '-webkit-'] %}{{ prefix }}{{ tr }}{% endfor %}"></i> {{ day.windSpeed }}&nbsp;km/h</span>
    </p>
    <p class="forecast-summary">{{ day.summary }}</p>
    <p class="forecast-rain">Risque de précipitations&nbsp;: {{ day.precipProbability }}%</p>
</div>

