'use strict';

/**
 * @ngdoc service
 * @name Sdc.calculator
 * @description
 * # calculator
 * Performs all the state specific duty calculations.
 */
angular.module('Sdc')
  .factory('Calculator', function (Utils) {
    var THRESHOLD_INF = -1; // temporary constant
    return {
      calculate: function(data) {
        // results.grant is an object that has optional properties.
        var results = {mortgageFee: 0, transferFee: 0, propertyDuty: 0, grants: {}, total: 0};

        switch (data.propertyState) {
          case 'ACT':
            this.processAct(data, results);
            break;
          case 'NSW':
            this.processNsw(data, results);
            break;
          case 'NT':
            this.processNt(data, results);
            break;
          case 'QLD':
            this.processQld(data, results);
            break;
          case 'SA':
            this.processSa(data, results);
            break;
          case 'TAS':
            this.processTas(data, results);
            break;
          case 'VIC':
            this.processVic(data, results);
            break;
          case 'WA':
            this.processWa(data, results);
            break;
          default:
            console.log('No valid property state selected.');
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
       * Process ACT fees.
       * @param data
       * @param results
       */
      processAct: function(data, results) {
        if (data.purpose === 'residential') {
        }
        results.total = data.propertyValue + 100;
      },

      /**
       * Process NSW fees.
       * @param data
       * @param results
       */
      processNsw: function(data, results) {
        if (data.purpose === 'residential') {
        }
        results.total = data.propertyValue + 200;
      },

      /**
       * Process NT fees.
       * @param data
       * @param results
       */
      processNt: function(data, results) {
        if (data.purpose === 'residential') {
        }
        results.total = data.propertyValue + 300;
      },

      /**
       * Process QLD fees.
       * @param data
       * @param results
       */
      processQld: function(data, results) {
        if (data.purpose === 'residential') {
        }
        results.total = data.propertyValue + 400;
      },

      /**
       * Process SA fees.
       * @param data
       * @param results
       */
      processSa: function(data, results) {
        if (data.purpose === 'residential') {
        }
        results.total = data.propertyValue + 500;
      },

      /**
       * Process TAS fees.
       * @param data
       * @param results
       */
      processTas: function(data, results) {
        if (data.purpose === 'residential') {
        }
        results.total = data.propertyValue + 600;
      },

      /**
       * Process VIC fees.
       * @param data
       * @param results
       */
      processVic: function(data, results) {
        if (data.purpose === 'residential') {
        }
        results.total = data.propertyValue + 700;
      },

      /**
       * Process WA fees.
       * @param data
       * @param results
       */
      processWa: function(data, results) {
        results.mortgage_fee = 160;
        results.transfer_fee = this.calcTransferFeeWA(data.propertyValue);
        results.duty = 0;

        if (data.propertyValue <= 200000) {
          var thresholds = [
            {min: 0, max: 100000, init: 0, plus: 1.50},
            {min: 100001, max: 200000, init: 1500, plus: 4.39}
          ];
        }
        if (data.firstHome == true && data.propertyValue <= 530000 && data.propertyStatus == "established") {
          var thresholds = [
            {min: 0, max: 430000, init: 0, plus: 0},
            {min: 430001, max: 530000, init: 0, plus: 19.19}
          ];
        }
        else if (data.firstHome == true && data.propertyValue <= 400000 && data.propertyStatus == "vacant") {
          var thresholds = [
            {min: 0, max: 300000, init: 0, plus: 0},
            {min: 300001, max: 400000, init: 0, plus: 13.01}
          ];
        }
        else {
          if (data.purpose === 'residential') {
            var thresholds = [
              {min: 0, max: 80000, init: 0, plus: 1.90},
              {min: 80001, max: 100000, init: 1520, plus: 2.85},
              {min: 100001, max: 250000, init: 2090, plus: 3.80},
              {min: 250001, max: 500000, init: 7790, plus: 4.75},
              {min: 500001, max: THRESHOLD_INF, init: 19665, plus: 5.15},
            ];
          }
          else { // Investment
            var thresholds = [
              {min: 0, max: 120000, init: 0, plus: 1.90},
              {min: 120001, max: 150000, init: 2280, plus: 2.85},
              {min: 150001, max: 360000, init: 3135, plus: 3.80},
              {min: 360001, max: 725000, init: 11115, plus: 4.75},
              {min: 725001, max: THRESHOLD_INF, init: 19665, plus: 5.15},
            ];
          }
        }

        results.duty = this.dutyByThreshold(data.propertyValue, thresholds);
        results.total = results.duty + results.mortgage_fee + results.transfer_fee;
        console.log(results);
      },

      /**
       * Calculate the transfer fee for WA
       * @param propertyValue
       */
      calcTransferFeeWA: function(propertyValue) {
        var thresholds = [
          {min: 0, max: 85000, init: 160, plus: 0},
          {min: 85001, max: 120000, init: 170, plus: 0},
          {min: 120001, max: 200000, init: 190, plus: 0},
          {min: 200001, max: 300000, init: 210, plus: 0},
          {min: 300001, max: 400000, init: 230, plus: 0},
          {min: 400001, max: 500000, init: 250, plus: 0},
          {min: 500001, max: 600000, init: 270, plus: 0},
          {min: 600001, max: 700000, init: 290, plus: 0},
          {min: 700001, max: 800000, init: 310, plus: 0},
          {min: 800001, max: 900000, init: 330, plus: 0},
          {min: 900001, max: 1000000, init: 350, plus: 0},
          {min: 1000001, max: 1100000, init: 370, plus: 0},
          {min: 1100001, max: 1200000, init: 390, plus: 0},
          {min: 1200001, max: 1300000, init: 410, plus: 0},
          {min: 1300001, max: 1400000, init: 430, plus: 0},
          {min: 1400001, max: 1500000, init: 450, plus: 0},
          {min: 1500001, max: 1600000, init: 470, plus: 0},
          {min: 1600001, max: 1700000, init: 490, plus: 0},
          {min: 1700001, max: 1800000, init: 510, plus: 0},
          {min: 1800001, max: 1900000, init: 530, plus: 0},
          {min: 1900001, max: 2000000, init: 550, plus: 0},
          {min: 2000001, max: THRESHOLD_INF, init: 550, plus: 20, denomination: 100000},
        ];

        return this.dutyByThreshold(propertyValue, thresholds);
      },

      /**
       * Calculate fee using a threshold table.
       * @param propertyValue
       * @param thresholds
       */
      dutyByThreshold: function(propertyValue, thresholds) {
        for (var i = 0; i < thresholds.length; i++) {
          if (propertyValue <= thresholds[i].max || thresholds[i].max == THRESHOLD_INF) {
            var remainder = propertyValue - thresholds[i].min;
            var denomination = Utils.isUndefinedOrNull(thresholds[i].denomination) ? 100 : thresholds[i].denomination;
            return thresholds[i].init + ((remainder / denomination) * thresholds[i].plus);
          }
        }
      }
    };
  });
