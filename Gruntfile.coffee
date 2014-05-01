module.exports = (grunt)->

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    watch:
      app:
        files: 'coffee/*.coffee'
        tasks: [ 'default' ]

    clean:
      all: [
        'static/js/<%= pkg.name %>.min.js'
        'js/<%= pkg.name %>.js' ]

    coffee:
      compile:
        files:
          'js/<%= pkg.name %>.js': [
            'coffee/long.coffee' ]

    uglify:
      options:
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      build:
        files:
          'static/js/<%= pkg.name %>.min.js': [
            'js/<%= pkg.name %>.js' ]

  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  # grunt.loadNpmTasks 'grunt-contrib-watch'

  # Default task(s).
  grunt.registerTask 'default', ['coffee','uglify']
