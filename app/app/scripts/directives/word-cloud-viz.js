/*global WordCloudApp */
'use strict';

WordCloudApp.directive('wordCloudViz', function($timeout) {

  return {
    template: '<div class="word-cloud-viz"></div>',
    restrict: 'A',
    scope: {
      wordCloud: '=model'
    },
    // replace: true,
    controller: function($scope, $element) {
      console.log('Setting up wordCloudViz controller with a word cloud from scope');
      $scope.wordCloud.element = $element[0];
    },
    link: function postLink(scope, element) {
      scope.wordCloud.element = element[0];
      /* don't make clouds of short texts */
      if (!scope.wordCloud.orthography || scope.wordCloud.orthography.length < 20) {
        return;
      }
      var waitime = Math.min(scope.wordCloud.orthography.length / 100, 1000);
      console.log('Waiting' + waitime);
      $timeout(function() {
        // console.log(element);
        scope.wordCloud.width = element[0].offsetWidth || 1000;
        if (!scope.wordCloud.runningStemmer) {
          scope.wordCloud.render();
        } else {
          console.log('The stemmer is running, waiting again ' + waitime);
          $timeout(function() {
            // console.log(element);
            scope.wordCloud.width = element[0].offsetWidth || 1000;
            scope.wordCloud.render();
          }, waitime);
        }
      }, waitime);
    }
  };
});
