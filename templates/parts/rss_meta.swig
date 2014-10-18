<title>{{ title }}</title>
<link>{{ path|ext_url(true) }}</link>
<description></description>
<docs>http://www.rssboard.org/rss-specification</docs>
<pubDate>{{ date|date('r') }}</pubDate>
<atom:link rel="self" type="application/rss+xml" href="{{ path|ext_url(true) }}"/>
