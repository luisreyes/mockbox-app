_v.mockmanager = (function(){
  'use strict';

  var 
  doc,
  _availableIds,
  listContainer;

  function init(){
    doc = chrome.app.window.get('mocks').contentWindow.document;
  }

  function setAvailableIds(){
    mockbox.getAll(function(result){
      _availableIds = result; 
      listContainer = doc.getElementById('mocks-list');
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
        liSubtitle.innerHTML = 'by ' + _availableIds[i].createdBy +' on '+ mockbox.utils.toDate(_availableIds[i].createdOn);

        liLoad.addEventListener('click', function(){
          load(this.getAttribute('data-reference-id'));
        });

        liDelete.addEventListener('click', function(){
          remove(this.getAttribute('data-reference-id'));
        });
        
        
        listContainer.appendChild(li);
      } 
    });
    
  }

  function load(gui){
    if(mockbox.isDirty()){
      mockbox.utils.confirm('continue',function(){
        loadMethods();
      });
    }else{
      loadMethods();
    }  

    function loadMethods(){
      console.log('LOAD');
      chrome.runtime.sendMessage({message:'loadItem', gui:gui});
      mockbox.reset();
      mockbox.popout.close('mocks');
    }
  }

  function remove(gui){
    mockbox.utils.confirm('delete',function(){
      chrome.runtime.sendMessage({message:'deleteItem', gui:gui});
    
      // Visual of Deleting
      var item = doc.getElementById(gui);
      apollo.addClass(item,'deleted');
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