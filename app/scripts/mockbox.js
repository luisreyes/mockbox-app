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
      sidebarToggleClasses = ['closed', 'open', 'open-half' ],
      currentSidebarToggleClassIndex,
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
      
      var currClass = sidebarToggleClasses[currentSidebarToggleClassIndex];
      
      if(currentSidebarToggleClassIndex === sidebarToggleClasses.length-1){ 
        currentSidebarToggleClassIndex = 0;
      }else{
        currentSidebarToggleClassIndex++;
      }      

      setSidebarState(currentSidebarToggleClassIndex);
    
    });

    chrome.runtime.onMessage.addListener(function(data) {
      switch(data.message){
         
         case 'closeApp':
          // Save to storage
            saveSettings(function(){
              // Loop and close all windows
                _mock.windows.closeAll();
            });            
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
              //console.log(chrome.runtime.lastError);
            }else{
              tokens.google = token;
            }

            closeSplash();

          });
          
          // Open last if lastGui is avaliable
          if(_settings.lastGui && _settings.autoload){
            _mock.database.restoreEditorsFromId(_settings.lastGui);
          }

          chrome.runtime.getPlatformInfo(function(p){
            apollo.addClass(document.body, p.os);
            apollo.removeClass(document.getElementById('app-window-controls'), 'hidden');
          });

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

            chrome.runtime.getPlatformInfo(function(p){
              apollo.addClass(document.body, p.os);
              apollo.removeClass(document.getElementById('app-window-controls'), 'hidden');
            });

            //apollo.removeClass(splashAllow, 'hidden');
            //apollo.addClass(splashLoading, 'hidden');

            // Defulat App Settings
            _settings.theme = 'light';
            _settings.lastGui = null;
            _settings.sidebarState = 1;
            _settings.autoload = true;

            currentSidebarToggleClassIndex = _settings.sidebarState;

            _settings.isInited = true;

            _mock.database.onReady(function(){
              var templates = _mock.templates.getAll();
              for(var i = 0; i < templates.length; i++){
                _mock.database.save('templates',templates[i], true);
              }  
            });

            closeSplash();
            saveSettings();

            

          break;
          default: return;
      }
    });

    // Restore from memory
    _mock.storage.preferences.restore();
    
    // Init Clicks
    _mock.clicks.init();
  }

  function setSidebarState(stateIndex){
    apollo.removeClass(domEditors, ['open','closed', 'open-half']);
    apollo.removeClass(header, ['open','closed', 'open-half']);

    apollo.addClass(domEditors, sidebarToggleClasses[stateIndex]);
    apollo.addClass(header, sidebarToggleClasses[stateIndex]);
  }

  function closeSplash(){
    window.setTimeout(function(){
      apollo.addClass(splash, 'opaque');
      apollo.removeClass(document.getElementById('app-header'), 'hidden');
      splash.addEventListener('webkitTransitionEnd', function() {
        apollo.addClass(splash, 'hidden');
      });
    }, 900);
  }

  function saveSettings(callback){
    // Add currentGui to the settings model
    _settings.lastGui = currentGui;
    // Set the sidebar state
    _settings.sidebarState = currentSidebarToggleClassIndex;
    // Save the settings
    _mock.storage.preferences.save(_settings, callback);
  }

  function setSettings(){
    // Set Convert to theme css name
    var theme = (_settings.theme === 'dark') ? 'mbo' : 'xq-light';
    
    //Set Editos Theme
    setGlobalEditorOption('theme', theme);
    // Set sidebar state
    currentSidebarToggleClassIndex = _settings.sidebarState;
    setSidebarState(currentSidebarToggleClassIndex);

    // Change css file
    chrome.app.window.get('main').contentWindow.document.getElementById('mockbox-styles').setAttribute('href', 'styles/mockbox-' + _settings.theme + '.css');

  }

  /*******************/
  /* Editor Functions */
  /*******************/

  // Initialize Editors
  function initEditors(){

    // var mixedMode = {
    //   name: "htmlmixed",
    //   scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache|\/x-jade/i,
    //                  mode: null},
    //                 {matches: /(text|application)\/(x-)?vb(a|script)/i,
    //                  mode: "vbscript"}]};

    // Initialize Main Code Editors
    editors.html  = new CodeMirror(domHtml,  { mode: 'htmlmixed' });
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

  function setEditorsData(data, fromTemplate){
    if(fromTemplate){currentGui = null;}
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
      _mock.clicks.buttons.removeClass('export','inactive');
    }else{
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
    document.getElementById('app-header').querySelector('.project-name').innerHTML = 'New Prototype';
    var l = defaultLayout.split(',');
    sv.setLayout(l[0],l[1],l[2]);
    clearEditors();
    _mock.utils.isDirty(false);
  }

  mockbox = this;

  return {
    init: function(){
      init();

    },
    tokens: function(){
      return tokens;
    },
    getSettings: function(){ 
      return _settings;
    },
    restore: function(data, fromTemplate){
      setEditorsData(data, fromTemplate);
    },
    gui: function(){
      if(arguments.length){
        currentGui = arguments[0];
      }else{
        return currentGui;
      }
    },
    getEditorsModel: function(){
      return { 
        html:{
          value:editors.html.getValue(),
          title:'main'
        }, 
        css:{
          value:editors.css.getValue(),
          title:'styles' 
        },
        js:{
          value:editors.js.getValue(),
          title:'scripts' 
        }
      };
    },
    export: function(){
      return exportPackage();
    },
    save: function(){
      _mock.database.save('prototypes',getSaveData());
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
  prototypeName = header.querySelector('.project-name'),
  
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
    load      :sidebar.querySelector('.load'),
    export    :sidebar.querySelector('.export'),
    about     :sidebar.querySelector('.about'),
    profile   :sidebar.querySelector('.profile-settings'),

    //Splash
    allow    :splash.querySelector('.allow'),
    later     :splash.querySelector('.maybelater'),
    
    // Header Bar
    check     :header.querySelector('.icon_check'),
    
    // Application Chrome Controls
    appMin    :windowControls.querySelector('.window-min'),
    appMax    :windowControls.querySelector('.window-max'),
    appClose  :windowControls.querySelector('.window-close')

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
     prototypeName.blur();
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

    buttons.load.addEventListener( 'click', function(e){
      
      // Verify the click happens opn the LI in the sidebar navigation
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;
      
      // If it has a class 'inactive' ignore the click
      if(!apollo.hasClass(element, 'inactive')){
        chrome.runtime.sendMessage({message:'onOpenPopout', popout:'load'});
      }
    });


    buttons.export.addEventListener( 'click', function(e){
      
      // Verify the click happens opn the LI in the sidebar navigation
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;
      
      // If it has a class 'inactive' ignore the click
      if(!apollo.hasClass(element, 'inactive')){
        chrome.runtime.sendMessage({message:'onOpenPopout', popout:'export'});
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

  }

  function signin(){}

  function clickToEditProjectName(){
    // Cache initial value to manage dirty flag
    var initValue = prototypeName.innerHTML, newValue;
   
    // On click of the field
    prototypeName.addEventListener('click', function(){
      
      // Add tabindex for 'focus' management
      prototypeName.setAttribute('tabindex','-1');
      
      //Set attribute to edit the content
      prototypeName.setAttribute('contenteditable','true');
      
      // Set classes for editing styles
      apollo.addClass(prototypeName,'editing');
      // Display the check to accept changes
      apollo.addClass(prototypeName.nextSibling,'visible');

      this.addEventListener('keypress', onKeypress);
      
    });

    // On 'blur' of the field
    prototypeName.addEventListener('blur', function(){
      
      // Cache new value for comparison and dirty flag management
      newValue = prototypeName.innerHTML;

      //Set dirty if it is
      _mock.utils.isDirty(newValue !== initValue);  
      
      // Restore to non edit styles
      prototypeName.setAttribute('contenteditable','false');
      apollo.removeClass(prototypeName,'editing');
      
      // Hide 'check'
      apollo.removeClass(prototypeName.nextSibling,'visible');

      this.removeEventListener('keypress', onKeypress);
    });
  }

  function onKeypress(e){
    if(e.keyCode === 13){
      e.target.blur();
    }
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
  indexedDb.db = null,
  _onReadyCallback = null;
  
  function init() {
    // open displays the data previously saved
    indexedDb.open(); 
  }

  indexedDb.open = function() {
    var version = 1;
    var request = window.indexedDB.open("MockBoxMasterDB", version);

    // We can only create Object stores in a versionchange transaction.
    request.onupgradeneeded = function(e) {
      var db = e.target.result;

      // A versionchange transaction is started automatically.
      e.target.transaction.onerror = indexedDb.onerror;
      
      if(db.objectStoreNames.contains("prototypes")) {
        db.deleteObjectStore("prototypes");
      }

      if(db.objectStoreNames.contains("templates")) {
        db.deleteObjectStore("templates");
      }

      var store = db.createObjectStore("prototypes",{keyPath: "gui"});
      var guiIndex = store.createIndex("by_prototypeId", "gui");

      var store2 = db.createObjectStore("templates",{keyPath: "gui"});
      var guiIndex2 = store2.createIndex("by_templateId", "gui");
    };

    request.onsuccess = function(e) {
      indexedDb.db = e.target.result;
      _onReadyCallback && _onReadyCallback();
    };

    request.onerror = indexedDb.onerror;
  };

  indexedDb.addEditEntry = function(table, data, suppressNotification) {
    var db = indexedDb.db,
        trans = db.transaction(table, "readwrite"),
        store = trans.objectStore(table),
        currentGui = _mock.gui() || _mock.utils.getGUID();

    if(table !== 'templates'){
      _mock.gui(currentGui);
    }
    
    // Put Entry
    var entry = store.put({
      "gui" : (table === 'templates') ? _mock.utils.getGUID() : currentGui,
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
      !suppressNotification && mockbox.notify({type:'success',message:'Saved Successfully'});
    };

    entry.onerror = function(e) {
      mockbox.notify({type:'error',message:'Problem Saving: ' + e.toString()});
    };
  };
  
  indexedDb.deleteEntry = function(id, table) {
    var db = indexedDb.db;
    var trans = db.transaction(table, "readwrite");
    var store = trans.objectStore(table);

    var request = store.delete(id);

    request.onsuccess = function(e) {
      mockbox.notify({type:'error', message:'Deleted'});
    };

    request.onerror = function(e) {
    };
  };

  indexedDb.getAll = function(table, callback) {
    var db = indexedDb.db;
    var transaction = db.transaction([table]);
    var objectStore = transaction.objectStore(table);

    var items = [];
    var callback = callback;
    var request = objectStore.openCursor();

    request.onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        items.push(cursor.value);
        cursor.continue();
      }
      else {
        callback(items);
      }
    };


    
    request.onerror = function(event) {
      // Handle errors!
    };
  }; 

  indexedDb.setEditorsFromId = function(id, isTemplate) {
    var db = indexedDb.db;
    var table = isTemplate ? 'templates' : 'prototypes'
    var transaction = db.transaction([table]);
    var objectStore = transaction.objectStore(table);
    var request = objectStore.get(id);
    
    request.onsuccess = function(event) {
      if(request.result){
        // Do something with the request.result!
        mockbox.notify({type:'info', message:'Loaded ' + request.result.name});
        var gui = isTemplate ? _mock.utils.getGUID() : request.result.gui;
        _mock.gui(gui);
        _mock.restore(request.result, isTemplate);
      }
    };
    
    request.onerror = function(event) {};
  }; 


  return {
    init:init,
    save: function(table, data, suppressNotification){
      indexedDb.addEditEntry(table, data, suppressNotification);
    },
    delete:function(id){
      indexedDb.deleteEntry(id, 'prototypes');
    },
    restoreEditorsFromId: function(id, isTemplate){
      indexedDb.setEditorsFromId(id, isTemplate);
    },
    onReady: function(callback){
      if(indexedDb.db){
        callback();
      }else{
        _onReadyCallback = callback;
      }
    },
    getAll:function(table, callback){
      indexedDb.getAll(table, callback);
    }

  };

}());
_mock.drive = (function(){
"use strict";

  var folderIds, mainCallback, countFoldersCreated, countFoldersToCreate, countFilesCreated=0, countFilesToCreate;

  // Get count for folders to be create and set the value on "countFoldersToCreate"
  function _setCountToCreate(data){
    
    // Initialize the count
    countFoldersToCreate = 0;
    countFilesToCreate = 0;
    
    // Loop through all editors
    for (var type in data.editors) {
    
      // Check the property exists in the editors object do not include the HTML since it goes in 
      // the main folder and the main folder is always created
      if (data.editors.hasOwnProperty(type)) {
    
        // Check the property has a value
        if(data.editors[type].value){
          // Increment count
          countFilesToCreate++;
          
          // Check the property has a value
          if(type !== 'html'){
            // Increment count
            countFoldersToCreate++;
          }
        }

      }
    }
  }

  function _createFolders(data, callback){
    // Set count to var "countFoldersToCreate"
    _setCountToCreate(data);
    
    // Initialize folders ids object
    folderIds = {};
    
    // Initialize folder created count
    countFoldersCreated = 0;

    // Cache main project folder callback
    mainCallback = callback;
    
    // Generate the "main" folder
    _upload({title:'MockBox-' + data.projectName, type:'application/vnd.google-apps.folder',model:data.editors.html}, function(result, folder){ 
      
      // Cache the folder id for later reference
      folderIds[folder.title] = result.id;
      
      // Check if it the only needed folder
      if(countFoldersToCreate === countFoldersCreated){
        
        // Call main callback function
        mainCallback();
        return;

      }else{
        
        // Additional folders needed... go create them
        _createInnerFolders(data);

      }      
    });
  }

  function _createInnerFolders(data){
    
    // Loop through all editors
    for (var type in data.editors) {
    
      // Check the property exists in the editors object
      if ((type !== 'html') && data.editors.hasOwnProperty(type)) {
    
        // Check the value is valid or truthy
        if(data.editors[type].value){
          
          // Create next folder
          _upload({title:data.editors[type].title, type:'application/vnd.google-apps.folder', parent:'main', model:data.editors[type]}, onFolderCreate);

        }
      }
    }
  }

  function onFolderCreate(result, data){

    // Increment created counter
    countFoldersCreated++;

    // Cache the folders id for file creation reference
    folderIds[data.title] = result.id
    
    // Check all folders have been created
    if(countFoldersCreated === countFoldersToCreate){

      // Call main callback
      mainCallback();
      
    }
  }

  function onFileCreate(result){
    
    // Increment created counter
    countFilesCreated++;

    // Check all folders have been created
    if(countFilesCreated === countFilesToCreate){

      _mock.notification.send({type:'success', message:'Export Completed'}); 
      
      
    }
  }

  function _upload(data, callback){
    var model = data.model;
    var file = {
      metadata:{
        "title": data.title,
        "mimeType": data.type || "application/octet-stream",
        "description": "Created on MockBox for Google Chrome <http://mockbox.io>"
      },
      data: data.value
    };
    
    if(data.parent) file.metadata.parents = [{"id":folderIds[data.parent]}];

    var req = new XMLHttpRequest(),
        guid = Math.random().toString().substr(2),
        boundary = '-------'+guid,
        delimiter = "\r\n--" + boundary + "\r\n",
        close_delim = "\r\n--" + boundary + "--";

    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(file.metadata);

    if(file.data){    
      multipartRequestBody +=
        delimiter +
        'Content-Type: ' + file.metadata.mimeType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        file.data;
    }
    
    multipartRequestBody += close_delim;
    
    chrome.identity.getAuthToken({'interactive':true},function(token){
      
      req.open('POST', 'https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart', true);
      req.setRequestHeader('Authorization', 'Bearer ' + token);
      req.setRequestHeader('Content-Type', 'multipart/related; boundary='+boundary);

      req.onreadystatechange = function() {

        if (req.readyState == 4) {
          if(req.status == 200){
            var res = JSON.parse(req.responseText);
            callback && callback(res,model);
          }else
          if(req.status == 401){
            req.abort();
            _mock.notification.send({type:'error', message:'Export Cancelled. You have not authorized access.'}); 

          }
        }
      };

      req.send(multipartRequestBody);  
    });
  }
  return {
    upload: function(file, callback){
      var cb = callback || onFileCreate; 
      _upload(file, cb);
    },
    generateFolders: function(data, callback){
      _createFolders(data, callback);
    }
  };

}());
_mock.ftp = (function(){
  'use strict';

    var ftpClient, host,root,user,password,port;

    function _send(data, files){
        var deferred = Q.defer();
        host = data.host;
        root = 'mockbox';
        user = data.user;
        password = data.pass;
        port = data.port || 21;

        _upload(files).then(deferred.resolve);

        return deferred.promise;
    }

    function _upload(files){
        var deferred = Q.defer();
        ftpClient = new FtpClient(host, port, user, password);

        // Connect
        ftpClient.connect()
            // List directory contents
            .then(ftpClient.list.bind(ftpClient))
            .then(
                // Check/Create Root Directory
                function(dirs) {
                var deferred = Q.defer();
                var hasFolder = false;
                // Look to see if folder exists
                dirs.forEach(function(dir) {
                    if (dir.name === root) {
                        hasFolder = true;
                        return false;
                    }
                });

                // Create a folder if one doesn't exist
                if (!hasFolder) {
                    ftpClient._mkd("./"+root).then(deferred.resolve);
                } else {
                    deferred.resolve();
                }

                return deferred.promise;
            })

            .then(function(){
                var deferred = Q.defer();

                var i = 0;
                _mock.utils.promiseLoop(function(){ return i < files.length; },
                  function () {
                    ftpClient.upload(files[i].name, files[i].data);
                    i++;
                    return Q.delay(500); // arbitrary async
                  }).then(deferred.resolve);

                  return deferred.promise;
                
            })

            // Disconnect
            .then(ftpClient.disconnect.bind(ftpClient))
            .then(deferred.resolve);

            return deferred.promise;
    }

  return {
    send: function(data, files){
         var deferred = Q.defer();
        _send(data, files).then(deferred.resolve);
        return deferred.promise;
    }
  };

}());
_mock.local = (function(){
"use strict";

  var filesToBeWritten, filesWritten;
  
  function _getZip(data){
    var zip = new JSZip();
      zip.file("index.html", data.editors.html.value);
      data.editors.js.value && zip.file("scripts/scripts.js", data.editors.js.value);
      data.editors.css.value && zip.file("styles/styles.css", data.editors.css.value);
      return zip.generate({type:"blob"});
  }

  function _saveFile(options){
    var data = {
      filename: options.filename,
      filedata: options.filedata
    };

    chrome.fileSystem.chooseEntry({ type:'saveFile', suggestedName: data.filename }, function(entry, fileEntry){
      
      if(entry){
        _mock.notification.send({type:'info', message:'Exporting to '+ entry.name, persist:true});
        // check isWritableEntry
        entry.createWriter(function(fileWriter) {

          fileWriter.onwriteend = function(e) {
            _mock.notification.send({type:'success', message:'Export Completed'}); 
          };

          fileWriter.onerror = function(e) {
            _mock.notification.send({type:'Error', message:'Error Creating Zip: ' + e.toString()});
          };

          fileWriter.write(data.filedata);

        });
      }else{
        _mock.notification.send({type:'error', message:'Export Cancelled'});
      }
    });
  }
  
  var _files, _rootName;
  var _root = {};
  function _saveMultipleFiles(data){
    _files = data.files;
    _rootName = data.folderName;
    chrome.fileSystem.chooseEntry({ type:'openDirectory'}, function(entry){
      _root = entry;

      if(_root){
        _mock.notification.send({type:'info', message:'Exporting to '+ _root.name, persist:true});
        var req_fs = window.webkitRequestFileSystem;
        req_fs(window.TEMPORARY, 1024*1024, function(fs){
          
          filesWritten = 0;
          filesToBeWritten = 0;

          _root.getDirectory(_rootName,{create:true}, function(entry){
            
            if(_files.html.filedata.size) {
              filesToBeWritten++;
              entry.getFile(_files.html.filename, {create:true}, onGetFile, onGetError);  
            }

            if(_files.css.filedata.size) {
              filesToBeWritten++;
              entry.getDirectory('styles',{create:true}, function(entry){
                entry.getFile(_files.css.filename, {create:true}, onGetFile, onGetError);  
              }, onGetError);
            }
            
            if(_files.js.filedata.size) {
              filesToBeWritten++;
              entry.getDirectory('scripts',{create:true}, function(entry){
                entry.getFile(_files.js.filename, {create:true}, onGetFile, onGetError);
              }, onGetError);
            }
                           
          }, onGetError);
          

        });
      }else{
        _mock.notification.send({type:'error', message:'Export Cancelled'});
      }
    });
  }

  function onGetFile(fileEntry){
    fileEntry.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
        filesWritten++;
        if(filesWritten >= filesToBeWritten){
          _mock.notification.send({type:'success', message:'Export Completed'});
        }
      };

      fileWriter.onerror = function(e) {
        _mock.notification.send({type:'Error', message:'Error Creating File: ' + e.toString()});
      };

      var type = fileEntry.name.substr(fileEntry.name.lastIndexOf('.') + 1);
      fileWriter.write(_files[type].filedata);

    },function(){ 
      return fileEntry;
    });

  }

  function onGetError(e){
    console.log(e); 
  }

  function _saveZip(data){
    _saveFile({
      filename:'MockBox-' + data.projectName + '.zip',
      filedata: _getZip(data)
    });
  }
 
  return {
    saveZip:function(data){
      _saveZip(data);
    },
    saveFile:function(data){
      _saveFile(data);
    },
    saveFiles: function(files){
      _saveMultipleFiles(files);
    }

  };

}());
_mock.notification = (function(){
"use strict";

  var icons = ['icon_error-oct', 'icon_check_alt', 'icon_cone', 'icon_info']
  var timeout;

  function _send(type, message, persist){
    var doc = chrome.app.window.current().contentWindow.document;
    var not = doc.getElementById('app-notification');
    var notWrapper = doc.querySelector('.notification-wrapper');
    var notIcon = doc.querySelector('.notification-icon');
    var notMessage = doc.querySelector('.notification-message');
    
    notMessage.innerHTML = message;

    apollo.removeClass(notIcon, icons);
    apollo.removeClass(notWrapper, ['error', 'success', 'warning', 'info']);

    var icon;
    switch(type){
      case 'error': icon = icons[0]; break;
      case 'success': icon = icons[1]; break;
      case 'warning': icon = icons[2]; break;
      case 'info': icon = icons[3]; break;
    };

    apollo.addClass(notWrapper, type);
    apollo.addClass(not, 'showing');
    apollo.addClass(notIcon, icon);

    if(!persist){
      timeout = setTimeout(function(){
        apollo.removeClass(not, 'showing');
      }, 4000);
    }else{
      window.clearTimeout(timeout)
    }

  }
  return {
    send: function(options){
      _send(options.type, options.message, options.persist);
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
      };
      
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
      if(_confirmAcceptCallback){
        _confirmAcceptCallback();
      }
      return;
    },
    confirmDeclineCallback: function(){
        if(_confirmDeclineCallback){
        _confirmDeclineCallback();
      }
      return;
    }
  };

}());
_mock.receiver = (function(){
  'use strict';

  document.addEventListener('keypress', function(event) {
      if ( (event.which == 115 && event.ctrlKey) || (event.which == 19) ){
        if(_mock.utils.isDirty()){
          _mock.save();
        }  
      }

      if ( (event.which == 108 && event.ctrlKey) || (event.which == 12) ){
        chrome.runtime.sendMessage({message:'onOpenPopout', popout:'load'});
      }

      if ( (event.which == 110 && event.ctrlKey) || (event.which == 14) ){
        _mock.reset();
      }
      
  });

  chrome.runtime.onMessage.addListener(function(data) {
    switch(data.message){
      
      case 'onClosePopout': 
        // Close the popout with the passed id
        _mock.popout.close(data.popoutId);
        break;

      case 'onLoadItem': 
        // Restore working project from db by id
        _mock.database.restoreEditorsFromId(data.gui, data.isTemplate);
        break;

      case 'onOpenPopout':
        switch(data.popout){
          case 'load':
            // Open the window and run the function
            _mock.popout.open('load', function(){
              // init the views js file
              views.load.init();
              // Generate the list to display
              views.load.generateList();
            });
            break;  
          case 'export':
            // Open the window and run the function
            _mock.popout.open('export', function(){
             // init the views js file
              views.export.init();
            });
            break;  
        }
        
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

      case 'onDirty':
        if(data.isDirty){
          _mock.clicks.buttons.removeClass('save','inactive');
        }else{
          _mock.clicks.buttons.addClass('save','inactive');
        }
        break;
      
      case 'onExport':

        _mock.popout.close('export');

        var exportData = {
          projectName: document.getElementById('app-header').querySelector('.project-name').innerHTML,
          editors: _mock.getEditorsModel(),
          projectFolderName: 'MockBox-' + document.getElementById('app-header').querySelector('.project-name').innerHTML
        };
        
        if(data.model.type === 'drive'){
          
          _mock.notification.send({type:'info', message:'Exporting to Google Drive', persist:true});
          
          if(data.model.packaged){
            
            // Get zip file from utils
            var zip = _mock.utils.getExportPackage(exportData.editors);
            // Upload zip file to drive
            _mock.drive.upload({title: exportData.projectFolderName+'.zip',type:zip.type,value: zip}, function(){
              _mock.notification.send({type:'success', message:'Export Completed'}); 
            });
          
          }else{

            // Create Individual folders in drive
            _mock.drive.generateFolders(exportData, function(){
              // Export only if the editor has data.
              exportData.editors.html.value && _mock.drive.upload({title:'index.html',type:'text/html', value: btoa(exportData.editors.html.value), parent:'main'});
              
              exportData.editors.css.value && _mock.drive.upload({title:'styles.css',type:'text/css', value: btoa(exportData.editors.css.value), parent:'styles'});

              exportData.editors.js.value && _mock.drive.upload({title:'scripts.js',type:'application/javascript', value: btoa(exportData.editors.js.value), parent:'scripts'});
            });

            
          
          }
        }else
        if(data.model.type === 'local'){

          if(data.model.packaged){
            _mock.local.saveZip(exportData);
          }else{
            // Var to cache the files data
            var files = {};
            
            // Generate all blob files from the editors
            for(var type in exportData.editors){
              if(exportData.editors.hasOwnProperty(type)){
                // Create Blob
                var blob = new Blob([exportData.editors[type].value], {type:'text/'+type});
                // New file blob
                files[type] = {
                  filename:exportData.editors[type].title === 'main' ? 'index'+ '.' + type : exportData.editors[type].title + '.' + type,
                  filedata:blob
                };
              }
            }
            // Save all files to local
            _mock.local.saveFiles({ files: files, folderName: exportData.projectFolderName });
          }
        }else

        if(data.model.type === 'ftp'){
          _mock.notification.send({type:'info', message:'Exporting to: '+data.model.host, persist:true});
          var files = [];
          if(data.model.packaged){
            
            // Get zip file from utils
            files[0] = {
              name: './'+data.model.folder+'/mockbox/'+exportData.projectFolderName+'.zip',
              data: _mock.utils.getExportPackage(exportData.editors, 'arraybuffer')
            }               
            
          }else{
            // Generate all blob files from the editors
            for(var type in exportData.editors){
              if(exportData.editors.hasOwnProperty(type)){
                // Create Blob
                var blob = new Blob([exportData.editors[type].value], {type:'text/'+type});
                _mock.utils.blobToArrayBuffer(blob, type, function(result, type){
                  files.push({
                    name:exportData.editors[type].title === 'main' ? './'+data.model.folder+'/mockbox/index'+ '.' + type : './'+data.model.folder+'/mockbox/'+exportData.editors[type].title + '.' + type,
                    data:result
                  });
                });
                
              }
            }
          }

          _mock.ftp.send(data.model, files)
          .then(function(){ 
            _mock.notification.send({type:'success', message:'Export Completed'});
          });
        }

        
       break;

      default: return;
    }
  });

}());
/*! Sync Storage - Used for settings data
/*  ----------------------------------
/*  Saves data and retores on load.
/*  This is not the database, for permanent
/*  storage look at mockbox.database.js 
*/

