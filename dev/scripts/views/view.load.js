_v.load = (function(){
  'use strict';

  var doc,
      sidebar,
      sidebarOptions,
      panelsWrapper,
      panels,
      selectedClass,
      selectedPanel,
      buttons = {},
      _availableIds,
      prototypeListContainer,
      templateListContainer,
      emptyPrototypeList,
      emptyTemplateList,
      itemCount;

  function init(){
    doc = chrome.app.window.get('load').contentWindow.document;
    sidebar = doc.getElementById('load-options');
    sidebarOptions = sidebar.getElementsByTagName('ul')[0];
    panelsWrapper = doc.getElementById('load-panels');
    panels = panelsWrapper.getElementsByTagName('ul')[0].getElementsByClassName('panel');

    buttons = {
      sidebar:{
        templates :sidebarOptions.querySelector('.templates'),
        prototypes   :sidebarOptions.querySelector('.prototypes')
      }
    };
    
    addListener();
    
    setPanel({target:buttons.sidebar.prototypes});
  }

  function addListener(){
    for(var i in buttons.sidebar){
      buttons.sidebar[i].addEventListener('click', setPanel);
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
  }

  function setAvailablePrototypeIds(){
    mockbox.getAll('prototypes',function(result){
      prototypeListContainer = doc.getElementById('prototype-list');
      emptyPrototypeList = doc.getElementById('prototype-list-empty');
      itemCount = result.length;
      
      if(itemCount){
        _availableIds = result; 
        apollo.removeClass(prototypeListContainer, 'hidden');
        apollo.addClass(emptyPrototypeList, 'hidden');
        prototypeListContainer.innerHTML = "";
        
        for (var i=0; i < _availableIds.length;i++){
          
          var template = doc.getElementById('prototypes-list-item-template').cloneNode(true),
              li = template.querySelector('.list-item'),
              liTitle = template.querySelector('.list-item-title'),
              liSubtitle = template.querySelector('.list-item-subtitle'),
              liLoad = template.querySelector('.list-item-load'),
              liDelete = template.querySelector('.list-item-delete');

          li.id = _availableIds[i].gui;
          liTitle.innerHTML = _availableIds[i].name;
          liTitle.setAttribute('title',_availableIds[i].name);
          liSubtitle.innerHTML = 'Created on '+ mockbox.utils.toDate(_availableIds[i].createdOn);
          liLoad.setAttribute('data-reference-id',_availableIds[i].gui);
          liLoad.setAttribute('data-load-type','prototype');
          liDelete.setAttribute('data-reference-id',_availableIds[i].gui);

          liLoad.addEventListener('click', onLoadClick);

          liDelete.addEventListener('click', onDeleteClick);
          
          prototypeListContainer.appendChild(li);
        }
      }else{
          apollo.addClass(prototypeListContainer, 'hidden');
          apollo.removeClass(emptyPrototypeList, 'hidden');
        }
    });
    
  }


  function setAvailableTemplateIds(){
    mockbox.getAll('templates', function(result){
      templateListContainer = doc.getElementById('templates-list');
      emptyTemplateList = doc.getElementById('templates-list-empty');
      itemCount = result.length;
      
      if(itemCount){
        _availableIds = result; 
        apollo.removeClass(templateListContainer, 'hidden');
        apollo.addClass(emptyTemplateList, 'hidden');
        templateListContainer.innerHTML = "";
        
        for (var i=0; i < _availableIds.length;i++){
          
          var template = doc.getElementById('templates-list-item-template').cloneNode(true),
              li = template.querySelector('.list-item'),
              liTitle = template.querySelector('.list-item-title'),
              liLoad = template.querySelector('.list-item-load');
              
          li.id = _availableIds[i].gui;
          liTitle.innerHTML = _availableIds[i].name;
          liTitle.setAttribute('title',_availableIds[i].name);
          liLoad.setAttribute('data-reference-id',_availableIds[i].gui);
          liLoad.setAttribute('data-load-type','template');
          
          liLoad.addEventListener('click', onLoadClick);

          templateListContainer.appendChild(li);
        }
      }else{
          apollo.addClass(templateListContainer, 'hidden');
          apollo.removeClass(emptyTemplateList, 'hidden');
        }
    });
    
  }

  function onLoadClick(e){
    var element = e.target;
    while(element.localName !== 'td'){
      element = element.parentNode;
    }
    load(element.getAttribute('data-reference-id'), element.getAttribute('data-load-type'));
  }

  function onDeleteClick(e){
    var element = e.target;
    while(element.localName !== 'td'){
      element = element.parentNode;
    }
    remove(element.getAttribute('data-reference-id'));
  }

  function load(gui, type){
    var isTemplate = (type === 'template') ? true : false;
    if(mockbox.isDirty()){
      mockbox.popout.confirm('continue',function(){
        loadMethods(isTemplate);
      });
    }else{
      loadMethods(isTemplate);
    }  

    function loadMethods(isTemplate){
     chrome.runtime.sendMessage({message:'onLoadItem', gui:gui, isTemplate:isTemplate});
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
        apollo.addClass(prototypeListContainer, 'hidden');
        apollo.removeClass(emptyPrototypeList, 'hidden');
      }

    });
    
  }


  return {
    init: function(){
      !doc && init();
    },
    generateList: function(){
      setAvailableTemplateIds();
      setAvailablePrototypeIds();
    }
  };

}());