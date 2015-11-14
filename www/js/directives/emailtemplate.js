'use strict';

/**
 * @ngdoc directive
 * @name sdcApp.directive:emailTemplate
 * @description
 * # emailTemplate
 */
angular.module('Sdc')
  .directive('emailTemplate', function () {
    return {
      templateUrl: '/views/emailtemplate.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the emailTemplate directive' + attrs);
      }
    };
  });

