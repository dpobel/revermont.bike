{% extends "layouts/layout.swig" %}

{% block pageItemType %}http://www.schema.org/ContactPage{% endblock %}

{% block menu %}{% set selected = section %}{% parent %}{% endblock %}

{% block title %}{{ title }} - {% parent %}{% endblock %}

{% block content %}
    <article itemprop="mainContentOfPage">
        <h1 class="icon-contact page-title">{{ title }}</h1>
        <div>{{ contents|safe }}</div>

        <form action="http://pooleapp.com/stash/b129b249-496a-4ff0-8f64-6c2e77dc7d3d/" method="post" class="pure-form contact-form">
        <fieldset>
            <legend>Contacter le webmaster</legend>
            <div>
                <input type="hidden" name="redirect_to" value="{{ 'send'|ext_url }}">
                <label for="name" class="form-input-required">Nom*&nbsp;:</label>
                <input type="text" name="name" id="name" class="pure-input-1" required>
            </div>

            <div>
                <label for="email" class="form-input-required">Adresse e-mail*&nbsp;:</label>
                <input type="email" name="email" id="email" class="pure-input-1" required>
            </div>

            <div>
                <label for="subject" class="form-input-required">Sujet*&nbsp;:</label>
                <input type="text" name="subject" id="subject" class="pure-input-1" required>
            </div>

            <div>
                <label for="text" class="form-input-required">Texte*&nbsp;:</label>
                <textarea id="text" name="text" class="pure-input-1" rows="5" required></textarea>
            </div>
            <div class="form-button">
                <button class="pure-button button-highlight">Poster le commentaire</button>
            </div>
        </fieldset>
        </form>
    </article>
{% endblock %}
