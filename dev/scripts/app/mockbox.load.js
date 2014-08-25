_mock.load = (function(){
  'use strict';

  var 
  doc,
  _availableIds,
  listContainer;

  function init(){
    doc = chrome.app.window.get('load').contentWindow.document;
  }

  function setAvailableIds(){
    _mock.database.getAll(function(result){
      _availableIds = result; 
      listContainer = doc.getElementById('mocks-list');
      listContainer.innerHTML = "";
      
      for (var i=0; i < _availableIds.length;i++){
        var newLi = doc.createElement('li');
        newLi.id = _availableIds[i].gui;
        newLi.addEventListener('click', function(){
           load(this.id);
        });
        
        newLi.innerHTML = _availableIds[i].name;
        listContainer.appendChild(newLi);
      } 
    });
    
  }

  function load(gui){
    chrome.runtime.sendMessage({message:'loadItem', gui:gui});
    _mock.reset();
    _mock.popout.close('load');
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