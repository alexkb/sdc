'use strict';

/**
 * Presets a few things to help with development.
 * @type {boolean}
 */
var DEV_MODE = true;

/**
 * @todo
 * - Write tests for calculator output
 * - Directive or some kind of formatter for the property value (show as currency, but edit as number).
 * - Display itemised fees.
 */

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
        $scope.data.propertyState = locString;
      });
    });

    // Set more defaults:
    $scope.data.purpose = 'residential';
    $scope.data.propertyStatus = 'established';
    $scope.data.propertyLocation = 'south';
    $scope.data.firstHome = false;
    if (DEV_MODE) {
      $scope.data.propertyValue = 500000;
    }

    // If we see changes on the model, lets recalculate the stamp duty.
    $scope.$watch('data', function(data) {
      // Get out of here if we don't have the absolute essentials
      if (Utils.isUndefinedOrNull(data.propertyValue) || Utils.isUndefinedOrNull(data.propertyState)) {
        console.log('No property value or state provided.');
        return;
      }
      // Set the model's total due. @todo: display itemised list of fees etc.
      data.dutyDue = Calculator.calculate(data);
    }, function() {});
  });
