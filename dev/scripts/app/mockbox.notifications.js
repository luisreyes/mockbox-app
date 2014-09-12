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