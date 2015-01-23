'use strict';

/**
 * @ngdoc service
 * @name Sdc.calculator
 * @description
 * # calculator
 * Service in the Sdc.
 */
angular.module('Sdc')
  .factory('Calculator', function () {
    return {
      process: function(propertyState, data) {
        switch (propertyState) {
          case 'ACT':
            return this.calcAct(data);
          case 'NSW':
            return this.calcNsw(data);
          case 'NT':
            return this.calcNt(data);
          case 'QLD':
            return this.calcQld(data);
          case 'SA':
            return this.calcSa(data);
          case 'TAS':
            return this.calcTas(data);
          case 'VIC':
            return this.calcVic(data);
          case 'WA':
            return this.calcWa(data);
        }
      },
      calcAct: function(options) {
        if (options.purpose === 'residential') {
        }
        return options.propertyValue + 100;
      },
      calcNsw: function(options) {
        if (options.purpose === 'residential') {
        }
        return options.propertyValue + 200;
      },
      calcNt: function(options) {
        if (options.purpose === 'residential') {
        }
        return options.propertyValue + 300;
      },
      calcQld: function(options) {
        if (options.purpose === 'residential') {
        }
        return options.propertyValue + 400;
      },
      calcSa: function(options) {
        if (options.purpose === 'residential') {
        }
        return options.propertyValue + 500;
      },
      calcTas: function(options) {
        if (options.purpose === 'residential') {
        }
        return options.propertyValue + 600;
      },
      calcVic: function(options) {
        if (options.purpose === 'residential') {
        }
        return options.propertyValue + 700;
      },
      calcWa: function(options) {
        if (options.purpose === 'residential') {
        }
        return options.propertyValue + 800;
      },
    };
    // AngularJS will instantiate a singleton by calling "new" on this function
  });
