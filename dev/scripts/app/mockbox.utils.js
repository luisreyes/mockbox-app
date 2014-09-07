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
  }
  
  NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
      for(var i = 0, len = this.length; i < len; i++) {
          if(this[i] && this[i].parentElement) {
              this[i].parentElement.removeChild(this[i]);
          }
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

  function _getExportZip(data){
    var zip = new JSZip();

    if(data.html){
      zip.file('index.html', data.html);
      zip.file('index.html').asBinary();
    }

    if(data.css){
      zip.file('styles/styles.css', data.css);
      zip.file('styles/styles.css').asBinary();
    }
    if(data.js){
      zip.file('scripts/scripts.js', data.js);
      zip.file('scripts/scripts.js').asBinary();
    }

    return zip.generate();
  }

  

  return {
    toDate: function(epoch){
      return toDate(epoch);
    }, 
    getExportPackage: function(data){
      return _getExportZip(data);
    },
    isDirty:function(){
      if(arguments.length){
        _isDirty = arguments[0];
        _isDirtyDispatcher();
      }else{
        return _isDirty;
      }
    },
    Collect: function(baseObj, updateObj){
      return _collect(baseObj, updateObj);
    }
    
  }

}());