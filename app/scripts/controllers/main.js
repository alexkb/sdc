'use strict';

/**
 * @todo
 * - Write tests for calculator output
 * - Convert propertyValue field to a directive to encapsulate the formatting rules.
 * - Display itemised fees.
 * - Calculate grants and add it to the results.
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
    $scope.results = {mortgageFee: 0, transferFee: 0, propertyDuty: 0, grants: {}, total: 0};

    // Set defaults:
    $scope.data.propertyValue = '';
    $scope.data.purpose = 'residential';
    $scope.data.propertyStatus = 'established';
    $scope.data.propertyLocation = 'south';
    $scope.data.firstHome = false;
    $scope.data.paymentMethod = 'paper';
    // results.grant is an object that has optional properties.

    // Set form options
    $scope.stateOptions = [{name: 'NSW'}, {name: 'SA'}, {name: 'TAS'}, {name: 'VIC'}, {name: 'WA'}];

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
        console.log('Missing required inputs: property value or state');
        return;
      }

      console.log('Watch about to call calculate()');
      $scope.calculate();

    }, function() {});

    /**
     * Performs stamp duty calculation using calculator service.
     */
    $scope.calculate = function() {

      switch ($scope.data.propertyState) {
        case 'NSW':
          $scope.results = Calculator.processNsw($scope.propertyValueCleansed(), $scope.data.propertyStatus, $scope.data.purpose, $scope.data.firstHome);
          break;
        case 'SA':
          $scope.results = Calculator.processSa($scope.propertyValueCleansed(), $scope.data.propertyStatus, $scope.data.purpose, $scope.data.firstHome);
          break;
        case 'VIC':
          $scope.results = Calculator.processVic($scope.propertyValueCleansed(), $scope.data.propertyStatus, $scope.data.purpose, $scope.data.firstHome, $scope.data.paymentMethod);
          break;
        case 'WA':
          $scope.results = Calculator.processWa($scope.propertyValueCleansed(), $scope.data.propertyStatus, $scope.data.purpose, $scope.data.firstHome);
          break;
        case 'TAS':
          $scope.results = Calculator.processTas($scope.propertyValueCleansed());
          break;
        default:
          console.log('No valid property state selected.');
          break;
      }
    };

    /**
     * Called from view to format the property value into a more readable value, e.g. 500,000.
     * Help from:
     * http://stackoverflow.com/questions/9311258/how-do-i-replace-special-characters-with-regex-in-javascript
     */
    $scope.propertyValueFormatted = function() {
      var formattedValue = $scope.propertyValueCleansed().toLocaleString('en');

      // If the formatted value equates to zero (number or string), then lets set the model to an empty string so the user sees the placeholder again.
      if (formattedValue === 0 || formattedValue === '0') {
        $scope.data.propertyValue = '';
      }
      // Buf if the value isn't 0 and has changed since our last digest, then lets set it to the nicely formatted value :)
      else if (formattedValue !== $scope.data.propertyValue) {
        $scope.data.propertyValue = formattedValue;
      }
    };

    /**
     * Helper function to remove formatted characters in property Value.
     * @returns {string}
     */
    $scope.propertyValueCleansed = function() {
      return Number(String($scope.data.propertyValue).replace(/[^0-9.]/g, '')); // remove the crud
    };
  });
