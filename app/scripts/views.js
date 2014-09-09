/*! MockBox - Prorotype builder
/*  Author: Luis Reyes <luis@luisreyes.com>
/*  Url: mockbox.io
*/
var views; 

(function(){ var _v = (function(){
'use strict';

  function init(){}

  return {
    init: init
  };

}());


_v.about = (function(){
  'use strict';

  var doc,
      buttons = {},
      links = {
        twitter:'https://twitter.com/mockboxio',
        email:'mailto:support@mockbox.io?subject=Hello MockBox'
      };

  function init(){
    doc = chrome.app.window.get('about').contentWindow.document;
    doc.getElementById('about-version').innerHTML = 'Current version: ' + chrome.runtime.getManifest().version;

    buttons = {
      twitter: doc.getElementById('about-footer').querySelector('.twitter'),
      email: doc.getElementById('about-footer').querySelector('.email')
    };

    addListeners();
  }

  function addListeners(){
    buttons.twitter.addEventListener( 'click', function(){
      // Open external page
      openLink('twitter');
    });

    buttons.email.addEventListener( 'click', function(){
      // Open external page
      //openLink('email');
      testGooglePayments();
    });
  }

  function openLink(loc){
    // Open external page
    window.open(links[loc], '_blank');
  }

  function testGooglePayments(){
    google.payments.inapp.getPurchases({
        'success': function(){
          console.log('Purch Success');
        },
        'failure': function(){
          console.log('Purch fail');   
        }
      });

      google.payments.inapp.getSkuDetails({
          'parameters': {'env': 'prod'},
          'success': function(){
            console.log('SKU Success');
            console.log(arguments);
          },
          'failure': function(){
            console.log('SKU fail');
            console.log(arguments);   
          }
        });
  }
  return {
    init: function(){
      !doc && init();
    }
  };

}());
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
        mockbox :sidebarOptions.querySelector('.mockbox'),
        drive   :sidebarOptions.querySelector('.drive'),
        dropbox :sidebarOptions.querySelector('.dropbox'),
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
_v.load = (function(){
  'use strict';

  var doc, _availableIds, listContainer, emptyList, itemCount;

  function init(){
    doc = chrome.app.window.get('load').contentWindow.document;
  }

  function setAvailableIds(){
    mockbox.getAllPrototypes(function(result){
      listContainer = doc.getElementById('prototype-list');
      emptyList = doc.getElementById('prototype-list-empty');
      itemCount = result.length;
      
      if(itemCount){
        _availableIds = result; 
        apollo.removeClass(listContainer, 'hidden');
        apollo.addClass(emptyList, 'hidden');
        listContainer.innerHTML = "";
        
        for (var i=0; i < _availableIds.length;i++){
          
          var template = doc.getElementById('list-item-template').cloneNode(true),
              li = template.querySelector('.list-item'),
              liTitle = template.querySelector('.list-item-title'),
              liSubtitle = template.querySelector('.list-item-subtitle'),
              liLoad = template.querySelector('.list-item-load'),
              liDelete = template.querySelector('.list-item-delete');

          li.id = _availableIds[i].gui;
          liLoad.setAttribute('data-reference-id',_availableIds[i].gui);
          liDelete.setAttribute('data-reference-id',_availableIds[i].gui);
          liTitle.innerHTML = _availableIds[i].name;
          liSubtitle.innerHTML = 'Created on '+ mockbox.utils.toDate(_availableIds[i].createdOn);

          liLoad.addEventListener('click', onLoadClick);

          liDelete.addEventListener('click', onDeleteClick);
          
          listContainer.appendChild(li);
        }
      }else{
          apollo.addClass(listContainer, 'hidden');
          apollo.removeClass(emptyList, 'hidden');
        }
    });
    
  }

  function onLoadClick(e){
    load(e.target.getAttribute('data-reference-id'));
  }

  function onDeleteClick(e){
    remove(e.target.getAttribute('data-reference-id'));
  }

  function load(gui){
    if(mockbox.isDirty()){
      mockbox.popout.confirm('continue',function(){
        loadMethods();
      });
    }else{
      loadMethods();
    }  

    function loadMethods(){
      chrome.runtime.sendMessage({message:'onLoadItem', gui:gui});
      // Clear Dirty Flag to bypass reset dirty check
      mockbox.isDirty(false);
      mockbox.reset();
      mockbox.popout.close('load');
    }
  }

  function remove(gui){
    mockbox.popout.confirm('delete',function(){
      chrome.runtime.sendMessage({message:'onDeleteItem', gui:gui});
      itemCount--;

      // Visual of Deleting
      var item = doc.getElementById(gui);
      apollo.addClass(item,'deleted');

      item.addEventListener('webkitTransitionEnd', function() {
        item.parentNode.removeChild(item);
      });
      
      if(!itemCount){
        apollo.addClass(listContainer, 'hidden');
        apollo.removeClass(emptyList, 'hidden');
      }

    });
    
  }


  return {
    init: function(){
      !doc && init();
    },
    generateList: function(){
      setAvailableIds();
    }
  };

}());
_v.settings = (function(){
  'use strict';

  var doc;

  function _init(){
    doc = chrome.app.window.get('settings').contentWindow.document;
  }

  
  function _restoreStates(settings){
    // Set Theme
    doc.getElementById('settings-theme-select').value = settings.theme;
    // Set Last Worked on Checkbox
    doc.getElementById('settings-open-check').checked = settings.autoload;
    // Update buttons
    _updateAuths();
  }

  function _updateAuths(){
    // Get all current tokens
    var tokens = mockbox.getTokens();

    // Cache services container DOM Element
    var services = doc.getElementById('settings-access-services');
    
    // Check for available tokens
    setState(services.getElementsByClassName('google-access')[0], tokens.google);
  }

  function setState(service, hasToken){
    var hideElements,showElements;

    if(hasToken){
      showElements = service.getElementsByClassName('revoke');
      hideElements = service.getElementsByClassName('access');
      service.getElementsByTagName('input')[0].checked = true;
    }else{
      showElements = service.getElementsByClassName('access');
      hideElements = service.getElementsByClassName('revoke');
      service.getElementsByTagName('input')[0].checked = false;
    }

    var i = 0;
    for(i; i < showElements.length; i++){
      apollo.removeClass(showElements[i], 'hidden');  
    }

    for(i; i < hideElements.length; i++){
      apollo.addClass(hideElements[i], 'hidden');
    }
  }

  return {
    init: function(callback){
      !doc && _init(callback);
    },
    restoreSettingStates: function(settings){
      _restoreStates(settings);
    },
    updateAuthorizations:function(){
      _updateAuths();
    }
  };

}());
  _v.init();

  //Expose
  views = _v;

}());