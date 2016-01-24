'use strict';

angular.module('schedules.round')
    .controller('SchedulesRoundCtrl', function (scheduleService, scheduleRoundService, rounds,
                                                utility, DELIVERY_STATUS, deliveryService, $state) {
      var _this = this;


      function openRoundTab() {
        if($state.params.roundId) {
          _this.toggleDisplay($state.params.roundId);
        }
      }

      _this.STATUS = DELIVERY_STATUS;
      _this.rounds = rounds;
      _this.getColorCode = function (status, ccsClass) {
        return deliveryService.getStatusColor(status, ccsClass);
      };

      _this.formatDate = function(date){
        if(utility.isValidDate(date)){
          return utility.formatDate(date, "dd, MMM yyyy");
        }
        return 'N/A';
      };

      _this.groupedDailyDeliveries = {};
      _this.roundToDisplay = null;
      function  groupDailyDeliveriesByDate(doc){
        if(!angular.isArray(_this.groupedDailyDeliveries[doc.date])){
          _this.groupedDailyDeliveries[doc.date] = []
        }
        return _this.groupedDailyDeliveries[doc.date].push(doc)
      }
      _this.showDisplayRound = function (roundUUID) {
        scheduleService.getByRound(roundUUID)
          .then(function (res) {
            res.forEach(function (doc){
              if(doc.facilityRounds){
                doc.facilityRounds.forEach(function (delivery){
                  groupDailyDeliveriesByDate(delivery);
                })
              }else{
                groupDailyDeliveriesByDate(doc);
              }
            })
          });
        };

      _this.toggleDisplay = function (roundId) {
        if (roundId === _this.roundToDisplay) {
          _this.roundToDisplay = null;
        } else {
          _this.roundToDisplay = roundId;
          _this.showDisplayRound(roundId);
        }
      };

      openRoundTab();
    });
