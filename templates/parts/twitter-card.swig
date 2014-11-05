    <meta name="twitter:card" content="{{ type }}">
    <meta name="twitter:site" content="{{ site }}">
    <meta name="twitter:creator" content="{{ creator }}">
    <meta name="twitter:title" content="{{ title }}">
    <meta name="twitter:description" content="{{ description }}">
{% if src %}
    <meta name="twitter:image:src" content="{{ src|ext_url(true) }}">
{% endif %}
{% if images %}
    {% for image in images %}
    <meta name="twitter:image{{ loop.index0 }}" content="{{ image|ext_url(true) }}">
    {% endfor %}
{% endif %}
