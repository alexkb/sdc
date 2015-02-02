'use strict';

/**
 * @ngdoc service
 * @name sdcApp.Utils
 * @description
 * # Utils
 * Service in the sdcApp.
 */
angular.module('Sdc')
  .factory('Utils', function () {
    var service = {
      /**
       * Macro for checking if things are defined or null.
       * Help from: http://stackoverflow.com/a/17910655/687274
       * @param obj
       * @returns {boolean}
       */
      isUndefinedOrNull: function(obj) {
        return !angular.isDefined(obj) || obj===null;
      },

      /**
       * obj.toLocalString() replacement, as its unreliable across different web renderers.
       * Help from: http://stackoverflow.com/a/16157942
       * @param x
       * @param sep
       * @param grp
       * @returns {*}
       */
      localeString: function(x, sep, grp) {
        var sx = (''+x).split('.'), s = '', i, j;
        sep = sep || (sep = ','); // default seperator
        grp = grp || grp === 0 || (grp = 3); // default grouping
        i = sx[0].length;
        while (i > grp) {
          j = i - grp;
          s = sep + sx[0].slice(j, i) + s;
          i = j;
        }
        s = sx[0].slice(0, i) + s;
        sx[0] = s;
        return sx.join('.');
      }
    };

    return service;
  });
