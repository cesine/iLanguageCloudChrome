/*global WordCloudApp */
'use strict';

WordCloudApp.directive('wordCloud', function($rootScope) {
  return {
    templateUrl: 'views/word-cloud.html',
    restrict: 'A',
    transclude: false,
    scope: {
      wordCloud: '=model'
    },
    controller: function($scope, $element) {
      console.log('Setting up wordCloud controller with a word cloud from scope');
      if ($scope.wordCloud && $scope.wordCloud.title) {
        $scope.title = $scope.wordCloud.title;
      }
      if ($scope.wordCloud && $scope.wordCloud.orthography) {
        $scope.orthography = $scope.wordCloud.orthography;
      }
      // $scope.nonContentWordsSpaceSeparated = $scope.wordCloud.nonContentWordsSpaceSeparated;
      // $scope.morphemesSpaceSeparated = $scope.wordCloud.morphemesSpaceSeparated;
      // $scope.punctuationSpaceSeparated = $scope.wordCloud.punctuationSpaceSeparated;
      // $scope.wordFrequenciesLineBreakSeparated = $scope.wordCloud.wordFrequenciesLineBreakSeparated;
      // $scope.lexicalExperienceJSON = $scope.wordCloud.lexicalExperienceJSON;

      $scope.editedWordCloud = null;
      $scope.wordNodeShow = false;

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
        if ($rootScope.editingCloudInList) {
          $rootScope.editingCloudInList(wordCloud);
        }
        // Clone the original wordCloud to restore it on demand.
        $scope.originalWordCloud = $scope.extendDeep({}, wordCloud);
      };

      $scope.doneEditing = function(wordCloud) {
        $scope.editedWordCloud = null;
        if ($rootScope.editingCloudInList) {
          $rootScope.editingCloudInList(null);
        }

        if (wordCloud.orthography) {
          wordCloud.orthography = wordCloud.orthography.trim();
        }

        if (!wordCloud.orthography && (!wordCloud.lexicon || !wordCloud.lexicon.length)) {
          if ($rootScope.removeWordCloudFromList) {
            $rootScope.removeWordCloudFromList(wordCloud);
          }
        } else {
          wordCloud.save();
          if (wordCloud.element) {
            wordCloud.render();
          }
        }
      };

      $scope.revertEditing = function() {
        $scope.doneEditing($scope.originalWordCloud);
      };

      $scope.removeWordCloud = function(wordCloud) {
        wordCloud.trashed = 'deleted';
        wordCloud.save();
        if ($rootScope.removeWordCloudFromList) {
          $rootScope.removeWordCloudFromList(wordCloud);
        }
      };

      $scope.wordCloudArchived = function(wordCloud) {
        if ($rootScope.wordCloudArchivedFromList) {
          $rootScope.wordCloudArchivedFromList(wordCloud);
        }
        wordCloud.save();
      };

      $scope.refreshWhatsInScope = function(newValue) {
        if (!newValue) {
          return;
        }
        if ($scope.wordCloud && !$scope.wordCloud.element) {
          $scope.wordCloud.element = $element[0];
        }

        $scope.orthography = newValue.orthography;
        $scope.filteredText = newValue.filteredText;
        $scope.morphemes = newValue.morphemes;
        newValue.nonContentWordsArray = newValue.nonContentWordsArray || [];
        $scope.nonContentWordsSpaceSeparated = $scope.wordCloud.nonContentWordsSpaceSeparated = newValue.nonContentWordsArray.join(' ');
        
        newValue.prefixesArray = newValue.prefixesArray || [];
        newValue.suffixesArray =newValue.suffixesArray || [];
        $scope.morphemesSpaceSeparated = ($scope.wordCloud.morphemesSpaceSeparated = newValue.prefixesArray.join(' ') + ' ' + newValue.suffixesArray.join(' ')).trim();
        
        newValue.punctuationArray = newValue.punctuationArray || [];
        $scope.punctuationSpaceSeparated = $scope.wordCloud.punctuationSpaceSeparated = newValue.punctuationArray.join(' ');
        
        newValue.wordFrequencies = newValue.wordFrequencies || [];
        $scope.wordFrequenciesLineBreakSeparated = newValue.wordFrequencies.map(function(word) {
          return word.orthography + ' ' + word.count;
        }).join('\n');

        newValue.lexicalExperience = newValue.lexicalExperience || {};
        $scope.lexicalExperienceJSON = JSON.stringify(newValue.lexicalExperience);

      };

      /*
      prepare the watchers and connect the wordCloud up to the scope
      */


      /* Refresh the stemmer */
      if ($scope.wordCloud && $scope.wordCloud.orthography && (!$scope.wordCloud.wordFrequencies || !$scope.wordCloud.wordFrequencies.length)) {
        console.warn('This cloud is not empty ', $scope.wordCloud);
        $scope.refreshWhatsInScope($scope.wordCloud.runStemmer().runSegmenter());
      }

      $scope.$watch('wordCloud', function(newValue, oldValue) {
        console.log('the cloud changed');
        $scope.refreshWhatsInScope(newValue, oldValue);
        // if (!$scope.$$phase) {
        //   $scope.$apply();
        // }
      });

      $scope.$watch('wordCloud.length', function(newValue, oldValue) {
        if (!$scope.wordCloud) {
          return;
        }
        console.log('the number of words changed', newValue, oldValue);
        if ($scope.wordCloud && !$scope.wordCloud.element) {
          $scope.wordCloud.element = $element[0];
        }
        $scope.wordCloud.render();
        // if (!$scope.$$phase) {
        //   $scope.$apply();
        // }
      });

      $scope.changeOrthography = function(newValue) {
        if (!newValue || !$scope.wordCloud) {
          return;
        }
        if (newValue === $scope.wordCloud.orthography) {
          return;
        }
        console.log('changeOrthography');
        $scope.orthography = $scope.wordCloud.orthography = newValue;
        $scope.wordCloud.runSegmenter();
        // $scope.changeMorphemes($scope.wordCloud.morphemes);
      };

      $scope.changeMorphemes = function(newValue) {
        if (newValue === $scope.wordCloud.morphemes) {
          return;
        }
        $scope.morphemes = $scope.wordCloud.morphemes = newValue;
        console.log('changeMorphemes');
        // $scope.wordCloud.runWordFrequencyGenerator();
        // $scope.changeNonContentWords($scope.wordCloud.nonContentWordsArray);
      };

      $scope.changeNonContentWords = function(newValue) {
        if (newValue === $scope.wordCloud.nonContentWordsSpaceSeparated) {
          return;
        }
        console.log('changeNonContentWords');
        if (newValue) {
          $scope.wordCloud.userSpecifiedNonContentWords = true;
        } else {
          $scope.wordCloud.userSpecifiedNonContentWords = false;
        }

        $scope.wordCloud.nonContentWordsArray = newValue;
        var previousWordFrequencyLength = $scope.wordCloud.wordFrequencies.length;
        $scope.wordCloud.runWordFrequencyGenerator().runStemmer();

        // $scope.nonContentWordsArray = $scope.wordCloud.nonContentWordsArray = newValue;
        // $scope.nonContentWordsArray = $scope.wordCloud.nonContentWordsArray = newValue;
        // $scope.nonContentWordsArray = $scope.wordCloud.nonContentWordsArray = newValue;

        // $scope.nonContentWordsSpaceSeparated = newValue.nonContentWordsSpaceSeparated;
        // $scope.morphemesSpaceSeparated = newValue.morphemesSpaceSeparated;
        // $scope.punctuationSpaceSeparated = newValue.punctuationSpaceSeparated;
        // $scope.wordFrequenciesLineBreakSeparated = newValue.wordFrequenciesLineBreakSeparated;
        // $scope.lexicalExperienceJSON = newValue.lexicalExperienceJSON;

        /* very conservative update of the word frequency list, to reduce re-drawing... */
        if (previousWordFrequencyLength !== $scope.wordCloud.wordFrequencies.length) {
          $scope.wordFrequenciesLineBreakSeparated = $scope.wordCloud.wordFrequencies.map(function(word) {
            return word.orthography + ' ' + word.count;
          }).join('\n');
        }
      };

      $scope.changeMorphemesSpaceSeparated = function(newValue) {
        if (newValue === $scope.wordCloud.morphemesSpaceSeparated) {
          return;
        }
        console.log('changeMorphemes');
        $scope.wordCloud.morphemesArray = newValue;

        $scope.wordCloud.runSegmenter();
        $scope.wordCloud.runStemmer();
        // $scope.orthography = newValue.orthography;
        // $scope.nonContentWordsSpaceSeparated = newValue.nonContentWordsSpaceSeparated;
        // $scope.morphemesSpaceSeparated = newValue.morphemesSpaceSeparated;
        // $scope.punctuationSpaceSeparated = newValue.punctuationSpaceSeparated;
        // $scope.wordFrequenciesLineBreakSeparated = newValue.wordFrequenciesLineBreakSeparated;
        // $scope.lexicalExperienceJSON = newValue.lexicalExperienceJSON;
        var newLexicalExperience = JSON.stringify($scope.wordCloud.lexicalExperience);
        if (newLexicalExperience !== $scope.wordCloud.lexicalExperienceJSON) {
          $scope.wordCloud.lexicalExperienceJSON = newLexicalExperience;
        }
      };

      $scope.changePunctuation = function(newValue) {
        if (newValue === $scope.wordCloud.punctuationSpaceSeparated) {
          return;
        }
        console.log('changePunctuation');
        $scope.wordCloud.punctuationArray = newValue.split(/ +/);

        $scope.wordCloud.runWordFrequencyGenerator();
        // $scope.orthography = newValue.orthography;
        // $scope.nonContentWordsSpaceSeparated = newValue.nonContentWordsSpaceSeparated;
        // $scope.morphemesSpaceSeparated = newValue.morphemesSpaceSeparated;
        // $scope.punctuationSpaceSeparated = newValue.punctuationSpaceSeparated;
        // $scope.wordFrequenciesLineBreakSeparated = newValue.wordFrequenciesLineBreakSeparated;
        // $scope.lexicalExperienceJSON = newValue.lexicalExperienceJSON;
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
        console.log('changeLexicalExperience');

        try {
          $scope.wordCloud.lexicalExperience = JSON.parse(newValue);
        } catch (e) {
          console.warn(e);
          return;
        }
        var previousWordFrequencyLength = $scope.wordCloud.wordFrequencies.length;
        $scope.wordCloud.runStemmer();
        // $scope.orthography = newValue.orthography;
        // $scope.nonContentWordsSpaceSeparated = newValue.nonContentWordsSpaceSeparated;
        // $scope.morphemesSpaceSeparated = newValue.morphemesSpaceSeparated;
        // $scope.punctuationSpaceSeparated = newValue.punctuationSpaceSeparated;
        // $scope.wordFrequenciesLineBreakSeparated = newValue.wordFrequenciesLineBreakSeparated;
        // $scope.lexicalExperienceJSON = newValue.lexicalExperienceJSON;

        if (previousWordFrequencyLength !== $scope.wordCloud.wordFrequencies.length) {
          $scope.wordCloud.wordFrequenciesLineBreakSeparated = $scope.wordCloud.wordFrequencies.map(function(word) {
            return word.orthography + ' ' + word.count;
          }).join('\n');
        }
      };

      //
      //   if (newValue.morphemes !== $scope.wordCloud.morphemes) {
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