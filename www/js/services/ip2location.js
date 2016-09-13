'use strict';

/**
 * @ngdoc service
 * @name sdcApp.ip2location
 * @description
 * # Geo
 * Factory in the sdcApp.
 */
angular.module('Sdc')
  .factory('ip2location', function ($q, $http) {
    return {
      getRegion: function() {
        var q = $q.defer();

        $http({
          method: 'GET',
          url: 'https://freegeoip.net/json/'
        }).then(function successCallback(response) {
          if (response.data.region_code != undefined) {
            q.resolve(response.data.region_code);
          }
        });

        return q.promise;
      },
    };
  });
