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
  mockName = header.querySelector('.project-name'),
  
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
    mocks     :sidebar.querySelector('.mocks'),
    export    :sidebar.querySelector('.export'),
    about     :sidebar.querySelector('.about'),
    profile   :sidebar.querySelector('.profile-settings'),
    twitter   :sidebar.querySelector('.twitter'),
    email     :sidebar.querySelector('.email'),

    //Splash
    signin    :splash.querySelector('.signin'),
    later     :splash.querySelector('.maybelater'),
    
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
    email:'mailto:support@mockbox.io?subject=Hello MockBox'
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

    // About
    buttons.about.addEventListener( 'click', function(){
      _mock.popout.open('about', function(){
          // init the views js file
          views.about.init();
          // Generate the list to display
          //views.mocks.generateList();
        });
    });

    // Splash Signin Button
    buttons.signin.addEventListener( 'click', function(){
      chrome.runtime.sendMessage({message:'allowAccess', callback: 'closeSplash' });
    });

    buttons.profileLink.addEventListener( 'click', function(e){
      signinPreAuth();
    });

    buttons.profileImg.addEventListener( 'click', function(e){
      signinPreAuth();
    });

    // Splash Later Button
    buttons.later.addEventListener( 'click', function(){
      chrome.runtime.sendMessage({message:'later' });
    });

    buttons.mocks.addEventListener( 'click', function(e){
      
      // Verify the click happens opn the LI in the sidebar navigation
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;
      
      // If it has a class 'inactive' ignore the click
      if(!apollo.hasClass(element, 'inactive')){
        // Open the window and run the function
        _mock.popout.open('mocks', function(){
          // init the views js file
          views.mocks.init();
          // Generate the list to display
          views.mocks.generateList();
        });
      }
    });


    buttons.export.addEventListener( 'click', function(e){
      
      // Verify the click happens opn the LI in the sidebar navigation
      var element = (e.target.localName === 'li') ? e.target : e.target.parentElement;
      
      // If it has a class 'inactive' ignore the click
      if(!apollo.hasClass(element, 'inactive')){
        // Open the window and run the function
        _mock.popout.open('export', function(){
          // Methods to run on window load
          // TODO
        });
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
    
    buttons.twitter.addEventListener( 'click', function(){
      // Open external page
      openLink('twitter');
    });

    buttons.email.addEventListener( 'click', function(){
      
      google.payments.inapp.getPurchases({
        'success': function(){
          //debugger;
          console.log('Purch Success');
        },
        'failure': function(){
          //debugger;
          console.log('Purch fail');   
        }
      });

      google.payments.inapp.getSkuDetails({
          'parameters': {'env': 'prod'},
          'success': function(){
            //debugger;
            console.log('SKU Success');
            console.log(arguments);
          },
          'failure': function(){
            //debugger;
            console.log('SKU fail');
            console.log(arguments);   
          }
        });

      // Open external page
      //openLink('email');
    });

    
  }

  function openLink(loc){
    // Open external page
    window.open(links[loc], '_blank');
  }

  function signinPreAuth(){
    if(!mockbox.isAuthenticated()){
        chrome.runtime.sendMessage({message:'allowAccess', callback: 'closeSplash' });
      }else{
        buttons.profile.click();
      }
  }

  function clickToEditProjectName(){
    // Cache initial value to manage dirty flag
    var initValue = mockName.innerHTML, newValue;
    // On click of the field
    mockName.addEventListener('click', function(){
      
      // Add tabindex for 'focus' management
      mockName.setAttribute('tabindex','-1');
      
      //Set attribute to edit the content
      mockName.setAttribute('contenteditable','true');
      
      // Set classes for editing styles
      apollo.addClass(mockName,'editing');
      // Display the check to accept changes
      apollo.addClass(mockName.nextSibling,'visible');
      
    });

    // On 'blur' of the field
    mockName.addEventListener('blur', function(){
      
      // Cache new value for comparison and dirty flag management
      newValue = mockName.innerHTML;

      //Set dirty if it is
      _mock.utils.isDirty(newValue !== initValue);  
      
      // Restore to non edit styles
      mockName.setAttribute('contenteditable','false');
      apollo.removeClass(mockName,'editing');
      
      // Hide 'check'
      apollo.removeClass(mockName.nextSibling,'visible');
    
    });
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