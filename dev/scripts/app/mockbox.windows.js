_mock.windows = (function(){
'use strict'; 
  var ids = ['main'];

  var globals ={
    frame:'none',
    hidden:false
  }
  var model = {
    
    confirm :{
      file:'popout_confirm.html',
      exists: false,
      options:{
        id:'confirm',
        frame: globals.frame,
        hidden: globals.hidden,
        resizable:false,
        bounds: {
          width: 400,
          height: 200
        }
      }
    },

    mocks :{
      file:'popout_mocks.html',
      exists: false,
      options:{
        id:'mocks',
        frame: globals.frame,
        hidden: globals.hidden,
        resizable:false,
        bounds: {
          width: 600,
          height: 460
        }
      }
    },

    settings :{
      file:'popout_settings.html',
      exists: false,
      options:{
        id:'settings',
        frame: globals.frame,
        hidden: globals.hidden,
        resizable:false,
        bounds: {
          width: 400,
          height: 400
        }
      }
    },

    export :{
      file:'popout_export.html',
      exists: false,
      options:{
        id:'export',
        frame: globals.frame,
        hidden: globals.hidden,
        resizable:false,
        bounds: {
          width: 600,
          height: 460
        }
      }
    }

  };

  function _showCreate(id, callback){
    
    if(!model[id].exists){
      
      // Create Window
      chrome.app.window.create(model[id].file, model[id].options, function(w){
        // Window Callback
        ids.push(id);
        model[id].exists = true;
        w.contentWindow.addEventListener("DOMContentLoaded", function(){
          setWindowProperties(w);
          if(callback){
            callback();
          }
        }, false);        

      });
      
    }else{
      var win = chrome.app.window.get(id);
      win.show();
      setWindowProperties(win);
      if(callback){
        callback();
      }  
      
    }
  }

  function setWindowProperties(win){
    var theme = mockbox.getSettings().theme,
        mainBounds = chrome.app.window.get('main').getBounds(),
        winBounds = win.getBounds();
    win.setBounds({
      left: Math.round((mainBounds.left+mainBounds.width/2) - (winBounds.width/2)),
      top: Math.round((mainBounds.top+mainBounds.height/2) - (winBounds.height/2))
    })
    win.contentWindow.document.getElementById('mockbox-styles').setAttribute('href', 'styles/mockbox-' + theme + '.css');
  }

  function _hide(id, callback){
    if(model[id].exists){
      chrome.app.window.get(id).hide();
      if(callback){
        callback();
      }
    }
  }

  function _closeAll(){
    ids.forEach(function(id){
      _close(id);
    });
    
  }

  function _close(id){
    chrome.app.window.get(id).close();
    
  }

  return {
    show: function(id, callback){
      _showCreate(id, callback);
    },
    hide: function(id, callback){
      _hide(id, callback);
    },
    closeAll:function(){
      _closeAll();
    },
    close:function(id){
      _close(id);
    },
    getAll: function(){
      return chrome.app.window.getAll();
    }
  };

}());