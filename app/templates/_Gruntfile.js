var path = require('path');

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        connect: {
            default: {
                options: {
                    hostname: 'localhost',
                    port: 8000,
                    keepalive: true,
                    open: 'http://localhost:8000/dev/index.html',
                }
            },

            qunit: {
                options: {
                    hostname: 'localhost',
                    port: 8000,
                    keepalive: true,
                    open: 'http://localhost:8000/dev/tests.html',
                }
            }
        },

        bower: {
            target: {
                rjsConfig: 'dev/main.js',
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-bower-requirejs');


    grunt.registerTask('test', ['bower','connect:qunit']);
    grunt.registerTask('default', ['bower','connect']);
};
