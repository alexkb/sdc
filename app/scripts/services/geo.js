'use strict';

/**
 * @ngdoc service
 * @name sdcApp.Geo
 * @description
 * # Geo
 * Factory in the sdcApp.
 */
angular.module('Sdc')
  .factory('Geo', function ($q) {
    return {
      getLocation: function() {
        var q = $q.defer();

        navigator.geolocation.getCurrentPosition(function(position) {
          q.resolve(position);
        }, function(error) {
          q.reject(error);
        });

        return q.promise;
      }
    };
  });
