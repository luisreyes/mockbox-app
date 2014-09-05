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
        buttons.cancelBtn = document.getElementById("confirm-buttons").querySelector('.cancel');
        buttons.continueBtn = document.getElementById("confirm-buttons").querySelector('.continue');
      };

      if(_currentId === 'settings'){
        var services = document.getElementById("settings-access-services");
        buttons.switches = services.getElementsByTagName('label');
        buttons.okBtn = document.getElementById("settings-footer").querySelector('.ok');
        buttons.cancelBtn = document.getElementById("settings-footer").querySelector('.cancel');
      }

      if(_currentId === 'about'){
        buttons.okBtn = document.getElementById("about-footer").querySelector('.ok');
      }

      if(_currentId === 'connection'){
        buttons.okBtn = document.getElementById("connection-footer").querySelector('.ok');
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
        chrome.runtime.sendMessage({message:'onConfirm', popoutId:_currentId, isAccept:false});
      });

      buttons.continueBtn.addEventListener('click', function(e){
        chrome.runtime.sendMessage({message:'onConfirm', popoutId:_currentId, isAccept:true});
      });
    }else

    if(_currentId === 'connection'){
      buttons.okBtn.addEventListener('click', function(e){
        chrome.runtime.sendMessage({message:'closePopout', popoutId:_currentId});
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

      for(var i = 0; i < buttons.switches.length;i++){
        buttons.switches[i].addEventListener('click', function(e){
          var service = e.target.parentElement.parentElement.parentElement.classList[0];
          
          if(e.target.tagName === 'INPUT'){
            var on = e.target.checked;
            
            if(on){
              chrome.runtime.sendMessage( { message:'allowAccess', service: service });
            }else{
              chrome.runtime.sendMessage( { message:'revokeAccess', service: service });
            }
          }

        });
      }

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