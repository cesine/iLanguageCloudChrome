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
        stopWords: /^(და|აის|კასატორი|არ|მე|მიერ|თუ|არა|ფი|ეს|არის|მის|ან)$/
        // |სა-, სტა-,იმის,-ში/
      };
      console.log('in controller wordCloudViz');
      $scope.wordCloud.font = 'FreeSerif';

      cloud.text = $scope.wordCloud.text;
      /* dont make clouds of short texts */
      if (!cloud.text || cloud.text.length < 20) {
        return;
      }

      /* make the longer texts have more space */
      if (cloud.text && cloud.text.length > 300) {
        cloud.height = 400;
      } else {
        cloud.height = 200;
      }

      if (!$scope.wordCloud.title && $scope.wordCloud.text) {
        var titleLength = $scope.wordCloud.text.length > 31 ? 30 : $scope.wordCloud.text.length - 1;
        $scope.wordCloud.title = $scope.wordCloud.text.substring(0, titleLength) + '...';
      }
      // $scope.wordCloud.stopWords = /^(like|feel|soul|around|the|and|that|my|i|of|was|so|with|a|in|when|then|which|these|us|as|me|an|am|at|be|is|by)$/;
      $scope.wordCloud.stopWordsSpaceSeparated = $scope.wordCloud.stopWordsSpaceSeparated || '';
      $scope.wordCloud.stopWordsArray = $scope.wordCloud.stopWordsSpaceSeparated.split(' ');
      $scope.wordCloud.morphemes = $scope.wordCloud.morphemes;

      cloud.element = $element[0];
      cloud.stopWords = $scope.wordCloud.stopWords;
      cloud.font = $scope.wordCloud.font;

      window.opts = cloud;
      cloud = iLanguageCloud(cloud).render();
      $scope.wordCloud.stopWordsArray = cloud.stopWordsArray;
      $scope.wordCloud.stopWordsSpaceSeparated = cloud.stopWordsArray.join(' ');
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
