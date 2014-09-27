    <meta name="twitter:card" content="{{ type }}">
    <meta name="twitter:site" content="{{ site }}">
    <meta name="twitter:creator" content="{{ creator }}">
    <meta name="twitter:title" content="{{ title }}">
    <meta name="twitter:description" content="{{ description }}">
{% if src %}
    <meta name="twitter:image:src" content="{{ src|ext_url(true) }}">
{% endif %}
