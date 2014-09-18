/*! MockBox - Prorotype builder
/*  Author: Luis Reyes <luis@luisreyes.com>
/*  Url: mockbox.io
*/
var popout; 

(function(){ var _pop = (function(){
'use strict';
  var confirmTitle = {
    continue: 'You have unsaved changes',
    delete: 'You are trying to delete this prototype',
    revoke:'Revoke Access Token?'
  };

  var confirmMessage = {
    continue: 'Are you sure you want to continue?',
    delete: 'Are you sure you want to delete it?',
    revoke:'Are you sure you want to revoke the access token?'
  };

  function init(){

    chrome.runtime.getPlatformInfo(function(p){
      apollo.addClass(document.body, p.os);
    });

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
    
  }

  return {
    init: init
  };

}());
  _pop.init();
  
  //Expose
  popout = _pop;

}());