/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: '<%= pkg.build.js %>',
        dest: 'dist/leaflet.photomarker-src.js'
      }
    },
    uglify: {
      dist: {
        src: 'dist/leaflet.photomarker-src.js',
        dest: 'dist/leaflet.photomarker.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: false,
          L: true,
          require: true,
          __dirname: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      project: {
        src: 'src/**/*.js'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Unit Tests
  grunt.registerTask('test', function() {
    var testacular = require('testacular'),
        testConfig = { cmd: 'start', configFile: __dirname+'/spec/testacular.conf.js' };
    this.async(),
    // Grunt test options
    testConfig.singleRun = true;
    testConfig.browsers = ['PhantomJS'];
    testacular.server.start(testConfig);
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};
