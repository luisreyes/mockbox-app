_mock.popout = (function(){
'use strict'; 
  var 
  popoutWrapper = document.getElementById('app-popout'),
  popoutOverlay = popoutWrapper.querySelector('.overlay'),
  _confirmCallback = null,
  currentId = '';

  function _open(loc, callback){
    currentId = loc;
    apollo.addClass(popoutOverlay, 'visible');
    chrome.app.window.get(loc).show();
    if(callback){
      callback();
    }
  }

  function _close(loc, callback){
    currentId = '';
    apollo.removeClass(popoutOverlay, 'visible');
    chrome.app.window.get(loc).hide();
    // should then invoke _mock.load('gui'); OR _mock.export();
  }

  function callConfirmCallback(){
    _confirmCallback();
  }

  function _confirm(type, callback){
    currentId = 'confirm';
    chrome.runtime.sendMessage({message:'confirmType', type:type});
    chrome.app.window.get('confirm').show();
    apollo.addClass(popoutOverlay, 'visible');
    if(callback){
      _confirmCallback = callback;
    }
  }

  return {
    open: function(location, callback){
      _open(location, callback);
    },
    close: function(location, callback){
      _close(location, callback);
    },
    getCurrentId: function(){
      return currentId;
    },
    confirm: function(type, callback){
      _confirm(type,callback);
    }, 
    confirmCallback: function(){
      callConfirmCallback();
    }
  };

}());