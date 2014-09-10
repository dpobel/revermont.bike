<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>{{ title }}</title>
        <link>{{ path|ext_url(true) }}</link>
        <description></description>
        <docs>http://www.rssboard.org/rss-specification</docs>
        <pubDate>{{ date|date('r') }}</pubDate>
        <atom:link rel="self" type="application/rss+xml" href="{{ path|ext_url(true) }}"/>

    {% for obj in collections[exportCollection] %}
        <item>
            <title>{{ obj.title }}</title>
            <link>{{ obj.path|ext_url }}</link>
            <guid isPermaLink="true">{{ obj.path|ext_url }}</guid>
            <pubDate>{{ obj.created.toDate()|date('r') }}</pubDate>
            <description>
                {{ obj.contents|rssify}}
            </description>
        </item>
    {% endfor %}
    </channel>
</rss>
