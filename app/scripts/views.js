/*! MockBox - Prorotype builder
/*  Author: Luis Reyes <luis@luisreyes.com>
/*  Url: mockbox.io
*/
var views; 

(function(){ var _v = (function(){
'use strict';

  function init(){}

  views = this;

  return {
   init: function(){
      init();

    }
  };

}());


_v.about = (function(){
  'use strict';

  var doc,
      buttons = {},
      links = {
        twitter:'https://twitter.com/mockboxio',
        email:'mailto:mockbox@luisreyes.com?subject=Hello MockBox Support'
      };

  function init(){
    doc = chrome.app.window.get('about').contentWindow.document;
    doc.getElementById('about-version').innerHTML = 'v' + chrome.runtime.getManifest().version;

    buttons = {
      twitter: doc.getElementById('about-footer').querySelector('.twitter'),
      email: doc.getElementById('about-footer').querySelector('.email')
    };

    addListeners();

    checkUpdate();
  }

  function addListeners(){
    buttons.twitter.addEventListener( 'click', function(){
      // Open external page
      openLink('twitter');
    });

    buttons.email.addEventListener( 'click', function(){
      // Open external page
      openLink('email');
    });
  }

  function openLink(loc){
    // Open external page
    window.open(links[loc], '_blank');
  }

  function checkUpdate(){
    chrome.runtime.requestUpdateCheck(function(status){
      var msg;
      switch(status){
        case 'no_update':
          msg = 'You are running on the latest version';
          break;
        case 'update_available':
          msg = 'An update is avalable';
          break;
        case 'throttled':
          msg = 'There are no updates available';
          break;
      }

      doc.getElementById('about-update').innerHTML = msg;
      

    });
  }

  function onLoad(){
    checkUpdate();
  }
  return {
    init: function(){
      if(!doc){
        init();
      }else{
        onLoad();
      }
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

    for(var item in buttons.sidebar){
       if(buttons.sidebar[item].classList[0] === selectedClass){
        apollo.addClass(buttons.sidebar[item], 'selected');
      }else{
        apollo.removeClass(buttons.sidebar[item], 'selected');  
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
      mockbox.reset({clearProperties:true});
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
      if(!doc) init();
    },
    generateList: function(){
      setAvailableTemplateIds();
      setAvailablePrototypeIds();
    }
  };

}());
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
          preprocessor: "none",
          html: "",
          head: ""
        },
        css:{
          preprocessor: "none",
          normalize: false,
          animate: false,
          sources: []
        },
        js:{
          preprocessor: "none",
          framework: "none",
          apollo: false,
          modernizer: false,
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
          preprocessor: doc.getElementById('properties-html-preprocessor').value,
          html: doc.getElementById('properties-html-customHtml').value,
          head: doc.getElementById('properties-html-headIncludes').value
        },
        css:{
          preprocessor: doc.getElementById('properties-css-preprocessor').value,
          normalize: doc.getElementById('properties-css-normalize').checked,
          animate: doc.getElementById('properties-css-animate').checked,
          sources: doc.getElementById('properties-css-sources').value.split(',')
        },
        js:{
          preprocessor: doc.getElementById('properties-js-preprocessor').value,
          framework: doc.getElementById('properties-js-framework').value,
          apollo: doc.getElementById('properties-js-apollo').checked,
          modernizer: doc.getElementById('properties-js-modernizer').checked,
          sources: doc.getElementById('properties-js-sources').value.split(',')
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
    doc.getElementById('properties-html-preprocessor').value = properties.html.preprocessor,
    doc.getElementById('properties-html-customHtml').value = properties.html.html,
    doc.getElementById('properties-html-headIncludes').value = properties.html.head
    
    // CSS Fields
    doc.getElementById('properties-css-preprocessor').value = properties.css.preprocessor,
    doc.getElementById('properties-css-normalize').checked = properties.css.normalize,
    doc.getElementById('properties-css-animate').checked = properties.css.animate,
    doc.getElementById('properties-css-sources').value = properties.css.sources
    
    // JavaScript Fields
    doc.getElementById('properties-js-preprocessor').value = properties.js.preprocessor,
    doc.getElementById('properties-js-framework').value = properties.js.framework,
    doc.getElementById('properties-js-apollo').checked = properties.js.apollo,
    doc.getElementById('properties-js-modernizer').checked = properties.js.modernizer,
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
_v.purchase = (function(){
  'use strict';

  var doc, buttons = {}, hasExport = false;
      
  function init(){
    doc = chrome.app.window.get('purchase').contentWindow.document;
    
    buttons = {
      // CACHE THE PURCHASE BUTTON HERE
      buy: doc.getElementById('purchase-footer').querySelector('.buy')
    };
    
    addListeners();
    getLicenses();
  }

  function addListeners(){
    
    buttons.buy.addEventListener('click', onPurchaseClick);
    
  }

  function getLicenses(){
    google.payments.inapp.getPurchases({
      'success': onLicenseUpdate,
      'failure': onLicenseUpdateFail
    });
  }

  function onPurchaseClick(e){
    // Go purchase a license
    var sku = "pkg_export";
    google.payments.inapp.buy({
      'parameters': {'env': 'prod'},
      'sku': sku,
      'success': onPurchase,
      'failure': onPurchaseFailed
    });

  }

  function onLicenseUpdate(result){
    // Validate result to set "hasExport"
    if(result.response.details[0].sku === "pkg_export"){
      // Send Is licenced
      chrome.runtime.sendMessage({message:'onPurchased', licensed:true });
    }
  }
  function onLicenseUpdateFail(result){
    // Validate result to set "hasExport"
  }


  function onPurchase(purchase) {
    var jwt = purchase.jwt;
    var cartId = purchase.request.cardId;
    var orderId = purchase.response.orderId;
    //statusDiv.text("Purchase completed. Order ID: " + orderId);
    getLicenses();
  }

  function onPurchaseFailed(purchase) {
    var reason = purchase.response.errorType;
    //statusDiv.text("Purchase failed. " + reason);
  }
  

  return {
    init: function(data){
      if(!doc) init();
    }
  };

}());
_v.settings = (function(){
  'use strict';

  var doc,
      sidebar,
      sidebarOptions,
      panelsWrapper,
      panels,
      selectedClass,
      selectedPanel,
      buttons = {};

  function _init(){
    doc = chrome.app.window.get('settings').contentWindow.document;
    sidebar = doc.getElementById('settings-options');
    sidebarOptions = sidebar.getElementsByTagName('ul')[0];
    panelsWrapper = doc.getElementById('settings-panels');
    panels = panelsWrapper.getElementsByTagName('ul')[0].getElementsByClassName('panel');

    buttons = {
      sidebar:{
        application:sidebarOptions.querySelector('.application')
      },
      ok:doc.getElementById('settings-footer').querySelector('.ok'),
      cancel:doc.getElementById('settings-footer').querySelector('.cancel')
    }

    addListeners();

    setPanel({target:buttons.sidebar.application});
  }

  function addListeners(){
    for(var i in buttons.sidebar){
      buttons.sidebar[i].addEventListener('click', setPanel);
    }

    buttons.ok.addEventListener('click', onOkClick);
    buttons.cancel.addEventListener('click', onCancelClick);

  }

  function onOkClick(e){
    var data = {
      message:'saveSettings', 
      settings:{
        theme: doc.getElementById('settings-theme-select').value,
        autoload:doc.getElementById('settings-open-check').checked
      }
    };

    chrome.runtime.sendMessage(data);
    chrome.runtime.sendMessage({message:'onClosePopout', popoutId:'settings'});
  }

  function onCancelClick(e){
    chrome.runtime.sendMessage({message:'onClosePopout', popoutId:'settings' });
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

  function _restoreStates(settings){
    // Set Theme
    doc.getElementById('settings-theme-select').value = settings.theme;
    // Set Last Worked on Checkbox
    doc.getElementById('settings-open-check').checked = settings.autoload;
    // Update buttons
    //_updateAuths();
  }

  // function _updateAuths(){
  //   // Get all current tokens
  //   var tokens = mockbox.getTokens();

  //   // Cache services container DOM Element
  //   var services = doc.getElementById('settings-access-services');
    
  //   // Check for available tokens
  //   setState(services.getElementsByClassName('google-access')[0], tokens.google);
  // }

  // function setState(service, hasToken){
  //   var hideElements,showElements;

  //   if(hasToken){
  //     showElements = service.getElementsByClassName('revoke');
  //     hideElements = service.getElementsByClassName('access');
  //     service.getElementsByTagName('input')[0].checked = true;
  //   }else{
  //     showElements = service.getElementsByClassName('access');
  //     hideElements = service.getElementsByClassName('revoke');
  //     service.getElementsByTagName('input')[0].checked = false;
  //   }

  //   var i = 0;
  //   for(i; i < showElements.length; i++){
  //     apollo.removeClass(showElements[i], 'hidden');  
  //   }

  //   for(i; i < hideElements.length; i++){
  //     apollo.addClass(hideElements[i], 'hidden');
  //   }
  // }

  return {
    init: function(callback){
      if(!doc) _init(callback);
    },
    restoreSettingStates: function(settings){
      _restoreStates(settings);
    },
    updateAuthorizations:function(){
      //_updateAuths();
    }
  };

}());
  
  window.addEventListener("DOMContentLoaded", _v.init, false);
  //Expose
  views = _v;

}());