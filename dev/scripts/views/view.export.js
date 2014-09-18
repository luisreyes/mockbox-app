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
      buttons = {}, 
      fields = [];
  
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

    fields = [
      doc.getElementById('ftp-export-host-input'),
      doc.getElementById('ftp-export-port-input'),
      doc.getElementById('ftp-export-path-input'),
      doc.getElementById('ftp-export-user-input'),
      doc.getElementById('ftp-export-pass-input')
    ];
    
    addListeners();
    
    setPanel({target:buttons.sidebar.local});
  }

  function addListeners(){
    for(var i in buttons.sidebar){
      buttons.sidebar[i].addEventListener('click', setPanel);
    }

    buttons.export.addEventListener('click', onExportClick);
    buttons.cancel.addEventListener('click', onCancelClick);

    fields.forEach(function(field){
          
      // Add listener to for ENTER key
      field.addEventListener('focus', function(){
        this.addEventListener('keypress', onKeypress);
      });

      // Remove listener to for ENTER key
      field.addEventListener('blur', function(){
        this.removeEventListener('keypress', onKeypress);
      });

    });


  }

  function onExportClick(e){
    var isValid = false;
    var model = {};

    switch(selectedClass){
      
      case 'drive':
        model.type = selectedClass;
        model.packaged = selectedPanel.querySelector('.zip.switch-input').checked;
        model.versioned = selectedPanel.querySelector('.version.switch-input').checked;
        isValid = true;
      break;

      case 'local':
        model.type = selectedClass;
        model.packaged = selectedPanel.querySelector('.zip.switch-input').checked;
        model.versioned = selectedPanel.querySelector('.version.switch-input').checked;
        isValid = true;
      break;

      case 'ftp':
        model.host = '';
        model.folder = '';
        model.user = '';
        model.pass = '';

        model.type = selectedClass;
        model.packaged = selectedPanel.querySelector('.zip.switch-input').checked;
        model.versioned = selectedPanel.querySelector('.version.switch-input').checked;
        model.host =    fields[0].value;
        model.port =    fields[1].value;
        model.folder =  fields[2].value;
        model.user =    fields[3].value;
        model.pass =    fields[4].value;

        if(model.host === ''){
          mockbox.notify({type:'error', message:'Please enter a valid host address'});
          return;
        }

        if(model.user === ''){
          mockbox.notify({type:'error', message:'Please enter a valid username'});
          return;
        }
        
        isValid = true;      

      break;

      default: return;
    }
    if(isValid){
      saveFieldsToSettings();
      chrome.runtime.sendMessage({message:'onExport', model:model });
    }

  }

  function onKeypress(e){
    if(e.keyCode === 13){
      buttons.export.click();
    }
  }

  function saveFieldsToSettings(){    
    var data = {
      message:'saveSettings', 
      settings:{
        ftp:{
          host: doc.getElementById('ftp-export-host-input').value,
          port: doc.getElementById('ftp-export-port-input').value,
          path: doc.getElementById('ftp-export-path-input').value,
          user: doc.getElementById('ftp-export-user-input').value
        }
      }
    };

    chrome.runtime.sendMessage(data);
  }

  function onCancelClick(e){
    chrome.runtime.sendMessage({message:'onClosePopout', popoutId:'export' });
  }

  function restoreFields(data){
    if(data.ftp){
      doc.getElementById('ftp-export-host-input').value = data.ftp.host || '';
      doc.getElementById('ftp-export-port-input').value = data.ftp.port || '';
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

    buttons.export.innerHTML = 'export to ' + selectedClass;    

  }


  return {
    init: function(data){
      if(!doc) init();

      restoreFields(data);
    }
  };

}());