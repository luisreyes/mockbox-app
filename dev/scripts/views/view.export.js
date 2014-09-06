_v.export = (function(){
  'use strict';

  var doc;

  function init(){
    doc = chrome.app.window.get('export').contentWindow.document;
    
  }

  return {
    init: function(){
      if(!doc) init();
    }
  }

}());