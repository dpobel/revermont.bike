<h2><a href="{{ track.path|url }}">{{ track.title }}</a></h2>
<ul>
    <li><b>Distance&nbsp;:</b> {{ track.distance }}&nbsp;km</li>
    <li><b>Dénivelé&nbsp;:</b> {% if track.loop %}±{{ track.elevation.gain }}{% else %}+{{ track.elevation.gain }}/-{{ track.elevation.loss}}{% endif %}&nbsp;m</li>
</ul>
<p class="details"><a href="{{ track.path|url }}" class="bubble icon-tracks">Voir le détail de la trace</a></p>
