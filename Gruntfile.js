'use strict';

module.exports = function(grunt) {
  // Add require for connect-modewrite
  var modRewrite = require('connect-modrewrite');

  // Define the configuration for all the tasks
  grunt.initConfig({
    // Project settings
    bowerApp: {
      // configurable app path
      app: require('./bower.json').appPath || 'app',
    },

    // Update bower versioning
    update_json: {
      options: {
        src: 'package.json',
        indent: '\t'
      },
      package: {
        dest: 'package.json',
        fields: {
          version: function (src) {
            var newVersion = src.version.split('.'),
              version = '';

            newVersion[newVersion.length - 1]++;

            for(var i = 0; i < newVersion.length; i++) {
              version += newVersion[i];

              if (i !== newVersion.length - 1) {
                version += '.';
              }
            }
            
            return version;
          }
        }
      },
      bower: {
        dest: 'bower.json',
        fields: 'version'
      },
      component: {
        src: 'bower.json',
        dest: 'component.json',
        fields: {
          version: null,
          dependencies: null
        },
      }
    },

    // Uglify the javascript file into a dist folder for distribution
    uglify: {
      services: {
        files: {
          'dist/sphere-services.min.js': ['app/js/sphere-services.js']
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['bowerInstall']
      },
      js: {
        files: ['<%= bowerApp.app %>/js/{,*/}*.js'],
        options: {
            livereload: true
        }
      },
      styles: {
        files: ['<%= bowerApp.app %>/css/{,*/}*.css'],
        options: {
            livereload: true
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= bowerApp.app %>/{,*/}*.html',
          '<%= bowerApp.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729,
        base: '<%= bowerApp.app %>'
      },
      livereload: {
        options: {
          open: 'http://localhost:<%= connect.options.port %>',
          base: [
            '.tmp',
            '<%= bowerApp.app %>'
          ],
          // MODIFIED: Add this middleware configuration
          middleware: function(connect, options) {
            var middlewares = [];

            middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]'])); //Matches everything that does not contain a '.' (period)
            options.base.forEach(function(base) {
                middlewares.push(connect.static(base));
            });
            return middlewares;
          }
        }
      }

    },
    // Automatically inject Bower components into the app
    bowerInstall: {
        app: {
          src: ['<%= bowerApp.app %>/index.html'],
          ignorePath: '<%= bowerApp.app %>/'
        }
    },
    // Upload bower component
    shell: {
      bowerRegister: {
        command: 'bower register ' + require('./bower.json').name + ' ' + require('./bower.json').repository.url
      }
    }
  });
  // Load tasks
  require('load-grunt-tasks')(grunt);

  // Register new tasks
  grunt.registerTask('serve', ['bowerInstall', 'connect', 'watch']);
  grunt.registerTask('publish', ['update_json', 'uglify', 'shell:bowerRegister']);
  grunt.registerTask('build', ['update_json', 'uglify']);
}
