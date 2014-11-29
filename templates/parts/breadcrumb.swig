<nav class="breadcrumb">
    <ul class="bc-list">
    {% for item in struct %}
        <li class="bc-item" itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
            {% if item.path %}
                <a href="{{ item.path|url }}" itemprop="url"><span itemprop="title">{{ item.name }}</span></a>
            {% else %}
                <span itemprop="title">{{ item.name }}</span>
            {% endif %}
        </li>
    {% endfor %}
    </ul>
</nav>

