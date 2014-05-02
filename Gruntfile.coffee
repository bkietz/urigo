module.exports = (grunt)->

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    watch:
      coffee:
        files: 'src/*.coffee'
        tasks: [ 'coffee' ]

    clean:
      all: [
        'bin/*'
        'static/js/<%= pkg.name %>.js'
        'static/js/<%= pkg.name %>.min.js'
      ]

    coffee:
      compile:
        expand: true
        flatten: true
        cwd: 'src'
        src: [ '*.coffee' ]
        dest: 'bin'
        ext: '.js'

    browserify:
      urigo:
        files: [
          'static/js/<%= pkg.name %>.js' : [ 'src/<%= pkg.name %>.js' ]
        ]

    uglify:
      options:
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      build:
        files:
          'static/js/<%= pkg.name %>.min.js': [
            'static/js/<%= pkg.name %>.js']

  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  # Default task(s).
  grunt.registerTask 'default', ['coffee','browserify','uglify']
