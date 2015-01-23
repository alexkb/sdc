'use strict';

/**
 * @ngdoc directive
 * @name sdcApp.directive:calculator
 * @description
 * # calculator
 */
angular.module('Sdc')
  .directive('calculator', function (appData) {
    return {
      restrict: 'E',
      link: function postLink($scope, element, attrs) {

        console.log(attrs);
        console.log($scope.data);
        console.log(appData);
        //$scopedata.dutyDue = 100;
        //console.log(appData);
        //appData = $scope.data;
        //$scope.data = appData;
        //element.text('this is the calculator directive' + $scope.locString);
      }
    };
  });
