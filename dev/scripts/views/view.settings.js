_v.settings = (function(){
  'use strict';

  var doc;

  function _init(){
    doc = chrome.app.window.get('settings').contentWindow.document;
  }

  
  function _restoreStates(settings){
    // Set Theme
    doc.getElementById('settings-theme-select').value = settings.theme;
    // Set Last Worked on Checkbox
    doc.getElementById('settings-open-check').checked = settings.autoload;
    // Update buttons
    _updateAuths();
  }

  function _updateAuths(){
    // Get all current tokens
    var tokens = mockbox.getTokens();

    // Cache services container DOM Element
    var services = doc.getElementById('settings-access-services');
    
    // Check for available tokens
    setState(services.getElementsByClassName('google-access')[0], tokens.google);
  }

  function setState(service, hasToken){
    var hideElements,showElements;

    if(hasToken){
      showElements = service.getElementsByClassName('revoke');
      hideElements = service.getElementsByClassName('access');
      service.getElementsByTagName('input')[0].checked = true;
    }else{
      showElements = service.getElementsByClassName('access');
      hideElements = service.getElementsByClassName('revoke');
      service.getElementsByTagName('input')[0].checked = false;
    }

    var i = 0;
    for(i; i < showElements.length; i++){
      apollo.removeClass(showElements[i], 'hidden');  
    }

    for(i; i < hideElements.length; i++){
      apollo.addClass(hideElements[i], 'hidden');
    }
  }

  return {
    init: function(callback){
      !doc && _init(callback);
    },
    restoreSettingStates: function(settings){
      _restoreStates(settings);
    },
    updateAuthorizations:function(){
      _updateAuths();
    }
  };

}());