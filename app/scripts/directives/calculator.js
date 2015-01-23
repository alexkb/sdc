'use strict';

/**
 * @ngdoc directive
 * @name sdcApp.directive:calculator
 * @description
 * # calculator
 */
angular.module('Sdc')
  .directive('calculator', function (Geo) {
    return {
      restrict: 'E',
      link: function postLink($scope, element, attrs) {
        Geo.getLocation().then(function(position) {
          var lat = position.coords.latitude;
          var lng = position.coords.longitude;
          Geo.reverseGeocode(lat, lng).then(function(locString) {
            console.log(locString);
            $scope.locString = locString;
          });
        });
        console.log(attrs);
        //console.log(appData);
        //appData = $scope.data;
        //$scope.data = appData;
        //element.text('this is the calculator directive' + $scope.locString);
      }
    };
  });
