module.exports = function(grunt) {
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
        watch: {
            options: {
                atBegin: true
            },
            build: {
                files: ['src/**', 'templates/**', 'build.*', 'lib/**'],
                tasks: ["build"]
            },
            test: {
                files: ['lib/**', 'tests/*'],
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

    grunt.registerTask('build', ['shell:build']);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('default', ['build']);
};
