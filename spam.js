#!/usr/bin/env node

var conf = require('./build.json').pooleApp,
    argv = require('minimist')(process.argv.slice(2), {
        "string": ['secret', 'csrf', 'sessionid'],
        "boolean": ['help', 'h'],
    }),
    async = require('async'),
    superagent = require('superagent'),
    url = require('url'),
    template = require('string-template'),
    filtrex = require('filtrex'),

    DATA_URL_TEMPLATE = 'http://pooleapp.com/data/{secret}.json',
    DELETE_URL = 'http://pooleapp.com/row/{id}/delete/';

if ( argv.help || argv.h || !argv.secret || !argv.csrf || !argv.sessionid ) {
    console.log('spam.js --secret pooleAppSecret --csrf token --sessionid sessionid');
    process.exit(0);
}

function filterSessions(filterExpr, struct) {
    if ( !filterExpr ) {
        return struct;
    }

    struct.sessions = struct.sessions.filter(function (value) {
        return !filtrex(filterExpr)(value);
    });
    return struct;
}

function fetchFormData(formName, formInfo, cb) {
    superagent
        .get(template(DATA_URL_TEMPLATE, formInfo))
        .buffer()
        .end(function (err, res) {
            var struct;

            if ( err ) {
                console.log('Error status', err.status);
                return cb(err);
            }
            try {
                struct = filterSessions(formInfo.filter, JSON.parse(res.text));
            } catch(e) {
                return cb(e);
            }
            cb(false, {
                "formName": formName,
                "identifier": formInfo.identifier,
                "sessions": struct.sessions,
            });
        });
}

function removeSession(session, cb) {
    var deleteUrl = url.parse(template(DELETE_URL, {id: session._id}));

    superagent
        .post(deleteUrl)
        .type('form')
        .set('Cookie', 'sessionid=' + argv.sessionid + '; csrftoken=' + argv.csrf)
        .send("csrfmiddlewaretoken=" + argv.csrf)
        .end(function (err, res) {
            if ( err ) {
                console.log('Error status', err.status);
                return cb(err);
            }
            console.log('  Removed ' + session._id);
            cb();
        });
}

Object.keys(conf.forms).forEach(function (formName) {
    var tasks = [];

    console.log('- Cleaning ' + formName);
    conf.forms[formName].secret = argv.secret;
    fetchFormData(formName, conf.forms[formName], function (err, struct) {
        if ( err ) {
            console.log('Failed to retrieve the records', err);
            process.exit(1);
        }
        struct.sessions.forEach(function (session) {
            tasks.push(function (cb) {
                removeSession(session, cb);
            });
        });
        async.parallelLimit(tasks, 4);
    });
});
