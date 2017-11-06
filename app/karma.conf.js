// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    plugins: [
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor'
    ],
    // base path, that will be used to resolve files and exclude
    basePath: '',
    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/node_modules/angular/angular.js',
      'app/node_modules/angular-mocks/angular-mocks.js',
      'app/node_modules/angular-resource/angular-resource.js',
      'app/node_modules/angular-cookies/angular-cookies.js',
      'app/node_modules/angular-sanitize/angular-sanitize.js',
      'app/node_modules/angular-route/angular-route.js',
      'app/scripts/*.js',
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js',

      //location of templates
      'app/views/**/*.html'
    ],

    preprocessors: {
        //location of templates
        'app/views/**/*.html': 'html2js'
    },

    ngHtml2JsPreprocessor: {
        // strip app from the file path
        stripPrefix: 'app/'
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
