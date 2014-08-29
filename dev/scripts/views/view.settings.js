_v.settings = (function(){
  'use strict';

  var doc;

  function init(){
    doc = chrome.app.window.get('settings').contentWindow.document;
  }

  
  function restoreStates(settings){
    // Set Theme
    doc.getElementById('settings-theme-select').value = settings.theme;
    //Set Last Worked on Checkbox
    doc.getElementById('settings-open-check').checked = settings.autoload;
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