<item>
    <title>{{ obj.title }}</title>
    <link>{{ obj.path|ext_url }}</link>
    <guid isPermaLink="true">{{ obj.path|ext_url }}</guid>
    <pubDate>{{ obj.created.toDate()|date('r') }}</pubDate>
    <description>
        {{ obj.contents|rssify}}
    </description>
</item>
