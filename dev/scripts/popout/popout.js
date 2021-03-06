/*! MockBox - Prorotype builder
/*  Author: Luis Reyes <luis@luisreyes.com>
/*  Url: mockbox.io
*/
var popout; 

(function(){ var _pop = (function(){
'use strict';
  var confirmTitle = {
    continue: 'You have unsaved changes',
    delete: 'You are trying to delete this prototype',
    revoke:'Revoke Access Token?'
  };

  var confirmMessage = {
    continue: 'Are you sure you want to continue?',
    delete: 'Are you sure you want to delete it?',
    revoke:'Are you sure you want to revoke the access token?'
  };

  function init(){

    chrome.runtime.getPlatformInfo(function(p){
      apollo.addClass(document.body, p.os);
    });

    _pop.clicks.init();

    chrome.runtime.onMessage.addListener(function(data) {
      if(data.message === 'confirmType'){
        var p = document.getElementById("popout-title");
        if(p){
          p.innerHTML = confirmTitle[data.type];
          document.getElementById("confirm-message").innerHTML = confirmMessage[data.type];
        }
      }
    });
  }

  return {
    init: init
  };

}());