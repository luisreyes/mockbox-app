_v.settings = (function(){
  'use strict';

  var doc;

  function init(){
    doc = chrome.app.window.get('settings').contentWindow.document;
  }

  
  function restoreStates(data){
    // Set Theme
    doc.getElementById('settings-theme-select').value = data.settings.theme;
    //Set Last Worked on Checkbox
    doc.getElementById('settings-open-check').checked = data.settings.openOnLoad;
  }

  return {
    init: function(){
      if(!doc) init();
    },
    restoreSettingStates: function(data){
      restoreStates(data);
    }
  }

}());