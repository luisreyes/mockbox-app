_mock.popout = (function(){
'use strict'; 
  var 
  popoutWrapper = document.getElementById('app-popout'),
  popoutOverlay = popoutWrapper.querySelector('.overlay'),
  _confirmCallback = null,
  currentId = '',
  openCount = 0;

  function _open(id, callback){
    currentId = id;
    openCount++;
    apollo.addClass(popoutOverlay, 'visible');
    _mock.windows.show(id,callback);
  }

  function _close(id, callback){
    currentId = '';
    openCount--;
    // Helps not remove the overlay when multiple windows open
    if(openCount === 0){
      apollo.removeClass(popoutOverlay, 'visible');
    }
    _mock.windows.hide(id);
  }

  function callConfirmCallback(){
    _confirmCallback();
  }

  function _confirm(type, callback){
    currentId = 'confirm';
    
    _mock.popout.open('confirm', function(){
      chrome.runtime.sendMessage({message:'confirmType', type:type});
      apollo.addClass(popoutOverlay, 'visible');
      if(callback){
        _confirmCallback = callback;
      }
    });

    
  }

  return {
    open: function(id, callback){
      _open(id, callback);
    },
    close: function(id, callback){
      _close(id, callback);
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