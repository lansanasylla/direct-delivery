'use strict';

angular.module('delivery')
  .service('deliveryService', function (dbService) {

    var _this = this;

    _this.save = function (ddDoc) {
      return dbService.save(ddDoc);
    };

    _this.updateFacilityRound = function (dailyDelivery, facRnd) {
      var fr;
      for (var i in dailyDelivery.facilityRounds) {
        fr = dailyDelivery.facilityRounds[i];
        if (fr.facility.id === facRnd.facility.id) {
          dailyDelivery.facilityRounds[i] = facRnd;
          return dailyDelivery;
        }
      }
      dailyDelivery.facilityRounds.push(facRnd);
      return dailyDelivery;
    };

    _this.filterByFacility = function (dd, facilityId) {
      return dd.facilityRounds
        .filter(function (facRnd) {
          return facRnd.facility.id === facilityId;
        });
    };

    _this.calcQty = function (packedProduct) {
      var res = {};
      var deliveredQty = (packedProduct.expectedQty - packedProduct.onHandQty);
      var returnedQty = (packedProduct.onHandQty - packedProduct.expectedQty);
      res.deliveredQty = deliveredQty;
      res.returnedQty = 0;
      if (deliveredQty <= 0) {
        res.deliveredQty = 0;
        res.returnedQty = returnedQty;
      }
      return res;
    };

    _this.initReturnedQty = function (facilityRnd) {
      for (var i in facilityRnd.packedProduct) {
        if (!angular.isNumber(facilityRnd.packedProduct[i].returnedQty)) {
          facilityRnd.packedProduct[i].returnedQty = 0;
        }
      }
      return facilityRnd;
    };

    _this.isValidSignature  = function(signature){
      //FIXME: find better signature verification technique e.g base64 the image data uri
      return ((signature.$isEmpty === false) && (signature.dataUrl.length > 0));
    };

    _this.validateItemQty = function (item) {
      var validation = {
        onHandQty: !angular.isNumber(item.onHandQty),
        expectedQty: !angular.isNumber(item.expectedQty),
        deliveredQty: !angular.isNumber(item.deliveredQty),
        returnedQty: !angular.isNumber(item.returnedQty)
      };
      return validation;
    };

    _this.validateDeliverItems = function(deliverItems){
      var invalid = {};
      function validate(item){
        var res =  _this.validateItemQty(item);
        for(var type in res){
          var invalidQty = res[type];
          if(invalidQty === true){
            invalid[item.productID] = res;
            break;
          }
        }
      }
      deliverItems.forEach(validate)
      var isValid = Object.keys(invalid).length === 0;
      if(isValid){
        return isValid;
      }
      return invalid;
    };

  });
