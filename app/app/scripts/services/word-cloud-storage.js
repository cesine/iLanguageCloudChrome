/*global WordCloudApp */
'use strict';

/**
 * Services that persists and retrieves TODOs handle when the chrome storage changes from another user
 * https://developer.chrome.com/apps/app_codelab5_data
 */
WordCloudApp.factory('wordCloudStorage', function() {
  var STORAGE_ID = 'wordClouds-angularjs-perf';

  return {
    get: function(callback) {
      chrome.storage.sync.get(STORAGE_ID,
        function(data) {

          var storageHolder = [];
          if (chrome.runtime.lastError || !data || !data[STORAGE_ID]) {
            console.log('got no wordClouds', data);
            /* error */
          } else {
            storageHolder = data[STORAGE_ID];
            console.log('got some wordClouds', storageHolder);
          }
          if (typeof callback === 'function') {
            callback(storageHolder);
          }
        });
    },

    put: function(wordClouds) {
      var wordCloudList = JSON.stringify(wordClouds);
      console.log('setting wordClouds', wordCloudList);

      chrome.storage.sync.set({
        'wordClouds-angularjs-perf': wordClouds
      });
    }
  };
});
