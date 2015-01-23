'use strict';

/**
 * @ngdoc service
 * @name sdcApp.Utils
 * @description
 * # Utils
 * Service in the sdcApp.
 */
angular.module('Sdc')
  .factory('Utils', function () {
    // Help from: http://stackoverflow.com/a/17910655/687274
    var service = {
      isUndefinedOrNull: function(obj) {
        return !angular.isDefined(obj) || obj===null;
      }
    };

    return service;
  });
