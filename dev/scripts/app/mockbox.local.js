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
      debugger;
      _saveFile(data);
    }

  };

}());