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
  .factory('Calculator', function (Utils, $window, PropertyModel) {
    var THRESHOLD_INF = -1; // temporary constant
    return {
      getStates: function() {
        return [{name: 'ACT'}, {name: 'NSW'}, {name: 'NT'}, {name: 'QLD'}, {name: 'SA'}, {name: 'TAS'}, {name: 'VIC'}, {name: 'WA'}];
      },
      /**
       * Process ACT fees.
       * @returns {{}}
       */
      processAct: function() {
        var results = {grants: {}};
        results.mortgageFee = 125;
        results.transferFee = 243;
        var thresholds = [];

        if (PropertyModel.data.propertyValue < 550000 && PropertyModel.data.propertyStatus === 'newbuild' && PropertyModel.data.purpose === 'residential' && this.actConcessionMeansTestPass()) {
          thresholds = [
            {min: 0, max: 446100, init: 20, plus: 0}, // extra $100 to cover the min $20 fee.
            {min: 446101, max: 550000, init: 0, plus: 17.55}
          ];
        }
        else if (PropertyModel.data.propertyValue < 298300 && PropertyModel.data.propertyStatus === 'land' && PropertyModel.data.purpose === 'residential' && this.actConcessionMeansTestPass()) {
          thresholds = [
            {min: 0, max: 266800, init: 20, plus: 0}, // extra $100 to cover the min $20 fee.
            {min: 266800, max: 298300, init: 0, plus: 23.50}
          ];
        }
        else {
          thresholds = [
            {min: 0, max: 1000, init: 20, plus: 0},
            {min: 1001, max: 200000, init: 0, plus: 2},
            {min: 200001, max: 300001, init: 4000, plus: 3.5},
            {min: 300001, max: 500000, init: 7500, plus: 4.15},
            {min: 500001, max: 750001, init: 15800, plus: 5},
            {min: 750001, max: 1000000, init: 28300, plus: 6.5},
            {min: 1000001, max: 1455000, init: 44550, plus: 7},
            {min: 1455001, max: THRESHOLD_INF, init: 0, plus: 5.25}
          ];
        }

        if (PropertyModel.data.firstHome) {
          if (PropertyModel.data.propertyStatus !== 'established') {
            results.grants.fhog = 12500;
          }
          else {
            results.grants.fhog = 0;
          }
        }

        results.propertyDuty = this.dutyByThresholdRounded(thresholds);
        results.total = $window.Math.round( results.propertyDuty + results.mortgageFee + results.transferFee );

        return results;
      },

      /**
       * Mean tests the buyer for a concession in ACT
       * @returns {boolean}
       */
      actConcessionMeansTestPass: function() {
        if (Utils.isUndefinedOrNull(PropertyModel.data.income) || Utils.isUndefinedOrNull(PropertyModel.data.propertyDependents)) {
          return false;
        }

        var income = parseInt(PropertyModel.data.income);
        var propertyDependents = parseInt(PropertyModel.data.propertyDependents);

        if ((propertyDependents === 0 && income <= 160000) ||
          (propertyDependents === 1 && income <= 163330) ||
          (propertyDependents === 2 && income <= 166660) ||
          (propertyDependents === 3 && income <= 169990) ||
          (propertyDependents === 4 && income <= 173320) ||
          (propertyDependents >= 5 && income < 176650)) {
          return true;
        }
        return false;
      },

      /**
       * Process NSW fees.
       * @returns results
       */
      processNsw: function() {
        var results = {grants: {}};
        results.mortgageFee = 107;
        results.transferFee = 214;
        var thresholds = [];

        if (PropertyModel.data.firstHome && PropertyModel.data.propertyStatus === 'newbuild' && PropertyModel.data.purpose === 'residential' && PropertyModel.data.propertyValue < 650000) {
          thresholds = [
            {min: 0, max: 550000, init: 0, plus: 0},
            {min: 550001, max:650000, sliding: {rate: 0.2474, subtract: 136070}}
          ];
        }
        else if (PropertyModel.data.firstHome && PropertyModel.data.propertyStatus === 'vacant' && PropertyModel.data.purpose === 'residential' && PropertyModel.data.propertyValue < 450000) {
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

        if (PropertyModel.data.firstHome) {
          if (PropertyModel.data.purpose === 'residential' && PropertyModel.data.propertyStatus !== 'established') {
            results.grants.fhog = PropertyModel.data.propertyValue <= 750000 ? 15000 : 0;
            results.grants.nhg = ((PropertyModel.data.propertyStatus === 'land' && PropertyModel.data.propertyValue < 450000) || (PropertyModel.data.propertyStatus === 'newbuild' && PropertyModel.data.propertyValue < 650000)) ? 5000 : 0;
          }
          else {
            results.grants.fhog = 0;
            results.grants.nhg = 0;
          }
        }

        results.propertyDuty = this.dutyByThresholdRounded(thresholds);
        results.total = $window.Math.round(results.propertyDuty + results.mortgageFee + results.transferFee );

        return results;
      },

      /**
       * Process NT fees.
       * @returns results
       */
      processNt: function() {
        var results = {grants: {}};
        results.mortgageFee = 137;
        results.transferFee = 137;
        var thresholds = 0;
        var concession = 0;

        if (PropertyModel.data.propertyValue < 525000) {
          var v = PropertyModel.data.propertyValue/1000;
          results.propertyDuty = $window.Math.round( (0.06571441 * (v * v)) + (15 * v) );
        }
        else {
          thresholds = [
            {min: 525000, max: 3000000, init: 25988, plus: 4.95},
            {min: 3000001, max: THRESHOLD_INF, init: 163500, plus: 5.45}
          ];

          results.propertyDuty = this.dutyByThresholdRounded(thresholds);
        }

        if (PropertyModel.data.pensioner) {
          concession = 8500;
        }
        else if (PropertyModel.data.firstHome && PropertyModel.data.purpose === 'residential' && PropertyModel.data.propertyStatus !== 'established') {
          concession = 7000;
        }
        else if (PropertyModel.data.firstHome && PropertyModel.data.purpose === 'residential' && PropertyModel.data.propertyStatus === 'established') {
          concession = 0;
        }

        results.grants.fhog = PropertyModel.data.firstHome && PropertyModel.data.purpose === 'residential' && PropertyModel.data.propertyStatus !== 'established' ? 26000 : 0;

        results.propertyDuty = results.propertyDuty <= concession ? 0 : (results.propertyDuty - concession);
        results.total = $window.Math.round( results.propertyDuty + results.mortgageFee + results.transferFee );
        return results;
      },

      /**
       * Process QLD fees. Note: due to unique sliding scale for first home buyers, the logic is slightly different to other states.
       * @returns results.
       */
      processQld: function() {
        var results = {grants: {}};
        results.mortgageFee = 168.6;
        results.transferFee = this.calcTransferFeeQld();
        var thresholds = [];

        if (PropertyModel.data.firstHome && PropertyModel.data.propertyValue <= 500000 && PropertyModel.data.propertyStatus !== 'vacant' && PropertyModel.data.purpose === 'residential') {
          results.propertyDuty = 0;
        }
        else if (PropertyModel.data.firstHome && PropertyModel.data.propertyValue <= 250000 && PropertyModel.data.propertyStatus === 'vacant' && PropertyModel.data.purpose === 'residential') {
          results.propertyDuty = 0;
        }
        else if (PropertyModel.data.purpose === 'residential') {
          var concession = 0;
          var concessionThresholds = [];

          if (PropertyModel.data.firstHome && PropertyModel.data.propertyStatus !== 'vacant') {
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
          else if (PropertyModel.data.firstHome && PropertyModel.data.propertyStatus === 'vacant') {
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
            concession = this.concessionByThreshold(concessionThresholds);
          }

          thresholds = [
            {min: 0, max: 350000, init: 0, plus: 1},
            {min: 350001, max: 540000, init: 3500, plus: 3.5},
            {min: 540001, max: 1000000, init: 10150, plus: 4.5},
            {min: 1000001, max: THRESHOLD_INF, init: 30850, plus: 5.75}
          ];

          results.propertyDuty = this.dutyByThresholdRounded(thresholds) - concession;
        }
        else {
          thresholds = [
            {min: 0, max: 5000, init: 0},
            {min: 5001, max: 75000, init: 0, plus: 1.50},
            {min: 75001, max: 540000, init: 1050, plus: 3.5},
            {min: 540001, max: 1000000, init: 17325, plus: 4.5},
            {min: 1000000, max: THRESHOLD_INF, init: 38025, plus: 5.75}
          ];

          results.propertyDuty = this.dutyByThresholdRounded(thresholds);
        }

        results.grants.fhog = PropertyModel.data.firstHome && PropertyModel.data.propertyValue <= 750000 && PropertyModel.data.purpose === 'residential' && PropertyModel.data.propertyStatus === 'newhome' ? 15000 : 0;
        results.propertyDuty = results.propertyDuty;
        results.total =  results.propertyDuty + results.mortgageFee + results.transferFee;

        return results;
      },

      /**
       * Process SA fees.
       * @returns result
       */
      processSa: function() {
        var results = {grants: {}};
        results.mortgageFee = 152;
        results.transferFee = this.calcTransferFeeSa();

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

        results.grants.fhog = PropertyModel.data.firstHome && PropertyModel.data.propertyStatus !== 'established' && PropertyModel.data.purpose === 'residential' ? 15000 : 0;
        results.propertyDuty = this.dutyByThresholdRounded(thresholds);
        results.total = $window.Math.round( results.propertyDuty + results.mortgageFee + results.transferFee );

        return results;
      },

      /**
       * Process TAS fees.
       * @returns results
       */
      processTas: function() {
        var results = {grants: {}};
        results.mortgageFee = 126.54;
        results.transferFee = 192.88;

        var thresholds = [
          {min: 0, max: 3000, init: 50, plus: 0},
          {min: 3001, max: 25000, init: 50, plus: 1.75},
          {min: 25001, max: 75000, init: 435, plus: 2.25},
          {min: 75001, max: 200000, init: 1560, plus: 3.50},
          {min: 200001, max: 375000, init: 5935, plus: 4},
          {min: 375001, max: 725000, init: 12935, plus: 4.25},
          {min: 725001, max: THRESHOLD_INF, init: 27810, plus: 4.5},
        ];

        results.grants.fhog = PropertyModel.data.firstHome && PropertyModel.data.propertyStatus !== 'established' && PropertyModel.data.purpose === 'residential' ? 7000 : 0;
        results.grants.fhbb = PropertyModel.data.firstHome && PropertyModel.data.propertyStatus === 'newhome' && PropertyModel.data.purpose === 'residential' ? 20000 : 0;
        results.propertyDuty = this.dutyByThresholdRounded(thresholds);
        results.total = $window.Math.round( results.propertyDuty + results.mortgageFee + results.transferFee );

        return results;
      },

      /**
       * Process VIC fees.
       * @returns results
       */
      processVic: function() {
        var results = {grants: {}};
        var thresholds = [];
        results.mortgageFee = PropertyModel.data.paymentMethod === 'paper' ? 110 : 87.60;
        results.transferFee = this.calcTransferFeeVic();

        if (PropertyModel.data.firstHome && PropertyModel.data.propertyValue <= 600000 && PropertyModel.data.purpose === 'residential') {
          thresholds = [
            {min: 0, max: 25000, init: 0, plus: 1.4, discount: 0.5},
            {min: 25001, max: 130000, init: 350, plus: 2.4, discount: 0.5},
            {min: 130001, max: 440000, init: 2870, plus: 5, discount: 0.5},
            {min: 440001, max: 550000, init: 18370, plus: 6, discount: 0.5},
            {min: 550001, max: 600000, init: 28070, plus: 6, discount: 0.5},
          ];
        }
        else if (PropertyModel.data.propertyValue > 130000 && PropertyModel.data.propertyValue <= 550000 && PropertyModel.data.purpose === 'residential') {
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
            {min: 960001, max: THRESHOLD_INF, init: 52800, plus: 5.5},
          ];
        }

        results.grants.fhog = (PropertyModel.data.firstHome && PropertyModel.data.propertyStatus !== 'established' && PropertyModel.data.purpose === 'residential' && PropertyModel.data.propertyValue <= 750000) ? 10000 : 0;
        results.propertyDuty = this.dutyByThresholdRounded(thresholds);
        results.total = $window.Math.round( results.propertyDuty + results.mortgageFee + results.transferFee );

        return results;
      },

      /**
       * Process WA fees.
       * @returns results
       */
      processWa: function() {
        var results = {grants: {}};
        var thresholds = [];
        results.grants = {};
        results.mortgageFee = 160;
        results.transferFee = this.calcTransferFeeWa();

        if (PropertyModel.data.propertyValue <= 200000) {
          thresholds = [
            {min: 0, max: 100000, init: 0, plus: 1.50},
            {min: 100001, max: 200000, init: 1500, plus: 4.39}
          ];
        }
        if (PropertyModel.data.firstHome && PropertyModel.data.propertyValue <= 530000 && PropertyModel.data.propertyStatus === 'established' && PropertyModel.data.purpose === 'residential') {
          thresholds = [
            {min: 0, max: 430000, init: 0, plus: 0},
            {min: 430001, max: 530000, init: 0, plus: 19.19}
          ];
        }
        else if (PropertyModel.data.firstHome && PropertyModel.data.propertyValue <= 400000 && PropertyModel.data.propertyStatus === 'vacant' && PropertyModel.data.purpose === 'residential') {
          thresholds = [
            {min: 0, max: 300000, init: 0, plus: 0},
            {min: 300001, max: 400000, init: 0, plus: 13.01}
          ];
        }
        else {
          if (PropertyModel.data.purpose === 'residential') {
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

        if (PropertyModel.data.firstHome) {
          results.grants.fhog = (PropertyModel.data.propertyStatus === 'established') ? 3000 : 10000;

          if (PropertyModel.data.propertyLocation === 'south' && PropertyModel.data.propertyValue > 750000) {
            results.grants.fhog = 0;
          }
          else if (PropertyModel.data.propertyLocation === 'north' && PropertyModel.data.propertyValue > 1000000) {
            results.grants.fhog = 0;
          }
        }

        results.propertyDuty = this.dutyByThresholdRounded(thresholds);
        results.total = $window.Math.round( results.propertyDuty + results.mortgageFee + results.transferFee );

        return results;
      },

      /**
       * Calculate the transfer fee for WA
       */
      calcTransferFeeWa: function() {
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

        return this.dutyByThresholdRounded(thresholds);
      },

      /**
       * Calculate the transfer fee for VIC
       * @param propertyValue
       * @param paymentMethod
       * @returns {*}
       */
      calcTransferFeeVic: function() {
        var thresholds = [];

        if (PropertyModel.data.paymentMethod === 'paper') {
          thresholds = [
            {min: 0, max: THRESHOLD_INF, init: 135.20, plus: 2.46, denomination: 1000, limit: 1366}
          ];
        }
        else {
          thresholds = [
            {min: 0, max: THRESHOLD_INF, init: 111.70, plus: 2.46, denomination: 1000, limit: 1342}
          ];
        }

        return this.dutyByThresholdRounded(thresholds);
      },

      /**
       * Calculate the transfer fee for SA.
       * @returns Number
       */
      calcTransferFeeSa: function() {
        var thresholds = [
          {min: 0, max: 5000, init: 152, plus: 0},
          {min: 5001, max: 20000, init: 167, plus: 0},
          {min: 20001, max: 40000, init: 184, plus: 0},
          {min: 40001, max: 50000, init: 285, plus: 0},
          {min: 50001, max: THRESHOLD_INF, init: 285, plus: 75.5, denomination: 10000}
        ];

        return this.dutyByThresholdRounded(thresholds);
      },

      /**
       * Calculate the transfer fee for QLD.
       * @returns Number
       */
      calcTransferFeeQld: function() {
        var thresholds = [
          {min: 0, max: 180000, init: 168.6},
          {min: 180001, max: THRESHOLD_INF, init: 168.6, plus: 31.80, denomination: 10000}
        ];

        return this.dutyByThresholdRounded(thresholds);
      },

      /**
       * Calculate fee using a threshold table.
       * @param thresholds - array of threshold objects like so:
       *  {min: 0, max: 0, init: 0, plus: 0, denomination: 0, limit 0, discount: 0.0},
       */
      dutyByThreshold: function(thresholds) {
        for (var i = 0; i < thresholds.length; i++) {
          if (PropertyModel.data.propertyValue <= thresholds[i].max || thresholds[i].max === THRESHOLD_INF) {
            if (!Utils.isUndefinedOrNull(thresholds[i].sliding)) {
              return PropertyModel.data.propertyValue * thresholds[i].sliding.rate - thresholds[i].sliding.subtract;
            }

            // We take an extra 1 off the threshold[i].min (if it's not 0), as regs specify its for every denomination over the min INCLUSIVE.
            var remainder = PropertyModel.data.propertyValue - thresholds[i].min - (thresholds[i].min > 0 ? 1 : 0);

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
       * Wrapper for dutyByThresholdRounded().
       * @param thresholds
       * @returns {number}
       */
      dutyByThresholdRounded: function(thresholds) {
        return $window.Math.round(this.dutyByThreshold(thresholds));
      },

      /**
       * Basic function to return a discount value if propertyValue is within a certain range.
       * @param thresholds
       * @returns {number}
       */
      concessionByThreshold: function(thresholds) {
        for(var i = 0; i < thresholds.length; i++) {
          if (PropertyModel.data.propertyValue < thresholds[i].max || thresholds[i].max === THRESHOLD_INF) {
            return thresholds[i].discount;
          }
        }

        return 0;
      },

      /**
       * Calculates the true cost of the property with fees and grants summed.
       * @param results
       * @returns {*}
       */
      calculateTotalPropertyCost: function(results) {
        var totalCost = PropertyModel.data.propertyValue + results.total; // results.total contains all fees

        if (!Utils.isUndefinedOrNull(results.grants.fhog) && results.grants.fhog !== -1) {
          totalCost -= results.grants.fhog;
        }

        if (!Utils.isUndefinedOrNull(results.grants.nhg) && results.grants.nhg !== -1) {
          totalCost -= results.grants.nhg;
        }

        if (!Utils.isUndefinedOrNull(results.grants.fhbb) && results.grants.fhbb !== -1) {
          totalCost -= results.grants.fhbb;
        }

        return totalCost;
      }
    };
  });




