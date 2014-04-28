module.exports = (grunt)->

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    watch:
      app:
        files: 'coffee/*.coffee'
        tasks: [ 'default' ]

    clean:
      all: [ 'js/<%= pkg.name %>.js', 'min/<%= pkg.name %>.min.js' ]

    coffee:
      compile:
        files:
          'js/<%= pkg.name %>.js': [
            'coffee/long.coffee' ]

    uglify:
      options:
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      build:
        src: 'js/<%= pkg.name %>.js'
        dest: 'min/<%= pkg.name %>.min.js'

  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  # grunt.loadNpmTasks 'grunt-contrib-watch'

  # Default task(s).
  grunt.registerTask 'default', ['coffee','uglify']
