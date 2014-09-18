_mock.windows = (function(){
'use strict'; 
  var ids = ['main'];

  var globals = {
    frame:'none',
    hidden:true
  };

  var model = {
    confirm :{
      file:'popout_confirm.html',
      created: false,
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

    load :{
      file:'popout_load.html',
      created: false,
      options:{
        id:'load',
        frame: globals.frame,
        hidden: globals.hidden,
        resizable:false,
        bounds: {
          width: 500,
          height: 450
        }
      }
    },

    settings :{
      file:'popout_settings.html',
      created: false,
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
      created: false,
      options:{
        id:'export',
        frame: globals.frame,
        hidden: globals.hidden,
        resizable:false,
        bounds: {
          width: 500,
          height: 460
        }
      }
    },

    about :{
      file:'popout_about.html',
      created: false,
      options:{
        id:'about',
        frame: globals.frame,
        hidden: globals.hidden,
        resizable:false,
        bounds: {
          width: 300,
          height: 300
        }
      }
    }

  };

  function _showCreate(id, callback){
    
    if(!model[id].created){
      
      // Create Window
      chrome.app.window.create(model[id].file, model[id].options, function(w){
        // Window Callback
        ids.push(id);
        model[id].created = true;
        w.contentWindow.addEventListener("DOMContentLoaded", function(){
          setWindowProperties(w);
          w.show();
          if(callback){
            callback();
          }
        }, false);        

      });
      
    }else{
      var win = chrome.app.window.get(id);
      setWindowProperties(win);
      win.show();
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
    });
    
    win.contentWindow.document.getElementById('mockbox-styles').setAttribute('href', 'styles/mockbox-' + theme + '.css');
  }

  function _hide(id, callback){
    if(model[id].created){
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