'use strict';

angular.module('delivery')
  .controller('FacilityDeliveryCtrl', function FacilityDeliveryCtrl($state, log, deliveryService, dailyDelivery) {

    var vm = this; //view model

    function init(){
      vm.dailyDelivery = dailyDelivery;
      var facilityId = $state.params.facilityId;
      vm.facRnd = {};
      if(!angular.isObject(vm.dailyDelivery)){
        log.error('invalidDailyDelivery');
        $state.go('home.schedule');
        return;
      }

      var dailyFacRndForGivenId = deliveryService.filterByFacility(vm.dailyDelivery, facilityId);
      if(dailyFacRndForGivenId.length === 0){
        log.error('facilityRoundNotSet');
        $state.go('home.schedule');
      }else{
        vm.ddId = dailyFacRndForGivenId[0]._id;
        vm.facRnd = dailyFacRndForGivenId[0];
        vm.facility = vm.facRnd.facility;
        vm.arrivedAt = new Date().toJSON();
        vm.facilityKPI = vm.facRnd.facilityKPI;
      }
      if(!angular.isArray(vm.facRnd.packedProduct)){
        vm.facRnd.packedProduct = [];
      }
    }

    init();

  });
