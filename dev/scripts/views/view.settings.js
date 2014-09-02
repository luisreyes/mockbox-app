_v.settings = (function(){
  'use strict';

  var doc;

  function init(){
    doc = chrome.app.window.get('settings').contentWindow.document;
  }

  
  function restoreStates(settings){
    // Set Theme
    doc.getElementById('settings-theme-select').value = settings.theme;
    // Set Last Worked on Checkbox
    doc.getElementById('settings-open-check').checked = settings.autoload;
    // Check if is authenticated
    if(mockbox.isAuthenticated()){
      console.log(settings);
      apollo.addClass(doc.getElementById('settings-signin-container'), 'hidden');
      apollo.removeClass(doc.getElementById('settings-signout-container'), 'hidden');
      doc.getElementById('settings-signout-container').querySelector('.username').innerHTML = 'Boing Boing';
    }else{
      apollo.removeClass(doc.getElementById('settings-signin-container'), 'hidden');
      apollo.addClass(doc.getElementById('settings-signout-container'), 'hidden');
    }

  }

  return {
    init: function(){
      if(!doc) init();
    },
    restoreSettingStates: function(settings){
      restoreStates(settings);
    }
  }

}());