/*global WordCloudApp, iLanguageClouds */
'use strict';

/**
 * Services that persists and retrieves to a server
 */
WordCloudApp.factory('wordCloudStorage', function($http) {
  var USERNAME_STORAGE = 'wordClouds-username';
  var username = 'anonymouswordclouduser1401218737791';
  var dbname = 'anonymouswordclouduser1401218737791-firstcorpus';

  var db;
  var getUserName = function(callbackForGettingUsername) {

    // chrome.storage.sync.get(USERNAME_STORAGE, function(data) {

    //   var username = [];
    //   if (chrome.runtime.lastError || !data || !data[USERNAME_STORAGE]) {
    //     console.log('got no username', data);
    //     /* error */
    //   } else {
    //     username = data[USERNAME_STORAGE];
    //     console.log('got some wordClouds', username);

    //   }
    //   if (!username || username.length === 0) {
    //     username = 'anonymouswordclouduser' + Date.now();
    //     //Register user
    //     chrome.storage.sync.set({
    //       USERNAME_STORAGE: username
    //     });
    //   }
    //   dbname = username + '-firstcorpus';
      if (typeof callbackForGettingUsername === 'function') {
        callbackForGettingUsername();
      }
    // });
  };

  return {
    get: function(callbackForGettingClouds) {

      var onceUsernameIsKnown = function() {
        db = db || new iLanguageClouds({
          username: username,
          dbname: dbname,
          url: 'https://localhost:6984'
        });
        console.log("fetching clouds for ", db.toJSON());
        db.fetchAllDocuments().then(function(someclouds) {
          console.log(someclouds);
          if (typeof callbackForGettingClouds === 'function') {
            callbackForGettingClouds(someclouds);
          }
        }, function(reason) {
          console.log("No clouds...", reason);
        });
      };

      if (!username) {
        getUserName(onceUsernameIsKnown)
      } else {
        onceUsernameIsKnown();
      }

    },

    getId: function(id) {

    },

    put: function(wordClouds) {

    },
    dbUrl: function() {
      return 'https://localhost:6984/' + dbname;
    }
  };
});
