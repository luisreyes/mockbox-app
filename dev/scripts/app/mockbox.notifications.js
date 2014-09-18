_mock.notification = (function(){
"use strict";

  var icons = ['icon_error-oct', 'icon_check_alt', 'icon_cone', 'icon_info'],
      doc, not, notWrapper, notIcon, notMessage, notClose, notLink, timeout, linkUrl;

  function init(){
    doc = chrome.app.window.current().contentWindow.document;
    not = doc.getElementById('app-notification');
    notWrapper = doc.querySelector('.notification-wrapper');
    notIcon = doc.querySelector('.notification-icon');
    notMessage = doc.querySelector('.notification-message');
    notClose = doc.querySelector('.notification-close');
    notLink = doc.querySelector('.notification-link');

    addListeners();
  }

  function _send(type, message, persist){
    
    notMessage.innerHTML = message;

    apollo.removeClass(notIcon, icons);
    apollo.removeClass(notWrapper, ['error', 'success', 'warning', 'info']);

    var icon;
    switch(type){
      case 'error': icon = icons[0]; break;
      case 'success': icon = icons[1]; break;
      case 'warning': icon = icons[2]; break;
      case 'info': icon = icons[3]; break;
    }

    apollo.addClass(notWrapper, type);
    apollo.addClass(not, 'showing');
    apollo.addClass(notIcon, icon);
    
    var time = persist ? 60000 : 5000;

    timeout = setTimeout(function(){
      apollo.removeClass(not, 'showing');
    }, time);

  }

  function addListeners(){
    notClose.addEventListener('mouseover', function(){
      apollo.addClass(notClose, 'icon_close_alt');
    });

    notClose.addEventListener('mouseleave', function(){
      apollo.removeClass(notClose, 'icon_close_alt');
    });
    
    notClose.addEventListener('click', function(){
      window.clearTimeout(timeout);
      apollo.removeClass(not, 'showing');
    });

    notLink.addEventListener('click', function(){
      if(linkUrl){
        window.open(linkUrl, '_blank');
      }
    });

  }

  return {
    send: function(options){
      if(!doc) init();
      _send(options.type, options.message, options.persist);
    },
    setLink: function(data){
      notLink.innerHTML = data.text;
      notLink.setAttribute('title', data.title);
      linkUrl = data.url;
    },
    clearLink: function(){
      notLink.innerHTML = '';
      notLink.setAttribute('title', '');
      linkUrl = null;
    }
  };

}());