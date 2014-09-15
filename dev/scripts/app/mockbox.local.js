_mock.local = (function(){
"use strict";

  var filesToBeWritten, filesWritten;
  
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
      
      if(entry){
        _mock.notification.send({type:'info', message:'Exporting to '+ entry.name, persist:true});
        // check isWritableEntry
        entry.createWriter(function(fileWriter) {

          fileWriter.onwriteend = function(e) {
            _mock.notification.send({type:'success', message:'Export Completed'}); 
          };

          fileWriter.onerror = function(e) {
            _mock.notification.send({type:'Error', message:'Error Creating Zip: ' + e.toString()});
          };

          fileWriter.write(data.filedata);

        });
      }else{
        _mock.notification.send({type:'error', message:'Export Cancelled'});
      }
    });
  }
  
  var _files, _rootName;
  var _root = {};
  function _saveMultipleFiles(data){
    _files = data.files;
    _rootName = data.folderName;
    chrome.fileSystem.chooseEntry({ type:'openDirectory'}, function(entry){
      _root = entry;

      if(_root){
        _mock.notification.send({type:'info', message:'Exporting to '+ _root.name, persist:true});
        var req_fs = window.webkitRequestFileSystem;
        req_fs(window.TEMPORARY, 1024*1024, function(fs){
          
          filesWritten = 0;
          filesToBeWritten = 0;

          _root.getDirectory(_rootName,{create:true}, function(entry){
            
            if(_files.html.filedata.size) {
              filesToBeWritten++;
              entry.getFile(_files.html.filename, {create:true}, onGetFile, onGetError);  
            }

            if(_files.css.filedata.size) {
              filesToBeWritten++;
              entry.getDirectory('styles',{create:true}, function(entry){
                entry.getFile(_files.css.filename, {create:true}, onGetFile, onGetError);  
              }, onGetError);
            }
            
            if(_files.js.filedata.size) {
              filesToBeWritten++;
              entry.getDirectory('scripts',{create:true}, function(entry){
                entry.getFile(_files.js.filename, {create:true}, onGetFile, onGetError);
              }, onGetError);
            }
                           
          }, onGetError);
          

        });
      }else{
        _mock.notification.send({type:'error', message:'Export Cancelled'});
      }
    });
  }

  function onGetFile(fileEntry){
    fileEntry.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
        filesWritten++;
        if(filesWritten >= filesToBeWritten){
          _mock.notification.send({type:'success', message:'Export Completed'});
        }
      };

      fileWriter.onerror = function(e) {
        _mock.notification.send({type:'Error', message:'Error Creating File: ' + e.toString()});
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
      filename:'MockBox_' + data.projectName.replace(/\s/g,'_') + '.zip',
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