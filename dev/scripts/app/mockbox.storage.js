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
      if(!result.settings || result.settings.later){
        chrome.runtime.sendMessage({message:'onFirstRun'});
      }else{
        chrome.runtime.sendMessage({message:'restoreSettings', settings:result.settings});
      }
    });
  }

  function _saveSettings(data, callback){
    chrome.storage.sync.set({'settings':data}, function(){
      if(callback)
        callback();
    });
  }

  return {
    preferences:{
      restore: function(){
        _restoreSettings();
      },
      save: function(data, callback){
        _saveSettings(data, callback);
      }
    },
    purge:function(){
      chrome.storage.sync.clear();
    }
  };

}());