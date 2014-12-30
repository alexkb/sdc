'use strict';

/**
 * @ngdoc service
 * @name sdcApp.Geo
 * @description
 * # Geo
 * Factory in the sdcApp. Loosly based on https://github.com/driftyco/ionic-weather/blob/master/www/js/services.js
 */
angular.module('Sdc')
  .factory('Geo', function ($q) {
    return {
      reverseGeocode: function(lat, lng) {
        var q = $q.defer();
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({
          'latLng': new google.maps.LatLng(lat, lng)
        }, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if(results.length > 1) {
              var r = results[1];
              var foundState = false;
              for(var i = 0; i < r.address_components.length && !foundState; i++) {
                if (r.address_components[i].types.indexOf("administrative_area_level_1") != -1) {
                  foundState = r.address_components[i].short_name;
                }
              }
              q.resolve(foundState);
            }
          } else {
            console.log('reverse fail', results, status);
            q.reject(results);
          }
        });

        return q.promise;
      },
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