_mock.storage = (function(){
'use strict'; 

  function _restoreSettings(){
    chrome.storage.sync.get('settings', function(result){
      var hasSettings;

      if(result.settings){
        hasSettings = result.settings ? true : false;
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
_mock.templates = (function(){
  'use strict';

  function getTemplates(){
    return [
    {
      name: 'Hello Template',
      html: '<div class="wheel"><ul class="umbrella"><li class="color"></li><li class="color"></li><li class="color"></li><li class="color"></li><li class="color"></li><li class="color"></li><li class="color"></li><li class="color"></li><li class="color"></li><li class="color"></li><li class="color"></li><li class="color"></li></ul></div>',
      css : '.color,.umbrella,.wheel{content:"";position:absolute;border-radius:50%;left:calc(50% - 7.5em);top:calc(50% - 7.5em);width:15em;height:15em}.wheel{overflow:hidden;width:15em;height:15em;position:relative}.umbrella{position:relative;-webkit-filter:blur(1.7em);-webkit-transform:scale(1.35)}.color,.color:nth-child(n+7):after{clip:rect(0,15em,15em,7.5em)}.color:after,.color:nth-child(n+7){content:"";position:absolute;border-radius:50%;left:calc(50% - 7.5em);top:calc(50% - 7.5em);width:15em;height:15em;clip:rect(0,7.5em,15em,0)}.color:nth-child(1):after{background-color:#9ED110;transform:rotate(30deg);z-index:12}.color:nth-child(2):after{background-color:#50B517;transform:rotate(60deg);z-index:11}.color:nth-child(3):after{background-color:#179067;transform:rotate(90deg);z-index:10}.color:nth-child(4):after{background-color:#476EAF;transform:rotate(120deg);z-index:9}.color:nth-child(5):after{background-color:#9f49ac;transform:rotate(150deg);z-index:8}.color:nth-child(6):after{background-color:#CC42A2;transform:rotate(180deg);z-index:7}.color:nth-child(7):after{background-color:#FF3BA7;transform:rotate(180deg)}.color:nth-child(8):after{background-color:#FF5800;transform:rotate(210deg)}.color:nth-child(9):after{background-color:#FF8100;transform:rotate(240deg)}.color:nth-child(10):after{background-color:#FEAC00;transform:rotate(270deg)}.color:nth-child(11):after{background-color:#FC0;transform:rotate(300deg)}.color:nth-child(12):after{background-color:#EDE604;transform:rotate(330deg)}body{background:#f2f2f2;padding:50px}',
      js  : '// No JavaScript',
      layout: [50,50,50],
      author: '@luisreyesdev'
    },
    {
      name: 'MockBox Template',
      html: '<!-- MockBox HTML -->',
      css : '/* MockBox CSS */',
      js  : '// JavaScript Here',
      layout: [60,70,50],
      author: '@luisreyesdev'
    }];

  }    

  return {
    getAll:function(){
      return getTemplates();
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
  };
  
  NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
      for(var i = 0, len = this.length; i < len; i++) {
          if(this[i] && this[i].parentElement) {
              this[i].parentElement.removeChild(this[i]);
          }
      }
  };

  function _isDirtyDispatcher(){
      chrome.runtime.sendMessage({message:'onDirty', isDirty:_isDirty });
  }

  function _collect(baseObj, updateObj) {
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

  function _getGUID() {
      return ("000000" + (Math.random()*Math.pow(36,6) << 0).toString(36)).slice(-6);
  }

  function _getExportZip(data, type){
    var zip = new JSZip();

    if(data.html.value){
      zip.file('index.html', data.html.value);
      zip.file('index.html').asBinary();
    }

    if(data.css.value){
      zip.file(data.css.title + '/styles.css', data.css.value);
      zip.file(data.css.title + '/styles.css').asBinary();
    }
    
    if(data.js.value){
      zip.file(data.js.title + '/scripts.js', data.js.value);
      zip.file(data.js.title + '/scripts.js').asBinary();
    }

    return zip.generate({type: type || 'base64' });
  }

  function _blobToArrayBuffer(bb, id, callback) {
    var f = new FileReader();
    f.onload = function(e) {
        callback(e.target.result, id);
    };
    f.readAsArrayBuffer(bb);
  };

  // `condition` is a function that returns a boolean
  // `fn` is a function that returns a promise
  // returns a promise for the completion of the loop
  function _promiseWhile(condition, fn) {
    var deferred = Q.defer();

    function loop() {
        // When the result of calling `condition` is no longer true, we are
        // done.
        if (!condition()) return deferred.resolve();
        // Use `when`, in case `fn` does not return a promise.
        // When it completes loop again otherwise, if it fails, reject the
        // done promise
        Q.when(fn(), loop, deferred.reject);
    }

    // Start running the loop in the next tick so that this function is
    // completely async. It would be unexpected if `fn` was called
    // synchronously the first time.
    Q.nextTick(loop);

    // The promise
    return deferred.promise;
  }
  

  return {
    getGUID: function(){
      return _getGUID();
    },
    toDate: function(epoch){
      return toDate(epoch);
    }, 
    getExportPackage: function(data, type){
      return _getExportZip(data, type);
    },
    blobToArrayBuffer: function(blob, id, callback){
      return _blobToArrayBuffer(blob, id, callback);
    },
    promiseLoop: function(condition, fn){
      return _promiseWhile(condition, fn);
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
      return _collect(baseObj, updateObj);
    }
    
  };

}());
_mock.windows = (function(){
'use strict'; 
  var ids = ['main'];

  var globals = {
    frame:'none',
    hidden:false
  };

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

    load :{
      file:'popout_load.html',
      exists: false,
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
          width: 500,
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
          height: 300
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
    });
    
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
  _mock.database.init();
  window.addEventListener("DOMContentLoaded", _mock.init, false);
  //Expose
  mockbox = {
    getSettings: function(){
      return _mock.getSettings();
    },
    getAll:function(table,callback){
      return _mock.database.getAll(table,callback);
    },
    popout:_mock.popout,
    reset:function(){
      return _mock.reset();
    },
    utils:_mock.utils,
    notify:function(o){
      _mock.notification.send(o);
      //_mock.notify.send(o);
    },
    getTokens: function(){
      return _mock.tokens();
    },
    isDirty:_mock.utils.isDirty
  };

}());