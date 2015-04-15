<nav class="breadcrumb" itemprop="breadcrumb">
    <ul class="bc-list">
    {% for item in struct %}
        <li class="bc-item" itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
            {% if item.path %}
                <a href="{{ item.path|ext_url }}" itemprop="url"><span itemprop="title">{{ item.name }}</span></a>
            {% else %}
                {% if item.current %}
                    <meta itemprop="url" content="{{ item.current|ext_url }}"/>
                {% endif %}
                <span itemprop="title">{{ item.name }}</span>
            {% endif %}
        </li>
    {% endfor %}
    </ul>
</nav>

