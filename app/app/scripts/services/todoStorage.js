/*global todomvc */
'use strict';

/**
 * Services that persists and retrieves TODOs handle when the chrome storage changes from another user
 * https://developer.chrome.com/apps/app_codelab5_data
 */
todomvc.factory('todoStorage', function() {
  var STORAGE_ID = 'todos-angularjs-perf';

  return {
    get: function(callback) {
      chrome.storage.sync.get(STORAGE_ID,
        function(data) {

          var storageHolder = [];
          if (chrome.runtime.lastError || !data || !data[STORAGE_ID]) {
            console.log("got no todos", data);
            /* error */
          } else {
            storageHolder = data[STORAGE_ID];
            console.log("got some todos", storageHolder);
          }
          if (typeof callback == "function") {
            callback(storageHolder);
          }
        });
    },

    put: function(todos) {
      var todoList = JSON.stringify(todos);
      console.log("setting todos", todoList);

      chrome.storage.sync.set({
        'todos-angularjs-perf': todos
      });
    }
  };
});
