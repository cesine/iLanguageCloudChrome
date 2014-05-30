/*global WordCloudApp */
'use strict';

WordCloudApp.directive('wordCloudViz', function($timeout) {

  return {
    template: '<div class="word-cloud-viz"></div>',
    restrict: 'A',
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
      $timeout(function() {
        console.log(element);
        scope.wordCloud.width = element[0].offsetWidth || 1000;
        scope.wordCloud.render();
      }, 1000);
    }
  };
});
