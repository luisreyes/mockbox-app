_mock.popout = (function(){
'use strict'; 
  var 
  popoutWrapper = document.getElementById('app-popout'),
  popoutBase = popoutWrapper.querySelector('.base'),
  currentId = '';

  function _open(loc){
    currentId = loc;
    apollo.addClass(popoutBase, 'visible');
    chrome.app.window.get(loc).show();
    // should then invoke _mock.load('gui'); OR _mock.export();
  }

  function _close(loc){
    currentId = '';
    apollo.removeClass(popoutBase, 'visible');
    chrome.app.window.get(loc).hide();
    // should then invoke _mock.load('gui'); OR _mock.export();
  }

  return {
    open: function(location){
      _open(location);
    },
    close: function(location){
      _close(location);
    },
    getCurrentId: function(){
      return currentId;
    }
  };

}());