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
  .controller('MainCtrl', function ($scope, $filter, $localstorage, $ionicModal, $ionicPopover, ip2location, Utils, Calculator, PropertyModel, ResultsModel) {

    $scope.data = PropertyModel.data;
    $scope.results = ResultsModel.results;

    $scope.flags = {};
    $scope.flags.changesMade = false; // Used to determine which button is shown in the footer.

    // Initial History Array
    $scope.history = [];

    // Set form options
    $scope.stateOptions = Calculator.getStates();

    // Version variable used in about us view.
    $scope.version = '0.0.7';

    function onReady() {
      // Set default state value based on geolocation service.
      ip2location.getRegion().then(function(region) {
        PropertyModel.initiate(region);
      });
    }

    if (ionic.Platform.isWebView()) {
      // Then we're in mobile, so lets run our geo when its safe to do so.
      document.addEventListener('deviceready', onReady, false);
    }
    else {
      // Then we're in ionic serve mode, which is fine to run our get location.
      onReady();
    }

    // If we see changes on the model, lets recalculate the stamp duty.
    $scope.$watch(function(scope) { return scope.data; }, function(data) {
      // Get out of here if we don't have the absolute essentials
      if (Utils.isUndefinedOrNull(data.propertyValueFormatted) || data.propertyValueFormatted === "" || Utils.isUndefinedOrNull(data.propertyState)) {
        console.log('Missing required inputs: property value or state');

        // Try run our geolocation again.
        onReady();

        return;
      }

      console.log("Watch on PropertyModel fired");
      PropertyModel.propertyValueFormat();

      // Runs the calculator
      Calculator.go();

      $scope.flags.changesMade = true;
    }, true );

    /**
     * closeKeyboard helper function that makes sure the keyboard plugin is available before closing.
     */
    $scope.closeKeyboard = function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.close();
      }
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
        PropertyModel.load($scope.history[index].data);
        console.log($scope.history[index].data);
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
        var email = '<h1>Stamp Duty Calculator Results for ' + $scope.data.propertyState + '</h1><p><strong>Property Value:</strong> $' + $scope.data.propertyValueFormatted + '</p><p>Stamp duty on Property: ' +  $filter('currency')($scope.results.propertyDuty) + '<br />Mortgage registration fee: ' + $filter('currency')($scope.results.mortgageFee) + '<br />Transfer fee: ' + $filter('currency')($scope.results.transferFee) + '</p><p><strong>Total Government Fees:</strong> ' +  $filter('currency')($scope.results.total) + '</p><p>Calculated on: ' + $filter('date')($scope.results.calculateTime, 'd/M/yy h:mm a') + '.</p>';

        window.cordova.plugins.email.open({
          to: '',
          subject: 'Stamp duty estimate for $' + $scope.data.propertyValueFormatted,
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
      PropertyModel.resetToDefaults();
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
