/*global  iLanguageCloud */
'use strict';

angular.module('WordCloudApp').directive('wordCloudViz', function() {

  return {
    template: '<div></div>',
    restrict: 'A',
    controller: function($scope, $element) {
      /* don't make clouds of short texts */
      if (!$scope.wordCloud.orthography || $scope.wordCloud.orthography.length < 20) {
        return;
      }
      console.log('Setting up wordCloudViz controller with a word cloud from scope');
      $scope.wordCloud.element = $element[0];

      /* when to re-generate the morpheme segmented text */
      $scope.$watch('wordCloud.orthography', function(newValue, oldValue) {
        if (newValue === oldValue) {
          return;
        }
        $scope.wordCloud.orthography = newValue;
        $scope.wordCloud.runSegmenter();
        if ($scope.wordCloud.segmentedText !== $scope.wordCloud.segmentedText) {
          $scope.wordCloud.segmentedText = $scope.wordCloud.segmentedText;
        }
      });
      $scope.$watch('wordCloud.morphemesSpaceSeparated', function(newValue, oldValue) {
        if (newValue === oldValue) {
          return;
        }
        $scope.wordCloud.prefixesArray = [];
        $scope.wordCloud.suffixesArray = [];
        newValue.split(' ').map(function(morpheme) {
          if (morpheme.indexOf('-') === 0) {
            $scope.wordCloud.prefixesArray.push(morpheme);
          } else {
            $scope.wordCloud.suffixesArray.push(morpheme);
          }
        });
        $scope.wordCloud.runSegmenter();
        if ($scope.wordCloud.segmentedText !== $scope.wordCloud.segmentedText) {
          $scope.wordCloud.segmentedText = $scope.wordCloud.segmentedText;
        }
      });

      /* when to re-generate the lexical experience */
      $scope.$watch('wordCloud.segmentedText', function(newValue, oldValue) {
        if (newValue === oldValue) {
          return;
        }
        $scope.wordCloud.segmentedText = newValue;
        $scope.wordCloud.runWordFrequencyGenerator();
        var newLexicalExperience = JSON.stringify($scope.wordCloud.lexicalExperience);
        if (newLexicalExperience !== $scope.wordCloud.lexicalExperienceJSON) {
          $scope.wordCloud.lexicalExperienceJSON = newLexicalExperience;
        }
      });
      $scope.$watch('wordCloud.punctuationSpaceSeparated', function(newValue, oldValue) {
        if (newValue === oldValue) {
          return;
        }
        $scope.wordCloud.punctuationArray = newValue.split(' ');
        $scope.wordCloud.runWordFrequencyGenerator();
        var newLexicalExperience = JSON.stringify($scope.wordCloud.lexicalExperience);
        if (newLexicalExperience !== $scope.wordCloud.lexicalExperienceJSON) {
          $scope.wordCloud.lexicalExperienceJSON = newLexicalExperience;
        }
      });

      /* when to re-generate the frequency list */
      $scope.$watch('wordCloud.nonContentWordsSpaceSeparated', function(newValue, oldValue) {
        if (newValue === oldValue) {
          return;
        }
        $scope.wordCloud.nonContentWordsArray = newValue.split(' ');
        var previousWordFrequencyLength = $scope.wordCloud.wordFrequencies.length;
        $scope.wordCloud.runStemmer();
        /* very conservative update of the word frequency list, to reduce re-drawing... */
        if (previousWordFrequencyLength !== $scope.wordCloud.wordFrequencies.length) {
          $scope.wordCloud.wordFrequenciesLineBreakSeparated = $scope.wordCloud.wordFrequencies.map(function(word) {
            return word.orthography + ' ' + word.count;
          }).join('\n');
        }
      });
      $scope.$watch('wordCloud.lexicalExperienceJSON', function(newValue, oldValue) {
        if (newValue === oldValue) {
          return;
        }
        try {
          $scope.wordCloud.lexicalExperience = JSON.parse(newValue);
        } catch (e) {
          console.warn(e);
          return;
        }
        var previousWordFrequencyLength = $scope.wordCloud.wordFrequencies.length;
        $scope.wordCloud.runStemmer();
        if (previousWordFrequencyLength !== $scope.wordCloud.wordFrequencies.length) {
          $scope.wordCloud.wordFrequenciesLineBreakSeparated = $scope.wordCloud.wordFrequencies.map(function(word) {
            return word.orthography + ' ' + word.count;
          }).join('\n');
        }
      });

      /* when to re-generate the word $scope.wordCloud visualization */
      $scope.$watch('wordCloud.wordFrequenciesLineBreakSeparated', function(newValue, oldValue) {
        $scope.wordCloud.render();
      });

    },
    link: function postLink() {
      // element.orthography('this is the wordCloudViz directive');
      // cloud.orthography = scope.wordCloud.orthography;
      // cloud.render();
    }
  };
});
