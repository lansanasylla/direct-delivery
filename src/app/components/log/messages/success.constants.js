'use strict';

angular.module('log')
  .constant('SUCCESS_MESSAGES', {
    packingSaved: {
      title: 'Packing saved',
      message: 'Packing list saved successfully'
    },
    authSuccess: {
      title: 'Authentication',
      message: 'Login success'
    },
    'deliveryCancelled': {
      title: 'Delivery cancelled',
      message: 'Delivery cancelled successfully'
    },
    'facilityDeliverySaved': {
      title: 'Delivery report saved',
      message: 'Facility delivery report completed successfully'
    },
    'dailyDeliverySyncDown': {
      title: 'Daily delivery sync down',
      message: 'Daily delivery sync down completed successfully'
    },
    'remoteReplicationUpToDate': {
      title: 'Replication up to date',
      message: 'Replication to remote database completed successfully'
    },
    'kpiSaved': {
      title: 'Facility KPI saved',
      message: 'Facility KPI was saved successfully!'
    },
    returnedStockSaved: {
      title: 'Returned stock saved',
      message: 'Returned stock was saved successfully!'
    }
  });
