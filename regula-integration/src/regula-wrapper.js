import {
  defineComponents,
  DocumentReaderService,
  InternalScenarios
} from '@regulaforensics/vp-frontend-document-components';

var sdkInstance = null;
var initPromise = null;

function ensureSdkConfig(sdk) {
  sdk.recognizerProcessParam.processParam.scenario = InternalScenarios.MrzAndLocate;
  sdk.recognizerProcessParam.processParam.multipageProcessing = true;
  sdk.imageProcessParam.processParam.scenario = InternalScenarios.MrzAndLocate;
}

function initialize(options) {
  if (initPromise) {
    return initPromise;
  }

  initPromise = defineComponents().then(function () {
    sdkInstance = new DocumentReaderService();
    window.RegulaDocumentSDK = sdkInstance;

    ensureSdkConfig(sdkInstance);

    if (options && options.license) {
      return sdkInstance.initialize({ license: options.license }).then(function () {
        return sdkInstance;
      });
    }

    // For production/non-test environments, pass your Base64 license key:
    // return sdkInstance.initialize({ license: 'YOUR_BASE64_LICENSE_KEY' });
    return sdkInstance.initialize().then(function () {
      return sdkInstance;
    });
  });

  return initPromise;
}

function getInstance() {
  return sdkInstance;
}

function shutdown() {
  if (!sdkInstance) {
    initPromise = null;
    return Promise.resolve();
  }

  var instanceToClose = sdkInstance;
  sdkInstance = null;
  window.RegulaDocumentSDK = null;
  initPromise = null;

  return instanceToClose.shutdown();
}

function isProcessCompleted(eventDetail) {
  if (!eventDetail) {
    return false;
  }

  if (eventDetail.completed === true) {
    return true;
  }

  if (eventDetail.status && String(eventDetail.status).toUpperCase() === 'COMPLETED') {
    return true;
  }

  if (eventDetail.action && String(eventDetail.action).toUpperCase() === 'PROCESS_FINISHED') {
    return true;
  }

  return false;
}

export { initialize, getInstance, shutdown, isProcessCompleted };
