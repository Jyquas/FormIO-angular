(function (angular) {
  'use strict';

  angular.module('legacy.regula.sample', ['legacy.regula']).controller('ReaderDemoController', [function () {
    var vm = this;

    vm.readerOpen = false;
    vm.latestResult = null;
    vm.closeReason = null;

    vm.openReader = function () {
      vm.readerOpen = true;
    };

    vm.handleProcessFinished = function (result) {
      vm.latestResult = result;
      console.log('PROCESS_FINISHED payload:', result);
    };

    vm.handleClose = function (event) {
      vm.closeReason = event;
      vm.readerOpen = false;
      console.log('CLOSE payload:', event);
    };
  }]);
})(window.angular);
