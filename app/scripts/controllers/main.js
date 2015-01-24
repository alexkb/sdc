'use strict';

/**
 * @ngdoc function
 * @name Sdc.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the Sdc
 */
angular.module('Sdc')
  .controller('MainCtrl', function ($scope, Geo, Utils, Calculator) {
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
    $scope.data.dutyDue = 0.00;
    $scope.data.propertyLocation = 'south';
    $scope.data.firstHome = false;

    // If we see changes on the model, lets recalculate the stamp duty.
    $scope.$watch('data', function(data) {
      // Get out of here if we don't have the absolute essentials
      if (Utils.isUndefinedOrNull(data.propertyValue) || Utils.isUndefinedOrNull(data.state)) {
        return;
      }
      // Set the model's total due. @todo: display itemised list of fees etc.
      data.dutyDue = Calculator.calculate(data.state, data);
    }, function() {});
  });
