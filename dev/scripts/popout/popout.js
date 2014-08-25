/*! MockBox - Prorotype builder
/*  Author: Luis Reyes <luis@luisreyes.com>
/*  Url: mockbox.io
*/
var Popout; 

(function(){ var _pop = (function(){
'use strict';

  var baseDoc = chrome.app.window.get('main').contentWindow.document;

  function init(){
    _pop.clicks.init();
  }

  return {
    init: init,
    getBaseDoc: function(){
      return baseDoc;
    }
  };

}());