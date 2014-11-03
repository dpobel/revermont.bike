[
    {% for photo in geoimages %}
    {
        "title": "{{ photo.title|e('js') }}",
        "latlon": {{ photo.latlon|json|safe }},
        "variations": {
        {% for variation in photo.variations %}
            "{{ loop.key|e('js') }}": {
                "path": "{{ variation.fullpath|url(true)|e('js') }}",
                "width": {{ variation.width }},
                "height": {{ variation.height }}
            }{% if not loop.last %},{% endif %}
        {% endfor %}
        },
        "popup": {% filter json %}{% include "parts/photo_popup.swig" with photo %}{% endfilter %} 
    }{% if not loop.last %},{% endif %}
    {% endfor %}
]
