_mock.local = (function(){
"use strict";
  
  function _getZip(data){
    var zip = new JSZip();
      zip.file("index.html", data.editors.html.value);
      data.editors.js.value && zip.file("scripts/scripts.js", data.editors.js.value);
      data.editors.css.value && zip.file("styles/styles.css", data.editors.css.value);
      return zip.generate({type:"blob"});
  }

  function _saveFile(options){
    var data = {
      filename: options.filename,
      filedata: options.filedata
    };

    chrome.fileSystem.chooseEntry({ type:'saveFile', suggestedName: data.filename }, function(entry, fileEntry){
      // check isWritableEntry
      entry.createWriter(function(fileWriter) {

        fileWriter.onwriteend = function(e) {
          console.log('Write completed.');
        };

        fileWriter.onerror = function(e) {
          console.log('Write failed: ' + e.toString());
        };

        fileWriter.write(data.filedata);

      });
    });
  }
  
  var _files, _rootName;
  var _root = {};
  function _saveMultipleFiles(data){
    _files = data.files;
    _rootName = data.folderName;
    chrome.fileSystem.chooseEntry({ type:'openDirectory'}, function(entry){
      _root = entry;
      // check isWritableEntry
      var req_fs = window.requestFileSystem || window.webkitRequestFileSystem || window.mozRequestFileSystem;
      req_fs(window.TEMPORARY, 1024*1024, function(fs){
        
        _root.getDirectory(_rootName,{create:true}, function(entry){
          debugger;
          if(_files.html.filedata.size) {
            entry.getFile(_files.html.filename, {create:true}, onGetFile, onGetError);  
          }

          if(_files.css.filedata.size) {
            entry.getDirectory('styles',{create:true}, function(entry){
              entry.getFile(_files.css.filename, {create:true}, onGetFile, onGetError);  
            }, onGetError);
          }
          
          if(_files.js.filedata.size) {
            entry.getDirectory('scripts',{create:true}, function(entry){
              entry.getFile(_files.js.filename, {create:true}, onGetFile, onGetError);
            }, onGetError);
          }
                         
        }, onGetError);
        

      });
    });
  }

  function onGetFile(fileEntry){
    fileEntry.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
        console.log('Write completed.');
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };

      var type = fileEntry.name.substr(fileEntry.name.lastIndexOf('.') + 1);
      fileWriter.write(_files[type].filedata);

    },function(){ 
      return fileEntry;
    });
  }

  function onGetError(e){
    console.log(e); 
  }

  function _saveZip(data){
    _saveFile({
      filename:'MockBox-' + data.projectName + '.zip',
      filedata: _getZip(data)
    });
  }
 
  return {
    saveZip:function(data){
      _saveZip(data);
    },
    saveFile:function(data){
      _saveFile(data);
    },
    saveFiles: function(files){
      _saveMultipleFiles(files);
    }

  };

}());