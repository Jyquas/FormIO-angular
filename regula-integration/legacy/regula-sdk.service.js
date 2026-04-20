(function (angular) {
  'use strict';

  angular.module('legacy.regula').factory('regulaSdkService', ['$q', function ($q) {
    function toPromise(nativePromise) {
      return $q(function (resolve, reject) {
        nativePromise.then(resolve).catch(reject);
      });
    }

    function guardBridge() {
      if (!window.RegulaWebComponentBridge || !window.RegulaWebComponentBridge.initialize) {
        throw new Error('RegulaWebComponentBridge is not loaded. Build/load dist/regula-wrapper.iife.js first.');
      }

      return window.RegulaWebComponentBridge;
    }

    return {
      initialize: function (options) {
        var bridge = guardBridge();
        return toPromise(bridge.initialize(options));
      },
      shutdown: function () {
        var bridge = guardBridge();
        return toPromise(bridge.shutdown());
      },
      isProcessCompleted: function (detail) {
        var bridge = guardBridge();
        return bridge.isProcessCompleted(detail);
      },
      getInstance: function () {
        var bridge = guardBridge();
        return bridge.getInstance();
      }
    };
  }]);
})(window.angular);
