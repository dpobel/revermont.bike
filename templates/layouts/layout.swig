<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{% block title %}{{ config.title }}{% endblock %}</title>
    <!--[if lte IE 8]>
    <link rel="stylesheet" href="{{ "css/pure/pure.css"|asset() }}">
    <link rel="stylesheet" href="{{ "css/pure/grids-responsive-old-ie.css"|asset() }}">
    <![endif]-->
    <!--[if gt IE 8]><!-->
    <link rel="stylesheet" href="{{ "css/pure/pure.css"|asset() }}">
    <link rel="stylesheet" href="{{ "css/pure/grids-responsive.css"|asset() }}">
    <!--<![endif]-->
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
                <li{% if selected == item.section %} class="pure-menu-selected"{% endif %}><a href="{{ item.path|url }}">{{ item.title }}</a></li>
                {% endfor %}
            </ul>
        </nav>
    {% endblock %}
    {% block content %}{% endblock %}
    {% block footer %}{% endblock %}
</body>
</html>
