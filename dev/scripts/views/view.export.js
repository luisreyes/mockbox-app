_v.export = (function(){
  'use strict';

  var doc,
      sidebar,
      sidebarOptions,
      panelsWrapper,
      panels,
      selectedClass,
      selectedPanel,
      buttons = {};
  
  function init(){
    doc = chrome.app.window.get('export').contentWindow.document;
    sidebar = doc.getElementById('export-options');
    sidebarOptions = sidebar.getElementsByTagName('ul')[0];
    panelsWrapper = doc.getElementById('export-panels');
    panels = panelsWrapper.getElementsByTagName('li');

    buttons = {
      sidebar:{
        //mockbox :sidebarOptions.querySelector('.mockbox'),
        drive   :sidebarOptions.querySelector('.drive'),
        //dropbox :sidebarOptions.querySelector('.dropbox'),
        ftp     :sidebarOptions.querySelector('.ftp'),
        local   :sidebarOptions.querySelector('.local')
      },
      export  :doc.getElementById('export-options-footer').querySelector('.ok'),
      cancel  :doc.getElementById('export-options-footer').querySelector('.cancel')
    };
    
    addListener();
    
    setPanel({target:buttons.sidebar.local});
  }

  function addListener(){
    for(var i in buttons.sidebar){
      buttons.sidebar[i].addEventListener('click', setPanel);
    }

    buttons.export.addEventListener('click', onExportClick);
    buttons.cancel.addEventListener('click', onCancelClick);
  }

  function onExportClick(e){

    var model = {};

    switch(selectedClass){
      
      case 'drive':
        model.type = selectedClass;
        model.packaged = selectedPanel.querySelector('.zip.switch-input').checked;
      break;

      case 'local':
        model.type = selectedClass;
        model.packaged = selectedPanel.querySelector('.zip.switch-input').checked;
      break;

      case 'ftp':
        model.host = 'get from credentials files';
        model.folder='get from credentials files';
        model.user = 'get from credentials files';
        model.pass = 'get from credentials files';

        model.type = selectedClass;
        model.packaged = selectedPanel.querySelector('.zip.switch-input').checked;
      break;

      default: return;
    }

    chrome.runtime.sendMessage({message:'onExport', model:model });

  }

  function onCancelClick(e){
    chrome.runtime.sendMessage({message:'onClosePopout', popoutId:'export' });
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
    for(var i = 0; i < panels.length; i++){
      if(panels[i].classList[0] === selectedClass){
        // Cache selected element
        selectedPanel = panels[i];
        // Display selected panel
        apollo.removeClass(panels[i], 'hidden');
      }else{
        apollo.addClass(panels[i], 'hidden');  
      } 
    }

    for(var i in buttons.sidebar){
       if(buttons.sidebar[i].classList[0] === selectedClass){
        apollo.addClass(buttons.sidebar[i], 'selected');
      }else{
        apollo.removeClass(buttons.sidebar[i], 'selected');  
      }
    }

    buttons.export.innerHTML = 'export to ' + selectedClass;    

  }


  return {
    init: function(){
      !doc && init();
    }
  };

}());