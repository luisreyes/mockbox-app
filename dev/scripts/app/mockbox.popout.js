_mock.popout = (function(){
'use strict'; 
  var 
  popoutWrapper = document.getElementById('app-popout'),
  popoutOverlay = popoutWrapper.querySelector('.overlay'),
  _confirmAcceptCallback = null,
  _confirmDeclineCallback = null,
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

  function _confirm(type, acceptCallback, declineCallback){
    currentId = 'confirm';
    
    _mock.popout.open('confirm', function(){
      chrome.runtime.sendMessage({message:'confirmType', type:type});
      apollo.addClass(popoutOverlay, 'visible');
      if(acceptCallback){
        _confirmAcceptCallback = acceptCallback;
      }
      if(declineCallback){
        _confirmDeclineCallback = declineCallback;
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
    confirm: function(type, acceptCallback, declineCallback){
      _confirm(type,acceptCallback,declineCallback);
    }, 
    confirmAcceptCallback: function(){
      _confirmAcceptCallback();
    },
    confirmDeclineCallback: function(){
      _confirmDeclineCallback();
    }
  };

}());