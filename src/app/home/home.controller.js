'use strict';

angular.module('home')
  .controller('HomeCtrl', function (
    dailySchedule,
    coreService,
    AuthService,
    SYNC_STATUS,
    $rootScope,
    $scope,
    HOME_TABS,
    $window,
    log
  ) {
    var vm = this;
    var unbind = {};
    vm.today = new Date();
    vm.dailyDelivery = {};
    vm.tabs = HOME_TABS;
    vm.syncInProgress = coreService.getSyncInProgress();

    function processEvent(event, data) {
      vm.syncInProgress = coreService.getSyncInProgress();
      if (event && event.name === SYNC_STATUS.ERROR) {
        var reason;
        if (data && data.msg && data.msg.message) {
          reason = 'The error message was "' + data.msg.message + '"';
        }
        log.error('coreDocsRetrievalFailed', data, reason);
      }
    }

    function addSyncListeners() {
      unbind[SYNC_STATUS.IN_PROGRESS] = $rootScope.$on(SYNC_STATUS.IN_PROGRESS, processEvent);
      unbind[SYNC_STATUS.ERROR] = $rootScope.$on(SYNC_STATUS.ERROR, processEvent);
      unbind[SYNC_STATUS.MAX_RETRY_COMPLETED] = $rootScope.$on(SYNC_STATUS.MAX_RETRY_COMPLETED, processEvent);
      unbind[SYNC_STATUS.COMPLETE] = $rootScope.$on(SYNC_STATUS.COMPLETE, processEvent);
    }

    function init() {
      vm.dailyDelivery = dailySchedule;
      if (Object.keys(unbind).length === 0) {
        addSyncListeners();
        //add device online status listerners
        vm.isOnline = $window.navigator.onLine ? 'online' : 'offline';
        $window.addEventListener('offline', updateOnlineState);
        $window.addEventListener('online', updateOnlineState);
      }
    }

    init();

    function updateOnlineState () {
      vm.isOnline = $window.navigator.onLine ? 'online' : 'offline';
      if(vm.isOnline && AuthService.isLoggedIn) {
        coreService.retryStartSyncAfterLogin(AuthService.currentUser.name);
      }
      $scope.$digest();
    }

    function removeSyncListeners() {
      for (var k in SYNC_STATUS) {
        var event = SYNC_STATUS[k];
        unbind[event]();
      }
      $window.removeEventListener('offline', null);
      $window.removeEventListener('online', null);
    }

    vm.startSync = function () {
      coreService.startSyncAfterLogin(AuthService.currentUser.name);
      addSyncListeners();
    };

    $scope.$on('$destroy', removeSyncListeners);

  });
