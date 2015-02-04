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

  // Splash
  splash = document.getElementById('app-splash'),

  // Project Name on Main Header
  prototypeName = header.querySelector('.project-name'),
  
  // Popout element on Main Window
  popoutWrapper = document.getElementById('app-popout'),
  
  // Popout element on Main Window
  popoutOverlay = popoutWrapper.querySelector('.overlay'),

  // Collection of buttons
  buttons = {

    // Navigation
    profileLink:sidebar.querySelector('.profile-name'),
    profileImg:sidebar.querySelector('.profile-img'),
    new       :sidebar.querySelector('.new'),
    save      :sidebar.querySelector('.save'),
    load      :sidebar.querySelector('.load'),
    export    :sidebar.querySelector('.export'),
    about     :sidebar.querySelector('.about'),
    profile   :sidebar.querySelector('.profile-settings'),

    //Splash
    allow    :splash.querySelector('.allow'),
    later     :splash.querySelector('.maybelater'),
    
    // Header Bar
    projectProperties     :header.querySelector('.icon_adjust-horiz'),
    
    // Application Chrome Controls
    appMin    :windowControls.querySelector('.window-min'),
    appMax    :windowControls.querySelector('.window-max'),
    appClose  :windowControls.querySelector('.window-close')

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
      // Check if the window is maximized
      if(chrome.app.window.current().isMaximized()){
        // Set back to size
        chrome.app.window.current().restore();
      }else{
        // Maximize to screen
        chrome.app.window.current().maximize();
      }
    });

    // Close Application and all it's Windows
    buttons.appClose.addEventListener('click', function(e){
      // Before closing the app check if any data needs saving
      if(mockbox.isDirty()){
        // Display Confirm Dialog
        mockbox.popout.confirm('continue',function(){
          // If continue the close
          closeMethods();
        });
      }else{
        // There is no need to save, close the app
        closeMethods();
      }  

      // Encapsulated code to close the app
      function closeMethods(){
        chrome.runtime.sendMessage({message:'closeApp'});
      }
    });
    



    // ---------------------------------------------- //
    // Additional Clicks
    // ---------------------------------------------- //


    // Overlay click to trigger Focus and Attention to Popout Window
    popoutOverlay.addEventListener('click', function(){
      // Set the current window var to the current window
      // This method is used to brin attention to a window in case it falls behind the main window
      var curWindow = chrome.app.window.get(_mock.popout.getCurrentId());
      curWindow.focus();
      curWindow.drawAttention();
      setTimeout( function(){
        curWindow.clearAttention();
      },3000)
    });
    
    // Project Name Accept
    buttons.projectProperties.addEventListener( 'click', function(){
      _mock.popout.open('properties', function(){
        // init the views js file
        views.properties.init(function(){
          views.properties.restore(_mock.getCurrentProperties());
        });
      });
    });


    // ---------------------------------------------- //
    // Additional Clicks
    // ---------------------------------------------- //    

    // Sidebar Buttons Action

    // New Button
    buttons.new.addEventListener( 'click', function(e){
      // Verify the click happens opn the LI in the sidebar navigation
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;

      // If it has a class 'inactive' ignore the click
      if(!apollo.hasClass(element, 'inactive')){
        _mock.reset();
      }
    });

    // Save Button
    buttons.save.addEventListener( 'click', function(e){
      // Verify the click happens opn the LI in the sidebar navigation
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;
      
      // If it has a class 'inactive' ignore the click
      if(!apollo.hasClass(element, 'inactive')){
        _mock.save();
      }
    });

    // About
    buttons.about.addEventListener( 'click', function(){
      _mock.popout.open('about', function(){
          // init the views js file
          views.about.init();
        });
    });

    // Splash Signin Button
    buttons.allow.addEventListener( 'click', function(){
      chrome.runtime.sendMessage({message:'allowAccess', isSplashScreen:true, service: 'google-access'});
    });

    buttons.profileLink.addEventListener( 'click', function(e){
      signin();
    });

    buttons.profileImg.addEventListener( 'click', function(e){
      signin();
    });

    // Splash Later Button
    buttons.later.addEventListener( 'click', function(){
      chrome.runtime.sendMessage({message:'later' });
    });

    buttons.load.addEventListener( 'click', function(e){
      
      // Verify the click happens opn the LI in the sidebar navigation
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;
      
      // If it has a class 'inactive' ignore the click
      if(!apollo.hasClass(element, 'inactive')){
        chrome.runtime.sendMessage({message:'onOpenPopout', popout:'load'});
      }
    });


    buttons.export.addEventListener( 'click', function(e){
      

      // Verify the click happens opn the LI in the sidebar navigation
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;
      
      // If it has a class 'inactive' ignore the click
      if(!apollo.hasClass(element, 'inactive')){
        
        chrome.runtime.sendMessage({message:'onOpenPopout', popout:'export'});

        // REMOVE PURCHASE FOR NOW 2/4/2015
        // // Check if this package has been purchased
        // _mock.popout.open('purchase', function(){
        //   // init the views js file
        //   views.purchase.init();
        // });
  
      }
    });

    buttons.profile.addEventListener( 'click', function(e){

      // Verify the click happens opn the LI in the sidebar navigation
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;
      
      // If it has a class 'inactive' ignore the click
      if(!apollo.hasClass(element, 'inactive')){

        // Open the window and run the function
        _mock.popout.open('settings', function(){
          // init the views js file
          views.settings.init();
          // Restore settings from memory
          views.settings.restoreSettingStates(mockbox.getSettings());
        });
      }
    });

  }

  function signin(){}

  function clickToEditProjectName(){
    // Cache initial value to manage dirty flag
    var initValue = prototypeName.innerHTML, newValue, latestValidValue;
   
    // On click of the field
    prototypeName.addEventListener('click', function(){
      
      // Add tabindex for 'focus' management
      prototypeName.setAttribute('tabindex','-1');
      
      //Set attribute to edit the content
      prototypeName.setAttribute('contenteditable','true');
      
      // Set classes for editing styles
      apollo.addClass(prototypeName,'editing');
      
      this.addEventListener('keypress', onKeypress);
      
    });

    // On 'blur' of the field
    prototypeName.addEventListener('blur', function(){
      
      // Validate new input name for not empty
      prototypeName.innerHTML = prototypeName.innerHTML || latestValidValue;
      latestValidValue = prototypeName.innerHTML;

      // Cache new value for comparison and dirty flag management
      newValue = prototypeName.innerHTML;

      //Set dirty if it is
      _mock.utils.isDirty(newValue !== initValue);  
      
      // Restore to non edit styles
      prototypeName.setAttribute('contenteditable','false');
      apollo.removeClass(prototypeName,'editing');
      
      this.removeEventListener('keypress', onKeypress);
    });
  }

  function onKeypress(e){
    if(e.keyCode === 13){
      e.target.blur();
    }
  }

  return {
    init: function(){
      // Add Button listeners
      addListeners();
      // Addlistener to name edit
      clickToEditProjectName();
    },

    // Methods to manipulate classes on button i.e add 'inactive' class to buttons from outside this namespace
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