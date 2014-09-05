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
      header = document.getElementById('app-header'),
      splash = document.getElementById('app-splash'),
      splashAllow = document.getElementById('app-splash-access'),
      splashLoading = document.getElementById('app-splash-loading'),
      sidebarToggle = document.getElementById('app-sidebar-toggle'),
      domEditors = document.getElementById('app-editors'),
      defaultLayout = '50,50,25',
      _settings = {},
      tokens = {},
      sv;

  function init(){
    
    //Init splitview
    sv = splitview;
    sv.init({
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
    
    sidebarToggle.addEventListener('click', function(){
    
      apollo.toggleClass(domEditors, 'open');
      apollo.toggleClass(header, 'open');
    
    });

    chrome.runtime.onMessage.addListener(function(data) {
      switch(data.message){
         
         case 'closePopout': 
          // Close the popout with the passed id
            _mock.popout.close(data.popoutId);
         break;

         case 'closeApp':
          // Save to storage
            saveSettings(function(){
              // Loop and close all windows
                _mock.windows.closeAll();
            });            
         break;

         case 'onLoadItem': 
          // Restore working project from db by id
            _mock.database.restoreEditorsFromId(data.gui);
         break;

         case 'onDeleteItem': 
          // Delete the item by the passed id
            _mock.database.delete(data.gui);
         break;

         case 'onConfirm': 
         if(data.isAccept){
            // Call methods to continue i.e "Yes I would ike to loose changes and close the application"
            _mock.popout.confirmAcceptCallback();
          }else{
            // Call methods to cancel i.e "Yes I would ike to loose changes and close the application"
            _mock.popout.confirmDeclineCallback();
          }
          // Close the popout
            _mock.popout.close(data.popoutId);
         break;

         case 'saveSettings':
          // Cache the settings to a global var
            _settings = _mock.utils.Collect(_settings, data.settings);          
          //Save to storage
            saveSettings();
          // Apply settings         
            setSettings();
         break;

         case 'restoreSettings':
          // Cache the settings to a global var
            _settings = data.settings;
          // Apply settings     
            setSettings();

          // Get token for google account
          _mock.oauth.getToken({'interactive':false},function(token){
            if (chrome.runtime.lastError) {
              console.log(chrome.runtime.lastError);
            }else{
              tokens.google = token;
            }

            closeSplash();

          });
          
          // Open last if lastGui is avaliable
          if(_settings.lastGui && _settings.autoload){
            _mock.database.restoreEditorsFromId(_settings.lastGui);
          }

         break;

          case 'allowAccess':
           if(data.service === 'google-access'){
            _mock.oauth.getToken({'interactive':true}, function(token){
              
              // Error
              if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError);

              // No Error
              }else{
                tokens.google = token;
                //_mock.oauth.getLicense();
                _settings.isInited = true;
              }

              // Whether error or not
              if(!data.isSplashScreen){
                views.settings.updateAuthorizations();
              }
              saveSettings();
              closeSplash();
            });
          }else{
            console.log(data.service+' not yet implemented');
          }
            
          break;

          case 'revokeAccess':
            if(data.service === 'google-access'){
              mockbox.popout.confirm('revoke',function(){
                // If confirm accept
                chrome.identity.removeCachedAuthToken({token:tokens.google}, function(){
                    tokens.google = undefined;
                    views.settings.updateAuthorizations();
                  });
              }, function(){
                // If confirm decline
                views.settings.updateAuthorizations();
              });
            }else{
              console.log(data.service+' not yet implemented');
              views.settings.updateAuthorizations();
            }
          break;

          case 'later':
            _settings.isInited = true;
            apollo.addClass(splashAllow, 'hidden');
            apollo.removeClass(splashLoading, 'hidden');
            closeSplash();
            saveSettings();
          break;

          case 'onFirstRun':
            apollo.removeClass(splashAllow, 'hidden');
            apollo.addClass(splashLoading, 'hidden');

            // Defulat App Settings
            _settings.theme = 'light';
            _settings.lastGui = null;
            _settings.autoload = true;

            saveSettings();
          break;

          case 'onDirty':
            if(data.isDirty){
              _mock.clicks.buttons.removeClass('save','inactive');
            }else{
              _mock.clicks.buttons.addClass('save','inactive');
            }
          break;

          default: return;
      }
    });

    // Restore from memory
    _mock.storage.preferences.restore();
    
    // Init Clicks
    _mock.clicks.init();
  }

  function closeSplash(){
    window.setTimeout(function(){
      apollo.addClass(splash, 'opaque');
      splash.addEventListener('webkitTransitionEnd', function() {
        apollo.addClass(splash, 'hidden');
      });
    }, 900);
  }

  function saveSettings(callback){
    // Add currentGui to the settings model
    _settings.lastGui = currentGui;
    // Save the settings
    _mock.storage.preferences.save(_settings, callback);
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
    setGlobalEditorOption('theme', 'xq-light');

    // Listen for viewport size change
    sv.addEventListener('resize', function(){
      //Set Dirty to trigger save. Since layout is saved with project
      _mock.utils.isDirty(true);
      // Refresh all editors (CodeMirror's gutter fix)
      for (var type in editors) {
        if (editors.hasOwnProperty(type)) {
          editors[type].refresh();
        }
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
        if (editors.hasOwnProperty(type)) {
          editors[type].setOption(option, val);
        }
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
      if (editors.hasOwnProperty(type)) {
        editors[type].setValue("");
        editors[type].clearHistory();
        editors[type].clearGutter();
      }
    }
  }

  function setEditorsData(data){
    if(data){
      document.getElementById('app-header').querySelector('.project-name').innerHTML = data.name;
      editors.html.setValue( data.html );
      editors.js.setValue( data.js );
      editors.css.setValue( data.css );
      sv.setLayout( data.layout[0], data.layout[1], data.layout[2] );
      updateIframe();
      _mock.utils.isDirty(false);
    }else{
      setGlobalEditorOption('value', '');
    }
  }

  function onEditorChange(){
    updateIframe();
    _mock.utils.isDirty(true);
    if(areAllEmpty()){
      //_mock.clicks.buttons.removeClass('save','inactive');
      _mock.clicks.buttons.removeClass('export','inactive');
    }else{

      //_mock.clicks.buttons.addClass('save','inactive');
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
        };

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
        writer.onwriteend = function(e) { console.log(e); };
        writer.write(content, {type: 'application/zip'} );
      }, errorHandler);
    });

  }

  function errorHandler(e){ console.log(e); }

  function updateIframe(){
    document.getElementById('compiled-view').contentWindow.postMessage(getSaveData(), '*');
   
  }

  function _reset(){
    currentGui = null;
    document.getElementById('app-header').querySelector('.project-name').innerHTML = 'New Mock';
    var l = defaultLayout.split(',');
    sv.setLayout(l[0],l[1],l[2]);
    clearEditors();
    _mock.utils.isDirty(false);
  }

  mockbox = this;

  return {
    init: function(){
      _mock.database.init();
      init();

    },
    tokens: function(){
      return tokens;
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
      //if(areAllEmpty()){
        _mock.database.save(getSaveData());
        //_mock.clicks.buttons.addClass('save','inactive');
      //}
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

  // Splash
  splash = document.getElementById('app-splash'),

  // Project Name on Main Header
  mockName = header.querySelector('.project-name'),
  
  // Popout element on Main Window
  popoutWrapper = document.getElementById('app-popout'),
  
  // Popout element on Main Window
  popoutOverlay = popoutWrapper.querySelector('.overlay'),

  // Collection of buttons
  buttons = {

    // Navigation
    profileLink:sidebar.querySelector('.profile-name'),
    profileImg:sidebar.querySelector('.profile-img'),
    new       :sidebar.querySelector('.new'),
    save      :sidebar.querySelector('.save'),
    mocks     :sidebar.querySelector('.mocks'),
    export    :sidebar.querySelector('.export'),
    about     :sidebar.querySelector('.about'),
    profile   :sidebar.querySelector('.profile-settings'),
    twitter   :sidebar.querySelector('.twitter'),
    email     :sidebar.querySelector('.email'),

    //Splash
    allow    :splash.querySelector('.allow'),
    later     :splash.querySelector('.maybelater'),
    
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
    email:'mailto:support@mockbox.io?subject=Hello MockBox'
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
    buttons.new.addEventListener( 'click', function(e){
      // Verify the click happens opn the LI in the sidebar navigation
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;

      // If it has a class 'inactive' ignore the click
      if(!apollo.hasClass(element, 'inactive')){
        _mock.reset();
      }
    });

    // Save Button
    buttons.save.addEventListener( 'click', function(e){
      // Verify the click happens opn the LI in the sidebar navigation
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;
      
      // If it has a class 'inactive' ignore the click
      if(!apollo.hasClass(element, 'inactive')){
        _mock.save();
      }
    });

    // About
    buttons.about.addEventListener( 'click', function(){
      _mock.popout.open('about', function(){
          // init the views js file
          views.about.init();
          // Generate the list to display
          //views.mocks.generateList();
        });
    });

    // Splash Signin Button
    buttons.allow.addEventListener( 'click', function(){
      chrome.runtime.sendMessage({message:'allowAccess', isSplashScreen:true, service: 'google-access'});
    });

    buttons.profileLink.addEventListener( 'click', function(e){
      signin();
    });

    buttons.profileImg.addEventListener( 'click', function(e){
      signin();
    });

    // Splash Later Button
    buttons.later.addEventListener( 'click', function(){
      chrome.runtime.sendMessage({message:'later' });
    });

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

    buttons.profile.addEventListener( 'click', function(e){

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
      
      google.payments.inapp.getPurchases({
        'success': function(){
          console.log('Purch Success');
        },
        'failure': function(){
          console.log('Purch fail');   
        }
      });

      google.payments.inapp.getSkuDetails({
          'parameters': {'env': 'prod'},
          'success': function(){
            console.log('SKU Success');
            console.log(arguments);
          },
          'failure': function(){
            console.log('SKU fail');
            console.log(arguments);   
          }
        });

      // Open external page
      //openLink('email');
    });

    
  }

  function openLink(loc){
    // Open external page
    window.open(links[loc], '_blank');
  }

  function signin(){}

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
      _mock.utils.isDirty(newValue !== initValue);  
      
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
      return ("000000" + (Math.random()*Math.pow(36,6) << 0).toString(36)).slice(-6);
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
  
  return {
    init:init,
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
    };
}());
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
      _notify(o);
    }
  };

}());
_mock.oauth = (function(){
  'use strict';
  var profile = {};
  var userId;

  function _getToken(type,callback){
    chrome.identity.getAuthToken(type, callback);
  }
  
  function _getLicense() {
    var CWS_LICENSE_API_URL = 'https://www.googleapis.com/chromewebstore/v1.1/userlicenses/';
    var req = new XMLHttpRequest();

    chrome.identity.getAuthToken({'interactive':true},function(token){
      req.open('GET', CWS_LICENSE_API_URL + chrome.runtime.id);
      req.setRequestHeader('Authorization', 'Bearer ' + token);
      
      req.onreadystatechange = function() {
        if (req.readyState == 4) {
          var license = JSON.parse(req.responseText);
          console.log(license);
        }
      }
      
      req.send();  
    });

    
    
  }

  return {
    getToken:function(t,c){
      _getToken(t,c);
    },
    getLicense: function(){
      _getLicense();
    }
  };

}());
_mock.popout = (function(){
'use strict'; 
  var 
  popoutWrapper = document.getElementById('app-popout'),
  popoutOverlay = popoutWrapper.querySelector('.overlay'),
  _confirmAcceptCallback = null,
  _confirmDeclineCallback = null,
  currentId = '',
  openCount = 0;

  function _open(id, callback){
    currentId = id;
    openCount++;
    apollo.addClass(popoutOverlay, 'visible');
    _mock.windows.show(id,callback);
  }

  function _close(id, callback){
    currentId = '';
    openCount--;
    // Helps not remove the overlay when multiple windows open
    if(openCount === 0){
      apollo.removeClass(popoutOverlay, 'visible');
    }
    _mock.windows.hide(id);
  }

  function _confirm(type, acceptCallback, declineCallback){
    currentId = 'confirm';
    
    _mock.popout.open('confirm', function(){
      chrome.runtime.sendMessage({message:'confirmType', type:type});
      apollo.addClass(popoutOverlay, 'visible');
      if(acceptCallback){
        _confirmAcceptCallback = acceptCallback;
      }
      if(declineCallback){
        _confirmDeclineCallback = declineCallback;
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
    confirm: function(type, acceptCallback, declineCallback){
      _confirm(type,acceptCallback,declineCallback);
    }, 
    confirmAcceptCallback: function(){
      _confirmAcceptCallback();
    },
    confirmDeclineCallback: function(){
      _confirmDeclineCallback();
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
      if(result.settings){
        var hasSettings = result.settings ? true : false;
      }
      

      if(hasSettings){
        if(result.settings.isInited){
          chrome.runtime.sendMessage({message:'restoreSettings', settings:result.settings});
        }else{
          chrome.runtime.sendMessage({message:'onFirstRun'});
        }
      }else{
        chrome.runtime.sendMessage({message:'onFirstRun'});
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

  function _isDirtyDispatcher(){
      chrome.runtime.sendMessage({message:'onDirty', isDirty:_isDirty });
  }

  function _Collect(baseObj, updateObj) {
    // Updates the base object with the new object
    var obj = baseObj; {
        for (var prop in updateObj) {
            var val = updateObj[prop];
            if (typeof val == "object") // this also applies to arrays or null!
                update(obj[prop], val);
            else
                obj[prop] = val;
        }
    }
    return obj;
}

  

  return {
    toDate: function(epoch){
      return toDate(epoch);
    }, 
    isDirty:function(){
      if(arguments.length){
        _isDirty = arguments[0];
        _isDirtyDispatcher();
      }else{
        return _isDirty;
      }
    },
    Collect: function(baseObj, updateObj){
      return _Collect(baseObj, updateObj);
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
    },

    about :{
      file:'popout_about.html',
      exists: false,
      options:{
        id:'about',
        frame: globals.frame,
        hidden: globals.hidden,
        resizable:false,
        bounds: {
          width: 300,
          height: 260
        }
      }
    },

    connection :{
      file:'popout_connection.html',
      exists: false,
      options:{
        id:'connection',
        frame: globals.frame,
        hidden: globals.hidden,
        resizable:false,
        bounds: {
          width: 400,
          height: 200
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
  window.addEventListener("DOMContentLoaded", _mock.init, false);

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
    getTokens: function(){
      return _mock.tokens();
    },
    isDirty:_mock.utils.isDirty
  };

}());