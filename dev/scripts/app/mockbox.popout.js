_mock.popout = (function(){
'use strict'; 
  var 
  popoutWrapper = document.getElementById('app-popout'),
  popoutBase = popoutWrapper.querySelector('.base'),
  currentId = '';

  function _open(loc, callback){
    currentId = loc;
    apollo.addClass(popoutBase, 'visible');
    chrome.app.window.get(loc).show();
    if(callback){
      callback();
    }
  }

  function _close(loc, callback){
    currentId = '';
    apollo.removeClass(popoutBase, 'visible');
    chrome.app.window.get(loc).hide();
    // should then invoke _mock.load('gui'); OR _mock.export();
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
    }
  };

}());