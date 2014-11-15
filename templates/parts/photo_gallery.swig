<div itemscope itemtype="http://www.schema.org/ImageObject" class="pure-u gallery-photo" data-width="{{ photo.variations.list.width }}">
    <a href="{{ photo.path|url }}" itemprop="url" class="gallery-photo-link" style="height: {{ photo.variations.list.height }}px">
    <img src="{{ photo.variations.list.fullpath|url(true) }}" itemprop="thumbnail" alt="{{ photo.title }}" width="{{ photo.variations.list.width }}" height="{{ photo.variations.list.height }}">
    </a>
</div>

