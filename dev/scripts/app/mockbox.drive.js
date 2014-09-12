_mock.drive = (function(){
"use strict";

  var folderIds, mainCallback, countFoldersCreated, countFoldersToCreate, countFilesCreated=0, countFilesToCreate;

  // Get count for folders to be create and set the value on "countFoldersToCreate"
  function _setCountToCreate(data){
    
    // Initialize the count
    countFoldersToCreate = 0;
    countFilesToCreate = 0;
    
    // Loop through all editors
    for (var type in data.editors) {
    
      // Check the property exists in the editors object do not include the HTML since it goes in 
      // the main folder and the main folder is always created
      if (data.editors.hasOwnProperty(type)) {
    
        // Check the property has a value
        if(data.editors[type].value){
          // Increment count
          countFilesToCreate++;
          
          // Check the property has a value
          if(type !== 'html'){
            // Increment count
            countFoldersToCreate++;
          }
        }

      }
    }
  }

  function _createFolders(data, callback){
    // Set count to var "countFoldersToCreate"
    _setCountToCreate(data);
    
    // Initialize folders ids object
    folderIds = {};
    
    // Initialize folder created count
    countFoldersCreated = 0;

    // Cache main project folder callback
    mainCallback = callback;
    
    // Generate the "main" folder
    _upload({title:'MockBox-' + data.projectName, type:'application/vnd.google-apps.folder',model:data.editors.html}, function(result, folder){ 
      
      // Cache the folder id for later reference
      folderIds[folder.title] = result.id;
      
      // Check if it the only needed folder
      if(countFoldersToCreate === countFoldersCreated){
        
        // Call main callback function
        mainCallback();
        return;

      }else{
        
        // Additional folders needed... go create them
        _createInnerFolders(data);

      }      
    });
  }

  function _createInnerFolders(data){
    
    // Loop through all editors
    for (var type in data.editors) {
    
      // Check the property exists in the editors object
      if ((type !== 'html') && data.editors.hasOwnProperty(type)) {
    
        // Check the value is valid or truthy
        if(data.editors[type].value){
          
          // Create next folder
          _upload({title:data.editors[type].title, type:'application/vnd.google-apps.folder', parent:'main', model:data.editors[type]}, onFolderCreate);

        }
      }
    }
  }

  function onFolderCreate(result, data){

    // Increment created counter
    countFoldersCreated++;

    // Cache the folders id for file creation reference
    folderIds[data.title] = result.id
    
    // Check all folders have been created
    if(countFoldersCreated === countFoldersToCreate){

      // Call main callback
      mainCallback();
      
    }
  }

  function onFileCreate(result){
    
    // Increment created counter
    countFilesCreated++;

    // Check all folders have been created
    if(countFilesCreated === countFilesToCreate){

      _mock.notification.send({type:'success', message:'Export Completed'}); 
      
      
    }
  }

  function _upload(data, callback){
    var model = data.model;
    var file = {
      metadata:{
        "title": data.title,
        "mimeType": data.type || "application/octet-stream",
        "description": "Created on MockBox for Google Chrome <http://mockbox.io>"
      },
      data: data.value
    };
    
    if(data.parent) file.metadata.parents = [{"id":folderIds[data.parent]}];

    var req = new XMLHttpRequest(),
        guid = Math.random().toString().substr(2),
        boundary = '-------'+guid,
        delimiter = "\r\n--" + boundary + "\r\n",
        close_delim = "\r\n--" + boundary + "--";

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
    
    chrome.identity.getAuthToken({'interactive':true},function(token){
      
      req.open('POST', 'https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart', true);
      req.setRequestHeader('Authorization', 'Bearer ' + token);
      req.setRequestHeader('Content-Type', 'multipart/related; boundary='+boundary);

      req.onreadystatechange = function() {

        if (req.readyState == 4) {
          if(req.status == 200){
            var res = JSON.parse(req.responseText);
            callback && callback(res,model);
          }else
          if(req.status == 401){
            req.abort();
            _mock.notification.send({type:'error', message:'Export Cancelled. You have not authorized access.'}); 

          }
        }
      };

      req.send(multipartRequestBody);  
    });
  }
  return {
    upload: function(file, callback){
      var cb = callback || onFileCreate; 
      _upload(file, cb);
    },
    generateFolders: function(data, callback){
      _createFolders(data, callback);
    }
  };

}());