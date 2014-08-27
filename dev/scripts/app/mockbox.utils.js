_mock.utils = (function(){
  'use strict';
  var _isDirty = false,
      _confirmCallback = null;
  function toDate(eObj){
    var mEpoch = parseInt(eObj), dDate = new Date();

    if(mEpoch<10000000000) mEpoch *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)

    dDate.setTime(mEpoch);
    
    return dDate.toLocaleDateString();
  }

  Element.prototype.remove = function() {
      this.parentElement.removeChild(this);
  }
  
  NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
      for(var i = 0, len = this.length; i < len; i++) {
          if(this[i] && this[i].parentElement) {
              this[i].parentElement.removeChild(this[i]);
          }
      }
  }

  function callConfirmCallback(){
    _confirmCallback();
  }

  function _confirm(type, callback){
    chrome.runtime.sendMessage({message:'confirmType', type:type});
    chrome.app.window.get('confirm').show();
    if(callback){
      _confirmCallback = callback;
    }
  }

  return {
    toDate: function(epoch){
      return toDate(epoch);
    }, 
    isDirty:function(){
      if(arguments.length){
        _isDirty = arguments[0];
      }else{
        return _isDirty;
      }
    },
    confirm: function(type, callback){
      _confirm(type,callback);
    }, 
    confirmCallback: function(){
      callConfirmCallback();
    }
  }

}());