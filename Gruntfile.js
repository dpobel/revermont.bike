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
                files: ['src/**', 'templates/**', 'build.*', 'bower.json', 'lib/**'],
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
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.registerTask('build', ['shell:build', 'bower']);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('default', ['build']);
};
