{% set tags = tagsList|sort %}
<ul class="tag-cloud">
{% for keyword in tags -%}
    {% set info = tagsList[keyword] %}
    <li class="tag" style="font-size: {{ (1 + info.posts.length/totalPosts)|round(2) }}em"><a href="{{ info.path|url }}">{{ keyword }}</a></li>
{%- endfor %}
</ul>
