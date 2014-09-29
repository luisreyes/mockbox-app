_mock.database = (function(){

  var reqResult,
  listeningForResult = false,
  indexedDb = {},
  _onReadyCallback = null;
  
  function init() {
    indexedDb.db = null;
    // open displays the data previously saved
    indexedDb.open(); 
  }

  indexedDb.open = function() {
    var version = 1;
    var request = window.indexedDB.open("MockBoxMasterDB", version);

    // We can only create Object stores in a versionchange transaction.
    request.onupgradeneeded = function(e) {
      var db = e.target.result;

      // A versionchange transaction is started automatically.
      e.target.transaction.onerror = indexedDb.onerror;
      
      if(db.objectStoreNames.contains("prototypes")) {
        db.deleteObjectStore("prototypes");
      }

      if(db.objectStoreNames.contains("templates")) {
        db.deleteObjectStore("templates");
      }

      var store = db.createObjectStore("prototypes",{keyPath: "gui"});
      var guiIndex = store.createIndex("by_prototypeId", "gui");

      var store2 = db.createObjectStore("templates",{keyPath: "gui"});
      var guiIndex2 = store2.createIndex("by_templateId", "gui");

      var store3 = db.createObjectStore("properties",{keyPath: "gui"});
      var guiIndex = store3.createIndex("by_prototypeId", "gui");
    };

    request.onsuccess = function(e) {
      indexedDb.db = e.target.result;
      if(_onReadyCallback) _onReadyCallback();
    };

    request.onerror = indexedDb.onerror;
  };

  indexedDb.addEditEntry = function(store, data, suppressNotification) {
    var db = indexedDb.db,
        trans = db.transaction(store, "readwrite"),
        store = trans.objectStore(store),
        currentGui = _mock.gui() || _mock.utils.getGUID();

    if(store === 'properties'){
      indexedDb.addEditProperties(currentGui, data, suppressNotification)
      return;
    }

    if(store !== 'templates'){
      _mock.gui(_mock.utils.getGUID());
    }
    
    // Put Entry
    var entry = store.put({
      "gui" : (store === 'templates') ? _mock.utils.getGUID() : currentGui,
      "name": data.name,
      "html": data.html,
      "css": data.css,
      "js": data.js,
      "layout": data.layout,
      "createdBy" : data.author || 'you',
      "updatedBy" : data.author || 'you',
      "createdOn" : new Date().getTime(),
      "updatedOn" : new Date().getTime()
    });

    entry.onsuccess = function(e) {
      indexedDb.addEditProperties(currentGui, data.properties, suppressNotification)
    };

    entry.onerror = function(e) {
      mockbox.notify({type:'error',message:'Problem Saving: ' + e.toString()});
    };
  };

  indexedDb.addEditProperties = function(id, _data, suppressNotification) {
    var db = indexedDb.db,
        trans = db.transaction('properties', "readwrite"),
        store = trans.objectStore('properties'),
        currentGui = id;

    var data = _data;
    data.gui = currentGui; 

    // Put Entry
    var entry = store.put(data);

    entry.onsuccess = function(e) {
      // Re-render all the editors
      mockbox.isDirty(false);
      if(!suppressNotification) mockbox.notify({type:'success',message:'Saved Successfully'});
    };

    entry.onerror = function(e) {
      mockbox.notify({type:'error',message:'Problem Saving: ' + e.toString()});
    };
  };
  
  indexedDb.deleteEntry = function(id, store) {
    var db = indexedDb.db;
    var trans = db.transaction(store, "readwrite");
    var store = trans.objectStore(store);

    var request = store.delete(id);

    request.onsuccess = function(e) {
      mockbox.notify({type:'error', message:'Deleted'});
    };

    request.onerror = function(e) {
    };
  };

  indexedDb.getAll = function(store, callback) {
    var db = indexedDb.db;
    var transaction = db.transaction([store]);
    var objectStore = transaction.objectStore(store);

    var items = [];
    var cb = callback;
    var request = objectStore.openCursor();

    request.onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        items.push(cursor.value);
        cursor.continue();
      }
      else {
        cb(items);
      }
    };


    
    request.onerror = function(event) {
      // Handle errors!
    };
  }; 

  _setEditorsFromId = function(id, isTemplate) {
    var db = indexedDb.db;
    var store = isTemplate ? 'templates' : 'prototypes';
    var transaction = db.transaction([store]);
    var objectStore = transaction.objectStore(store);
    var request = objectStore.get(id);
    
    request.onsuccess = function(event) {
      if(request.result){
        // Do something with the request.result!
        var gui = isTemplate ? _mock.utils.getGUID() : request.result.gui;
        _mock.gui(gui);
        _setProperties(id, request.result, isTemplate);
      }
    };
    
    request.onerror = function(event) {
      mockbox.notify({type:'error', message:'There was a problem loading: ' + data.name});
    };
  }; 

  _setProperties = function(id, data, isTemplate) {
    var db = indexedDb.db;
    var store = 'properties';
    var transaction = db.transaction([store]);
    var objectStore = transaction.objectStore(store);
    var request = objectStore.get(id);
    var prototypeData = data;
    
    request.onsuccess = function(event) {
      if(request.result){
        // Do something with the request.result!
        prototypeData.properties = request.result;
        _mock.restore(prototypeData, isTemplate);
        mockbox.notify({type:'info', message:'Loaded ' + data.name});
      }
    };
    
    request.onerror = function(event) {
      mockbox.notify({type:'error', message:'Error loading properties for: ' + data.name});
    };
  }; 


  return {
    init:init,
    save: function(store, data, suppressNotification){
      indexedDb.addEditEntry(store, data, suppressNotification);
    },
    delete:function(id){
      indexedDb.deleteEntry(id, 'prototypes');
      indexedDb.deleteEntry(id, 'properties');
    },
    restoreEditorsFromId: function(id, isTemplate){
      _setEditorsFromId(id, isTemplate);
    },
    onReady: function(callback){
      if(indexedDb.db){
        callback();
      }else{
        _onReadyCallback = callback;
      }
    },
    getAll:function(store, callback){
      indexedDb.getAll(store, callback);
    }

  };

}());