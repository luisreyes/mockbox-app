_pop.clicks = (function(){
'use strict'; 
  var
  _currentId,
  doc,
  buttons = {};

  function init(){
      _currentId = chrome.app.window.current().id;
      
      buttons.closeBtn = document.getElementById("app-popout-controls").querySelector('.window-close');
      
      if(_currentId === 'confirm'){
        buttons.cancelBtn = document.getElementById("confirm-buttons").querySelector('.cancel'),
        buttons.continueBtn = document.getElementById("confirm-buttons").querySelector('.continue')
      };

      if(_currentId === 'settings'){
        buttons.okBtn = document.getElementById("settings-footer").querySelector('.ok');
      }

      addListeners();

  }

  function addListeners(){
    
    // Popout Frame Buttons Action

    buttons.closeBtn.addEventListener('click', function(e){
      chrome.runtime.sendMessage({message:'closePopout', popoutId:_currentId});
    });

    if(_currentId === 'confirm'){
      buttons.cancelBtn.addEventListener('click', function(e){
        chrome.runtime.sendMessage({message:'closePopout', popoutId:_currentId});
      });

      buttons.continueBtn.addEventListener('click', function(e){
        chrome.runtime.sendMessage({message:'continuePopout', popoutId:_currentId});
      });
    }else

    if(_currentId === 'settings'){

      var data = {};

      buttons.okBtn.addEventListener('click', function(){

        data = {
          message:'saveSettings', 
          settings:{
            theme: document.getElementById('settings-theme-select').value,
            openOnLoad:document.getElementById('settings-open-check').checked
          }
        };

        chrome.runtime.sendMessage(data);
        chrome.runtime.sendMessage({message:'closePopout', popoutId:_currentId});
      });
    }
    
  }

  return {
    init: init
  };

}());