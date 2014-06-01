/*global WordCloudApp */
'use strict';

WordCloudApp.directive('wordCloudNode', function() {
  return {
    templateUrl: 'views/word-cloud-node.html',
    restrict: 'A',
    // scope: {
    //   wordNode: '=model'
    // },
    controller: function($scope) {
      console.log('Setting up wordCloudNode controller with a word node from scope');
      console.log($scope.wordNode);

      $scope.$watch('wordNode', function(newValue) {
        console.log('the wordNode changed', newValue);
      });

      $scope.initializeWordNode = function(wordNode) {
        if ($scope.wordNode) {
          $scope.saveWordNodeChanges(true);
        }
        $scope.wordNode = wordNode;
        wordNode.morphemes = wordNode.morphemes || wordNode.orthography;
        $scope.wordNodeOriginal = $scope.extendDeep({}, wordNode);

        return wordNode;
      };
      $scope.saveWordNodeChanges = function(keepWordNodeDialogOpenAfterSave) {

        if ($scope.wordNode.removeThisWord || $scope.wordNode.neverShowThisWord) {
          $scope.wordNode.size = 0;
          $scope.wordNode.text = '';
          $scope.wordNode.hasText = false;
          if ($scope.wordNode.removeThisWord) {
            $scope.wordCloud.userRemovedWordsForThisDocumentArray = $scope.wordCloud.userRemovedWordsForThisDocumentArray || [];
            $scope.wordCloud.userRemovedWordsForThisDocumentArray.unshift($scope.wordNode.orthography);
            $scope.wordNode.categories = $scope.wordNode.categories || [];
            $scope.wordNode.categories.unshift('userRemovedWordAsUnrepresentativeOfThisDocument');
          } else {
            $scope.wordCloud.userRemovedWordsForAllDocumentsArray = $scope.wordCloud.userRemovedWordsForAllDocumentsArray || [];
            $scope.wordCloud.userRemovedWordsForAllDocumentsArray.unshift($scope.wordNode.orthography);
            $scope.wordNode.categories = $scope.wordNode.categories || [];
            $scope.wordNode.categories.unshift('userRemovedWordFromAllDocuments');
          }
          // console.log($scope.nonContentWordsSpaceSeparated);
          // $scope.changeNonContentWords($scope.nonContentWordsSpaceSeparated + ' ' + $scope.wordNode.orthography);
          $scope.wordCloud.render();
          $scope.wordCloud.userPreformedCleaningChanges = $scope.wordCloud.userPreformedCleaningChanges || 0;
          $scope.wordCloud.userPreformedCleaningChanges += 1;
        }

        if ($scope.wordNodeOriginal.count !== $scope.wordNode.count) {
          $scope.wordCloud.userDefinedBoostingRules = $scope.wordCloud.userDefinedBoostingRules || [];
          $scope.wordCloud.userDefinedBoostingRules.push({
            orthography: $scope.wordNode.orthography,
            source: $scope.wordNodeOriginal.count,
            relation: 'wasBoostedTo',
            target: $scope.wordNode.count,
            context: $scope.wordCloud.textSize
          });
          $scope.wordCloud.userPreformedCleaningChanges = $scope.wordCloud.userPreformedCleaningChanges || 0;
          $scope.wordCloud.userPreformedCleaningChanges += 1;
        }

        if ($scope.wordNodeOriginal.orthography !== $scope.wordNode.orthography) {
          $scope.wordCloud.userDefinedCleaningReWriteRules = $scope.wordCloud.userDefinedCleaningReWriteRules || [];
          $scope.wordCloud.userDefinedCleaningReWriteRules.push({
            source: $scope.wordNodeOriginal.orthography,
            relation: 'isCleanedAs',
            target: $scope.wordNode.orthography
          });
          $scope.wordNode.text = $scope.wordNode.orthography;
          $scope.wordCloud.userPreformedCleaningChanges = $scope.wordCloud.userPreformedCleaningChanges || 0;
          $scope.wordCloud.userPreformedCleaningChanges += 1;
        }

        if ($scope.wordNodeOriginal.morphemes !== $scope.wordNode.morphemes) {
          $scope.wordCloud.morphemes.replace($scope.wordNodeOriginal.morphemes, $scope.wordNode.morphemes);
          $scope.wordCloud.userDefinedMorphemeSegmentationReWriteRules = $scope.wordCloud.userDefinedMorphemeSegmentationReWriteRules || [];
          $scope.wordCloud.userDefinedMorphemeSegmentationReWriteRules.push({
            source: $scope.wordNodeOriginal.morphemes,
            relation: 'isMorphemeSegmentedAs',
            target: $scope.wordNode.morphemes
          });
          $scope.wordCloud.userPreformedCleaningChanges = $scope.wordCloud.userPreformedCleaningChanges || 0;
          $scope.wordCloud.userPreformedCleaningChanges += 1;
        }
        $scope.wordNodeShow = keepWordNodeDialogOpenAfterSave;
        $scope.wordCloud.save();
        $scope.wordNode = null;
        // if (!$scope.$$phase) {
        //   $scope.$apply();
        // }
      };
    },
    link: function postLink(scope) {
      // element.text('this is the wordCloudNode directive');
      console.log(scope.wordNode);

    }
  };
});
