'use strict';

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

    // Set defaults:
    $scope.data.purpose = 'residential';
    $scope.data.propertyStatus = 'established';
    $scope.data.propertyLocation = 'south';
    $scope.data.firstHome = false;
    $scope.data.propertyValue = 500000;
    $scope.data.results = {mortgageFee: 0, transferFee: 0, propertyDuty: 0, grants: {}, total: 0};
    // results.grant is an object that has optional properties.

    // Set form options
    $scope.stateOptions = [{name: 'TAS'}, {name: 'VIC'}, {name: 'WA'}];

    // Set default state value based on geolocation service.
    Geo.getLocation().then(function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      Geo.reverseGeocode(lat, lng).then(function(locString) {
        $scope.data.propertyState = locString;
      });
    });

    // If we see changes on the model, lets recalculate the stamp duty.
    $scope.$watch('data', function(data) {
      // Get out of here if we don't have the absolute essentials
      if (Utils.isUndefinedOrNull(data.propertyValue) || Utils.isUndefinedOrNull(data.propertyState)) {
        console.log('No property value or state provided.');
        return;
      }

      $scope.calculate();

    }, function() {});

    /**
     * Performs stamp duty calculation using calculator service.
     */
    $scope.calculate = function() {
      switch ($scope.data.propertyState) {
        case 'WA':
          $scope.data.results = Calculator.processWa($scope.data.propertyValue, $scope.data.propertyStatus, $scope.data.purpose, $scope.data.firstHome);
          break;
        case 'TAS':
          $scope.data.results = Calculator.processTas($scope.data.propertyValue);
          break;
        default:
          console.log('No valid property state selected.');
          break;
      }
    };
  });
