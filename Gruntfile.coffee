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
        'browser/*'
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
          'browser/js/<%= pkg.name %>.js' : [ 'bin/<%= pkg.name %>.js' ]
        ]

    uglify:
      options:
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      build:
        files:
          'browser/js/<%= pkg.name %>.min.js': [
            'browser/js/<%= pkg.name %>.js'
          ]

    karma:
      options:
        keepalive: false
      unit:
        runnerPort: 9020
        configFile: 'test/karma.coffee'

  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-karma'

  # Default task(s).
  grunt.registerTask 'default', ['coffee','browserify','uglify']
