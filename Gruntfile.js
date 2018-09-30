module.exports = function(grunt) {
    var build = require('./build.json'),
        fnTest = 'tests/functional';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            build: {
                command: function () {
                    var forecast = (grunt.option('forecast') ? ' --forecast ' + grunt.option('forecast') : ''),
                        revision = (grunt.option('revision') ? ' --revision ' + grunt.option('revision') : '');

                    return './build.js' + forecast + revision;
                },
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            optimize: {
                command: function () {
                    var revision = (grunt.option('revision') ? ' --revision ' + grunt.option('revision') : '');

                    return './optimize.js' + revision;
                },
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            cache: {
                command: './cache.js',
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true
                },
            },
            screenshots: {
                command: function () {
                    return './screenshots.js';
                },
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            "build-test": {
                command: './build.js --source ' + fnTest + '/src --destination ' + fnTest + '/web',
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
        },
        bower: {
            install: {
                options: {
                    targetDir: build.assets,
                    layout: 'byType',
                    verbose: true,
                },
            },
        },
        watch: {
            options: {
                atBegin: true
            },
            build: {
                files: ['src/**', 'templates/**', 'build.*', 'bower.json', 'lib/**', 'assets/**'],
                tasks: ["build-local"]
            },
            "unit-test": {
                files: ['lib/**', 'tests/**'],
                tasks: ["unit-test"]
            },
            "functional-test": {
                files: [fnTest + '/src/**', 'templates/**', 'build.*', 'bower.json', 'lib/**', 'assets/**', 'tests/functional/*.js'],
                tasks: ["functional-test"]
            },
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['tests/*.js']
            },
        },
        "mocha_istanbul": {
            coverage: {
                src: 'tests',
                options: {
                    mask: '*.js',
                    reportFormats: ['text', 'html']
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: fnTest + '/web',
                },
            },
            screenshots: {
                options: {
                    port: build.screenshot.port,
                    base: build.destination
                }
            }
        },
        casper: {
            options: {
                test: true,
            },
            test: {
                src: [fnTest + '/*.js']
            }
        },
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-casper');

    grunt.registerTask('build', ['bower:install', 'shell:build', 'screenshots', 'shell:optimize']);
    grunt.registerTask('build-local', ['bower:install', 'shell:cache', 'shell:build']);
    grunt.registerTask('build-test', ['bower:install', 'shell:build-test']);
    grunt.registerTask('functional-test', ['build-test', 'connect', 'casper:test']);
    grunt.registerTask('unit-test', ['mochaTest']);
    grunt.registerTask('test', ['unit-test', 'functional-test']);
    grunt.registerTask('coverage', ['mocha_istanbul']);
    grunt.registerTask('screenshots', ['connect:screenshots', 'shell:screenshots']);
    grunt.registerTask('default', ['build']);
};
