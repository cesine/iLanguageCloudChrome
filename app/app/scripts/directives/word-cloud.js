'use strict';

angular.module('WordCloudApp')
  .directive('wordCloud', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the wordCloud directive');
      }
    };
  });
