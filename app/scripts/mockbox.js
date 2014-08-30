/*! MockBox - Prorotype builder
/*  Author: Luis Reyes <luis@luisreyes.com>
/*  Url: mockbox.io
*/
var mockbox; 

(function(){ var _mock = (function(){
'use strict'; 
  
  var editors = {},
      currentGui = null,
      domHtml = document.getElementById('html').querySelector('.code'),
      domCss  = document.getElementById('css').querySelector('.code'),
      domJs   = document.getElementById('js').querySelector('.code'),
      domView = document.getElementById('view').querySelector('.code'),
      header = document.getElementById('app-header'),
      sidebar = document.getElementById('app-sidebar'),
      sidebarToggle = document.getElementById('app-sidebar-toggle'),
      domEditors = document.getElementById('app-editors'),
      defaultLayout = '50,50,25',
      _settings = {},
      windows = [];

  function init(){
    
    //Init splitview
    splitview.init({
      main:'app-editors',
      layout: defaultLayout,
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
    
      apollo.toggleClass(domEditors, 'open');
      apollo.toggleClass(header, 'open');
    
    });

    _mock.oauth.getToken({'interactive':false},function(token){
      _mock.oauth.getProfile();
    });

    // Restore from memory
    _mock.storage.preferences.restore();

    // Init Clicks
    _mock.clicks.init();

    // Collect All Windows
    windows = chrome.app.window.getAll();

    chrome.runtime.onMessage.addListener(function(data) {
      switch(data.message){
         
         case 'closePopout': _mock.popout.close(data.popoutId);
         break;

         case 'closeApp':
            // Save to storage
            saveSettings();
            
            // Loop and close all windows
            _mock.windows.closeAll();
         break;

         case 'loadItem': 
            _mock.database.restoreEditorsFromId(data.gui);
         break;

         case 'deleteItem': 
            _mock.database.delete(data.gui);
         break;

         case 'continuePopout': 
            _mock.popout.confirmCallback();
            _mock.popout.close(data.popoutId);
         break;


         case 'saveSettings': 
          
          // Cache the settings to a global var
          _settings = data.settings;
          
          //Save to storage
          saveSettings();

          // Apply settings         
          setSettings();
         break;

         case 'restoreSettings':
          // Cache the settings to a global var
          _settings = data.settings;

          // Open last if lastGui is avaliable
          if(_settings.lastGui && _settings.autoload){
            _mock.database.restoreEditorsFromId(_settings.lastGui);
          }

          // Apply settings     
          setSettings();
         break;

          case 'signin':
            _mock.oauth.getToken({'interactive':true},function(token){
              debugger;
            });
          break;

          case 'onProfileData':
            console.log(data);
            var profileContainer = document.getElementById('profile-container');
            var imageNode = profileContainer.querySelector('.profile-img');
            var nameNode = profileContainer.querySelector('.profile-name');
            debugger;
            imageNode.setAttribute('src',data.profile.image.url);
            nameNode.innerHTML(data.profile.displayName);
          break;

         default: return;
         break;
      }
    });
  }

  function saveSettings(){
    // Add currentGui to the settings model
    _settings.lastGui = currentGui;
    
    // Save the settings
    _mock.storage.preferences.save(_settings);
  }

  function setSettings(){
    // Set Convert to theme css name
    var theme = (_settings.theme === 'dark') ? 'mbo' : 'xq-light';
    
    //Set Editos Theme
    setGlobalEditorOption('theme', theme);
    
    // Change css file
    chrome.app.window.get('main').contentWindow.document.getElementById('mockbox-styles').setAttribute('href', 'styles/mockbox-' + _settings.theme + '.css');

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
    editors.html  = new CodeMirror(domHtml,  { mode: mixedMode });
    editors.js    = new CodeMirror(domJs,    { mode: 'javascript' });
    editors.css   = new CodeMirror(domCss,   { mode: 'css' });

    // Set CodeMirror Options to all editors
    setGlobalEditorOption('lineNumbers', true);
    setGlobalEditorOption('fixedGutter', true);
    setGlobalEditorOption('styleActiveLine', true);
    setGlobalEditorOption('matchBrackets', true);
    setGlobalEditorOption('theme', 'mbo');

    // Listen for viewport size change
    splitview.addEventListener('resize', function(){
      //Set Dirty to trigger save. Since layout is saved with project
      _mock.utils.isDirty(true);
      // Refresh all editors (CodeMirror's gutter fix)
      for (var type in editors) {
        editors[type].refresh();
      }
    });


    editors.html.on('change', onEditorChange);
    editors.js  .on('change', onEditorChange);
    editors.css .on('change', onEditorChange);
    
    onEditorChange();
    _mock.utils.isDirty(false);
  }

  function setGlobalEditorOption(option, val){
    
    // Get passed 'option' and 'value' and set
    // it to all editors in the collection.
    for (var type in editors) {
      editors[type].setOption(option, val);
    }
  }

  function areAllEmpty(){
    // Check if all editors are empty
    for (var type in editors) {
      if(editors[type].getValue() !== ""){
        return true;
      }
    }
    return false;
  }

  function clearEditors(){
    // Loop all editors
    for (var type in editors) {
      editors[type].setValue("");
      editors[type].clearHistory();
      editors[type].clearGutter();
    }
  }

  function setEditorsData(data){
    if(data){
      document.getElementById('app-header').querySelector('.project-name').innerHTML = data.name;
      editors.html.setValue(data['html']);
      editors.js.setValue(data['js']);
      editors.css.setValue(data['css']);
      splitview.setLayout(data['layout'][0],data['layout'][1],data['layout'][2]);
      updateIframe();
      _mock.utils.isDirty(false);
    }else{
      setGlobalEditorOption('value', '');
    }
  }

  function savePreferences(){
    var data ={
      'loadLast':true,
      'theme':'light'
    };
    _mock.storage.preferences.save(data);
  }

  function onEditorChange(){
    updateIframe();
    _mock.utils.isDirty(true);
    if(areAllEmpty()){
      _mock.clicks.buttons.removeClass('save','inactive');
      _mock.clicks.buttons.removeClass('export','inactive');
    }else{

      _mock.clicks.buttons.addClass('save','inactive');
      _mock.clicks.buttons.addClass('export','inactive');
    }

  }


  function getSaveData(){
    var size0 = document.getElementById('html').style.height,
        size1 = document.getElementById('css').style.width,
        size2 = document.getElementById('css').style.height;
    return {
          gui : currentGui,
          name: document.getElementById('app-header').querySelector('.project-name').innerHTML,
          html: editors.html.getValue(),
          js  : editors.js.getValue(),
          css : editors.css.getValue(),
          layout: [
            size0.substr(0,size0.length-1),
            size1.substr(0,size1.length-1),
            size2.substr(0,size2.length-1)
            ]
        }

  }

  function exportPackage(){
    var _atHeader = '<!-- Prototype generated with MockBox v0.5.1 -->',
        zip = new JSZip(),
        styles = zip.folder("styles"),
        scripts = zip.folder("scripts");
    
    zip.file("index.html", _atHeader+'\n<!DOCTYPE html>\n<html>\n<head>\n<link rel="stylesheet" type="text/css" href="styles/atype.styles.css">\n</head>\n<body>\n'+editors.html.getValue()+'\n<script type="text/javascript" src="scripts/atype.scripts.js"></script>\n</body>\n</html>');
    styles.file("atype.styles.css", editors.css.getValue());
    scripts.file("atype.scripts.js", editors.js.getValue());
    
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

  function _reset(){
    currentGui = null;
    document.getElementById('app-header').querySelector('.project-name').innerHTML = 'New Mock';
    var l = defaultLayout.split(',');
    splitview.setLayout(l[0],l[1],l[2]);
    clearEditors();
    _mock.utils.isDirty(false);
  }

  mockbox = this;

  return {
    init: function(){
      init();
    },
    getSettings: function(){ 
      return _settings;
    },
    restore: function(data){
      setEditorsData(data);
    },
    gui: function(){
      if(arguments.length){
        currentGui = arguments[0];
      }else{
        return currentGui;
      }
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
      if(mockbox.isDirty()){
        mockbox.popout.confirm('continue',function(){
          _reset();            
        });      
      }else{
        _reset();  
      }
      
    }
  };

}());
_mock.clicks = (function(){
'use strict'; 
  var

  // Main Chrome Window
  wndMain = chrome.app.window.get('main'),
  
  // Main Chrome Window Controls (Minimize, Maximize, Close)
  windowControls = document.getElementById("app-window-controls"),
  
  // Main Sidebar Container
  sidebar = document.getElementById('app-sidebar'),
  
  // Main Header
  header = document.getElementById('app-header'),

  // Project Name on Main Header
  mockName = header.querySelector('.project-name'),
  
  // Popout element on Main Window
  popoutWrapper = document.getElementById('app-popout'),
  
  // Popout element on Main Window
  popoutOverlay = popoutWrapper.querySelector('.overlay'),

  // Collection of buttons
  buttons = {

    // Navigation
    new       :sidebar.querySelector('.new'),
    save      :sidebar.querySelector('.save'),
    mocks      :sidebar.querySelector('.mocks'),
    export    :sidebar.querySelector('.export'),
    settings  :sidebar.querySelector('.settings'),
    twitter   :sidebar.querySelector('.twitter'),
    email     :sidebar.querySelector('.email'),
    
    // Header Bar
    check     :header.querySelector('.icon_check'),
    
    // Application Chrome Controls
    appMin    :windowControls.querySelector('.window-min'),
    appMax    :windowControls.querySelector('.window-max'),
    appClose  :windowControls.querySelector('.window-close')

  },

  // External Links
  links = {
    twitter:'https://twitter.com/mockboxio',
    email:'mailto:boxes@mockbox.io?subject=Hello MockBox'
  };

  // Main Listeners
  function addListeners(){
    
    // ---------------------------------------------- //
    // Application Chrome Window Frame Buttons Action
    // ---------------------------------------------- //

    // Minimize Window
    buttons.appMin.addEventListener('click', function(e){
      chrome.app.window.current().minimize();
    });

    // Toggle Maximize Window
    buttons.appMax.addEventListener('click', function(e){
      // Check if the window is maximized
      if(chrome.app.window.current().isMaximized()){
        // Set back to size
        chrome.app.window.current().restore();
      }else{
        // Maximize to screen
        chrome.app.window.current().maximize();
      }
    });

    // Close Application and all it's Windows
    buttons.appClose.addEventListener('click', function(e){
      // Before closing the app check if any data needs saving
      if(mockbox.isDirty()){
        // Display Confirm Dialog
        mockbox.popout.confirm('continue',function(){
          // If continue the close
          closeMethods();
        });
      }else{
        // There is no need to save, close the app
        closeMethods();
      }  

      // Encapsulated code to close the app
      function closeMethods(){
        chrome.runtime.sendMessage({message:'closeApp'});
      }
    });
    



    // ---------------------------------------------- //
    // Additional Clicks
    // ---------------------------------------------- //


    // Overlay click to trigger Focus and Attention to Popout Window
    popoutOverlay.addEventListener('click', function(){
      // Set the current window var to the current window
      // This method is used to brin attention to a window in case it falls behind the main window
      var curWindow = chrome.app.window.get(_mock.popout.getCurrentId());
      curWindow.focus();
      curWindow.drawAttention();
    });
    
    // Project Name Accept
    buttons.check.addEventListener( 'click', function(){
     mockName.blur();
    });


    // ---------------------------------------------- //
    // Additional Clicks
    // ---------------------------------------------- //    

    // Sidebar Buttons Action

    // New Button
    buttons.new.addEventListener( 'click', _mock.reset );

    // Save Button
    buttons.save.addEventListener( 'click', _mock.save );

    buttons.mocks.addEventListener( 'click', function(e){
      
      // Verify the click happens opn the LI in the sidebar navigation
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;
      
      // If it has a class 'inactive' ignore the click
      if(!apollo.hasClass(element, 'inactive')){
        // Open the window and run the function
        _mock.popout.open('mocks', function(){
          // init the views js file
          views.mocks.init();
          // Generate the list to display
          views.mocks.generateList();
        });
      }
    });


    buttons.export.addEventListener( 'click', function(e){
      
      // Verify the click happens opn the LI in the sidebar navigation
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;
      
      // If it has a class 'inactive' ignore the click
      if(!apollo.hasClass(element, 'inactive')){
        // Open the window and run the function
        _mock.popout.open('export', function(){
          // Methods to run on window load
          // TODO
        });
      }
    });

    buttons.settings.addEventListener( 'click', function(e){

      // Verify the click happens opn the LI in the sidebar navigation
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;
      
      // If it has a class 'inactive' ignore the click
      if(!apollo.hasClass(element, 'inactive')){
        // Open the window and run the function
        _mock.popout.open('settings', function(){
          // init the views js file
          views.settings.init();
          // Restore settings from memory
          views.settings.restoreSettingStates(mockbox.getSettings());
        });
      }
    });
    
    buttons.twitter.addEventListener( 'click', function(){
      // Open external page
      openLink('twitter');
    });

    buttons.email.addEventListener( 'click', function(){
      // Open external page
      openLink('email');
    });

    
  }

  function openLink(loc){
    // Open external page
    window.open(links[loc], '_blank');
  }

  function clickToEditProjectName(){
    // Cache initial value to manage dirty flag
    var initValue = mockName.innerHTML, newValue;
    // On click of the field
    mockName.addEventListener('click', function(){
      
      // Add tabindex for 'focus' management
      mockName.setAttribute('tabindex','-1');
      
      //Set attribute to edit the content
      mockName.setAttribute('contenteditable','true');
      
      // Set classes for editing styles
      apollo.addClass(mockName,'editing');
      // Display the check to accept changes
      apollo.addClass(mockName.nextSibling,'visible');
      
    });

    // On 'blur' of the field
    mockName.addEventListener('blur', function(){
      
      // Cache new value for comparison and dirty flag management
      newValue = mockName.innerHTML;

      //Set dirty if it is
      _mock.utils.isDirty(!(newValue === initValue));  
      
      // Restore to non edit styles
      mockName.setAttribute('contenteditable','false');
      apollo.removeClass(mockName,'editing');
      
      // Hide 'check'
      apollo.removeClass(mockName.nextSibling,'visible');
    
    });
  }

  return {
    init: function(){
      // Add Button listeners
      addListeners();
      // Addlistener to name edit
      clickToEditProjectName();
    },

    // Methods to manipulate classes on button i.e add 'inactive' class to buttons from outside this namespace
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
    // open displays the data previously saved
    indexedDb.open(); 
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
      var createdByIndex = store.createIndex("by_createdBy", "createdBy"),
          guiIndex = store.createIndex("by_gui", "gui");
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
        currentGui = _mock.gui() || getUID();

    _mock.gui(currentGui);
    
    // Put Entry
    var entry = store.put({
      "gui" : currentGui,
      "name": data.name || "No Name",
      "html": data.html,
      "css": data.css,
      "js": data.js,
      "layout": data.layout,
      "layout": data.layout,
      "createdBy" : data.author || 'Someone',
      "updatedBy" : data.author || 'Someone',
      "createdOn" : new Date().getTime(),
      "updatedOn" : new Date().getTime()
    });

    entry.onsuccess = function(e) {
      // Re-render all the editors
      mockbox.isDirty(false);
      mockbox.notify({iconUrl:'icons/notifications/check.png',message:'Saved Successfully'});
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
      mockbox.notify({iconUrl:'icons/notifications/error.png', message:'Deleted'});
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
      _mock.gui(request.result.gui);
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
_mock.notify = (function(){
'use strict'; 

  var _counter = 0;

  function _notify(options){
    var data = options || {},
        o = {
          type: data.type || 'basic',
          title: data.title || 'MockBox',
          message: data.message || '',
          iconUrl: data.iconUrl || "icons/mockbox96.png"
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
_mock.oauth = (function(){
  'use strict';

  function _getToken(type,callback){
    
    chrome.identity.getAuthToken(type, callback);
  }

  function _getProfile(){
    chrome.identity.getProfileUserInfo(function(userInfo){
      //make url request here
      
      if(userInfo.id){
        var url = 'https://www.googleapis.com/plus/v1/people/'+userInfo.id+'?fields=displayName%2C+image/url&key=AIzaSyCgvqfmrNPXDPB-p1JGUINbqhhKG_awYOY';
        var response = {};
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function (e) {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              response = JSON.parse(xhr.responseText);
              chrome.runtime.sendMessage({message:'onProfileData', profile:response});
            } else {
              console.error(xhr.statusText);
            }
          }
        };
        xhr.onerror = function (e) {
          console.error(xhr.statusText);
        };
        xhr.send(null);
      }
    });
  }

  return {
    getToken:function(t,c){
      _getToken(t,c);
    },
    getProfile:function(){
      _getProfile();
    }
  }

}());
_mock.popout = (function(){
'use strict'; 
  var 
  popoutWrapper = document.getElementById('app-popout'),
  popoutOverlay = popoutWrapper.querySelector('.overlay'),
  _confirmCallback = null,
  currentId = '';

  function _open(id, callback){
    currentId = id;
    apollo.addClass(popoutOverlay, 'visible');
    _mock.windows.show(id,callback);
  }

  function _close(id, callback){
    currentId = '';
    apollo.removeClass(popoutOverlay, 'visible');
    _mock.windows.hide(id);
  }

  function callConfirmCallback(){
    _confirmCallback();
  }

  function _confirm(type, callback){
    currentId = 'confirm';
    
    _mock.popout.open('confirm', function(){
      chrome.runtime.sendMessage({message:'confirmType', type:type});
      apollo.addClass(popoutOverlay, 'visible');
      if(callback){
        _confirmCallback = callback;
      }
    });

    
  }

  return {
    open: function(id, callback){
      _open(id, callback);
    },
    close: function(id, callback){
      _close(id, callback);
    },
    getCurrentId: function(){
      return currentId;
    },
    confirm: function(type, callback){
      _confirm(type,callback);
    }, 
    confirmCallback: function(){
      callConfirmCallback();
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

  function _restoreSettings(){
    chrome.storage.sync.get('settings', function(result){
      var data = {};
      if(!result.settings){
        data.theme = 'dark';
        data.lastGui = null;
        data.autoload = true;
      }else{
        data = result.settings;
      }
      chrome.runtime.sendMessage({message:'restoreSettings', settings:data});
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
_mock.utils = (function(){
  'use strict';
  var _isDirty = false;

  function toDate(eObj){
    var mEpoch = parseInt(eObj), dDate = new Date();

    if(mEpoch<10000000000) mEpoch *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)

    dDate.setTime(mEpoch);
    
    return dDate.toLocaleDateString();
  }

  Element.prototype.remove = function() {
      this.parentElement.removeChild(this);
  }
  
  NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
      for(var i = 0, len = this.length; i < len; i++) {
          if(this[i] && this[i].parentElement) {
              this[i].parentElement.removeChild(this[i]);
          }
      }
  }

  

  return {
    toDate: function(epoch){
      return toDate(epoch);
    }, 
    isDirty:function(){
      if(arguments.length){
        _isDirty = arguments[0];
      }else{
        return _isDirty;
      }
    }
    
  }

}());
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
  _mock.init();
  //Expose
  mockbox = {
    load:function(gui){
      _mock.database.restoreEditorsFromId(gui);
    },
    getSettings: function(){
      return _mock.getSettings();
    },
    getAll:function(callback){
      return _mock.database.getAll(callback);
    },
    popout:_mock.popout,
    reset:function(){
      return _mock.reset();
    },
    utils:_mock.utils,
    notify:function(o){
      _mock.notify.send(o);
    },
    isDirty:_mock.utils.isDirty
  };

}());