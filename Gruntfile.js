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
            }
        },
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', ['shell:build']);
    grunt.registerTask('default', ['build']);

};
