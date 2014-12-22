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
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        Geo.getLocation().then(function(position) {
          var lat = position.coords.latitude;
          var lng = position.coords.longitude;
          console.log(lat + ' and ' + lng);
        });
        console.log(attrs);
        element.text('this is the calculator directive');
      }
    };
  });
