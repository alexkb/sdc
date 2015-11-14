'use strict';

angular.module('Sdc', ['ionic', 'config'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
      // Disable app sitting behind status bar.
      StatusBar.overlaysWebView(false);
    }
  });
})
