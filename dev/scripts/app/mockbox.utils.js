_mock.utils = (function(){
  'use strict';
  var _isDirty = false;

  function toDate(eObj){
    var mEpoch = parseInt(eObj), dDate = new Date();

    if(mEpoch<10000000000) mEpoch *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)

    dDate.setTime(mEpoch);
    
    return dDate.toLocaleDateString();
  }

  Element.prototype.remove = function() {
      this.parentElement.removeChild(this);
  };
  
  NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
      for(var i = 0, len = this.length; i < len; i++) {
          if(this[i] && this[i].parentElement) {
              this[i].parentElement.removeChild(this[i]);
          }
      }
  };

  function _getFolderNameFromType(type){
    switch(type){
      case 'css': return 'styles';
      break;
      case 'js': return 'scripts';
      break;
      default: return '';
      break;
    }
  }

  function _isDirtyDispatcher(){
      chrome.runtime.sendMessage({message:'onDirty', isDirty:_isDirty });
  }

  function _collect(baseObj, updateObj) {
    // Updates the base object with the new object
    var obj = baseObj; {
        for (var prop in updateObj) {
            var val = updateObj[prop];
            if (typeof val == "object") // this also applies to arrays or null!
                update(obj[prop], val);
            else
                obj[prop] = val;
        }
    }
    return obj;
  }

  function _getGUID() {
      return ("000000" + (Math.random()*Math.pow(36,6) << 0).toString(36)).slice(-6);
  }

  function _getExportZip(data, type){
    var zip = new JSZip();

    if(data.html.value){
      zip.file('index.html', data.html.value);
      zip.file('index.html').asBinary();
    }

    if(data.css.value){
      zip.file(data.css.title + '/styles.css', data.css.value);
      zip.file(data.css.title + '/styles.css').asBinary();
    }
    
    if(data.js.value){
      zip.file(data.js.title + '/scripts.js', data.js.value);
      zip.file(data.js.title + '/scripts.js').asBinary();
    }

    return zip.generate({type: type || 'base64' });
  }

  function _blobToArrayBuffer(bb, id, callback) {
    var f = new FileReader();
    f.onload = function(e) {
        callback(e.target.result, id);
    };
    f.readAsArrayBuffer(bb);
  };

  // `condition` is a function that returns a boolean
  // `fn` is a function that returns a promise
  // returns a promise for the completion of the loop
  function _promiseWhile(condition, fn) {
    var deferred = Q.defer();

    function loop() {
        // When the result of calling `condition` is no longer true, we are
        // done.
        if (!condition()) return deferred.resolve();
        // Use `when`, in case `fn` does not return a promise.
        // When it completes loop again otherwise, if it fails, reject the
        // done promise
        Q.when(fn(), loop, deferred.reject);
    }

    // Start running the loop in the next tick so that this function is
    // completely async. It would be unexpected if `fn` was called
    // synchronously the first time.
    Q.nextTick(loop);

    // The promise
    return deferred.promise;
  }
  

  return {
    getGUID: function(){
      return _getGUID();
    },
    toDate: function(epoch){
      return toDate(epoch);
    }, 
    getExportPackage: function(data, type){
      return _getExportZip(data, type);
    },
    blobToArrayBuffer: function(blob, id, callback){
      return _blobToArrayBuffer(blob, id, callback);
    },
    promiseLoop: function(condition, fn){
      return _promiseWhile(condition, fn);
    },
    isDirty:function(){
      if(arguments.length){
        _isDirty = arguments[0];
        _isDirtyDispatcher();
      }else{
        return _isDirty;
      }
    },
    getFolderForType: function(type){
      return _getFolderNameFromType(type);
    },
    Collect: function(baseObj, updateObj){
      return _collect(baseObj, updateObj);
    }
    
  };

}());