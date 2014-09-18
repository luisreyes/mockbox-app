_v.properties = (function(){
  'use strict';

  var doc,
      sidebar,
      sidebarOptions,
      panelsWrapper,
      panels,
      selectedClass,
      selectedPanel,
      buttons = {};

  function _init(callback){
    doc = chrome.app.window.get('properties').contentWindow.document;
    sidebar = doc.getElementById('properties-options');
    sidebarOptions = sidebar.getElementsByTagName('ul')[0];
    panelsWrapper = doc.getElementById('properties-panels');
    panels = panelsWrapper.getElementsByTagName('ul')[0].getElementsByClassName('panel');
    
    buttons = {
      sidebar:{
        application:sidebarOptions.querySelector('.application')
      },
      ok:doc.getElementById('properties-footer').querySelector('.ok'),
      cancel:doc.getElementById('properties-footer').querySelector('.cancel')
    }

    addListeners();

    setPanel({target:buttons.sidebar.application});

    if(callback) callback();

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
      properties:{
        theme: doc.getElementById('properties-theme-select').value,
        autoload:doc.getElementById('properties-open-check').checked
      }
    };

    chrome.runtime.sendMessage(data);
    chrome.runtime.sendMessage({message:'onClosePopout', popoutId:'properties'});
  }

  function onCancelClick(e){
    chrome.runtime.sendMessage({message:'onClosePopout', popoutId:'properties' });
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

  function _restoreStates(properties){
    // Set Window Title
    var title = properties.title || 'Prototype';
    doc.querySelector('.popout-title').innerHTML = title + ' Properties';
  }

  
  return {
    init: function(callback){
      if(!doc){
        _init(callback);
      }else if(callback){
        callback();
      };
    },
    restorePropertiesStates: function(properties){
      _restoreStates(properties);
    }
  };

}());