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
    //$scope.data = appData;
    $scope.data = {};

    // Set default State on load based on geolocation service.
    Geo.getLocation().then(function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      Geo.reverseGeocode(lat, lng).then(function(locString) {
        $scope.data.state = locString;
      });
    });

    $scope.calculateDutyDue = function() {
      //console.log(appData);
      //return appData.propertyValue + 10;

    };
  });
