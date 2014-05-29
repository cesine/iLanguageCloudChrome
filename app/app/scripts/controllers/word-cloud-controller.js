/*global WordCloudApp, iLanguageCloud */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the wordCloudStorage service
 * - exposes the model to the template and provides event handlers
 */
WordCloudApp.controller('WordCloudCtrl', function WordCloudCtrl($scope, $location, $filter, wordCloudStorage, $rootScope) {
  var wordClouds = $scope.wordClouds = [];

  // If there is saved data in storage, use it.
  // https://developer.chrome.com/apps/app_codelab5_data
  $scope.load = function(value) {
    if (value) {
      wordClouds = $scope.wordClouds = value;
      $scope.remainingCount = $filter('filter')(wordClouds, {
        archived: false
      }).length;
    }
  };

  wordCloudStorage.get(function(wordClouds) {
    console.log('Got some wordClouds', wordClouds);
    $scope.$apply(function() {
      $scope.load(wordClouds);
    });
  });

  $scope.newWordCloud = '';
  $scope.remainingCount = 0;

  if ($location.path() === '') {
    $location.path('/');
  }

  $scope.location = $location;

  $scope.$watch('location.path()', function(path) {
    $scope.statusFilter = {
      '/active': {
        archived: false
      },
      '/archived': {
        archived: true
      }
    }[path];
  });

  $scope.$watch('remainingCount == 0', function(val) {
    $scope.allChecked = val;
  });

  $scope.addWordCloud = function() {
    var newWordCloud = $scope.newWordCloud.trim();
    if (newWordCloud.length === 0) {
      return;
    }
    var cloudToSave = new iLanguageCloud({
      orthography: newWordCloud,
      archived: false,
      height: 200,
      nonContentWordsArray: [],
      prefixesArray: [], // |სა-, სტა-,იმის,-ში/
      suffixesArray: [],
      punctuationArray: [],
      wordFrequencies: [],
      collection: 'datums',
      lexicalExperience: {},
      caseInsensitive: true,
      url: wordCloudStorage.dbUrl()
    });

    /* make the longer texts have more vertical space */
    if (cloudToSave.orthography && cloudToSave.orthography.length > 300) {
      cloudToSave.height = 400;
    } else {
      cloudToSave.height = 200;
    }

    /* Create a title if not present */
    if (!cloudToSave.title && cloudToSave.orthography) {
      var titleLength = cloudToSave.orthography.length > 31 ? 30 : cloudToSave.orthography.length - 1;
      cloudToSave.title = cloudToSave.orthography.substring(0, titleLength) + '...';
    }

    wordClouds.unshift(cloudToSave);
    cloudToSave.save();

    $scope.newWordCloud = '';
    $scope.remainingCount++;
  };

  $rootScope.editingCloudInList = function(wordCloud) {
    $scope.editedWordCloud = wordCloud;
  };

  $rootScope.removeWordCloudFromList = function(wordCloud) {
    $scope.remainingCount -= wordCloud.archived ? 0 : 1;
    wordClouds.splice(wordClouds.indexOf(wordCloud), 1);
  };

  $rootScope.wordCloudArchivedFromList = function(wordCloud) {
    $scope.remainingCount += wordCloud.archived ? -1 : 1;
  };

  $rootScope.revertEditingFromList = function(wordCloud, original) {
    wordClouds[wordClouds.indexOf(wordCloud)] = original;
  };

  $scope.clearArchivedWordClouds = function() {
    $scope.wordClouds = wordClouds = wordClouds.filter(function(wordCloud) {
      if (wordCloud.archived) {
        wordCloud.trashed = 'deleted';
        wordCloud.save();
      }
      return !wordCloud.archived;
    });
  };

  $scope.markAll = function(archived) {
    wordClouds.forEach(function(wordCloud) {
      wordCloud.archived = !archived;
      wordCloud.save();
    });
    $scope.remainingCount = archived ? wordClouds.length : 0;
  };
});
