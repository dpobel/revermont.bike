<table class="pure-table pure-table-bordered pure-table-striped track-data">
    <thead>
        <tr>
            <th colspan="2">Caractéristiques</th>
        </tr>
    </thead>
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
</table>
