/*! Local Storage - Used for temp data
/*  ----------------------------------
/*  Saves data and retores on load.
/*  This is not the database, for permanent
/*  storage look at mockbox.database.js 
*/

_mock.storage = (function(){
'use strict'; 

  function setEditorValues(){
    chrome.storage.sync.get('editors', function(result){
      _mock.restoreFromMemory(result['editors']);
    });
  }

  function saveEditorData(data){
    chrome.storage.sync.set({'editors':data}, function(){});
  }

  // function restoreFromLastGui(){
  //   chrome.storage.sync.get('lastId', function(result){
  //     _mock.database.restoreEditorsFromId(result['lastId']);
  //   });
  // }
  
  // function setLastGui(gui){
  //   chrome.storage.sync.set({'lastId':gui}, null);
  // }  

  // return {
  //   editors:{
  //     
  //     save: function(id){
  //       setLastGui(id);
  //     }  
  //   },
  //   drop:function(){
  //     chrome.storage.sync.clear();
  //   }
  // }

  return {
    editors:{
      restore: function(){
        restoreFromGui();
      },
      setValues: function(){
        setEditorValues();
      },
      get: function(){
        setEditorValues();
      },
      save: function(data){
        saveEditorData(data);
      }  
    },
    purge:function(){
      chrome.storage.sync.clear();
    }
  }

}());