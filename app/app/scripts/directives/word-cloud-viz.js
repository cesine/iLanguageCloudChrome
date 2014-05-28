'use strict';

angular.module('WordCloudApp').directive('wordCloudViz', function() {

  return {
    template: '<div></div>',
    restrict: 'A',
    controller: function($scope, $element) {
      /* don't make clouds of short texts */

      console.log('Setting up wordCloudViz controller with a word cloud from scope');

      // $scope.wordCloud.render();
    },
    link: function postLink(scope, element) {
      scope.wordCloud.element = element[0];
      if (!scope.wordCloud.orthography || scope.wordCloud.orthography.length < 20) {
        return;
      }
      scope.wordCloud.render();
    }
  };
});
