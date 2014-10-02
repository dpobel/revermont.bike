<table class="pure-table pure-table-bordered pure-table-striped track-data">
    <thead>
        <tr>
            <th colspan="2">Caractéristiques{% if updated %} (Dernière <abbr title="Mise à jour">MAJ</abbr>: <time itemprop="dateModified" datetime="{{ updated.format() }}">{{ updated.format(config.dateFormat) }}</time>){% endif %}</th>
        </tr>
    </thead>
    <tr>
        <td class="track-data-name">Distance</td>
        <td>{{ distance }}&nbsp;km</td> 
    </tr>
    <tr>
        <td class="track-data-name">Dénivelé</td>
        <td>{% if loop %}±{{ elevation.gain }}{% else %}+{{ elevation.gain }}/-{{ elevation.loss}}{% endif %}&nbsp;m</td>
    </tr>
    {% if inverted %}
    <tr>
        <td class="track-data-name">En sens inverse&nbsp;?</td>
        <td>{{ inverted }}</td>
    </tr>
    {% endif %}
    <tr>
        <td class="track-data-name">Altitudes <abbr title="minimum">min.</abbr>/<abbr title="maximum">max.</abbr></td>
        <td>{{ elevation.min }}&nbsp;m / {{ elevation.max }}&nbsp;m</td>
    </tr>
</table>
