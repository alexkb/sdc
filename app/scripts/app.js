'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules. The 2nd parameter is an array of 'requires'
angular.module('Sdc', ['ionic', 'config'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
      // Disable app sitting behind status bar.
      StatusBar.overlaysWebView(false);
    }
  });
});
