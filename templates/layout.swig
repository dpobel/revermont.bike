<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>{% block title %}{{ config.title }}{% endblock %}</title>
</head>
<body>
    {% block menu %}{% endblock %}
    {% block content %}{% endblock %}
    {% block footer %}{% endblock %}
</body>
</html>
