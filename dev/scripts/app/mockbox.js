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
      document.getElementById('app-header').querySelector('.project-name').innerHTML = 'New box'
      clearEditors();
    }
  }

}());