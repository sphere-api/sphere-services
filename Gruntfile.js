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

    release: {
      options: {
        tagName: 'v<%= version %>',
        tag: false,
        push: true,
        pushTags: false,
        npm: false,
        npmtag: false,
        additionalFiles: ['bower.json', 'component.json']
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

    // explicitly commit the minified file
    gitcommit: {
      task: {
        options: {
          message: 'updating minified file'
        },
        files: [
          {
            src: ['dist/sphere-services.min.js']
          }
        ]
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
  grunt.registerTask('build:prerelease', ['uglify', 'gitcommit', 'release:prerelease']);
  grunt.registerTask('build:patch', ['release:patch']);
  grunt.registerTask('build:minor', ['release:minor']);
  grunt.registerTask('build:major', ['release:major']);
}
