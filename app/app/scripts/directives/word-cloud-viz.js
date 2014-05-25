/*global  iLanguageCloud */
'use strict';

angular.module('WordCloudApp').directive('wordCloudViz', function() {

  return {
    template: '<div></div>',
    restrict: 'A',
    controller: function($scope, $element) {
      /* don't make clouds of short texts */
      if (!$scope.wordCloud.text || $scope.wordCloud.text.length < 20) {
        return;
      }
      console.log('Setting up wordCloudViz controller with a word cloud from scope');

      /* Add values from the database */
      var cloud = {
        text: $scope.wordCloud.text,
        title: $scope.wordCloud.title,
        isAndroid: false,
        font: $scope.wordCloud.font || 'FreeSerif',
        element: $element[0],
        height: 200,
        // nonContentWordsArray: ["და", "აის", "კასატორი", "არ", "მე", "მიერ", "თუ", "არა", "ფი", "ეს", "არის", "მის", "ან"],
        nonContentWordsArray: $scope.wordCloud.nonContentWordsArray || [],
        prefixesArray: $scope.wordCloud.prefixesArray || [], // |სა-, სტა-,იმის,-ში/
        suffixesArray: $scope.wordCloud.suffixesArray || [],
        punctuationArray: $scope.wordCloud.punctuationArray || [],
        wordFrequencies: $scope.wordCloud.wordFrequencies || [],
        lexicalExperience: $scope.wordCloud.lexicalExperience || {}
      };

      /* make the longer texts have more vertical space */
      if ($scope.wordCloud.text && $scope.wordCloud.text.length > 300) {
        cloud.height = 400;
      } else {
        cloud.height = 200;
      }

      /* Create a title if not present */
      if (!cloud.title && cloud.text) {
        var titleLength = cloud.text.length > 31 ? 30 : cloud.text.length - 1;
        cloud.title = cloud.text.substring(0, titleLength) + '...';
      }

      /* create the cloud */
      cloud = iLanguageCloud(cloud);

      $scope.wordCloud.title = cloud.title;
      $scope.wordCloud.nonContentWordsSpaceSeparated = cloud.nonContentWordsArray.join(' ').trim();
      $scope.wordCloud.morphemesSpaceSeparated = (cloud.prefixesArray.join(' ') + ' ' + cloud.suffixesArray.join(' ')).trim();
      $scope.wordCloud.punctuationSpaceSeparated = cloud.punctuationArray.join(' ').trim();
      // $scope.wordCloud.wordFrequenciesLineBreakSeparated = cloud.wordFrequencies.map(function(word) {
      //   return word.orthography + ' ' + word.count;
      // }).join('\n');
      // $scope.wordCloud.lexicalExperienceJSON = JSON.stringify(cloud.lexicalExperience);

      /* when to re-generate the morpheme segmented text */
      $scope.$watch('wordCloud.text', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          return;
        }
        cloud.inputText = newValue;
        cloud.runSegmenter();
        if (cloud.segmentedText !== $scope.wordCloud.segmentedText) {
          $scope.wordCloud.segmentedText = cloud.segmentedText;
        }
      });
      $scope.$watch('wordCloud.morphemesSpaceSeparated', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          return;
        }
        cloud.prefixesArray = [];
        cloud.suffixesArray = [];
        newValue.split(' ').map(function(morpheme) {
          if (morpheme.indexOf('-') === 0) {
            cloud.prefixesArray.push(morpheme);
          } else {
            cloud.suffixesArray.push(morpheme);
          }
        });
        cloud.runSegmenter();
        if (cloud.segmentedText !== $scope.wordCloud.segmentedText) {
          $scope.wordCloud.segmentedText = cloud.segmentedText;
        }
      });

      /* when to re-generate the lexical experience */
      $scope.$watch('wordCloud.segmentedText', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          return;
        }
        cloud.segmentedText = newValue;
        cloud.runWordFrequencyGenerator();
        var newLexicalExperience = JSON.stringify(cloud.lexicalExperience);
        if (newLexicalExperience !== $scope.wordCloud.lexicalExperienceJSON) {
          $scope.wordCloud.lexicalExperienceJSON = newLexicalExperience;
        }
      });
      $scope.$watch('wordCloud.punctuationSpaceSeparated', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          return;
        }
        cloud.punctuationArray = newValue.split(' ');
        cloud.runWordFrequencyGenerator();
        var newLexicalExperience = JSON.stringify(cloud.lexicalExperience);
        if (newLexicalExperience !== $scope.wordCloud.lexicalExperienceJSON) {
          $scope.wordCloud.lexicalExperienceJSON = newLexicalExperience;
        }
      });

      /* when to re-generate the frequency list */
      $scope.$watch('wordCloud.nonContentWordsSpaceSeparated', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          return;
        }
        cloud.nonContentWordsArray = newValue.split(' ');
        var previousWordFrequencyLength = cloud.wordFrequencies.length;
        cloud.runStemmer();
        /* very conservative update of the word frequency list, to reduce re-drawing... */
        if (previousWordFrequencyLength !== cloud.wordFrequencies.length) {
          $scope.wordCloud.wordFrequenciesLineBreakSeparated = cloud.wordFrequencies.map(function(word) {
            return word.orthography + ' ' + word.count;
          }).join('\n');
        }
      });
      $scope.$watch('wordCloud.lexicalExperienceJSON', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          return;
        }
        try {
          cloud.lexicalExperience = JSON.parse(newValue);
        } catch (e) {
          console.warn(e);
          return;
        }
        var previousWordFrequencyLength = cloud.wordFrequencies.length;
        cloud.runStemmer();
        if (previousWordFrequencyLength !== cloud.wordFrequencies.length) {
          $scope.wordCloud.wordFrequenciesLineBreakSeparated = cloud.wordFrequencies.map(function(word) {
            return word.orthography + ' ' + word.count;
          }).join('\n');
        }
      });

      /* when to re-generate the word cloud visualization */
      $scope.$watch('wordCloud.wordFrequenciesLineBreakSeparated', function(newValue, oldValue) {
        cloud.render();
      });

    },
    link: function postLink() {
      // element.text('this is the wordCloudViz directive');
      // cloud.text = scope.wordCloud.text;
      // cloud.render();
    }
  };
});
