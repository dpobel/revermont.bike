<div class="track-popup">
    <h2 class="track-popup-title"><a href="{{ track.path|url }}">{{ track.title }}</a></h2>
    <ul class="track-popup-data">
        <li><b>Distance&nbsp;:</b> {{ track.distance }}&nbsp;km</li>
        <li><b>Dénivelé&nbsp;:</b> {% if track.loop %}±{{ track.elevation.gain }}{% else %}+{{ track.elevation.gain }}/-{{ track.elevation.loss}}{% endif %}&nbsp;m</li>
    </ul>
    <p><a href="{{ track.path|url }}" class="pure-button button-highlight icon-tracks">Voir le détail de la trace</a></p>
</div>
