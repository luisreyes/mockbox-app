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
_pop.clicks = (function(){
'use strict'; 
  var
  _currentId,
  buttons = {
    popClose: document.getElementById("app-popout-controls").querySelector('.window-close')
  };

  function addListeners(){
    
    // Popout Frame Buttons Action

    buttons.popClose.addEventListener('click', function(e){
      chrome.runtime.sendMessage({message:'closePopout', popoutId:chrome.app.window.current().id});
    });
    
  }

  return {
    init: function(){
      addListeners();
    }
  };

}());

  _pop.init();
  
  //Expose
  Popout = {};

}());