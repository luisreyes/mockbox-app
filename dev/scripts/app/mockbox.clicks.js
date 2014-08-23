_mock.clicks = (function(){
'use strict'; 
  var

  wndMain = chrome.app.window.get('main'),
  windowControls = document.getElementById('app-window-controls'),
  sidebar = document.getElementById('app-sidebar'),
  header = document.getElementById('app-header'),
  nodeName = header.querySelector('.project-name'),

  buttons = {
    new       :sidebar.querySelector('.new'),
    save      :sidebar.querySelector('.save'),
    load      :sidebar.querySelector('.load'),
    export    :sidebar.querySelector('.export'),
    twitter   :sidebar.querySelector('.twitter'),
    email     :sidebar.querySelector('.email'),
    check     :header.querySelector('.icon_check'),
    appMin    :windowControls.querySelector('.window-min'),
    appMax    :windowControls.querySelector('.window-max'),
    appClose  :windowControls.querySelector('.window-close')
  },

  links = {
    twitter:'https://twitter.com/mockboxio',
    email:'mailto:boxes@mockbox.io?subject=Hello MockBox'
  };

  function addListeners(){
    
    // Window Frame Buttons Action

    buttons.appMin.addEventListener('click', function(e){
      chrome.app.window.current().minimize();
    });

    buttons.appMax.addEventListener('click', function(e){
      if(chrome.app.window.current().isMaximized()){
        chrome.app.window.current().restore();
      }else{
        chrome.app.window.current().maximize();
      }
    });

    buttons.appClose.addEventListener('click', function(e){
      chrome.app.window.current().close();
    });
    
    // Sidebar Buttons Action

    buttons.new.addEventListener( 'click', _mock.reset );

    buttons.save.addEventListener( 'click', _mock.save );

    buttons.load.addEventListener( 'click', _mock.load );

    buttons.export.addEventListener( 'click', _mock.export );
    
    buttons.twitter.addEventListener( 'click', function(){
      openLink('twitter');
    });

    buttons.email.addEventListener( 'click', function(){
      openLink('email');
    });

    buttons.check.addEventListener( 'click', function(){
     nodeName.blur();
    });
  }

  function openLink(loc){
    window.open(links[loc], '_blank');
  }

  function clickToEditProjectName(){
    nodeName.addEventListener('click', function(){
      nodeName.setAttribute('tabindex','-1');
      nodeName.setAttribute('contenteditable','true');
      apollo.addClass(nodeName,'editing');
      apollo.addClass(nodeName.nextSibling,'visible');
    });

    nodeName.addEventListener('blur', function(){
        
      nodeName.setAttribute('contenteditable','false');
      apollo.removeClass(nodeName,'editing');
      apollo.removeClass(nodeName.nextSibling,'visible');
    
    });
  }

  return {
    init: function(){
      addListeners();
      clickToEditProjectName();
    },
    buttons:{
      toggleClass:function(b, c){
        apollo.toggleClass(buttons[b],c);
      },
      addClass:function(b, c){
        apollo.addClass(buttons[b],c);
      },
      removeClass:function(b, c){
        apollo.removeClass(buttons[b],c);
      }
    }
  }

}());