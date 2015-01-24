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
    var THRESHOLD_MAX_FLAG = -1; // temporary constant
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
       * Process WA
       * @param options
       * @param results
       */
      processWa: function(options, results) {
        results.mortgage_fee = 160;
        results.transfer_fee = 160;
        results.duty = 0;

        if (options.purpose === 'residential') {
          var thresholds = [
            {min: 0, max: 80000, init: 0, plus: 1.90},
            {min: 80001, max: 100000, init: 1520, plus: 2.85},
            {min: 100001, max: 250000, init: 2090, plus: 3.80},
            {min: 250001, max: 500000, init: 7790, plus: 4.75},
            {min: 500001, max: THRESHOLD_MAX_FLAG, init: 19665, plus: 5.15},
          ];
        }
        else {
          var thresholds = [
            {min: 0, max: 120000, init: 0, plus: 1.90},
            {min: 120001, max: 150000, init: 2280, plus: 2.85},
            {min: 150001, max: 360000, init: 3135, plus: 3.80},
            {min: 360001, max: 725000, init: 11115, plus: 4.75},
            {min: 725001, max: THRESHOLD_MAX_FLAG, init: 19665, plus: 5.15},
          ];
        }

        results.duty = this.dutyByThreshold(options.propertyValue, thresholds);

        results.total = results.duty + results.mortgage_fee + results.transfer_fee;

      },

      /**
       * Calculate duty using thresholds.
       * @param propertyValue
       * @param thresholds
       */
      dutyByThreshold: function(propertyValue, thresholds) {
        for (var i = 0; i < thresholds.length; i++) {
          if (propertyValue <= thresholds[i].max || thresholds[i].max == THRESHOLD_MAX_FLAG) {
            var remainder = propertyValue - thresholds[i].min;
            return thresholds[i].init + ((remainder / 100) * thresholds[i].plus);
          }
        }
      }
    };
  });
