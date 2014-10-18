<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
    {% include "parts/rss_meta.swig" %}

    {% for obj in collections[exportCollection] %}
        {% if obj.created|is_before(100, 'h') %}
            {% include "parts/rss_item.swig" %}
        {% endif %}
    {% endfor %}
    </channel>
</rss>
