<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{% block title %}{{ config.title }}{% endblock %}</title>
    <!--<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet" type="text/css">-->
    <!--[if lte IE 8]>
    <link rel="stylesheet" href="{{ "css/pure/pure.css"|asset() }}">
    <link rel="stylesheet" href="{{ "css/pure/grids-responsive-old-ie.css"|asset() }}">
    <link rel="stylesheet" href="{{ "lib/leaflet/leaflet.css"|asset() }}">
    <link rel="stylesheet" href="{{ "css/structure.css"|asset() }}">
    <link rel="stylesheet" href="{{ "css/theme.css"|asset() }}">
    <![endif]-->
    <!--[if gt IE 8]><!-->
    <link rel="stylesheet" href="{{ "css/pure/pure.css"|asset() }}">
    <link rel="stylesheet" href="{{ "css/pure/grids-responsive.css"|asset() }}">
    <link rel="stylesheet" href="{{ "lib/leaflet/leaflet.css"|asset() }}">
    <link rel="stylesheet" href="{{ "css/structure.css"|asset() }}">
    <link rel="stylesheet" href="{{ "css/theme.css"|asset() }}">
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
                    <li{% if section == "home" %} class="pure-menu-selected"{% endif %}>
                        <a href="/" class="back-home icon-mtb">{{ config.shortTitle }}</a>
                    </li>
                    {% for item in menu %}
                    <li{% if selected == item.section %} class="pure-menu-selected"{% endif %}><a href="{{ item.path|url }}" class="icon-{{ item.icon }}">{{ item.title }}</a></li>
                    {% endfor %}
                </ul>
            </nav>
        </header>
    {% endblock %}

    {% block pageTitle %}{% endblock %}

    <section class="site-main">
        <div class="site-main-content">
        {% block content %}{% endblock %}
        </div>
    </section>

    {% block footer %}
    <footer class="site-footer">
        <div class="site-footer-content pure-g">
            <div class="pure-u-1 pure-u-sm-1-2 pure-u-md-1-3 friends-link">
                <h2>Quelques liens</h2>
                {{ links|safe }}
            </div>
            <div class="pure-u-1 pure-u-sm-1-2 pure-u-md-1-3 social-networks">
                <h2>Réseaux sociaux</h2>

            </div>
            <div class="pure-u-1 pure-u-sm-1 pure-u-md-1-3 copyright-notice">
                {{ copyright|safe }}
            </div>
        </div>
    </footer>
    {% endblock %}

    <script data-main="{{ "js/enabled.js"|asset() }}" src="{{ "js/requirejs/require.js"|asset() }}"></script>
    <script>
    requirejs.config({
        paths: {
            "L": "{{ "lib/leaflet/leaflet"|asset() }}",
            "domReady": "requirejs-domready/domReady",
            "globalMap": "global-map",
        },
    });
    {% block javascriptCode %}{% endblock %}
    </script>
</body>
</html>
