_mock.drive = (function(){
"use strict";

  var folderIds;
  var mainCallback;
  var foldersToMake;

  function _createFolders(data, callback){
    // Cache Ids to put files in later
    folderIds = {};
    foldersToMake = 0;
    // Cache main project folder callback
    callback && (mainCallback = callback);
    
    // Generate the Main folder for the export package
    _upload({title:'MockBox - ' + data.projectName, type:'application/vnd.google-apps.folder'}, function(result){ 
      
      console.log('MAIN Folder Created');
      // Cache the Main folders Id
      folderIds.main = result.id;

      // cache to amount of folders required
      for (var type in data.editors) {
        if (data.editors.hasOwnProperty(type)) {
          data.editors[type] && (foldersToMake++);
        }
      }

      // Generate the Styles folder
      data.editors.css && _upload({title:'styles', type:'application/vnd.google-apps.folder', parent:'main'}, function(result){ 
        console.log('STYLES Folder Created');
        // Cache the Styles folders Id
        folderIds.styles = result.id;
        mainCallback && ifDoneCallback();
      });
      
      // Generate the Scripts folder
      data.editors.js && _upload({title:'scripts', type:'application/vnd.google-apps.folder', parent:'main'}, function(result){ 
        console.log('SCRIPTS Folder Created');
        // Cache the Scripts folders Id
        folderIds.scripts = result.id;
        mainCallback && ifDoneCallback();
      });

    });

  }

  function ifDoneCallback(){
    // Check the length of created folders
    if(Object.keys(folderIds).length === foldersToMake){
      mainCallback();
    }
  }

  function _upload(data, callback){

    var file = {
      metadata:{
        "title": data.title,
        "mimeType": data.type || "application/octet-stream",
        "description": "Created on MockBox for Google Chrome <http://mockbox.io>"
      },
      data: data.value
    }

    if(data.parent) file.metadata.parents = [{"id":folderIds[data.parent]}];

    var req = new XMLHttpRequest();
    var guid = Math.random().toString().substr(2);
    var boundary = '-------'+guid;
    var delimiter = "\r\n--" + boundary + "\r\n";
    var close_delim = "\r\n--" + boundary + "--";

    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(file.metadata);

    if(file.data){    
      multipartRequestBody +=
        delimiter +
        'Content-Type: ' + file.metadata.mimeType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        file.data;
    }
    
    multipartRequestBody += close_delim;
    
    chrome.identity.getAuthToken({'interactive':false},function(token){
      
      req.open('POST', 'https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart');
      req.setRequestHeader('Authorization', 'Bearer ' + token);
      req.setRequestHeader('Content-Type', 'multipart/related; boundary='+boundary);

      req.onreadystatechange = function() {
        if (req.readyState == 4) {
          var res = JSON.parse(req.responseText);
          callback && callback(res);
        }
      }

      req.send(multipartRequestBody);  
    });
  }
  return {
    upload: function(file, callback){
      _upload(file, callback);
    },
    generateFolders: function(data, callback){
      _createFolders(data, callback);
    }
  };

}());