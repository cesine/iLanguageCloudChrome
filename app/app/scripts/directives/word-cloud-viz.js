/*global  iLanguageCloud */
'use strict';

angular.module('WordCloudApp').directive('wordCloudViz', function() {

  return {
    template: '<div></div>',
    restrict: 'A',
    controller: function($scope, $element) {
      var cloud = {
        text: '',
        isAndroid: false,
        font: '',
        element: [],
        height: 200,
        stopWords: ''
      };
      console.log('in controller wordCloudViz');

      // $scope.wordCloud.stopWords = /^(like|feel|soul|around|the|and|that|my|i|of|was|so|with|a|in|when|then|which|these|us|as|me|an|am|at|be|is|by)$/;
      $scope.wordCloud.font = 'FreeSerif';
      $scope.wordCloud.text = $scope.wordCloud.title;

      cloud.text = $scope.wordCloud.text;
      /* dont make clouds of short texts */
      if (cloud.text.length < 20) {
        return;
      }

      /* make the longer texts have more space */
      if (cloud.text.length > 300) {
        cloud.height = 400;
      } else {
        cloud.height = 200;
      }

      cloud.element = $element[0];
      cloud.stopWords = $scope.wordCloud.stopWords;
      cloud.font = $scope.wordCloud.font;

      window.opts = cloud;
      cloud = iLanguageCloud(cloud).render();
      console.log(cloud);

      // $scope.$watch($scope.wordCloud.title, function(newValue, oldValue) {
      //   cloud.text = newValue.text;
      //   cloud.render();
      // });
    },
    link: function postLink() {
      // element.text('this is the wordCloudViz directive');
      // cloud.text = scope.wordCloud.text;
      // cloud.render();
    }
  };
});
