'use strict';

/**
 * @ngdoc function
 * @name sdcApp.controller:MainctrlCtrl
 * @description
 * # MainctrlCtrl
 * Controller of the sdcApp
 */
angular.module('Sdc')
  .controller('MainCtrl', function ($scope, Geo) {
    // initialise, so we don't get errors referring to it later on.
    $scope.data = {};

    // Set default state value based on geolocation service.
    Geo.getLocation().then(function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      Geo.reverseGeocode(lat, lng).then(function(locString) {
        $scope.data.state = locString;
      });
    });

    // Set more defaults:
    $scope.data.purpose = 'residential';
    $scope.data.propertyStatus = 'established';

    // If we see changes on the model, lets recalculate the stamp duty.
    $scope.$watch('data', function(newValue) {
      console.log(newValue);
    }, function() {});
  });
