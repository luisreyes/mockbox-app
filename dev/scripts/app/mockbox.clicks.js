_mock.clicks = (function(){
'use strict'; 
  var

  // Main Chrome Window
  wndMain = chrome.app.window.get('main'),
  
  // Main Chrome Window Controls (Minimize, Maximize, Close)
  windowControls = document.getElementById("app-window-controls"),
  
  // Main Sidebar Container
  sidebar = document.getElementById('app-sidebar'),
  
  // Main Header
  header = document.getElementById('app-header'),

  // Project Name on Main Header
  mockName = header.querySelector('.project-name'),
  
  // Popout element on Main Window
  popoutWrapper = document.getElementById('app-popout'),
  
  // Popout element on Main Window
  popoutOverlay = popoutWrapper.querySelector('.overlay'),

  // Collection of buttons
  buttons = {

    // Navigation
    new       :sidebar.querySelector('.new'),
    save      :sidebar.querySelector('.save'),
    mocks      :sidebar.querySelector('.mocks'),
    export    :sidebar.querySelector('.export'),
    settings  :sidebar.querySelector('.settings'),
    twitter   :sidebar.querySelector('.twitter'),
    email     :sidebar.querySelector('.email'),
    
    // Header Bar
    check     :header.querySelector('.icon_check'),
    
    // Application Chrome Controls
    appMin    :windowControls.querySelector('.window-min'),
    appMax    :windowControls.querySelector('.window-max'),
    appClose  :windowControls.querySelector('.window-close')

  },

  // External Links
  links = {
    twitter:'https://twitter.com/mockboxio',
    email:'mailto:boxes@mockbox.io?subject=Hello MockBox'
  };

  // Main Listeners
  function addListeners(){
    
    // ---------------------------------------------- //
    // Application Chrome Window Frame Buttons Action
    // ---------------------------------------------- //

    // Minimize Window
    buttons.appMin.addEventListener('click', function(e){
      chrome.app.window.current().minimize();
    });

    // Toggle Maximize Window
    buttons.appMax.addEventListener('click', function(e){
      if(chrome.app.window.current().isMaximized()){
        chrome.app.window.current().restore();
      }else{
        chrome.app.window.current().maximize();
      }
    });

    // Close Application and all it's Windows
    buttons.appClose.addEventListener('click', function(e){
      var allWindows = chrome.app.window.getAll();
      for(var i = 0; i < allWindows.length; i++){
        allWindows[i].close();
      }
    });
    



    // ---------------------------------------------- //
    // Additional Clicks
    // ---------------------------------------------- //


    // Overlay click to trigger Focus and Attention to Popout Window
    popoutOverlay.addEventListener('click', function(){
      var curWindow = chrome.app.window.get(_mock.popout.getCurrentId());
      curWindow.focus();
      curWindow.drawAttention();
    });
    
    // Project Name Accept
    buttons.check.addEventListener( 'click', function(){
     mockName.blur();
    });


    // ---------------------------------------------- //
    // Additional Clicks
    // ---------------------------------------------- //    

    // Sidebar Buttons Action

    // New Button
    buttons.new.addEventListener( 'click', _mock.reset );

    // Save Button
    buttons.save.addEventListener( 'click', _mock.save );

    buttons.mocks.addEventListener( 'click', function(e){
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;
      if(!apollo.hasClass(element, 'inactive')){
        views.mockmanager.init();
        _mock.popout.open('mocks', function(){
          views.mockmanager.generateList();
        });
      }
    });

    buttons.export.addEventListener( 'click', function(e){
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;
      if(!apollo.hasClass(element, 'inactive')){
        _mock.popout.open('export');
      }
    });

    buttons.settings.addEventListener( 'click', function(e){
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;
      if(!apollo.hasClass(element, 'inactive')){
        _mock.popout.open('settings');
      }
    });
    
    
    buttons.twitter.addEventListener( 'click', function(){
      openLink('twitter');
    });

    buttons.email.addEventListener( 'click', function(){
      openLink('email');
    });

    
  }

  function openLink(loc){
    window.open(links[loc], '_blank');
  }

  function clickToEditProjectName(){
    mockName.addEventListener('click', function(){
      mockName.setAttribute('tabindex','-1');
      mockName.setAttribute('contenteditable','true');
      apollo.addClass(mockName,'editing');
      apollo.addClass(mockName.nextSibling,'visible');
    });

    mockName.addEventListener('blur', function(){
        
      mockName.setAttribute('contenteditable','false');
      apollo.removeClass(mockName,'editing');
      apollo.removeClass(mockName.nextSibling,'visible');
    
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
  };

}());