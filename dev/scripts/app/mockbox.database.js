_mock.database = (function(){

  var reqResult,
  listeningForResult = false,
  indexedDb = {};
  indexedDb.db = null,
  _onReadyCallback = null;
  
  function init() {
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
    };

    request.onsuccess = function(e) {
      indexedDb.db = e.target.result;
      _onReadyCallback && _onReadyCallback();
    };

    request.onerror = indexedDb.onerror;
  };

  indexedDb.addEditEntry = function(table, data, suppressNotification) {
    var db = indexedDb.db,
        trans = db.transaction(table, "readwrite"),
        store = trans.objectStore(table),
        currentGui = _mock.gui() || _mock.utils.getGUID();

    if(table !== 'templates'){
      _mock.gui(currentGui);
    }
    
    // Put Entry
    var entry = store.put({
      "gui" : (table === 'templates') ? _mock.utils.getGUID() : currentGui,
      "name": data.name || "No Name",
      "html": data.html,
      "css": data.css,
      "js": data.js,
      "layout": data.layout,
      "createdBy" : data.author || 'Someone',
      "updatedBy" : data.author || 'Someone',
      "createdOn" : new Date().getTime(),
      "updatedOn" : new Date().getTime()
    });

    entry.onsuccess = function(e) {
      // Re-render all the editors
      mockbox.isDirty(false);
      !suppressNotification && mockbox.notify({type:'success',message:'Saved Successfully'});
    };

    entry.onerror = function(e) {
      mockbox.notify({type:'error',message:'Problem Saving: ' + e.toString()});
    };
  };
  
  indexedDb.deleteEntry = function(id, table) {
    var db = indexedDb.db;
    var trans = db.transaction(table, "readwrite");
    var store = trans.objectStore(table);

    var request = store.delete(id);

    request.onsuccess = function(e) {
      mockbox.notify({type:'error', message:'Deleted'});
    };

    request.onerror = function(e) {
    };
  };

  indexedDb.getAll = function(table, callback) {
    var db = indexedDb.db;
    var transaction = db.transaction([table]);
    var objectStore = transaction.objectStore(table);

    var items = [];
    var callback = callback;
    var request = objectStore.openCursor();

    request.onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        items.push(cursor.value);
        cursor.continue();
      }
      else {
        callback(items);
      }
    };


    
    request.onerror = function(event) {
      // Handle errors!
    };
  }; 

  indexedDb.setEditorsFromId = function(id, isTemplate) {
    var db = indexedDb.db;
    var table = isTemplate ? 'templates' : 'prototypes'
    var transaction = db.transaction([table]);
    var objectStore = transaction.objectStore(table);
    var request = objectStore.get(id);
    
    request.onsuccess = function(event) {
      if(request.result){
        // Do something with the request.result!
        mockbox.notify({type:'info', message:'Loaded ' + request.result.name});
        var gui = isTemplate ? _mock.utils.getGUID() : request.result.gui;
        _mock.gui(gui);
        _mock.restore(request.result, isTemplate);
      }
    };
    
    request.onerror = function(event) {};
  }; 


  return {
    init:init,
    save: function(table, data, suppressNotification){
      indexedDb.addEditEntry(table, data, suppressNotification);
    },
    delete:function(id){
      indexedDb.deleteEntry(id, 'prototypes');
    },
    restoreEditorsFromId: function(id, isTemplate){
      indexedDb.setEditorsFromId(id, isTemplate);
    },
    onReady: function(callback){
      if(indexedDb.db){
        callback();
      }else{
        _onReadyCallback = callback;
      }
    },
    getAll:function(table, callback){
      indexedDb.getAll(table, callback);
    }

  };

}());