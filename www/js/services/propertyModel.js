'use strict';

/** Help from:
 * http://blog.revolunet.com/blog/2014/02/14/angularjs-services-inheritance/
 * http://joelhooks.com/blog/2013/04/24/modeling-data-and-state-in-your-angularjs-application/
 */

angular.module('Sdc').factory('PropertyModel', function(Utils) {

  var data = {};
  data.propertyState = '';
  data.propertyValue = '';
  data.propertyValueFormatted = '';
  data.purpose = 'residential';
  data.propertyStatus = 'established';
  data.propertyLocation = 'south';
  data.firstHome = false;
  data.pensioner = false;
  data.paymentMethod = 'paper';

    // Save the default for resetting when requested.
  var dataDefaults = angular.copy(data);

  return {
    data: data,

    initiate: function (state) {
      data.propertyState = state;
      dataDefaults.propertyState = state;
    },

    resetToDefaults: function() {
      this.load(dataDefaults);
    },

    load: function(newModel) {
      Object.keys(data).forEach(function(key) {
        console.log(key, data[key]);
        if (newModel[key] !== undefined) {
          data[key] = newModel[key];
        }
      });
    },

    getPropertyState: function () {
      return this.data.propertyState;
    },

    /**
     * Called from view to format the property value into a more readable value, e.g. 500,000.
     * Help from:
     * http://stackoverflow.com/questions/9311258/how-do-i-replace-special-characters-with-regex-in-javascript
     */
    propertyValueFormat: function () {
      if (this.data.propertyValueFormatted === this.data.propertyValue && this.data.propertyValueFormatted === '') {
        return;
      }

      this.data.propertyValue = Number(String(this.data.propertyValueFormatted).replace(/[^0-9]/g, ''));

      var formattedValue = Utils.localeString(this.data.propertyValue);

      // If the formatted value equates to zero (number or string), then lets set the model to an empty string so the user sees the placeholder again.
      if (formattedValue === 0 || formattedValue === '0') {
        this.data.propertyValue = this.data.propertyValueFormatted = '';
      }
      // Buf if the value isn't 0 and has changed since our last digest, then lets set it to the nicely formatted value :)
      else if (formattedValue !== this.data.propertyValueFormatted) {
        this.data.propertyValueFormatted = formattedValue;
      }
    }
  };
});
