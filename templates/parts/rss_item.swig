<item>
    <title>{{ obj.title }}</title>
    <link>{{ obj.path|ext_url }}</link>
    <guid isPermaLink="true">{{ obj.path|ext_url }}</guid>
    <pubDate>{{ obj.created.toDate()|date('r') }}</pubDate>
    {% if obj.photo %}
    <enclosure url="{{ obj.variations.full.fullpath|ext_url(true) }}" length="{{ obj.variations.full.size }}" type="image/jpg"/>
    {% endif %}
    <description>
        {{ obj.contents|rssify}}
    </description>
</item>
