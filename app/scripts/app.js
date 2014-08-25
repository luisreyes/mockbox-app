/*! MockBox - Prorotype builder
/*  Author: Luis Reyes <luis@luisreyes.com>
/*  Url: mockbox.io
*/
var MockBox; 

(function(){ var _mock = (function(){
'use strict'; 
  
  var _p = {},
      currentGui = null,
      nodeHtml = document.getElementById('html').querySelector('.code'),
      nodeCss  = document.getElementById('css').querySelector('.code'),
      nodeJs   = document.getElementById('js').querySelector('.code'),
      nodeView = document.getElementById('view').querySelector('.code'),
      header = document.getElementById('app-header'),
      sidebar = document.getElementById('app-sidebar'),
      sidebarToggle = document.getElementById('app-sidebar-toggle'),
      nodeEditors = document.getElementById('app-editors');

  function init(){
    
    //Init splitview
    splitview.init({
      main:'app-editors',
      layout:'50,50,25',
      containers:{
        tl:'html',
        tr:'css',
        bl:'js',
        br:'view'
      }
    });

    // Initialize modules
    initEditors();
    
    sidebarToggle.addEventListener('click', function(e){
    
      apollo.toggleClass(nodeEditors, 'open');
      apollo.toggleClass(header, 'open');
    
    });

    function sidebarToggleAnimationEnd(){
      apollo.toggleClass(sidebar, 'open'); 
      apollo.toggleClass(nodeEditors, 'open');
    }


    // Restore from memory
    //_mock.storage.editors.restore();

    // Init Clicks
    _mock.clicks.init();

    chrome.runtime.onMessage.addListener(function(data) {
      switch(data.message){
         
         case 'closePopout': _mock.popout.close(data.popoutId);
         break;

         case 'loadItem': _mock.database.restoreEditorsFromId(data.gui);
         break;

         default: return;
         break;
      }
    });
  }

  /*******************/
  /* Editor Functions */
  /*******************/

  // Initialize Editors
  function initEditors(){

    var mixedMode = {
      name: "htmlmixed",
      scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache|\/x-jade/i,
                     mode: null},
                    {matches: /(text|application)\/(x-)?vb(a|script)/i,
                     mode: "vbscript"}]};

    // Initialize Main Code Editors
    _p.html  = new CodeMirror(nodeHtml,  { mode: mixedMode });
    _p.js    = new CodeMirror(nodeJs,    { mode: 'javascript' });
    _p.css   = new CodeMirror(nodeCss,   { mode: 'css' });

    // Set CodeMirror Options to all editors
    setGlobalEditorOption('lineNumbers', true);
    setGlobalEditorOption('fixedGutter', true);
    setGlobalEditorOption('styleActiveLine', true);
    setGlobalEditorOption('matchBrackets', true);
    setGlobalEditorOption('theme', 'mbo');

    // Listen for viewport size change
    splitview.addEventListener('resize', function(){
      
      // Refresh all editors (CodeMirror's gutter fix)
      for (var type in _p) {
        _p[type].refresh();
      }
    });


    _p.html.on('change', onEditorChange);
    _p.js  .on('change', onEditorChange);
    _p.css .on('change', onEditorChange);
    
    onEditorChange();
  }

  function setGlobalEditorOption(option, val){
    
    // Get passed 'option' and 'value' and set
    // it to all editors in the collection.
    for (var type in _p) {
      _p[type].setOption(option, val);
    }
  }

  function areAllEmpty(){
    for (var type in _p) {
      if(_p[type].getValue() !== ""){
        return true;
      }
    }
    return false;
  }

  function clearEditors(){
    for (var type in _p) {
      _p[type].setValue("");
      _p[type].clearHistory();
      _p[type].clearGutter();
    }
  }

  function setEditorsData(data){
    if(data){
      document.getElementById('app-header').querySelector('.project-name').innerHTML = data.name;
      _p.html.setValue(data['html']);
      _p.js.setValue(data['js']);
      _p.css.setValue(data['css']);
      updateIframe();
    }else{
      setGlobalEditorOption('value', '');
    }
  }

  function saveGuiToLs(){
    _mock.storage.editors.save(currentGui);
    updateIframe();
  }

  function onEditorChange(){
    updateIframe();
    if(areAllEmpty()){
      _mock.clicks.buttons.removeClass('save','inactive');
      _mock.clicks.buttons.removeClass('export','inactive');
    }else{
      _mock.clicks.buttons.addClass('save','inactive');
      _mock.clicks.buttons.addClass('export','inactive');
    }
    _mock.storage.editors.save(getSaveData());

  }


  function getSaveData(){
    return {
          gui : currentGui,
          name: document.getElementById('app-header').querySelector('.project-name').innerHTML,
          html: _p.html.getValue(),
          js  : _p.js.getValue(),
          css : _p.css.getValue()
        }
  }

  function exportPackage(){
    var _atHeader = '<!-- Prototype generated with MockBox v0.5.1 -->',
        zip = new JSZip(),
        styles = zip.folder("styles"),
        scripts = zip.folder("scripts");
    
    zip.file("index.html", _atHeader+'\n<!DOCTYPE html>\n<html>\n<head>\n<link rel="stylesheet" type="text/css" href="styles/atype.styles.css">\n</head>\n<body>\n'+_p.html.getValue()+'\n<script type="text/javascript" src="scripts/atype.scripts.js"></script>\n</body>\n</html>');
    styles.file("atype.styles.css", _p.css.getValue());
    scripts.file("atype.scripts.js", _p.js.getValue());
    
    var content = zip.generate({type:"blob"});
    
    //Save to system
    chrome.fileSystem.chooseEntry({type: 'saveFile', suggestedName:'mockbox.prototype.zip'}, function(writableFileEntry) {
      writableFileEntry.createWriter(function(writer) {
        writer.onerror = errorHandler;
        writer.onwriteend = function(e) {};
        writer.write(content, {type: 'application/zip'} );
      }, errorHandler);
    });

  }

  function errorHandler(e){}

  function updateIframe(){
    document.getElementById('compiled-view').contentWindow.postMessage(getSaveData(), '*');
   
  }

  return {
    init: function(){
      init();
    },
    restore: function(data){
      setEditorsData(data);
    },
    gui: {
      get: function(){ 
        return currentGui; 
      },
      set:function(gui){ 
        currentGui = gui;
        //saveGuiToLs();
      }
    },
    load: function(gui){
      _mock.database.restoreEditorsFromId(gui);
    },
    export: function(){
      exportPackage();
    },
    save: function(){
      if(areAllEmpty()){
        _mock.database.save(getSaveData());
      }
    },
    reset:function(){
      currentGui = null;
      document.getElementById('app-header').querySelector('.project-name').innerHTML = 'New Mock'
      clearEditors();
    }
  };

}());
_mock.clicks = (function(){
'use strict'; 
  var

  wndMain = chrome.app.window.get('main'),
  windowControls = document.getElementById("app-window-controls"),
  sidebar = document.getElementById('app-sidebar'),
  header = document.getElementById('app-header'),
  nodeName = header.querySelector('.project-name'),
  popoutWrapper = document.getElementById('app-popout'),
  popoutBase = popoutWrapper.querySelector('.base'),

  buttons = {
    new       :sidebar.querySelector('.new'),
    save      :sidebar.querySelector('.save'),
    load      :sidebar.querySelector('.load'),
    export    :sidebar.querySelector('.export'),
    settings  :sidebar.querySelector('.settings'),
    twitter   :sidebar.querySelector('.twitter'),
    email     :sidebar.querySelector('.email'),
    check     :header.querySelector('.icon_check'),
    appMin    :windowControls.querySelector('.window-min'),
    appMax    :windowControls.querySelector('.window-max'),
    appClose  :windowControls.querySelector('.window-close')
  },

  links = {
    twitter:'https://twitter.com/mockboxio',
    email:'mailto:boxes@mockbox.io?subject=Hello MockBox'
  };

  function addListeners(){
    
    // Window Frame Buttons Action

    buttons.appMin.addEventListener('click', function(e){
      chrome.app.window.current().minimize();
    });

    buttons.appMax.addEventListener('click', function(e){
      if(chrome.app.window.current().isMaximized()){
        chrome.app.window.current().restore();
      }else{
        chrome.app.window.current().maximize();
      }
    });

    buttons.appClose.addEventListener('click', function(e){
      var allWindows = chrome.app.window.getAll();
      for(var i = 0; i < allWindows.length; i++){
        allWindows[i].close();
      }
    });
    
    popoutBase.addEventListener('click', function(){
      var curWindow = chrome.app.window.get(_mock.popout.getCurrentId());
      curWindow.focus();
      curWindow.drawAttention();
    });

    // Sidebar Buttons Action

    buttons.new.addEventListener( 'click', _mock.reset );

    buttons.save.addEventListener( 'click', _mock.save );

    buttons.load.addEventListener( 'click', function(e){
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;
      if(!apollo.hasClass(element, 'inactive')){
        _mock.load.init();
        _mock.popout.open('load', function(){
          _mock.load.generateList();
        });
      }
    });

    buttons.export.addEventListener( 'click', function(e){
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;
      if(!apollo.hasClass(element, 'inactive')){
        _mock.popout.open('export');
      }
    });

    buttons.settings.addEventListener( 'click', function(e){
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;
      if(!apollo.hasClass(element, 'inactive')){
        _mock.popout.open('settings');
      }
    });
    
    
    buttons.twitter.addEventListener( 'click', function(){
      openLink('twitter');
    });

    buttons.email.addEventListener( 'click', function(){
      openLink('email');
    });

    buttons.check.addEventListener( 'click', function(){
     nodeName.blur();
    });
  }

  function openLink(loc){
    window.open(links[loc], '_blank');
  }

  function clickToEditProjectName(){
    nodeName.addEventListener('click', function(){
      nodeName.setAttribute('tabindex','-1');
      nodeName.setAttribute('contenteditable','true');
      apollo.addClass(nodeName,'editing');
      apollo.addClass(nodeName.nextSibling,'visible');
    });

    nodeName.addEventListener('blur', function(){
        
      nodeName.setAttribute('contenteditable','false');
      apollo.removeClass(nodeName,'editing');
      apollo.removeClass(nodeName.nextSibling,'visible');
    
    });
  }

  return {
    init: function(){
      addListeners();
      clickToEditProjectName();
    },
    buttons:{
      toggleClass:function(b, c){
        apollo.toggleClass(buttons[b],c);
      },
      addClass:function(b, c){
        apollo.addClass(buttons[b],c);
      },
      removeClass:function(b, c){
        apollo.removeClass(buttons[b],c);
      }
    }
  };

}());
_mock.database = (function(){

  var reqResult,
  listeningForResult = false,
  indexedDb = {};
  indexedDb.db = null;
  
  function init() {
    indexedDb.open(); // open displays the data previously saved
  }

  function getUID() {
      return ("000000" + (Math.random()*Math.pow(36,6) << 0).toString(36)).slice(-6)
  }

  indexedDb.open = function() {
    var version = 1;
    var request = window.indexedDB.open("MockBoxMasterDB", version);

    // We can only create Object stores in a versionchange transaction.
    request.onupgradeneeded = function(e) {
      var db = e.target.result;

      // A versionchange transaction is started automatically.
      e.target.transaction.onerror = indexedDb.onerror;
      
      if(db.objectStoreNames.contains("editor")) {
        db.deleteObjectStore("editor");
      }

      var store = db.createObjectStore("editor",{keyPath: "gui"});
      var projectNameIndex = store.createIndex("by_name", "name"),
          htmlIndex = store.createIndex("by_html", "html"),
          cssIndex = store.createIndex("by_css", "css"),
          jsIndex = store.createIndex("by_js", "js");
    };

    request.onsuccess = function(e) {
      indexedDb.db = e.target.result;
    };

    request.onerror = indexedDb.onerror;
  };

  indexedDb.addEditEntry = function(data) {
    var db = indexedDb.db,
        trans = db.transaction("editor", "readwrite"),
        store = trans.objectStore("editor"),
        currentGui = _mock.gui.get() || getUID();

    _mock.gui.set(currentGui);

    // Put Entry
    var entry = store.put({
      "gui" : currentGui,
      "name": data.name || "No Name",
      "html": data.html,
      "css": data.css,
      "js": data.js,
      "createdBy" : data.author || 'Someone',
      "UpdatedBy" : data.author || 'Someone',
      "createdOn" : new Date().getTime(),
      "updatedOn" : new Date().getTime()
    });

    entry.onsuccess = function(e) {
      // Re-render all the editors
      //console.log('New Entry Added');
    };

    entry.onerror = function(e) {
      //console.log(e.value);
    };
  };
  
  indexedDb.deleteEntry = function(id) {
    var db = indexedDb.db;
    var trans = db.transaction("editor", "readwrite");
    var store = trans.objectStore("editor");

    var request = store.delete(id);

    request.onsuccess = function(e) {
      //console.log('Entry Removed');
    };

    request.onerror = function(e) {
      //console.log(e.value);
    };
  };

  indexedDb.getAll = function() {
    var db = indexedDb.db;
    var transaction = db.transaction(["editor"]);
    var objectStore = transaction.objectStore("editor");

    var items = [];
    var request = objectStore.openCursor();

    request.onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        items.push(cursor.value);
        cursor.continue();
      }
      else {
        reqResult = items;
        _mock.events.dispatch('dbresult');
        //alert("Got all items: " + items);
      }
    };


    
    request.onerror = function(event) {
      // Handle errors!
    };
  }; 

  indexedDb.setEditorsFromId = function(id) {
    var db = indexedDb.db;
    var transaction = db.transaction(["editor"]);
    var objectStore = transaction.objectStore("editor");
    var request = objectStore.get(id);
    
    request.onsuccess = function(event) {
      // Do something with the request.result!
      _mock.gui.set(request.result.gui)
      _mock.restore(request.result);
    };
    
    request.onerror = function(event) {};
  }; 
  function onDbResult(callback){
    callback(reqResult);
    _mock.events.removeListener('dbresult', function(){
      onDbResult(callback);
    });
  }
  window.addEventListener("DOMContentLoaded", init, false);
  
  return {
    save: function(data){
      indexedDb.addEditEntry(data);
    },
    delete:function(id){
      indexedDb.deleteEntry(id);
    },
    restoreEditorsFromId: function(id){
      indexedDb.setEditorsFromId(id);
    },
    getAll:function(callback){
      indexedDb.getAll();
      if(!listeningForResult){
        _mock.events.addListener('dbresult', function(){
          onDbResult(callback);
        });
        listeningForResult = true;
      }
    }
  };

}());
_mock.events = (function () {
    'use strict';
    //Private Methods and Vars
    var _events = [];

    //Public Methods
    return {
        
        addListener: function (event, callback) {
            _events[event] = _events[event] || [];
            if (_events[event]) {
                _events[event].push(callback);
            }
        },

        removeListener: function (event, callback) {
            if (_events[event]) {
                var listeners = _events[event];
                for (var i = listeners.length - 1; i >= 0; --i) {
                    if (listeners[i] === callback) {
                        listeners.splice(i, 1);
                        return true;
                    }
                }
            }
            return false;
        },

        dispatch: function (event) {
            if (_events[event]) {
                var listeners = _events[event], len = listeners.length;
                while (len--) {
                    listeners[len](this); //callback with self
                }
            }
        }
    }
} ());
_mock.load = (function(){
  'use strict';

  var 
  doc,
  _availableIds,
  listContainer;

  function init(){
    doc = chrome.app.window.get('load').contentWindow.document;
  }

  function setAvailableIds(){
    _mock.database.getAll(function(result){
      _availableIds = result; 
      listContainer = doc.getElementById('mocks-list');
      listContainer.innerHTML = "";
      
      for (var i=0; i < _availableIds.length;i++){
        var newLi = doc.createElement('li');
        newLi.id = _availableIds[i].gui;
        newLi.addEventListener('click', function(){
           load(this.id);
        });
        
        newLi.innerHTML = _availableIds[i].name;
        listContainer.appendChild(newLi);
      } 
    });
    
  }

  function load(gui){
    chrome.runtime.sendMessage({message:'loadItem', gui:gui});
    _mock.reset();
    _mock.popout.close('load');
  }

  return {
    init: function(){
      if(!doc) init();
    },
    generateList: function(){
      setAvailableIds();
    }
  }

}());
_mock.notify = (function(){
'use strict'; 

  var _counter = 0;

  function _notify(options){
    var data = options || {},
        o = {
          type: data.type || 'basic',
          title: data.title || 'No Tilte',
          message: data.message || 'No Message',
          iconUrl: data.iconUrl || ""
        };
    
    chrome.notifications.create('id'+_counter, o, _callback);
  }

  function _callback(e){
    _counter++;
  }

  return {
    send: function(o){
      _notify(o)
    }
  };

}());
_mock.popout = (function(){
'use strict'; 
  var 
  popoutWrapper = document.getElementById('app-popout'),
  popoutBase = popoutWrapper.querySelector('.base'),
  currentId = '';

  function _open(loc, callback){
    currentId = loc;
    apollo.addClass(popoutBase, 'visible');
    chrome.app.window.get(loc).show();
    if(callback){
      callback();
    }
  }

  function _close(loc, callback){
    currentId = '';
    apollo.removeClass(popoutBase, 'visible');
    chrome.app.window.get(loc).hide();
    // should then invoke _mock.load('gui'); OR _mock.export();
  }

  return {
    open: function(location, callback){
      _open(location, callback);
    },
    close: function(location, callback){
      _close(location, callback);
    },
    getCurrentId: function(){
      return currentId;
    }
  };

}());
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
  };

}());
  _mock.init();

  //Expose
  MockBox = {
    load:function(gui){
      _mock.database.restoreEditorsFromId(gui);
    }
  };

}());