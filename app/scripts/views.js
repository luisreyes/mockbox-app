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

  var doc;

  function init(){
    doc = chrome.app.window.get('about').contentWindow.document;
    doc.getElementById('about-version').innerHTML = 'Current version: ' + chrome.runtime.getManifest().version;
  }

  return {
    init: function(){
      if(!doc) init();
    }
  }

}());
_v.mocks = (function(){
  'use strict';

  var doc, _availableIds, listContainer, emptyList, itemCount;

  function init(){
    doc = chrome.app.window.get('mocks').contentWindow.document;
  }

  function setAvailableIds(){
    mockbox.getAll(function(result){
      listContainer = doc.getElementById('mocks-list');
      emptyList = doc.getElementById('mocks-list-empty');
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

          liLoad.addEventListener('click', function(){
            load(this.getAttribute('data-reference-id'));
          });

          liDelete.addEventListener('click', function(){
            remove(this.getAttribute('data-reference-id'));
          });
          
          
          listContainer.appendChild(li);
        }
      }else{
          apollo.addClass(listContainer, 'hidden');
          apollo.removeClass(emptyList, 'hidden');
        }
    });
    
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
      mockbox.reset();
      mockbox.popout.close('mocks');
    }
  }

  function remove(gui){
    mockbox.popout.confirm('delete',function(){
      chrome.runtime.sendMessage({message:'onDeleteItem', gui:gui});
      itemCount--;

      // Visual of Deleting
      var item = doc.getElementById(gui);
      apollo.addClass(item,'deleted');
      
      if(!itemCount){
        apollo.addClass(listContainer, 'hidden');
        apollo.removeClass(emptyList, 'hidden');
      }

    });
    
  }


  return {
    init: function(){
      if(!doc) init();
    },
    generateList: function(){
      setAvailableIds();
    }
  }

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
    setState(services.getElementsByClassName('github-access')[0], tokens.github);
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
    for(var i = 0; i <= showElements.length-1; i++){
      apollo.removeClass(showElements[i], 'hidden');  
    }

    for(var i = 0; i <= hideElements.length-1; i++){
      apollo.addClass(hideElements[i], 'hidden');
    }
  }

  return {
    init: function(){
      if(!doc) _init();
    },
    restoreSettingStates: function(settings){
      _restoreStates(settings);
    },
    updateAuthorizations:function(){
      _updateAuths();
    }
  }

}());
  _v.init();

  //Expose
  views = _v;

}());