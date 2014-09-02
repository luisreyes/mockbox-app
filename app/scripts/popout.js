/*! MockBox - Prorotype builder
/*  Author: Luis Reyes <luis@luisreyes.com>
/*  Url: mockbox.io
*/
var popout; 

(function(){ var _pop = (function(){
'use strict';
  var confirmTitle={
    continue: 'You have unsaved changes',
    delete: 'You are trying to delete this mock',
    revoke:'Revoke Access?'
  }

  var confirmMessage = {
    continue: 'Are you sure you want to continue?',
    delete: 'Are you sure you want to delete it?',
    revoke:'Are you sure you want to revoke all access?'
  }

  function init(){
    _pop.clicks.init();

    chrome.runtime.onMessage.addListener(function(data) {
      if(data.message === 'confirmType'){
        var p = document.getElementById("popout-title");
        if(p){
          p.innerHTML = confirmTitle[data.type];
          document.getElementById("confirm-message").innerHTML = confirmMessage[data.type];
        }
      }
    });
  }

  return {
    init: init
  };

}());
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
        buttons.allowBtn = document.getElementById("settings-allow"),
        buttons.revokeBtn = document.getElementById("settings-revoke"),
        buttons.okBtn = document.getElementById("settings-footer").querySelector('.ok'),
        buttons.cancelBtn = document.getElementById("settings-footer").querySelector('.cancel');
      }

      if(_currentId === 'about'){
        buttons.okBtn = document.getElementById("about-footer").querySelector('.ok');
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
            autoload:document.getElementById('settings-open-check').checked
          }
        };

        chrome.runtime.sendMessage(data);
        chrome.runtime.sendMessage({message:'closePopout', popoutId:_currentId});
      });

      buttons.cancelBtn.addEventListener('click', function(e){
        chrome.runtime.sendMessage({message:'closePopout', popoutId:_currentId});
      });

      buttons.allowBtn.addEventListener('click', function(e){
        chrome.runtime.sendMessage({message:'allowAccess'});
      });

      buttons.revokeBtn.addEventListener('click', function(e){
        chrome.runtime.sendMessage({message:'revokeAccess'});
      });
    }else

    if(_currentId === 'about'){

      buttons.okBtn.addEventListener('click', function(){
        chrome.runtime.sendMessage({message:'closePopout', popoutId:_currentId});
      });
    }
    
  }

  return {
    init: init
  };

}());
  _pop.init();
  
  //Expose
  popout = _pop;

}());