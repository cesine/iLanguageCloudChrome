'use strict';

angular.module('WordCloudApp').directive('wordCloudViz', function() {

  return {
    template: '<div></div>',
    restrict: 'A',
    controller: function() {
      console.log('Setting up wordCloudViz controller with a word cloud from scope');
    },
    link: function postLink(scope, element) {
      scope.wordCloud.element = element[0];
      /* don't make clouds of short texts */
      if (!scope.wordCloud.orthography || scope.wordCloud.orthography.length < 20) {
        return;
      }
      scope.wordCloud.render();
    }
  };
});
