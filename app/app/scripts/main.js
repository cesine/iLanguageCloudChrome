'use strict';

try {
  // Listens for the app launching then creates the window
  if (chrome && chrome.app && chrome.app.runtime && chrome.app.runtime.onLaunched && chrome.app.runtime.onLaunched.addListener) {
    chrome.app.runtime.onLaunched.addListener(function() {
      var width = 600;
      var height = 400;

      chrome.app.window.create('index.html', {
        id: 'main',
        bounds: {
          width: width,
          height: height,
          left: Math.round((screen.availWidth - width) / 2),
          top: Math.round((screen.availHeight - height) / 2)
        }
      });
    });
  }
} catch (exception) {
  console.log('Caught exception', exception);
}