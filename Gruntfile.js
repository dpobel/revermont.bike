module.exports = function(grunt) {
    var build = require('./build.json');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            build: {
                command: './build.js',
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
        },
        watch: {
            options: {
                atBegin: true
            },
            build: {
                files: ['src/**', 'templates/**', 'build.*', 'bower.json', 'lib/**', 'assets/**'],
                tasks: ["build"]
            },
            test: {
                files: ['lib/**', 'tests/**'],
                tasks: ["test"]
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
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.registerTask('build', ['shell:build', 'bower']);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('coverage', ['mocha_istanbul']);
    grunt.registerTask('default', ['build']);
};
