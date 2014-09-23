_v.properties = (function(){
  'use strict';

  var doc,
      sidebar,
      sidebarOptions,
      panelsWrapper,
      panels,
      selectedClass,
      selectedPanel,
      buttons = {},
      defaults = {
        html:{
          html: "",
          head: ""
        },
        css:{
          normalize: true,
          sources: []
        },
        js:{
          framework: "none",
          apollo: false,
          sources: []
        }
      };

  function _init(callback){
    doc = chrome.app.window.get('properties').contentWindow.document;
    sidebar = doc.getElementById('properties-options');
    sidebarOptions = sidebar.getElementsByTagName('ul')[0];
    panelsWrapper = doc.getElementById('properties-panels');
    panels = panelsWrapper.getElementsByTagName('ul')[0].getElementsByClassName('panel');
    
    buttons = {
      sidebar:{
        html:sidebarOptions.querySelector('.html-properties'),
        css:sidebarOptions.querySelector('.css-properties'),
        js:sidebarOptions.querySelector('.js-properties')
      },
      ok:doc.getElementById('properties-footer').querySelector('.ok'),
      cancel:doc.getElementById('properties-footer').querySelector('.cancel')
    }

    addListeners();

    setPanel({target:buttons.sidebar.html});

    if(callback) callback();

  }

  function addListeners(){
    for(var i in buttons.sidebar){
      buttons.sidebar[i].addEventListener('click', setPanel);
    }

    buttons.ok.addEventListener('click', onOkClick);
    buttons.cancel.addEventListener('click', onCancelClick);

  }

  function _getAll(){
    return {
      html:{
          html: doc.getElementById('properties-html-customHtml').value,
          head: doc.getElementById('properties-html-headIncludes').value
        },
        css:{
          normalize: doc.getElementById('properties-css-normalize').checked,
          sources: doc.getElementById('properties-css-sources').value.split(';')
        },
        js:{
          framework: doc.getElementById('properties-js-framework').value,
          apollo: doc.getElementById('properties-js-apollo').checked,
          sources: doc.getElementById('properties-js-sources').value.split(';')
        }
      };
  }

  function onOkClick(e){
    var data = {
      message:'setProperties', 
      properties: _getAll()
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

  function _restore(properties){
    // Set Window Title
    var title = properties.title || 'Prototype';
    doc.querySelector('.popout-title').innerHTML = title + ' Properties';

    // HTML Fields
    doc.getElementById('properties-html-customHtml').value = properties.html.html,
    doc.getElementById('properties-html-headIncludes').value = properties.html.head
    
    // CSS Fields
    doc.getElementById('properties-css-normalize').checked = properties.css.normalize,
    doc.getElementById('properties-css-sources').value = properties.css.sources
    
    // JavaScript Fields
    doc.getElementById('properties-js-framework').value = properties.js.framework,
    doc.getElementById('properties-js-apollo').checked = properties.js.apollo,
    doc.getElementById('properties-js-sources').value = properties.js.sources

  }

  
  return {
    init: function(callback){
      if(!doc){
        _init(callback);
      }else if(callback){
        callback();
      };
    },
    restore: function(properties){
        _restore(properties);
    },
    getAll: function(){
      if(doc)
        return _getAll();
      else
        return defaults;
    },
    reset: function(){
      if(doc){
        _restore(defaults);  
        setPanel({target:buttons.sidebar.html});
      }
    },
    getDefaults: function(){
      return defaults;
    }
  };

}());