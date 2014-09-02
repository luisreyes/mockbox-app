_v.about = (function(){
  'use strict';

  var doc;

  function init(){
    doc = chrome.app.window.get('about').contentWindow.document;
    doc.getElementById('about-version').innerHTML = 'Current version: ' + chrome.runtime.getManifest().version;
  }

  return {
    init: function(){
      if(!doc) init();
    }
  }

}());