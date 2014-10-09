module.exports = (grunt) ->

  grunt.initConfig
    coffee:
      options:
        bare: false
      compile:
        files:
          'src/showErrors.js': 'src/showErrors.coffee'
          'test/showErrors.spec.js': 'test/showErrors.spec.coffee'
          'test/helpers.js': 'test/helpers.coffee'
    pkg: grunt.file.readJSON('package.json')
    uglify:
      options:
        banner: '/*! <%= pkg.name %> (version <%= pkg.version %>) <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      build:
        src: 'src/showErrors.js'
        dest: 'src/showErrors.min.js'
    watch:
      files: [
        'src/showErrors.coffee'
        'test/showErrors.spec.coffee'
      ]
      tasks: 'default'
      karma:
        files: ['src/showErrors.js', 'test/showErrors.spec.js']
        tasks: ['karma:unit:run']
    karma:
      unit:
        configFile: 'karma.conf.js'
        singleRun: true
      continuous:
        configFile: 'karma.conf.js'
        background: true

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.registerTask 'default', ['coffee', 'uglify', 'karma:unit']
