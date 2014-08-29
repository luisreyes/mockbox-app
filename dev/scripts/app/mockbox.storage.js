/*! Local Storage - Used for temp data
/*  ----------------------------------
/*  Saves data and retores on load.
/*  This is not the database, for permanent
/*  storage look at mockbox.database.js 
*/

_mock.storage = (function(){
'use strict'; 

  function _restorePreferences(){
    chrome.storage.sync.get('settings', function(result){
      chrome.runtime.sendMessage({message:'restoreSettings', preferences:result});
    });
  }

  function _savePreferences(data){
    chrome.storage.sync.set({'settings':data}, function(){
      console.log('setting saved');
    });
  }

  return {
    preferences:{
      restore: function(){
        _restorePreferences();
      },
      save: function(data){
        _savePreferences(data);
      }
    },
    purge:function(){
      chrome.storage.sync.clear();
    }
  };

}());