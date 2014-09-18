_pop.clicks = (function(){
'use strict'; 
  var
  _currentId,
  buttons = {};

  function init(){
      _currentId = chrome.app.window.current().id;
      buttons.closeBtn = document.getElementById("app-popout-controls").querySelector('.window-close');
      
      if(_currentId === 'confirm'){
        buttons.cancelBtn = document.getElementById("confirm-buttons").querySelector('.cancel');
        buttons.continueBtn = document.getElementById("confirm-buttons").querySelector('.continue');
      }

      if(_currentId === 'about'){
        buttons.okBtn = document.getElementById("about-footer").querySelector('.ok');
      }

      addListeners();

  }

  function addListeners(){
    
    // Popout Frame Buttons Action

    buttons.closeBtn.addEventListener('click', function(){
      chrome.runtime.sendMessage({message:'onClosePopout', popoutId:_currentId});
    });

    if(_currentId === 'confirm'){
      buttons.cancelBtn.addEventListener('click', function(){
        chrome.runtime.sendMessage({message:'onConfirm', popoutId:_currentId, isAccept:false});
      });

      buttons.continueBtn.addEventListener('click', function(){
        chrome.runtime.sendMessage({message:'onConfirm', popoutId:_currentId, isAccept:true});
      });
    }else

    if(_currentId === 'about'){

      buttons.okBtn.addEventListener('click', function(){
        chrome.runtime.sendMessage({message:'onClosePopout', popoutId:_currentId});
      });
    }

    document.body.addEventListener('keydown', onKeyDown);
    
  }

  function onKeyDown(e){ if(e.keyCode === 27) buttons.closeBtn.click(); }

  return {
    init: init
  };

}());