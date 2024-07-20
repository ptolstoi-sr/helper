module.exports = function(grunt) {
  // Lädt alle Grunt-Aufgaben, die in package.json aufgeführt sind
  require('load-grunt-tasks')(grunt);

  // Projekt-Konfiguration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Pfad-Konfigurationen
    paths: {
      webroot: "./wwwroot/"
    },

    // Aufgaben-Konfigurationen
    clean: {
      contents: ['<%= paths.webroot %>js/*', '<%= paths.webroot %>css/*']
    },
    concat: {
      options: {
        separator: ';'
      },
      js: {
        src: ['node_modules/jquery/dist/jquery.js', 'node_modules/bootstrap/dist/js/bootstrap.js'],
        dest: '<%= paths.webroot %>js/site.js'
      },
      css: {
        src: ['node_modules/bootstrap/dist/css/bootstrap.css'],
        dest: '<%= paths.webroot %>css/site.css'
      }
    },
    uglify: {
      my_target: {
        files: {
          '<%= paths.webroot %>js/site.min.js': ['<%= paths.webroot %>js/site.js']
        }
      }
    },
    cssmin: {
      target: {
        files: {
          '<%= paths.webroot %>css/site.min.css': ['<%= paths.webroot %>css/site.css']
        }
      }
    },
    watch: {
      scripts: {
        files: ['Scripts/**/*.js', 'Styles/**/*.css'],
        tasks: ['clean', 'concat', 'uglify', 'cssmin']
      }
    }
  });

  // Registriert die Standardaufgabe, die beim Ausführen von `grunt` ohne spezifische Aufgabe ausgeführt wird
  grunt.registerTask('default', ['clean', 'concat', 'uglify', 'cssmin', 'watch']);
};