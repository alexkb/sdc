'use strict';

/**
 * @todo
 * - Write tests for calculator output
 * - Convert propertyValue field to a directive to encapsulate the formatting rules.
 * - And as always, make more angular-like as feedback comes in or I learn more in other projects (hopefully).
 */

/**
 * @ngdoc function
 * @name Sdc.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the Sdc
 */
angular.module('Sdc')
  .controller('MainCtrl', function ($scope, $filter, $localstorage, $ionicModal, $ionicPopover, Geo, Utils, Calculator) {
    $scope.version = '0.0.3';

    // Set defaults:
    $scope.data = {};
    $scope.data.propertyState = '';
    $scope.data.propertyValue = '';
    $scope.data.purpose = 'residential';
    $scope.data.propertyStatus = 'established';
    $scope.data.propertyLocation = 'south';
    $scope.data.firstHome = false;
    $scope.data.pensioner = false;
    $scope.data.paymentMethod = 'paper';

    $scope.flags = {};
    $scope.flags.changesMade = false; // Used to determine which button is shown in the footer.

    // Save the default for resetting when requested.
    $scope.dataDefaults = angular.copy($scope.data);

    // Initial History Array
    $scope.history = [];

    // Initial results Object
    $scope.results = {
      mortgageFee: 0,
      transferFee: 0,
      propertyDuty: 0,
      grants: {
        fhog: -1,
        nhg: -1,
        fhbb: -1
      },
      total: 0,
      calculateTime: 0
    };

    // Set form options
    $scope.stateOptions = [{name: 'ACT'}, {name: 'NSW'}, {name: 'NT'}, {name: 'QLD'}, {name: 'SA'}, {name: 'TAS'}, {name: 'VIC'}, {name: 'WA'}];

    // Set default state value based on geolocation service.
    Geo.getLocation().then(function (position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      Geo.reverseGeocode(lat, lng).then(function (locString) {
        $scope.data.propertyState = locString;
        $scope.dataDefaults.propertyState = locString;
      });
    });

    // If we see changes on the model, lets recalculate the stamp duty.
    $scope.$watch('data', function(data) {
      // Get out of here if we don't have the absolute essentials
      if (Utils.isUndefinedOrNull(data.propertyValue) || Utils.isUndefinedOrNull(data.propertyState)) {
        console.log('Missing required inputs: property value or state');
        return;
      }

      $scope.calculate();
    }, function() {});


    $scope.closeKeyboard = function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.close();
      }
    };

    /**
     * Performs stamp duty calculation using calculator service.
     */
    $scope.calculate = function() {
      console.log('Running calculate().');
      var cleansedPropertyValue = $scope.getPropertyValueCleansed();

      switch ($scope.data.propertyState) {
        case 'ACT':
          $scope.results = Calculator.processAct(cleansedPropertyValue, $scope.data.propertyStatus, $scope.data.purpose, $scope.data.firstHome, $scope.data.pensioner, $scope.data.income, $scope.data.propertyDependents);
          break;
        case 'NSW':
          $scope.results = Calculator.processNsw(cleansedPropertyValue, $scope.data.propertyStatus, $scope.data.purpose, $scope.data.firstHome);
          break;
        case 'NT':
          $scope.results = Calculator.processNt(cleansedPropertyValue, $scope.data.propertyStatus, $scope.data.purpose, $scope.data.firstHome, $scope.data.pensioner);
          break;
        case 'QLD':
          $scope.results = Calculator.processQld(cleansedPropertyValue, $scope.data.propertyStatus, $scope.data.purpose, $scope.data.firstHome);
          break;
        case 'SA':
          $scope.results = Calculator.processSa(cleansedPropertyValue, $scope.data.propertyStatus, $scope.data.purpose, $scope.data.firstHome);
          break;
        case 'TAS':
          $scope.results = Calculator.processTas(cleansedPropertyValue, $scope.data.propertyStatus, $scope.data.purpose, $scope.data.firstHome);
          break;
        case 'VIC':
          $scope.results = Calculator.processVic(cleansedPropertyValue, $scope.data.propertyStatus, $scope.data.purpose, $scope.data.firstHome, $scope.data.paymentMethod);
          break;
        case 'WA':
          $scope.results = Calculator.processWa(cleansedPropertyValue, $scope.data.propertyStatus, $scope.data.purpose, $scope.data.firstHome, $scope.data.propertyLocation);
          break;
        default:
          console.log('No valid property state selected.');
          break;
      }

      $scope.results.calculateTime = new Date();
      $scope.flags.changesMade = true;
    };

    /**
     * Called from view to format the property value into a more readable value, e.g. 500,000.
     * Help from:
     * http://stackoverflow.com/questions/9311258/how-do-i-replace-special-characters-with-regex-in-javascript
     */
    $scope.propertyValueFormatted = function() {
      var formattedValue = Utils.localeString($scope.getPropertyValueCleansed());

      // If the formatted value equates to zero (number or string), then lets set the model to an empty string so the user sees the placeholder again.
      if (formattedValue === 0 || formattedValue === '0') {
        $scope.data.propertyValue = '';
      }
      // Buf if the value isn't 0 and has changed since our last digest, then lets set it to the nicely formatted value :)
      else if (formattedValue !== $scope.data.propertyValue) {
        $scope.data.propertyValue = formattedValue;
      }
    };

    /**
     * Helper function to remove formatted characters in property Value.
     * @returns {string}
     */
    $scope.getPropertyValueCleansed = function() {
      return Number(String($scope.data.propertyValue).replace(/[^0-9]/g, '')); // remove the crud
    };

    /**
     * Store the model in localStorage for the purposes of allowing users to load them back in later.
     */
    $scope.storeHistory = function() {
      console.log('calling storeHistory().');
      var myHistory = $localstorage.getObject('history');
      if (Utils.isUndefinedOrNull(myHistory.items)) {
        myHistory.items = [];
      }
      myHistory.items.push({data: $scope.data, results: $scope.results});
      $localstorage.setObject('history', myHistory);
      $scope.flags.changesMade = false;
    };

    /**
     * Load the historical data into the modal.
     * @param index
     */
    $scope.loadHistory = function(index) {
      if ($scope.history[index]) {
        $scope.data = $scope.history[index].data;
        $scope.flags.changesMade = false;
      }

      $scope.prevResultsModal.hide();
    };

    /**
     * Menu for other operations.
     * @param event
     */
    $ionicPopover.fromTemplateUrl('views/menu.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.menuPopover = popover;
    });

    $scope.openMenuPopover = function($event) {
      $scope.menuPopover.show($event);
    };

    $scope.closePopover = function() {
      $scope.menuPopover.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.menuPopover.remove();
    });

    /**
     * Menu operation: 'Email results'
     * Function triggered by view to build an email of the results and send to the mail composer plugin.
     */
    $scope.emailResults = function() {
      if (window.cordova && window.cordova.plugins.email) {
        // Have tried a few different ways to do this better, but none succedd. Have asked here:
        // http://stackoverflow.com/questions/28646040/passing-an-angular-view-to-a-cordova-plugin-method
        var email = '<h1>Stamp Duty Calculator Results for ' + $scope.data.propertyState + '</h1><p><strong>Property Value:</strong> $' + $scope.data.propertyValue + '</p><p>Stamp duty on Property: ' +  $filter('currency')($scope.results.propertyDuty) + '<br />Mortgage registration fee: ' + $filter('currency')($scope.results.mortgageFee) + '<br />Transfer fee: ' + $filter('currency')($scope.results.transferFee) + '</p><p><strong>Total Government Fees:</strong> ' +  $filter('currency')($scope.results.total) + '</p><p>Calculated on: ' + $filter('date')($scope.results.calculateTime, 'd/M/yy h:mm a') + '.</p>';

        window.cordova.plugins.email.open({
          to: '',
          subject: 'Stamp duty estimate for $' + $scope.data.propertyValue,
          body: email,
          isHtml: true
        });
      }
      else {
        console.log('Email plugin not available');
      }
    };

    /**
     * Menu operation: 'Load previous'
     * Displays a model of the previous calculations for selection.
     */
    $ionicModal.fromTemplateUrl('views/previousResults.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.prevResultsModal = modal;
    });

    /**
     * Loads the history and shows the prev results popup modal.
     */
    $scope.loadHistoryOptions = function() {
      $scope.menuPopover.hide();
      var history = $localstorage.getObject('history');

      // Get up to the 10 latest recent changes to history
      if (history.items !== undefined) {
        $scope.history = [];

        for (var i = 0; i < history.items.length && i < 20; i++) {
          $scope.history[i] = history.items.pop();
        }
      }
      $scope.prevResultsModal.show();
    };

    $scope.closePrevResultsModal = function() {
      $scope.prevResultsModal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.prevResultsModal.remove();
    });

    /**
     * Menu operation: 'Reset'
     * Clears the form for a fresh start.
     */
    $scope.clearInputs = function() {
      $scope.data = angular.copy($scope.dataDefaults);
      $scope.flags.changesMade = false;
      $scope.menuPopover.hide();
    };

    /**
     * Menu operation: 'About;
     * Shows an about pane.
     */
    $ionicModal.fromTemplateUrl('views/about.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.aboutModal = modal;
    });

    $scope.about = function() {
      $scope.menuPopover.hide();
      $scope.aboutModal.show();
    };

    $scope.closeAboutModal = function() {
      $scope.aboutModal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.aboutModal.remove();
    });

  });
