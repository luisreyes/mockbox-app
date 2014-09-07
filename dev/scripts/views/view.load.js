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
        item.parentNode.removeChild(item)
      });
      
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