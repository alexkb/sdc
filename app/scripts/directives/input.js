'use strict';

/**
 * @ngdoc directive
 * @name Sdc.directive:input
 * @description
 * # input
 * Based on https://github.com/mhartington/Ionic-Chat/blob/master/www/js/app.js
 */
angular.module('Sdc')
  .directive('input', function ($timeout) {
    return {
      restrict: 'E',
      scope: {
        'returnClose': '=',
        'onReturn': '&',
        'onFocus': '&',
        'onBlur': '&'
      },
      link: function(scope, element) {
        element.bind('focus', function(e) {
          if (scope.onFocus) {
            $timeout(function() {
              scope.onFocus(e);
            });
          }
        });
        element.bind('blur', function(e) {
          if (scope.onBlur) {
            $timeout(function() {
              scope.onBlur(e);
            });
          }
        });
        element.bind('keydown', function(e) {
          if (e.which === 13) {
            if (scope.returnClose) {
              element[0].blur();
            }

            if (scope.onReturn) {
              $timeout(function() {
                scope.onReturn();
              });
            }
          }
        });
      }
    };
  });
