<div class="comment-block">
    <h2 class="page-subtitle icon-comment">Commentaires</h2>

    {% if comments %}
        {% for comment in comments|reverse %}
            <div class="comment" itemscope itemtype="http://schema.org/Comment">
                <h3 class="comment-info">
                    {% if comment.url %}
                        <strong><a href="{{ comment.url }}" rel="nofollow" itemprop="author">{{ comment.name }}</a></strong>
                    {% else %}
                        <strong itemprop="author">{{ comment.name }}</strong>
                    {% endif %}
                    </strong>
                    &ndash;
                    <time datetime="{{ comment.created|parse_date().format() }}" itemprop="dateCreated">{{ comment.created|parse_date().format(config.dateTimeFormat) }}</time>
                </h3>
                <meta itemprop="about" content="{{ path|ext_url }}">
                <p class="comment-content" itemprop="text">{{ comment.text|e|nl2br|autolink|safe }}</p>
            </div>
        {% endfor %}
    {% else %}
        <p><em>Pas encore de commentaire</em></p>
    {% endif %}

    <form action="http://pooleapp.com/stash/1b9a4464-1169-4f56-9794-dbc670994c4e/" method="post" class="pure-form pure-form-stacked comment-form">
    <fieldset>
        <legend class="comment-add">Ajouter un commentaire</legend>
        <div class="comment-guidelines">
            {{ guidelines|safe }}
        </div>
        <div class="pure-g">
            <div class="pure-u-1 pure-u-lg-1-3 comment-input-box">
                <input type="hidden" name="redirect_to" value="{{ 'thanks'|ext_url }}">
                <input type="hidden" name="path" value="{{ path }}">

                <label for="name" class="form-input-required">Nom*&nbsp;:</label>
                <input type="text" name="name" id="name" class="pure-input-1" required>
            </div>

            <div class="pure-u-1 pure-u-lg-1-3 comment-input-box">
                <label for="email" class="form-input-required">Adresse e-mail*&nbsp;:</label>
                <input type="email" name="email" id="email" class="pure-input-1" required>
            </div>

            <div class="pure-u-1 pure-u-lg-1-3 comment-input-box">
                <label for="url">Site web&nbsp;:</label>
                <input type="url" name="url" id="url" class="pure-input-1">
            </div>

            <div class="pure-u-1 comment-input-box">
                <label for="text" class="form-input-required">Texte*&nbsp;:</label>
                <textarea id="text" name="text" class="pure-input-1" rows="5" required></textarea>
            </div>
            <div class="pure-u-1 form-button">
                <button class="pure-button button-highlight">Poster le commentaire</button>
            </div>
        </div>
    </fieldset>
    </form>

</div>
