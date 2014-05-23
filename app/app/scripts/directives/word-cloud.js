'use strict';

angular.module('WordCloudApp').directive('wordCloud', function() {
  return {
    templateUrl: 'views/word-cloud.html',
    restrict: 'A',
    link: function postLink() {
      // element.text('this is the wordCloud directive');
    }
  };
});
