'use strict';

angular.module('Sdc').factory('ResultsModel', function($window, Utils, PropertyModel) {

  var results = {
    mortgageFee: 0,
    transferFee: 0,
    propertyDuty: 0,
    grants: {
      fhog: -1,
      nhg: -1,
      fhbb: -1
    },
    total: 0,
    totalPropertyCost: 0,
    calculateTime: 0
  };

  var resultsDefaults = angular.copy(results);

  return {
    results: results,

    resetToDefaults: function() {
      this.load(resultsDefaults);
    },

    load: function(newModel) {
      Object.keys(results).forEach(function(key) {
        if (newModel[key] !== undefined) {
          results[key] = newModel[key];
        }
      });

      results.total = $window.Math.round( results.propertyDuty + results.mortgageFee + results.transferFee );

      results.calculateTime = new Date();
      this.calculateTotalPropertyCost();
    },

    /**
     * Calculates the true cost of the property with fees and grants summed.
     * @param results
     * @returns {*}
     */
    calculateTotalPropertyCost: function() {
      var totalCost = PropertyModel.data.propertyValue + results.total; // results.total contains all fees

      if (!Utils.isUndefinedOrNull(results.grants.fhog) && results.grants.fhog !== -1) {
        totalCost -= results.grants.fhog;
      }

      if (!Utils.isUndefinedOrNull(this.results.grants.nhg) && results.grants.nhg !== -1) {
        totalCost -= results.grants.nhg;
      }

      if (!Utils.isUndefinedOrNull(results.grants.fhbb) && results.grants.fhbb !== -1) {
        totalCost -= results.grants.fhbb;
      }

      results.totalPropertyCost = totalCost;
    }
  };

});
