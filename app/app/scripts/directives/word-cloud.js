'use strict';

angular.module('WordCloudApp').directive('wordCloud', function($rootScope) {
  return {
    templateUrl: 'views/word-cloud.html',
    restrict: 'A',
    transclude: false,
    scope: {
      wordCloud: '=model'
    },
    controller: function($scope, $element) {
      console.log('Setting up wordCloudViz controller with a word cloud from scope');
      $scope.title = $scope.wordCloud.title;
      $scope.orthography = $scope.wordCloud.orthography;
      $scope.nonContentWordsSpaceSeparated = $scope.wordCloud.nonContentWordsSpaceSeparated;
      $scope.morphemesSpaceSeparated = $scope.wordCloud.morphemesSpaceSeparated;
      $scope.punctuationSpaceSeparated = $scope.wordCloud.punctuationSpaceSeparated;
      $scope.wordFrequenciesLineBreakSeparated = $scope.wordCloud.wordFrequenciesLineBreakSeparated;
      $scope.lexicalExperienceJSON = $scope.wordCloud.lexicalExperienceJSON;

      $scope.editedWordCloud = null;

      /* http://stackoverflow.com/questions/15310935/angularjs-extend-recursive */
      $scope.extendDeep = function extendDeep(dst) {
        angular.forEach(arguments, function(obj) {
          if (obj !== dst) {
            angular.forEach(obj, function(value, key) {
              if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                extendDeep(dst[key], value);
              } else {
                dst[key] = value;
              }
            });
          }
        });
        return dst;
      };

      $scope.editWordCloud = function(wordCloud) {
        $scope.editedWordCloud = wordCloud;
        $rootScope.editingCloudInList(wordCloud);
        // Clone the original wordCloud to restore it on demand.
        $scope.originalWordCloud = $scope.extendDeep({}, wordCloud);
      };

      $scope.doneEditing = function(wordCloud) {
        $scope.editedWordCloud = null;
        $rootScope.editingCloudInList(null);

        wordCloud.orthography = wordCloud.orthography.trim();

        if (!wordCloud.orthography) {
          $rootScope.removeWordCloudFromList(wordCloud);
        } else {
          wordCloud.save();
          wordCloud.render();
        }
      };

      $scope.revertEditing = function() {
        $scope.doneEditing($scope.originalWordCloud);
      };

      $scope.removeWordCloud = function(wordCloud) {
        wordCloud.trashed = 'deleted';
        $rootScope.removeWordCloudFromList(wordCloud);
        wordCloud.save();
      };

      $scope.wordCloudArchived = function(wordCloud) {
        $rootScope.wordCloudArchivedFromList(wordCloud);
        wordCloud.save();
      };

      // return;

      /* don't make clouds of short texts */
      if (!$scope.wordCloud.orthography || $scope.wordCloud.orthography.length < 20) {
        return;
      }
      $scope.wordCloud.element = $element[0];
      $scope.changeOrthography = function(newValue) {
        if (newValue === $scope.wordCloud.orthography) {
          return;
        }
        console.log('changeOrthography');
        $scope.wordCloud.runSegmenter();
      };

      $scope.changeNonContentWords = function(newValue) {
        if (newValue === $scope.wordCloud.nonContentWordsSpaceSeparated) {
          return;
        }
        console.log('changeNonContentWords');
        $scope.wordCloud.nonContentWordsArray = newValue;
        var previousWordFrequencyLength = $scope.wordCloud.wordFrequencies.length;
        $scope.wordCloud.runStemmer();

        /* very conservative update of the word frequency list, to reduce re-drawing... */
        if (previousWordFrequencyLength !== $scope.wordCloud.wordFrequencies.length) {
          $scope.wordCloud.wordFrequenciesLineBreakSeparated = $scope.wordCloud.wordFrequencies.map(function(word) {
            return word.orthography + ' ' + word.count;
          }).join('\n');
        }
      };

      $scope.changeMorphemes = function(newValue) {
        if (newValue === $scope.wordCloud.morphemesSpaceSeparated) {
          return;
        }
        console.log('changeMorphemes');
        $scope.wordCloud.morphemesArray = newValue;

        $scope.wordCloud.runSegmenter();
      };

      $scope.changePunctuation = function(newValue) {
        if (newValue === $scope.wordCloud.punctuationSpaceSeparated) {
          return;
        }
        console.log('changePunctuation');
        $scope.wordCloud.punctuationArray = newValue.split(/ +/);

        $scope.wordCloud.runWordFrequencyGenerator();
        var newLexicalExperience = JSON.stringify($scope.wordCloud.lexicalExperience);
        if (newLexicalExperience !== $scope.wordCloud.lexicalExperienceJSON) {
          $scope.wordCloud.lexicalExperienceJSON = newLexicalExperience;
        }
      };

      $scope.changeWordFrequencies = function(newValue) {
        if (newValue === $scope.wordCloud.wordFrequenciesLineBreakSeparated) {
          return;
        }
        console.log('changeWordFrequencies');
        $scope.wordCloud.render();
      };

      $scope.changeLexicalExperience = function(newValue) {
        if (newValue === $scope.wordCloud.lexicalExperienceJSON) {
          return;
        }
        console.log('changeLexicalExperience');

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
      };

      //
      //   if (newValue.segmentedText !== $scope.wordCloud.segmentedText) {
      //     $scope.wordCloud.runWordFrequencyGenerator();
      //     var newLexicalExperience = JSON.stringify($scope.wordCloud.lexicalExperience);
      //     if (newLexicalExperience !== $scope.wordCloud.lexicalExperienceJSON) {
      //       $scope.wordCloud.lexicalExperienceJSON = newLexicalExperience;
      //     }
      //   }

      //   if (!$scope.$$phase) {
      //     $scope.$apply();
      //   }
      // }, true);

      // $scope.wordCloud.render();
      //trigger the chain or processing
      // $scope.wordCloud.morphemesSpaceSeparated = 'სა-';
    },
    link: function postLink() {
      // element.text('this is the wordCloud directive');
    }
  };
});
