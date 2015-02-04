_v.purchase = (function(){
  'use strict';

  var doc, buttons = {}, hasExport = false;
      
  function init(){
    doc = chrome.app.window.get('purchase').contentWindow.document;
    
    buttons = {
      // CACHE THE PURCHASE BUTTON HERE
      buy: doc.getElementById('purchase-footer').querySelector('.buy')
    };
    
    addListeners();
    getLicenses();
  }

  function addListeners(){
    
    buttons.buy.addEventListener('click', onPurchaseClick);
    
  }

  function getLicenses(){
    google.payments.inapp.getPurchases({
      'success': onLicenseUpdate,
      'failure': onLicenseUpdateFail
    });
  }

  function onPurchaseClick(e){
    // Go purchase a license
    var sku = "pkg_export";
    google.payments.inapp.buy({
      'parameters': {'env': 'prod'},
      'sku': sku,
      'success': onPurchase,
      'failure': onPurchaseFailed
    });

  }

  function onLicenseUpdate(result){
    // Validate result to set "hasExport"
    if(result.response.details[0].sku === "pkg_export"){
      // Send Is licenced
      chrome.runtime.sendMessage({message:'onPurchased', licensed:true });
    }
  }
  function onLicenseUpdateFail(result){
    // Validate result to set "hasExport"
  }


  function onPurchase(purchase) {
    var jwt = purchase.jwt;
    var cartId = purchase.request.cardId;
    var orderId = purchase.response.orderId;
    //statusDiv.text("Purchase completed. Order ID: " + orderId);
    getLicenses();
  }

  function onPurchaseFailed(purchase) {
    var reason = purchase.response.errorType;
    //statusDiv.text("Purchase failed. " + reason);
  }
  

  return {
    init: function(data){
      if(!doc) init();
    }
  };

}());