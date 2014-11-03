<ul class="content-tags" itemprop="keywords">
{% for tag in tags %}
    <li class="content-tags-item icon-tag"><a href="{{ tagsList[tag].path|url }}">{{ tag }}</a></li>
{% endfor %}
    </ul>
