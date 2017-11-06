/*global WordCloudApp, ILanguageCloud, ILanguageClouds */
'use strict';

/**
 * Services that persists and retrieves to a server
 */
WordCloudApp.factory('wordCloudStorage', function() {
  var USERNAME_STORAGE = 'wordClouds-username';
  var username = 'anonymouswordclouduser1509826445309';
  var dbname = 'anonymouswordclouduser1509826445309-firstcorpus';

  var getUserName = function(callbackForGettingUsername) {

    chrome.storage.sync.get(USERNAME_STORAGE, function(data) {

      var username = [];
      if (chrome.runtime.lastError || !data || !data[USERNAME_STORAGE]) {
        console.log('got no username', data);
        /* error */
      } else {
        username = data[USERNAME_STORAGE];
        console.log('got some wordClouds', username);

      }
      if (!username || username.length === 0) {
        username = 'anonymouswordclouduser' + Date.now();
        //Register user
        chrome.storage.sync.set({
          USERNAME_STORAGE: username
        });
      }
      dbname = username + '-firstcorpus';
      if (typeof callbackForGettingUsername === 'function') {
        callbackForGettingUsername();
      }
    });
  };

  return {
    get: function(callbackForGettingClouds) {

      var onceUsernameIsKnown = function() {
        window.db = window.db || new ILanguageClouds({
          username: username,
          dbname: dbname,
          url: 'http://localhost:5984'
        });
        console.log('fetching clouds for ', window.db.toJSON());
        window.db.login({
          name: window.db.username,
          authUrl: 'http://localhost:5984/_session',
          password: 'testtest'
        }).then(function() {
          window.db.fetchCollection('/_design/clouds/_view/clouds?descending=true&limit=5').then(function(someclouds) {
            console.log(someclouds);
            for (var cloudIndex = 0; cloudIndex < someclouds.length; cloudIndex++) {
              someclouds[cloudIndex].caseInsensitive = false;
              someclouds[cloudIndex] = new ILanguageCloud(someclouds[cloudIndex]);
              someclouds[cloudIndex].dbname = window.db.dbname;
              someclouds[cloudIndex].corpus = window.db;
              someclouds[cloudIndex].unsaved = true;
            }
            if (typeof callbackForGettingClouds === 'function') {
              callbackForGettingClouds(someclouds);
            }
          }, function(reason) {
            console.log('No clouds...', reason);
          }).fail(function(error) {
            console.log('Unable to build clouds please report this.', error, error.stack);
          });
        }, function(error) {
          console.log('Unable to login please report this.', error);
        }).fail(function(error) {
          console.log('Unable to login please report this.', error);
        });
      };

      if (!username) {
        getUserName(onceUsernameIsKnown);
      } else {
        onceUsernameIsKnown();
      }

    },

    // getId: function(id) {

    // },

    // put: function(wordClouds) {

    // },
    dbUrl: function() {
      return 'http://localhost:5984/' + dbname;
    }
  };
});
