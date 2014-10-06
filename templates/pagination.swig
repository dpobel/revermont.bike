{% if pagination.total > 1 %}
    <ul class="pure-paginator paginator">
        <li><a class="pure-button prev" href="{{ pagination.prev.path|url }}"{% if not pagination.prev %} disabled="disabled"{% endif %}>&#171;</a></li>
        {% for page, object in pagination.pages %}
        <li><a class="pure-button{% if pagination.num == page %} pure-button-active{% endif %}" href="{{ object.path|url }}">{{ page }}</a></li>
        {% endfor %}
        <li><a class="pure-button next" href="{{ pagination.next.path|url }}"{% if not pagination.next %} disabled="disabled"{% endif %}>&#187;</a></li>
    </ul>
{% endif %}
