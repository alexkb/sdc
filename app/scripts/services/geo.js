'use strict';

/**
 * @ngdoc service
 * @name sdcApp.Geo
 * @description
 * # Geo
 * Factory in the sdcApp.
 */
angular.module('Sdc')
  .factory('Geo', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
