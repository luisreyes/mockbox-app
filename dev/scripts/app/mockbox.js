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
      splashSignin = document.getElementById('app-splash-signin'),
      splashLoading = document.getElementById('app-splash-loading'),
      sidebarToggle = document.getElementById('app-sidebar-toggle'),
      domEditors = document.getElementById('app-editors'),
      defaultLayout = '50,50,25',
      _settings = {},
      isAuthenticated = false,
      lastToken = null,
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

         case 'loadItem': 
          // Restore working project from db by id
            _mock.database.restoreEditorsFromId(data.gui);
         break;

         case 'deleteItem': 
          // Delete the item by the passed id
            _mock.database.delete(data.gui);
         break;

         case 'continuePopout': 
          // Call methods to continue i.e "Yes I would ike to loose changes and close the application"
            _mock.popout.confirmCallback();
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

          if(!_settings.later){
            // Get token for google account
            _mock.oauth.getToken({'interactive':false},function(token){
              if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError);
              }else{
                lastToken = token;
                // Get profile data
                _mock.oauth.getProfile();
              }
            });
          }else{
            closeSplash();
          }

          // Open last if lastGui is avaliable
          if(_settings.lastGui && _settings.autoload){
            _mock.database.restoreEditorsFromId(_settings.lastGui);
          }

         break;

          case 'signin':
            _mock.oauth.getToken({'interactive':true}, function(token){
              // Get profile data
              _mock.oauth.getProfile();
              _settings.later = false;
            });
          break;

          case 'signout':
            chrome.identity.removeCachedAuthToken(lastToken, function(){
              console.log('revoked api');
            });
          break;

          case 'later':
            _settings.later = true;
            apollo.addClass(splashSignin, 'hidden');
            apollo.removeClass(splashLoading, 'hidden');
            closeSplash();
            saveSettings();
          break;

          case 'onProfileData':
            var profileContainer = document.getElementById('profile-container'),
                imageNode = profileContainer.querySelector('.profile-img'),
                nameNode = profileContainer.querySelector('.profile-name');

            isAuthenticated = true;
            imageNode.setAttribute('src',data.profile.image.url);
            nameNode.innerHTML = data.profile.name.givenName;
            closeSplash();
          break;

          case 'onFirstRun':
            apollo.removeClass(splashSignin, 'hidden');
            apollo.addClass(splashLoading, 'hidden');

            // Defulat App Settings
            _settings.theme = 'light';
            _settings.lastGui = null;
            _settings.autoload = true;
            _settings.later = false;
          
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

  function closeSplash(){
    window.setTimeout(function(){
      apollo.addClass(splash, 'opaque');
      splash.addEventListener('webkitTransitionEnd', function() {
        console.log('Transition complete!  This is the callback, no library needed!');
        apollo.addClass(splash, 'hidden');
      });
    }, 1000);
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
          //later: _settings.later,
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
    isAuthenticated: function(){
      return isAuthenticated;
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