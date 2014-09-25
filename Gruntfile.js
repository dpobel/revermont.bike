module.exports = function(grunt) {
    var build = require('./build.json'),
        fnTest = 'tests/functional';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            build: {
                command: function () {
                    var forecast = (grunt.option('forecast') ? ' --forecast ' + grunt.option('forecast') : ''),
                        pooleapp = (grunt.option('pooleapp') ? ' --pooleapp ' + grunt.option('pooleapp') : '');

                    return './build.js' + forecast + pooleapp;
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
                    targetDir: build.destination + '/' + build.assets,
                    layout: 'byType',
                    verbose: true,
                },
            },
            test: {
                options: {
                    targetDir: fnTest + '/web/' + build.assets,
                    layout: 'byType',
                    verbose: true,
                },
            }
        },
        watch: {
            options: {
                atBegin: true
            },
            build: {
                files: ['src/**', 'templates/**', 'build.*', 'bower.json', 'lib/**', 'assets/**'],
                tasks: ["build"]
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

    grunt.registerTask('build', ['shell:build', 'bower:install']);
    grunt.registerTask('build-test', ['shell:build-test', 'bower:test']);
    grunt.registerTask('functional-test', ['build-test', 'connect', 'casper:test']);
    grunt.registerTask('unit-test', ['mochaTest']);
    grunt.registerTask('test', ['unit-test', 'functional-test']);
    grunt.registerTask('coverage', ['mocha_istanbul']);
    grunt.registerTask('default', ['build']);
};
