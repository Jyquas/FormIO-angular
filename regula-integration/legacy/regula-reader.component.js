(function (angular) {
  'use strict';

  angular.module('legacy.regula').component('regulaReader', {
    bindings: {
      isOpen: '=',
      license: '<?',
      onProcessFinished: '&?',
      onClose: '&?'
    },
    template:
      '<div class="regula-reader-host" ng-if="$ctrl.isOpen">' +
      '  <document-reader class="regula-reader-element"></document-reader>' +
      '</div>',
    controller: ['$element', '$scope', 'regulaSdkService', function ($element, $scope, regulaSdkService) {
      var ctrl = this;
      var readerElement = null;
      var listenersBound = false;
      var sdkInitialized = false;

      function bindReaderEvents() {
        if (!readerElement || listenersBound) {
          return;
        }

        readerElement.addEventListener('PROCESS_FINISHED', onProcessFinishedEvent);
        readerElement.addEventListener('CLOSE', onCloseEvent);
        listenersBound = true;
      }

      function unbindReaderEvents() {
        if (!readerElement || !listenersBound) {
          return;
        }

        readerElement.removeEventListener('PROCESS_FINISHED', onProcessFinishedEvent);
        readerElement.removeEventListener('CLOSE', onCloseEvent);
        listenersBound = false;
      }

      function onProcessFinishedEvent(evt) {
        var detail = evt && evt.detail ? evt.detail : null;
        if (!regulaSdkService.isProcessCompleted(detail)) {
          return;
        }

        $scope.$applyAsync(function () {
          if (ctrl.onProcessFinished) {
            ctrl.onProcessFinished({ result: detail });
          }
        });
      }

      function onCloseEvent(evt) {
        $scope.$applyAsync(function () {
          ctrl.isOpen = false;
          if (ctrl.onClose) {
            ctrl.onClose({ event: evt && evt.detail ? evt.detail : null });
          }
        });
      }

      function setupWhenOpen() {
        if (!ctrl.isOpen) {
          return;
        }

        regulaSdkService
          .initialize({ license: ctrl.license })
          .then(function () {
            sdkInitialized = true;
            readerElement = $element[0].querySelector('document-reader');
            bindReaderEvents();
          })
          .catch(function (error) {
            $scope.$applyAsync(function () {
              ctrl.isOpen = false;
            });
            console.error('Regula SDK initialization failed:', error);
          });
      }

      ctrl.$onChanges = function (changes) {
        if (changes.isOpen) {
          if (changes.isOpen.currentValue) {
            setupWhenOpen();
          } else {
            unbindReaderEvents();
          }
        }
      };

      ctrl.$postLink = function () {
        if (ctrl.isOpen) {
          setupWhenOpen();
        }
      };

      ctrl.$onDestroy = function () {
        unbindReaderEvents();

        if (sdkInitialized) {
          regulaSdkService.shutdown().catch(function (error) {
            console.error('Regula SDK shutdown failed:', error);
          });
        }
      };
    }]
  });
})(window.angular);
