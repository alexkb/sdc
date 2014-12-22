'use strict';

/**
 * @ngdoc directive
 * @name sdcApp.directive:calculator
 * @description
 * # calculator
 */
angular.module('Sdc')
  .directive('calculator', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        console.log(attrs);
        element.text('this is the calculator directive');
      }
    };
  });
