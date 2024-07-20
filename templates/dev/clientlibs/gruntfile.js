module.exports = function(grunt) {
    // Lädt alle Grunt-Aufgaben, die in package.json aufgeführt sind
    require("load-grunt-tasks")(grunt);

    // Projekt-Konfiguration
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        // Pfad-Konfigurationen <%= paths.wwwroot %>
        paths: {
            wwwroot: "wwwroot/",
            clientlibs: "clientlibs/"
        },

        // Aufgaben-Konfigurationen
        clean: {
            contents: [
                "<%= paths.wwwroot %>js/*.min.js", 
                "<%= paths.wwwroot %>css/fonts/*.*", 
                "<%= paths.wwwroot %>css/*.min.css",
                "clientlibs/js/jquery.highlight.min.js",
                "clientlibs/css/*.min.css"
            ]
        },
        copy: {
            fonts: {
                files: [
                    { expand: false, src: ["node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff"], dest: "<%= paths.wwwroot %>css/fonts/bootstrap-icons.woff", filter: "isFile" },
                    { expand: false, src: ["node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2"], dest: "<%= paths.wwwroot %>css/fonts/bootstrap-icons.woff2", filter: "isFile" }
                ]
            }
        },
        uglify: {
            clientlibs: {
                files: {
                    "<%= paths.clientlibs %>js/site.min.js": ["<%= paths.clientlibs %>js/site.js"]
                }
            }
        },
        embedFonts: {
            fontawesome_brands: {
                files: {
                    "<%= paths.wwwroot %>css/brands.min.css": ["node_modules/@fortawesome/fontawesome-free/css/brands.min.css"]
                }
            },
            fontawesome_solid: {
                files: {
                    "<%= paths.wwwroot %>css/solid.min.css": ["node_modules/@fortawesome/fontawesome-free/css/solid.min.css"]
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    "<%= paths.clientlibs %>css/site.min.css": ["<%= paths.clientlibs %>css/site.css"]
                }
            }
        },
        concat: {
            options: {
                separator: ";"
            },
            jslibs: {
                src: [
                    "node_modules/jquery/dist/jquery.min.js", 
                    "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
                ],
                dest: "<%= paths.wwwroot %>js/libs.bundle.min.js"
            },
            validate: {
                src: [
                    "node_modules/jquery-validation/dist/jquery.validation.min.js",
                    "node_modules/jquery-validation/dist/localization/messages_de.min.js",
                    "node_modules/jquery-validation/dist/localization/methods_de.min.js",
                    "node_modules/jquery-validation-unobtrusive/dist/jquery.validate.unobtrusive.min.js"
                ],
                dest: "<%= paths.wwwroot %>js/validate.bundle.min.js"
            },
            jssite: {
                src: [
                    "<%= paths.clientlibs %>js/site.min.js"
                ],
                dest: "<%= paths.wwwroot %>js/site.bundle.min.js"
            },
            csslibs: {
                src: [
                    "node_modules/bootstrap/dist/css/bootstrap.min.css"
                ],
                dest: "<%= paths.wwwroot %>css/libs.bundle.min.css"
            },
            csssite: {
                src: [
                    "<%= paths.clientlibs %>css/site.min.css"
                ],
                dest: "<%= paths.wwwroot %>css/site.bundle.min.css"
            }
        },
        watch: {
            scripts: {
                files: ['Scripts/**/*.js', 'Styles/**/*.css'],
                tasks: ['clean', 'concat', 'uglify', 'cssmin']
            }
        }
    });

    // Lädt alle Grunt-Aufgaben, die in package.json aufgeführt sind sehe Zeile 3, deswegen einzelne auskommentiert sind.
    // grunt.loadNpmTasks("grunt-contrib-clean");
    // grunt.loadNpmTasks("grunt-contrib-concat");
    // grunt.loadNpmTasks("grunt-contrib-copy");
    // grunt.loadNpmTasks("grunt-contrib-jshint");
    // grunt.loadNpmTasks("grunt-contrib-uglify");
    // grunt.loadNpmTasks("grunt-contrib-watch");
    // grunt.loadNpmTasks("grunt-embed-fonts");
    // grunt.loadNpmTasks("grunt-contrib-cssmin");

    // Registriert die Standardaufgabe, die beim Ausführen von `grunt` ohne spezifische Aufgabe ausgeführt wird
    grunt.registerTask("default", ["clean", "copy", "uglify", "embedFonts", "cssmin", "concat"]);
    grunt.registerTask("neuErstellen", ["clean", "copy", "uglify", "embedFonts", "cssmin", "concat"]);
    grunt.registerTask("erstellen", ["copy", "uglify", "embedFonts", "cssmin", "concat"]);
    grunt.registerTask("all", ["clean", "copy", "uglify", "embedFonts", "cssmin", "concat", "watch"]);
    grunt.registerTask("bereiniegen", ["clean"]);
};