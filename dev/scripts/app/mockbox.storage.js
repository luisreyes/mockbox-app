/*! Local Storage - Used for temp data
/*  ----------------------------------
/*  Saves data and retores on load.
/*  This is not the database, for permanent
/*  storage look at mockbox.database.js 
*/

_mock.storage = (function(){
'use strict'; 

  function _restoreSettings(){
    chrome.storage.sync.get('settings', function(result){
      
      var restoreData = {
        theme: result.settings.theme || 'dark',
        lastGui: result.settings.lastGui || null,
        autoload: result.settings.autoload || false
      }

      chrome.runtime.sendMessage({message:'restoreSettings', settings:restoreData});
    });
  }

  function _saveSettings(data){
    chrome.storage.sync.set({'settings':data});
  }

  return {
    preferences:{
      restore: function(){
        _restoreSettings();
      },
      save: function(data){
        _saveSettings(data);
      }
    },
    purge:function(){
      chrome.storage.sync.clear();
    }
  };

}());