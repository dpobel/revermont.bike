<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{% block title %}{{ config.title }}{% endblock %}</title>
    <link href="http://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet" type="text/css">
    <!--[if lte IE 8]>
    <link rel="stylesheet" href="{{ "css/pure/pure.css"|asset() }}">
    <link rel="stylesheet" href="{{ "css/pure/grids-responsive-old-ie.css"|asset() }}">
    <link rel="stylesheet" href="{{ "css/theme.css"|asset() }}">
    <link rel="stylesheet" href="{{ "css/structure.css"|asset() }}">
    <![endif]-->
    <!--[if gt IE 8]><!-->
    <link rel="stylesheet" href="{{ "css/pure/pure.css"|asset() }}">
    <link rel="stylesheet" href="{{ "css/pure/grids-responsive.css"|asset() }}">
    <link rel="stylesheet" href="{{ "css/theme.css"|asset() }}">
    <link rel="stylesheet" href="{{ "css/structure.css"|asset() }}">
    <!--<![endif]-->
    <!--[if lt IE 9]>
    <script>(function(){var tags=['header','article','footer','nav', 'time', 'section', 'figure', 'abbr'];for(var i=0;i!=tags.length;i++) document.createElement(tags[i]);})();</script>
    <![endif]-->
    {% block meta %}{% endblock %}
</head>
<body class="rb section-{{ section }}">
    {% block menu %}
        <header class="site-header">
            <nav class="site-menu pure-menu pure-menu-open pure-menu-horizontal">
                <ul>
                    <li>
                        <a href="/" class="back-home">{{ config.shortTitle }}</a>
                    </li>
                    {% for item in menu %}
                    <li{% if selected == item.section %} class="pure-menu-selected"{% endif %}><a href="{{ item.path|url }}">{{ item.title }}</a></li>
                    {% endfor %}
                </ul>
            </nav>
        </header>
    {% endblock %}

    {% block pageTitle %}{% endblock %}

    <section class="site-main">
        {% block content %}{% endblock %}
    </section>
    {% block footer %}{% endblock %}
</body>
</html>
