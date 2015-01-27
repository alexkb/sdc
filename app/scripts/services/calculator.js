'use strict';

/**
 * @ngdoc service
 * @name Sdc.calculator
 * @description
 * # Calculator
 * Utils - custom utilities factory
 * $window - so we can use Math functions.
 * Performs all the state specific duty calculations.
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
      processNsw: function() {
        var results = {};
        return results;
      },

      /**
       * Process NT fees.
       * @returns results
       */
      processNt: function() {
        var results = {};
        return results;
      },

      /**
       * Process QLD fees.
       * @returns results
       */
      processQld: function() {
        var results = {};
        return results;
      },

      /**
       * Process SA fees.
       * @returns results
       */
      processSa: function() {
        var results = {};
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
        results.total = results.propertyDuty + results.mortgageFee + results.transferFee;
        results.total = $window.Math.round(results.total);

        return results;
      },

      /**
       * Process VIC fees.
       * @returns results
       */
      processVic: function() {
        var results = {};
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
        var results = {};
        results.mortgageFee = 160;
        results.transferFee = this.calcTransferFeeWA(propertyValue);
        var thresholds = [];

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
        results.total = results.propertyDuty + results.mortgageFee + results.transferFee;
        results.total = $window.Math.round(results.total);

        return results;
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
          if (propertyValue <= thresholds[i].max || thresholds[i].max === THRESHOLD_INF) {
            var remainder = propertyValue - thresholds[i].min;
            var denomination = Utils.isUndefinedOrNull(thresholds[i].denomination) ? 100 : thresholds[i].denomination;
            return thresholds[i].init + ((remainder / denomination) * thresholds[i].plus);
          }
        }
      }
    };
  });
