_v.settings = (function(){
  'use strict';

  var doc,
      sidebar,
      sidebarOptions,
      panelsWrapper,
      panels,
      selectedClass,
      selectedPanel,
      buttons = {};

  function _init(){
    doc = chrome.app.window.get('settings').contentWindow.document;
    sidebar = doc.getElementById('settings-options');
    sidebarOptions = sidebar.getElementsByTagName('ul')[0];
    panelsWrapper = doc.getElementById('settings-panels');
    panels = panelsWrapper.getElementsByTagName('ul')[0].getElementsByClassName('panel');

    buttons = {
      sidebar:{
        application:sidebarOptions.querySelector('.application')
      },
      ok:doc.getElementById('settings-footer').querySelector('.ok'),
      cancel:doc.getElementById('settings-footer').querySelector('.cancel')
    }

    addListeners();

    setPanel({target:buttons.sidebar.application});
  }

  function addListeners(){
    for(var i in buttons.sidebar){
      buttons.sidebar[i].addEventListener('click', setPanel);
    }

    buttons.ok.addEventListener('click', onOkClick);
    buttons.cancel.addEventListener('click', onCancelClick);

  }

  function onOkClick(e){
    var data = {
      message:'saveSettings', 
      settings:{
        theme: doc.getElementById('settings-theme-select').value,
        autoload:doc.getElementById('settings-open-check').checked
      }
    };

    chrome.runtime.sendMessage(data);
    chrome.runtime.sendMessage({message:'onClosePopout', popoutId:'settings'});
  }

  function onCancelClick(e){
    chrome.runtime.sendMessage({message:'onClosePopout', popoutId:'settings' });
  }

  function setPanel(e){
    // Cache the clicked element
    var element = e.target;
    // Loop and find the 'li'
    while (element.localName !== 'li') {
      element = element.parentNode;
    }

    // Cache the className from 'li'
    selectedClass = element.classList[0];

    // Loop and set class hidden to unselected and remove class hidden from slected
    var i = 0;
    for(; i < panels.length; i++){
      if(panels[i].classList[0] === selectedClass){
        // Cache selected element
        selectedPanel = panels[i];
        // Display selected panel
        apollo.removeClass(panels[i], 'hidden');
      }else{
        apollo.addClass(panels[i], 'hidden');  
      } 
    }

    i = 0;
    for(i in buttons.sidebar){
      if(buttons.sidebar[i].classList[0] === selectedClass){
        apollo.addClass(buttons.sidebar[i], 'selected');
      }else{
        apollo.removeClass(buttons.sidebar[i], 'selected');  
      }
    }
  }

  function _restoreStates(settings){
    // Set Theme
    doc.getElementById('settings-theme-select').value = settings.theme;
    // Set Last Worked on Checkbox
    doc.getElementById('settings-open-check').checked = settings.autoload;
    // Update buttons
    //_updateAuths();
  }

  // function _updateAuths(){
  //   // Get all current tokens
  //   var tokens = mockbox.getTokens();

  //   // Cache services container DOM Element
  //   var services = doc.getElementById('settings-access-services');
    
  //   // Check for available tokens
  //   setState(services.getElementsByClassName('google-access')[0], tokens.google);
  // }

  // function setState(service, hasToken){
  //   var hideElements,showElements;

  //   if(hasToken){
  //     showElements = service.getElementsByClassName('revoke');
  //     hideElements = service.getElementsByClassName('access');
  //     service.getElementsByTagName('input')[0].checked = true;
  //   }else{
  //     showElements = service.getElementsByClassName('access');
  //     hideElements = service.getElementsByClassName('revoke');
  //     service.getElementsByTagName('input')[0].checked = false;
  //   }

  //   var i = 0;
  //   for(i; i < showElements.length; i++){
  //     apollo.removeClass(showElements[i], 'hidden');  
  //   }

  //   for(i; i < hideElements.length; i++){
  //     apollo.addClass(hideElements[i], 'hidden');
  //   }
  // }

  return {
    init: function(callback){
      if(!doc) _init(callback);
    },
    restoreSettingStates: function(settings){
      _restoreStates(settings);
    },
    updateAuthorizations:function(){
      //_updateAuths();
    }
  };

}());