/*global WordCloudApp */
'use strict';

/**
 * Services that persists and retrieves TODOs handle when the chrome storage changes from another user
 * https://developer.chrome.com/apps/app_codelab5_data
 */
WordCloudApp.factory('wordCloudStorage', function() {
  var STORAGE_ID = 'wordClouds-index';

  return {
    get: function(callbackForGetIndex) {
      var self = this;
      chrome.storage.sync.get(STORAGE_ID, function(data) {

        var storageHolder = [];
        if (chrome.runtime.lastError || !data || !data[STORAGE_ID]) {
          console.log('got no wordClouds', data);
          /* error */
        } else {
          storageHolder = JSON.parse(data[STORAGE_ID]);
          console.log('got some wordClouds', storageHolder);

          var forEachfuncion = function(thisCloud, indexInStorage) {
            self.getId(thisCloud.id, function(wordCloud) {
              thisCloud.orthography = wordCloud.orthography || 'Word cloud is missing text.';
              console.log('Filled ', thisCloud);
              if (indexInStorage === storageHolder.length - 1) {
                if (typeof callbackForGetIndex === 'function') {
                  callbackForGetIndex(storageHolder);
                }
              } else {
                console.log('Not resolving storage yet');
              }
            });
          };
          for (var cloudIndex = 0; cloudIndex < storageHolder.length; cloudIndex++) {

            forEachfuncion(storageHolder[cloudIndex], cloudIndex);

          }
        }
      });
    },

    getId: function(id, callbackFromGetId) {
      console.log('looking for ' + id);
      chrome.storage.sync.get(id, function(data) {
        var wordCloud = {};
        if (chrome.runtime.lastError || !data || !data[id]) {
          console.log('got no wordCloud at this id', data);
          /* error */
        } else {
          wordCloud = JSON.parser(data[id]);
          console.log('got a wordCloud', wordCloud);
        }
        if (typeof callbackFromGetId === 'function') {
          console.log('Fetched ', wordCloud);
          callbackFromGetId(wordCloud);
        } else {
          console.log('never gets to the callbackFromGetId');
        }
      });
    },

    put: function(wordClouds) {
      var wordCloudIndex = [];
      wordClouds.map(function(wordCloud) {
        var indexable = {
          title: wordCloud.title,
          id: wordCloud.id || Date.now(),
        };
        wordCloudIndex.push(indexable);
        //save this cloud's orthography
        var id = indexable.id;
        console.log(id);
        chrome.storage.sync.set({
          id: JSON.stringify({
            orthography: wordCloud.orthography
          })
        });
      });
      JSON.stringify(wordCloudIndex);
      console.log('setting wordClouds');
      //save the index
      chrome.storage.sync.set({
        'wordClouds-index': JSON.stringify(wordCloudIndex)
      });
    }
  };
});
