<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>{% block title %}{{ config.title }}{% endblock %}</title>
    <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.4.2/pure-min.css">
    <!--[if lt IE 9]>
    <script>(function(){var tags=['header','article','footer','nav', 'time', 'section', 'figure', 'abbr'];for(var i=0;i!=tags.length;i++) document.createElement(tags[i]);})();</script>
    <![endif]-->
</head>
<body>
    {% block menu %}
        <nav class="pure-menu pure-menu-open pure-menu-horizontal">
            <a href="/" class="pure-menu-heading">{{ config.shortTitle }}</a>
            <ul>
                <li{% if selected == 'tracks' %} class="pure-menu-selected"{% endif %}><a href="/tracks/">Les traces</a></li>
                <li{% if selected == 'blog' %} class="pure-menu-selected"{% endif %}><a href="/posts/">Le blog</a></li>
                <li{% if selected == 'a-propos' %} class="pure-menu-selected"{% endif %}><a href="/pages/a-propos/">À propos</a></li>
            </ul>
        </nav>
    {% endblock %}
    {% block content %}{% endblock %}
    {% block footer %}{% endblock %}
</body>
</html>
