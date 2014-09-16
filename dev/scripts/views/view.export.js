_v.export = (function(){
  'use strict';

  var doc,
      sidebar,
      sidebarOptions,
      panelsWrapper,
      panels,
      selectedClass,
      selectedPanel,
      saveTimeout,
      buttons = {};
  
  function init(restoreData){
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
    
    addListeners();
    
    restoreData && restoreFields(restoreData);

    setPanel({target:buttons.sidebar.local});
  }

  function addListeners(){
    for(var i in buttons.sidebar){
      buttons.sidebar[i].addEventListener('click', setPanel);
    }

    buttons.export.addEventListener('click', onExportClick);
    buttons.cancel.addEventListener('click', onCancelClick);

    doc.getElementById('ftp-export-host-input').addEventListener('blur', onInputBlur);
    doc.getElementById('ftp-export-path-input').addEventListener('blur', onInputBlur);
    doc.getElementById('ftp-export-user-input').addEventListener('blur', onInputBlur);

  }

  function onExportClick(e){

    var model = {};

    switch(selectedClass){
      
      case 'drive':
        model.type = selectedClass;
        model.packaged = selectedPanel.querySelector('.zip.switch-input').checked;
        model.versioned = selectedPanel.querySelector('.version.switch-input').checked;
      break;

      case 'local':
        model.type = selectedClass;
        model.packaged = selectedPanel.querySelector('.zip.switch-input').checked;
        model.versioned = selectedPanel.querySelector('.version.switch-input').checked;
      break;

      case 'ftp':
        model.host = '';
        model.folder = ''
        model.user = '';
        model.pass = '';

        model.type = selectedClass;
        model.packaged = selectedPanel.querySelector('.zip.switch-input').checked;
        model.versioned = selectedPanel.querySelector('.version.switch-input').checked;
        model.host = doc.getElementById('ftp-export-host-input').value;
        model.folder = doc.getElementById('ftp-export-path-input').value;
        model.user = doc.getElementById('ftp-export-user-input').value;
        model.pass = doc.getElementById('ftp-export-pass-input').value;
      break;

      default: return;
    }

    chrome.runtime.sendMessage({message:'onExport', model:model });

  }

  function onInputBlur(e){
    
    if(saveTimeout) clearTimeout(saveTimeout);
    
    var data = {
      message:'saveSettings', 
      settings:{
        ftp:{
          host: doc.getElementById('ftp-export-host-input').value,
          path: doc.getElementById('ftp-export-path-input').value,
          user: doc.getElementById('ftp-export-user-input').value
        }
      }
    };

    saveTimeout = setTimeout(function(){
      chrome.runtime.sendMessage(data);  
    }, 1000);
    
  }

  function onCancelClick(e){
    chrome.runtime.sendMessage({message:'onClosePopout', popoutId:'export' });
  }

  function restoreFields(data){
    if(data.ftp){
      doc.getElementById('ftp-export-host-input').value = data.ftp.host || '';
      doc.getElementById('ftp-export-path-input').value = data.ftp.path || '';
      doc.getElementById('ftp-export-user-input').value = data.ftp.user || '';
    }

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
    init: function(data){
      !doc && init(data);
    }
  };

}());