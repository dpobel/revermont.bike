<table class="pure-table pure-table-bordered pure-table-striped track-data">
    <thead>
        <tr>
            <th colspan="2">Caractéristiques</th>
        </tr>
    </thead>
    <tr>
        <td class="track-data-name">Mise à jour</td>
        <td>
        {% if updated %}
            {{ updated.format(config.dateFormat) }}
        {% else %}
            {{ created.format(config.dateFormat) }}
        {% endif %}
        </td>
    </tr>
    {% if type %}
    <tr>
        <td class="track-data-name">Type</td>
        <td>{{ type }}</td> 
    </tr>
    {% endif %}
    <tr>
        <td class="track-data-name">Distance</td>
        <td>{{ distance }}&nbsp;km</td> 
    </tr>
    <tr>
        <td class="track-data-name">Dénivelé</td>
        <td>{% if loop %}±{{ elevation.gain }}{% else %}+{{ elevation.gain }}/-{{ elevation.loss}}{% endif %}&nbsp;m
    </tr>
    <tr>
        <td class="track-data-name">Altitude maximum</td>
        <td>{{ elevation.max }}&nbsp;m</td>
    </tr>
    <tr>
        <td class="track-data-name">Altitude minimum</td>
        <td>{{ elevation.min }}&nbsp;m</td>
    </tr>
    <tr>
        <td class="track-data-name">Mots-clés</td>
        <td>
            <ul class="content-tags">
            {% for tag in tags %}
                <li class="content-tags-item icon-tag"><a href="{{ tagsList[tag].path|url }}">{{ tag }}</a></li>
            {% endfor %}
            </ul>
        </td>
</table>
