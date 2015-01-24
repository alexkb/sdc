'use strict';

/**
 * @ngdoc service
 * @name Sdc.calculator
 * @description
 * # calculator
 * Performs all the state specific duty calculations.
 */
angular.module('Sdc')
  .factory('Calculator', function () {
    return {
      calculate: function(propertyState, options) {
        // results.grant is an object that has optional properties.
        var results = {mortgageFee: 0, transferFee: 0, propertyDuty: 0, grants: {}, total: 0};

        switch (propertyState) {
          case 'ACT':
            this.processAct(options, results);
            break;
          case 'NSW':
            this.processNsw(options, results);
            break;
          case 'NT':
            this.processNt(options, results);
            break;
          case 'QLD':
            this.processQld(options, results);
            break;
          case 'SA':
            this.processSa(options, results);
            break;
          case 'TAS':
            this.processTas(options, results);
            break;
          case 'VIC':
            this.processVic(options, results);
            break;
          case 'WA':
            this.processWa(options, results);
            break;
          default:
            break;
        }

        if (results.total !== undefined) {
          return results.total;
        }
        else {
          return 0;
        }
      },

      /**
       * ACT
       */
      processAct: function(options, results) {
        if (options.purpose === 'residential') {
        }
        results.total = options.propertyValue + 100;
      },

      /**
       * NSW
       */
      processNsw: function(options, results) {
        if (options.purpose === 'residential') {
        }
        results.total = options.propertyValue + 200;
      },

      /**
       * NT
       */
      processNt: function(options, results) {
        if (options.purpose === 'residential') {
        }
        results.total = options.propertyValue + 300;
      },

      /**
       * QLD
       */
      processQld: function(options, results) {
        if (options.purpose === 'residential') {
        }
        results.total = options.propertyValue + 400;
      },

      /**
       * SA
       */
      processSa: function(options, results) {
        if (options.purpose === 'residential') {
        }
        results.total = options.propertyValue + 500;
      },

      /**
       * TAS
       */
      processTas: function(options, results) {
        if (options.purpose === 'residential') {
        }
        results.total = options.propertyValue + 600;
      },

      /**
       * VIC
       */
      processVic: function(options, results) {
        if (options.purpose === 'residential') {
        }
        results.total = options.propertyValue + 700;
      },

      /**
       * WA
       */
      processWa: function(options, results) {
        results.mortgage_fee = 160;
        results.transfer_fee = 160;
        results.duty = 0;

        if (options.purpose === 'residential') {
          if (options.propertyValue) {

          }
        }
        else {
        }

        results.total = results.duty + results.mortgage_fee + results.transfer_fee;

      }
    };
  });
