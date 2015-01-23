'use strict';

/**
 * @ngdoc function
 * @name sdcApp.controller:MainctrlCtrl
 * @description
 * # MainctrlCtrl
 * Controller of the sdcApp
 */
angular.module('Sdc')
  .controller('MainCtrl', function ($scope, appData) {
    $scope.data = appData;

    $scope.calculateDutyDue = function() {
      return appData.propertyValue + 10;
    };
  });
