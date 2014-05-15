<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>{% block title %}{{ config.title }}{% endblock %}</title>
    <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.4.2/pure-min.css">
    <!--[if lt IE 9]>
    <script>(function(){var tags=['header','article','footer','nav', 'time', 'section', 'figure', 'abbr'];for(var i=0;i!=tags.length;i++) document.createElement(tags[i]);})();</script>
    <![endif]-->
    {% block meta %}{% endblock %}
</head>
<body>
    {% block menu %}
        <nav class="pure-menu pure-menu-open pure-menu-horizontal">
            <a href="/" class="pure-menu-heading">{{ config.shortTitle }}</a>
            <ul>
                {% for item in menu %}
                <li{% if selected == item.section %} class="pure-menu-selected"{% endif %}><a href="/{{ item.path }}/">{{ item.title }}</a></li>
                {% endfor %}
            </ul>
        </nav>
    {% endblock %}
    {% block content %}{% endblock %}
    {% block footer %}{% endblock %}
</body>
</html>
