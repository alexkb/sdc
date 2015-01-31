'use strict';

/**
 * @ngdoc service
 * @name Sdc.calculator
 * @description Performs all the state specific duty calculations.
 * # Calculator
 * Utils - custom utilities factory
 * $window - so we can use Math functions.
 */
angular.module('Sdc')
  .factory('Calculator', function (Utils, $window) {
    var THRESHOLD_INF = -1; // temporary constant
    return {
      /**
       * Process ACT fees.
       * @returns results
       */
      processAct: function() {
        var results = {};
        return results;
      },

      /**
       * Process NSW fees.
       * @returns results
       */
      processNsw: function(propertyValue, propertyStatus, purpose, firstHome) {
        var results = {};
        results.mortgageFee = 107;
        results.transferFee = 214;
        var thresholds = [];

        if (firstHome === true && propertyStatus === 'newbuild' && purpose === 'residential' && propertyValue < 650000) {
          thresholds = [
            {min: 0, max: 550000, init: 0, plus: 0},
            {min: 550001, max:650000, sliding: {rate: 0.2474, subtract: 136070}}
          ];
        }
        else if (firstHome === true && propertyStatus === 'vacant' && purpose === 'residential' && propertyValue < 450000) {
          thresholds = [
            {min: 0, max: 350000, init: 0, plus: 0},
            {min: 350001, max: 450000, sliding: {rate: 0.1574, subtract: 55090}}
          ];
        }
        else {
          thresholds = [
            {min: 0, max: 14000, init: 0, plus: 1.25},
            {min: 14001, max: 30000, init: 175, plus: 1.5},
            {min: 30001, max: 80000, init: 415, plus: 1.75},
            {min: 80001, max: 300000, init: 1290, plus: 3.50},
            {min: 300001, max: 1000000, init: 8990, plus: 4.50},
            {min: 1000001, max: 3000000, init: 40490, plus: 5.50},
            {min: 3000001, max: THRESHOLD_INF, init: 150490, plus: 7}
          ];
        }

        results.propertyDuty = this.dutyByThreshold(propertyValue, thresholds);
        results.total = $window.Math.round( results.propertyDuty + results.mortgageFee + results.transferFee );

        return results;
      },

      /**
       * Process NT fees.
       * @returns results
       */
      processNt: function(propertyValue, propertyStatus, purpose, firstHome, pensioner) {
        var results = {};
        results.mortgageFee = 137;
        results.transferFee = 137;
        var thresholds = 0;
        var concession = 0;

        if (propertyValue < 525000) {

          var v = propertyValue/1000;
          results.propertyDuty = (0.06571441 * (v * v)) + (15 * v);
        }
        else {
          thresholds = [
            {min: 525000, max: 3000000, init: 0, plus: 4.95},
            {min: 3000001, max: THRESHOLD_INF, init: 0, plus: 5.45}
          ];

          results.propertyDuty = this.dutyByThreshold(propertyValue, thresholds);
        }

        if (pensioner === true) {
          concession = 8500;
        }
        else if (firstHome === false && purpose === 'residential' && propertyStatus !== 'established') {
          concession = 7000;
        }
        else if (firstHome === true && purpose === 'residential' && propertyStatus === 'established') {
          concession = 7000;
        }

        results.propertyDuty = results.propertyDuty <= concession ? 0 : (results.propertyDuty - concession);
        results.total = $window.Math.round( results.propertyDuty + results.mortgageFee + results.transferFee );
        return results;
      },

      /**
       * Process QLD fees. Note: due to unique sliding scale for first home buyers, the logic is slightly different to other states.
       * @param propertyValue
       * @param propertyStatus
       * @param purpose
       * @param firstHome
       * @returns results.
       */
      processQld: function(propertyValue, propertyStatus, purpose, firstHome) {
        var results = {};
        results.mortgageFee = 162.9;
        results.transferFee = this.calcTransferFeeQld(propertyValue);
        var thresholds = [];

        if (firstHome === true && propertyValue <= 500000 && propertyStatus !== 'vacant' && purpose === 'residential') {
          results.propertyDuty = 0;
        }
        else if (firstHome === true && propertyValue <= 250000 && propertyStatus === 'vacant' && purpose === 'residential') {
          results.propertyDuty = 0;
        }
        else if (purpose === 'residential') {
          var concession = 0;
          var concessionThresholds = [];

          if (firstHome === true && propertyStatus !== 'vacant') {
            concessionThresholds = [
              {max: 505000, discount: 8750},
              {max: 510000, discount: 7875},
              {max: 515000, discount: 7000},
              {max: 520000, discount: 6125},
              {max: 525000, discount: 5250},
              {max: 530000, discount: 4735},
              {max: 535000, discount: 3500},
              {max: 540000, discount: 2625},
              {max: 545000, discount: 1750},
              {max: 550000, discount: 875},
            ];
          }
          else if (firstHome === true && propertyStatus === 'vacant') {
            concessionThresholds = [
              {max: 260000, discount: 7175},
              {max: 270000, discount: 6700},
              {max: 280000, discount: 6225},
              {max: 290000, discount: 5750},
              {max: 300000, discount: 5275},
              {max: 310000, discount: 4800},
              {max: 320000, discount: 4325},
              {max: 330000, discount: 3850},
              {max: 340000, discount: 3375},
              {max: 350000, discount: 2900},
              {max: 360000, discount: 2425},
              {max: 370000, discount: 1950},
              {max: 380000, discount: 1475},
              {max: 390000, discount: 1000},
              {max: 400000, discount: 525},
            ];
          }

          if (concessionThresholds.length > 0) {
            concession = this.concessionByThreshold(propertyValue, concessionThresholds);
          }

          thresholds = [
            {min: 0, max: 350000, init: 0, plus: 1},
            {min: 350001, max: 540000, init: 3500, plus: 3.5},
            {min: 540001, max: 1000000, init: 10150, plus: 4.5},
            {min: 1000001, max: THRESHOLD_INF, init: 30850, plus: 5.75}
          ];

          results.propertyDuty = this.dutyByThreshold(propertyValue, thresholds) - concession;
        }
        else {
          thresholds = [
            {min: 0, max: 5000, init: 0},
            {min: 5001, max: 75000, init: 0, plus: 1.50},
            {min: 75001, max: 540000, init: 1050, plus: 3.5},
            {min: 540001, max: 1000000, init: 17325, plus: 4.5},
            {min: 1000000, max: THRESHOLD_INF, init: 38025, plus: 5.75}
          ];

          results.propertyDuty = this.dutyByThreshold(propertyValue, thresholds);
        }

        results.propertyDuty = results.propertyDuty;
        results.total =  results.propertyDuty + results.mortgageFee + results.transferFee;

        return results;
      },

      /**
       * Process SA fees.
       * @param propertyValue
       * @param propertyStatus
       * @param purpose
       * @param firstHome
       * @returns result
       */
      processSa: function(propertyValue, propertyStatus, purpose, firstHome) {
        var results = {};
        results.mortgageFee = 152;
        results.transferFee = this.calcTransferFeeSa(propertyValue);

        var thresholds = [
          {min: 0, max: 12000, init: 0, plus: 1},
          {min: 12001, max: 30000, init: 120, plus: 2},
          {min: 30001, max: 50000, init: 480, plus: 3},
          {min: 50001, max: 100000, init: 1080, plus: 3.5},
          {min: 200001, max: 250000, init: 6830, plus: 4.25},
          {min: 250001, max: 300000, init: 8955, plus: 4.75},
          {min: 300001, max: 500000, init: 11330, plus: 5},
          {min: 500001, max: THRESHOLD_INF, init: 21330, plus: 5.5},
        ];

        results.propertyDuty = this.dutyByThreshold(propertyValue, thresholds);
        results.total = $window.Math.round( results.propertyDuty + results.mortgageFee + results.transferFee );

        if (firstHome === true && propertyStatus !== 'established' && purpose === 'residential') {
          results.grant.fhog = 15000;
        }

        return results;
      },

      /**
       * Process TAS fees.
       * @param propertyValue
       * @returns results
       */
      processTas: function(propertyValue) {
        var results = {};
        results.mortgageFee = 126.54;
        results.transferFee = 192.88;

        var thresholds = [
          {min: 0, max: 3000, init: 50, plus: 0},
          {min: 3001, max: 25000, init: 50, plus: 1.75},
          {min: 25001, max: 75000, init: 435, plus: 2.25},
          {min: 75001, max: 200000, init: 1536, plus: 3.50},
          {min: 200001, max: 375000, init: 5935, plus: 4.35},
          {min: 375001, max: 725000, init: 12935, plus: 4.25},
          {min: 725001, max: THRESHOLD_INF, init: 27810, plus: 4.5},
        ];

        results.propertyDuty = this.dutyByThreshold(propertyValue, thresholds);
        results.total = $window.Math.round( results.propertyDuty + results.mortgageFee + results.transferFee );

        return results;
      },

      /**
       * Process VIC fees.
       * @param propertyValue
       * @param propertyStatus
       * @param purpose
       * @param firstHome
       * @param paymentMethod
       * @returns results
       */
      processVic: function(propertyValue, propertyStatus, purpose, firstHome, paymentMethod) {
        var thresholds = [];
        var results = {};
        results.mortgageFee = paymentMethod === 'paper' ? 110 : 87.60;
        results.transferFee = this.calcTransferFeeVic(propertyValue, paymentMethod);

        if (firstHome === true && propertyValue < 600000 && purpose === 'residential') {
          thresholds = [
            {min: 0, max: 25000, init: 0, plus: 1.4, discount: 0.5},
            {min: 25001, max: 130000, init: 350, plus: 2.4, discount: 0.5},
            {min: 130001, max: 440000, init: 2870, plus: 5, discount: 0.5},
            {min: 440001, max: 550000, init: 18370, plus: 6, discount: 0.5},
            {min: 550001, max: 600000, init: 28070, plus: 6, discount: 0.5},
          ];
        }
        else if (propertyValue > 130000 && propertyValue < 550000 && propertyStatus === 'residential') {
          thresholds = [
            {min: 130001, max: 440000, init: 2870, plus: 5},
            {min: 440001, max: 550000, init: 18370, plus: 6},
          ];
        }
        else {
          thresholds = [
            {min: 0, max: 25000, init: 0, plus: 1.4},
            {min: 25001, max: 130000, init: 350, plus: 2.4},
            {min: 130001, max: 960000, init: 2870, plus: 6},
            {min: 960001, max: THRESHOLD_INF, init: 0, plus: 5.5},
          ];
        }

        results.propertyDuty = this.dutyByThreshold(propertyValue, thresholds);
        results.total = $window.Math.round( results.propertyDuty + results.mortgageFee + results.transferFee );

        return results;
      },

      /**
       * Process WA fees.
       * @param propertyValue
       * @param propertyStatus
       * @param purpose
       * @param firstHome
       * @returns results
       */
      processWa: function(propertyValue, propertyStatus, purpose, firstHome) {
        var thresholds = [];
        var results = {};
        results.mortgageFee = 160;
        results.transferFee = this.calcTransferFeeWa(propertyValue);

        if (propertyValue <= 200000) {
          thresholds = [
            {min: 0, max: 100000, init: 0, plus: 1.50},
            {min: 100001, max: 200000, init: 1500, plus: 4.39}
          ];
        }
        if (firstHome === true && propertyValue <= 530000 && propertyStatus === 'established' && purpose === 'residential') {
          thresholds = [
            {min: 0, max: 430000, init: 0, plus: 0},
            {min: 430001, max: 530000, init: 0, plus: 19.19}
          ];
        }
        else if (firstHome === true && propertyValue <= 400000 && propertyStatus === 'vacant' && purpose === 'residential') {
          thresholds = [
            {min: 0, max: 300000, init: 0, plus: 0},
            {min: 300001, max: 400000, init: 0, plus: 13.01}
          ];
        }
        else {
          if (purpose === 'residential') {
            thresholds = [
              {min: 0, max: 120000, init: 0, plus: 1.90},
              {min: 120001, max: 150000, init: 2280, plus: 2.85},
              {min: 150001, max: 360000, init: 3135, plus: 3.80},
              {min: 360001, max: 725000, init: 11115, plus: 4.75},
              {min: 725001, max: THRESHOLD_INF, init: 28453, plus: 5.15},
            ];
          }
          else { // Investment
            thresholds = [
              {min: 0, max: 80000, init: 0, plus: 1.90},
              {min: 80001, max: 100000, init: 1520, plus: 2.85},
              {min: 100001, max: 250000, init: 2090, plus: 3.80},
              {min: 250001, max: 500000, init: 7790, plus: 4.75},
              {min: 500001, max: THRESHOLD_INF, init: 19665, plus: 5.15},
            ];
          }
        }

        results.propertyDuty = this.dutyByThreshold(propertyValue, thresholds);
        results.total = $window.Math.round( results.propertyDuty + results.mortgageFee + results.transferFee );

        return results;
      },

      /**
       * Calculate the transfer fee for WA
       * @param propertyValue
       */
      calcTransferFeeWa: function(propertyValue) {
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
       * Calculate the transfer fee for VIC
       * @param propertyValue
       * @param paymentMethod
       * @returns {*}
       */
      calcTransferFeeVic: function(propertyValue, paymentMethod) {
        var thresholds = [];

        if (paymentMethod === 'paper') {
          thresholds = [
            {min: 0, max: THRESHOLD_INF, init: 135.20, plus: 2.46, denomination: 1000, limit: 1366}
          ];
        }
        else {
          thresholds = [
            {min: 0, max: THRESHOLD_INF, init: 111.70, plus: 2.46, denomination: 1000, limit: 1342}
          ];
        }

        return this.dutyByThreshold(propertyValue, thresholds);
      },

      /**
       * Calculate the transfer fee for SA.
       * @param propertyValue
       * @returns Number
       */
      calcTransferFeeSa: function(propertyValue) {
        var thresholds = [
          {min: 0, max: 5000, init: 152, plus: 0},
          {min: 5001, max: 20000, init: 167, plus: 0},
          {min: 20001, max: 40000, init: 184, plus: 0},
          {min: 40001, max: 50000, init: 285, plus: 0},
          {min: 50001, max: THRESHOLD_INF, init: 285, plus: 75.5, denomination: 10000}
        ];

        return this.dutyByThreshold(propertyValue, thresholds);
      },

      /**
       * Calculate the transfer fee for QLD.
       * @param propertyValue
       * @returns Number
       */
      calcTransferFeeQld: function(propertyValue) {
        var thresholds = [
          {min: 0, max: 180000, init: 162.9},
          {min: 180001, max: THRESHOLD_INF, init: 162.9, plus: 30.80, denomination: 10000}
        ];

        return this.dutyByThreshold(propertyValue, thresholds);
      },

      /**
       * Calculate fee using a threshold table.
       * @param propertyValue
       * @param thresholds - array of threshold objects like so:
       *  {min: 0, max: 0, init: 0, plus: 0, denomination: 0, limit 0, discount: 0.0},
       */
      dutyByThreshold: function(propertyValue, thresholds) {
        for (var i = 0; i < thresholds.length; i++) {
          if (propertyValue <= thresholds[i].max || thresholds[i].max === THRESHOLD_INF) {
            if (!Utils.isUndefinedOrNull(thresholds[i].sliding)) {
              return propertyValue * thresholds[i].sliding.rate - thresholds[i].sliding.subtract;
            }

            // We take an extra 1 off the threshold[i].min (if it's not 0), as regs specify its for every denomination over the min INCLUSIVE.
            var remainder = propertyValue - thresholds[i].min - (thresholds[i].min > 0 ? 1 : 0);

            // Denominations are every 100's, but some regs are 1,000 and others are 10,000.
            var denomination = Utils.isUndefinedOrNull(thresholds[i].denomination) ? 100 : thresholds[i].denomination;

            // Set the plus value even if it hasn't been set, to make the duty calculation fail safe.
            var plus = Utils.isUndefinedOrNull(thresholds[i].plus) ? 0 : thresholds[i].plus;

            // The typical calculation for calculating duty. If the plus value isn't specified then the duty is essentially the initial value.
            var duty = thresholds[i].init + ((remainder / denomination) * plus);

            if (!Utils.isUndefinedOrNull(thresholds[i].limit) && duty > thresholds[i].limit) {
              return thresholds[i].limit;
            }

            if (!Utils.isUndefinedOrNull(thresholds[i].discount)) {
              return (duty * thresholds[i].discount);
            }

            return duty;
          } // if propertyValue is in range
        } // for()
      }, // dutyByThreshold

      /**
       * Basic function to return a discount value if propertyValue is within a certain range.
       * @param propertyValue
       * @param thresholds
       * @returns {number}
       */
      concessionByThreshold: function(propertyValue, thresholds) {
        for(var i = 0; i < thresholds.length; i++) {
          if (propertyValue < thresholds[i].max || thresholds[i].max === THRESHOLD_INF) {
            return thresholds[i].discount;
          }
        }

        return 0;
      }
    };
  });
