'use strict';

angular.module('Sdc').factory('ResultsModel', function(Utils) {

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

  return {
    results: results
  };

});
