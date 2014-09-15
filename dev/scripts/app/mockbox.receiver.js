_mock.receiver = (function(){
  'use strict';

  document.addEventListener('keypress', function(event) {
      if ( (event.which == 115 && event.ctrlKey) || (event.which == 19) ){
        if(_mock.utils.isDirty()){
          _mock.save();
        }  
      }

      if ( (event.which == 108 && event.ctrlKey) || (event.which == 12) ){
        chrome.runtime.sendMessage({message:'onOpenPopout', popout:'load'});
      }

      if ( (event.which == 110 && event.ctrlKey) || (event.which == 14) ){
        _mock.reset();
      }
      
  });

  chrome.runtime.onMessage.addListener(function(data) {
    switch(data.message){
      
      case 'onClosePopout': 
        // Close the popout with the passed id
        _mock.popout.close(data.popoutId);
        break;

      case 'onLoadItem': 
        // Restore working project from db by id
        _mock.database.restoreEditorsFromId(data.gui, data.isTemplate);
        break;

      case 'onOpenPopout':
        switch(data.popout){
          case 'load':
            // Open the window and run the function
            _mock.popout.open('load', function(){
              // init the views js file
              views.load.init();
              // Generate the list to display
              views.load.generateList();
            });
            break;  
          case 'export':
            // Open the window and run the function
            _mock.popout.open('export', function(){
             // init the views js file
              views.export.init();
            });
            break;  
        }
        
      break;

      case 'onDeleteItem': 
        // Delete the item by the passed id
        _mock.database.delete(data.gui);
        break;

      case 'onConfirm': 
        if(data.isAccept){
          // Call methods to continue i.e "Yes I would ike to loose changes and close the application"
          _mock.popout.confirmAcceptCallback();
        }else{
          // Call methods to cancel i.e "Yes I would ike to loose changes and close the application"
          _mock.popout.confirmDeclineCallback();
        }
        // Close the popout
        _mock.popout.close(data.popoutId);
        break;

      case 'onDirty':
        if(data.isDirty){
          _mock.clicks.buttons.removeClass('save','inactive');
        }else{
          _mock.clicks.buttons.addClass('save','inactive');
        }
        break;
      
      case 'onExport':

        _mock.popout.close('export');

        var exportData = {
          projectName: document.getElementById('app-header').querySelector('.project-name').innerHTML,
          editors: _mock.getEditorsModel(),
          projectFolderName: 'MockBox_' + document.getElementById('app-header').querySelector('.project-name').innerHTML.replace(/\s/g, '_')
        };
        
        if(data.model.type === 'drive'){
          
          _mock.notification.send({type:'info', message:'Exporting to Google Drive', persist:true});
          
          if(data.model.packaged){
            
            // Get zip file from utils
            var zip = _mock.utils.getExportPackage(exportData.editors);
            // Upload zip file to drive
            _mock.drive.upload({title: exportData.projectFolderName+'.zip',type:zip.type,value: zip}, function(){
              _mock.notification.send({type:'success', message:'Export Completed'}); 
            });
          
          }else{

            // Create Individual folders in drive
            _mock.drive.generateFolders(exportData, function(){
              // Export only if the editor has data.
              exportData.editors.html.value && _mock.drive.upload({title:'index.html',type:'text/html', value: btoa(exportData.editors.html.value), parent:'main'});
              
              exportData.editors.css.value && _mock.drive.upload({title:'styles.css',type:'text/css', value: btoa(exportData.editors.css.value), parent:'styles'});

              exportData.editors.js.value && _mock.drive.upload({title:'scripts.js',type:'application/javascript', value: btoa(exportData.editors.js.value), parent:'scripts'});
            });

            
          
          }
        }else
        if(data.model.type === 'local'){

          if(data.model.packaged){
            // Save as ZIP
            _mock.local.saveZip(exportData);
          }else{
            // Collect all files to be saved
            // Var to cache the files data
            var files = {};
            
            // Generate all blob files from the editors
            for(var type in exportData.editors){
              if(exportData.editors.hasOwnProperty(type)){
                // Create Blob
                var blob = new Blob([exportData.editors[type].value], {type:'text/'+type});
                // New file blob
                files[type] = {
                  filename:exportData.editors[type].title === 'main' ? 'index'+ '.' + type : exportData.editors[type].title + '.' + type,
                  filedata:blob
                };
              }
            }
            // Save all files to local
            _mock.local.saveFiles({ files: files, folderName: exportData.projectFolderName });
          }
        }else

        if(data.model.type === 'ftp'){
          _mock.notification.send({type:'info', message:'Exporting to: '+data.model.host, persist:true});
          var files = [];
          data.model.projectname = exportData.projectName.replace(/\s/g,'_');

          if(data.model.packaged){
            
            // Get zip file from utils
            files[0] = {
              name: exportData.projectFolderName+'.zip',
              data: _mock.utils.getExportPackage(exportData.editors, 'arraybuffer')
            }               
            
          }else{
            // Generate all blob files from the editors
            for(var type in exportData.editors){
              if(exportData.editors.hasOwnProperty(type) && exportData.editors[type].value){
                // Create Blob
                var blob = new Blob([exportData.editors[type].value], {type:'text/'+type});
                _mock.utils.blobToArrayBuffer(blob, type, function(result, type){
                  files.push({
                    folder:_mock.utils.getFolderForType(type),
                    name:exportData.editors[type].title === 'main' ? 'index'+ '.' + type : exportData.editors[type].title + '.' + type,
                    data:result
                  });
                });
                
              }
            }
          }

          _mock.ftp.send(data.model, files);
        }

        
       break;

      default: return;
    }
  });

}());