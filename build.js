var metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    permalinks = require('metalsmith-permalinks'),
    metadata = require('metalsmith-metadata'),
    collections = require('metalsmith-collections');

metalsmith(__dirname)
    .use(markdown())
    .use(permalinks())
    .use(collections({
        tracks: {
            pattern: 'tracks/*/index.html'
        },
        posts: {
            pattern: 'posts/*/index.html'
        }
    }))
    .use(metadata({
        config: 'config.json',
    }))
    .use(templates('swig'))
    .destination('./web')
    .build();
