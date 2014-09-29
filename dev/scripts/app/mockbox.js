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
      footer = document.getElementById('app-footer'),
      splash = document.getElementById('app-splash'),
      splashAllow = document.getElementById('app-splash-access'),
      splashLoading = document.getElementById('app-splash-loading'),
      sidebarToggle = document.getElementById('app-sidebar-toggle'),
      domEditors = document.getElementById('app-editors'),
      defaultLayout = '50,50,25',
      _settings = {},
      currentProperties = {},
      tokens = {},
      sidebarToggleClasses = ['closed', 'open', 'open-half' ],
      currentSidebarToggleClassIndex,
      refreshTimeout,
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

         case 'setProperties':
          // Cache the settings to a global var
          setCurrentProperties(data.properties);
          // Apply settings         
            setProperties();
          // Set Dirty to allow to save the properties
            //_mock.utils.isDirty(true);
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
              
              closeSplash();
              saveSettings();  
            
            });

            

            

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
    apollo.removeClass(footer, ['open','closed', 'open-half']);
    apollo.removeClass(header, ['open','closed', 'open-half']);

    apollo.addClass(domEditors, sidebarToggleClasses[stateIndex]);
    apollo.addClass(footer, sidebarToggleClasses[stateIndex]);
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
    var theme = (_settings.theme === 'dark') ? 'mbo' : 'default';
    
    //Set Editos Theme
    setGlobalEditorOption('theme', theme);
    // Set sidebar state
    currentSidebarToggleClassIndex = _settings.sidebarState;
    setSidebarState(currentSidebarToggleClassIndex);

    // Change css file
    chrome.app.window.get('main').contentWindow.document.getElementById('mockbox-styles').setAttribute('href', 'styles/mockbox-' + _settings.theme + '.css');

  }

  function setProperties(){
    updateIframe();

  }

  /*******************/
  /* Editor Functions */
  /*******************/

  // Initialize Editors
  function initEditors(){

    // Initialize Main Code Editors
    editors.html  = new CodeMirror(domHtml,  { mode: 'htmlmixed' });
    editors.js    = new CodeMirror(domJs,    { mode: 'javascript' });
    editors.css   = new CodeMirror(domCss,   { mode: 'css' });

    // Set CodeMirror Options to all editors
    setGlobalEditorOption('lineNumbers', true);
    setGlobalEditorOption('fixedGutter', true);
    setGlobalEditorOption('autocomplete', true);
    setGlobalEditorOption('styleActiveLine', true);
    setGlobalEditorOption('matchBrackets', true);
    setGlobalEditorOption('theme', 'default');

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
      editors.html.setValue( html_beautify(data.html) );
      editors.js.setValue( js_beautify(data.js) );
      editors.css.setValue( css_beautify(data.css) );
      sv.setLayout( data.layout[0], data.layout[1], data.layout[2] );
      updateIframe();
      _mock.utils.isDirty(false);
    }else{
      setGlobalEditorOption('value', '');
    }    
  }

  function setCurrentProperties(properties){
    currentProperties = properties;
  }

  function onEditorChange(e){
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
        size1 = document.getElementById('html').style.width,
        size2 = document.getElementById('css').style.height;
    return {
          gui : currentGui,
          name: document.getElementById('app-header').querySelector('.project-name').innerHTML,
          html: editors.html.getValue(),
          js  : editors.js.getValue(),
          css : editors.css.getValue(),
          layout: [
            Math.round(size0.substr(0,size0.length-1)),
            Math.round(size1.substr(0,size1.length-1)),
            Math.round(size2.substr(0,size2.length-1))
            ],
          properties: views.properties.getAll()
        };

  }

  function updateIframe(timeout){
    
    var postData = {
      html: editors.html.getValue(),
      css: editors.css.getValue(),
      js: editors.js.getValue(),
      properties: _mock.getCurrentProperties()
    }
    
    document.getElementById('compiled-view').remove();
    var iframe = document.createElement('iframe');
    iframe.id = 'compiled-view';
    iframe.src = 'mockbox_prototype.html';
    document.getElementById('iframe-container').appendChild(iframe);
    
    if(refreshTimeout){clearTimeout(refreshTimeout);}
    refreshTimeout = setTimeout(function(){
      document.getElementById('compiled-view').contentWindow.postMessage(postData, '*');
    },100);
  }

  function _reset(){
    currentGui = null;
    document.getElementById('app-header').querySelector('.project-name').innerHTML = 'New Prototype';
    var l = defaultLayout.split(',');
    sv.setLayout(l[0],l[1],l[2]);
    clearEditors();
    views.properties.reset();
    _mock.utils.isDirty(false);
    setCurrentProperties(views.properties.getDefaults());
    
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
      setCurrentProperties(data.properties);
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
    getCurrentProperties: function(){
      if(!_mock.utils.getObjectLength(currentProperties)){
        var props = views.properties.getDefaults();
        props.title = header.querySelector('.project-name').innerHTML;
        setCurrentProperties(props);
      }
      return currentProperties;
    },
    save: function(){
      _mock.database.save('prototypes',getSaveData());
    },
    refresh:function(){
      updateIframe();
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