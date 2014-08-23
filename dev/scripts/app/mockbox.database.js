_mock.database = (function(){

  // https://developer.chrome.com/apps/offline_apps
  // http://www.w3.org/TR/IndexedDB/

  var indexedDb = {};
  indexedDb.db = null;
  
  function init() {
    indexedDb.open(); // open displays the data previously saved
  }

  function getUID() {
      return ("000000" + (Math.random()*Math.pow(36,6) << 0).toString(36)).slice(-6)
  }

  indexedDb.open = function() {
    var version = 1;
    var request = window.indexedDB.open("MockBoxMasterDB", version);

    // We can only create Object stores in a versionchange transaction.
    request.onupgradeneeded = function(e) {
      var db = e.target.result;

      // A versionchange transaction is started automatically.
      e.target.transaction.onerror = indexedDb.onerror;
      
      if(db.objectStoreNames.contains("editor")) {
        db.deleteObjectStore("editor");
      }

      var store = db.createObjectStore("editor",{keyPath: "gui"});
      var projectNameIndex = store.createIndex("by_name", "name"),
          htmlIndex = store.createIndex("by_html", "html"),
          cssIndex = store.createIndex("by_css", "css"),
          jsIndex = store.createIndex("by_js", "js");
    };

    request.onsuccess = function(e) {
      indexedDb.db = e.target.result;
    };

    request.onerror = indexedDb.onerror;
  };

  indexedDb.addEditEntry = function(data) {
    var db = indexedDb.db,
        trans = db.transaction("editor", "readwrite"),
        store = trans.objectStore("editor"),
        currentGui = _mock.gui.get() || getUID();

    _mock.gui.set(currentGui);

    // Put Entry
    var entry = store.put({
      "gui" : currentGui,
      "name": data.name || "No Name",
      "html": data.html,
      "css": data.css,
      "js": data.js,
      "createdBy" : data.author || 'Someone',
      "UpdatedBy" : data.author || 'Someone',
      "createdOn" : new Date().getTime(),
      "updatedOn" : new Date().getTime()
    });

    entry.onsuccess = function(e) {
      // Re-render all the editors
      //console.log('New Entry Added');
    };

    entry.onerror = function(e) {
      //console.log(e.value);
    };
  };
  
  indexedDb.deleteEntry = function(id) {
    var db = indexedDb.db;
    var trans = db.transaction("editor", "readwrite");
    var store = trans.objectStore("editor");

    var request = store.delete(id);

    request.onsuccess = function(e) {
      //console.log('Entry Removed');
    };

    request.onerror = function(e) {
      //console.log(e.value);
    };
  };

  indexedDb.getAllEntries = function() {
    //var todos = document.getElementById("todoItems");
    //todos.innerHTML = "";
    var db = indexedDb.db;
    var trans = db.transaction("editor", "readwrite");
    var store = trans.objectStore("editor");

    // Get everything in the store;
    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = store.openCursor(keyRange);

    cursorRequest.onsuccess = function(e) {
      var result = e.target.result;
      if(!!result == false)
        return;

      //renderEditor(result.value);
      //result.continue();
      //console.log(result);
    };

    cursorRequest.onerror = indexedDb.onerror;
  }; 

  indexedDb.setEditorsFromId = function(id) {
    var db = indexedDb.db;
    var transaction = db.transaction(["editor"]);
    var objectStore = transaction.objectStore("editor");
    var request = objectStore.get(id);
    
    request.onsuccess = function(event) {
      // Do something with the request.result!
      _mock.gui.set(request.result.gui)
      _mock.restore(request.result);
    };
    
    request.onerror = function(event) {
      // Handle errors!
      //console.log('No Entry Match in DB');
    };
  }; 

  //var todo = document.getElementById('todo');

  //html5rocks.indexedDb.addTodo(todo.value);
  //todo.value = '';
  window.addEventListener("DOMContentLoaded", init, false);
  
  return {
    save: function(data){
      indexedDb.addEditEntry(data);
    },
    delete:function(id){
      indexedDb.deleteEntry(id);
    },
    restoreEditorsFromId: function(id){
      indexedDb.setEditorsFromId(id);
    },
    getAll:function(){
      indexedDb.getAllEntries();
    }
  }

}());