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
              views.export.init(mockbox.getSettings());
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
        debugger;
        _mock.popout.close('export');

        var exportData = {
          projectName: document.getElementById('app-header').querySelector('.project-name').innerHTML,
          editors: _mock.getEditorsModel(),
          projectFolderName: 'MockBox_' + document.getElementById('app-header').querySelector('.project-name').innerHTML.replace(/\s/g, '_')
        },
        type,
        blob,
        version,
        files = {},
        gui = data.model.versioned ? '_'+_mock.utils.getGUID() : '';

        exportData.editors.html.value = html_beautify(_mock.templates.getBodyHeader({title: exportData.projectName})) + exportData.editors.html.value + _mock.templates.getBodyFooter('foot');
        
        if(data.model.type === 'drive'){
          
          _mock.notification.send({type:'info', message:'Exporting to Google Drive', persist:true});
          
          if(data.model.packaged){
            
            // Get zip file from utils
            var zip = _mock.utils.getExportPackage(exportData.editors);
            // Upload zip file to drive
            _mock.drive.upload({title: exportData.projectFolderName+gui+'.zip',type:zip.type,value: zip}, function(){
              _mock.notification.send({type:'success', message:'Export Completed'}); 
            });
          
          }else{

            // Create Individual folders in drive
            _mock.drive.generateFolders(exportData, function(){
              // Export only if the editor has data.
              if(exportData.editors.html.value) _mock.drive.upload({title:'index.html',type:'text/html', value: btoa(exportData.editors.html.value), parent:'main'});
              
              if(exportData.editors.css.value) _mock.drive.upload({title:'styles.css',type:'text/css', value: btoa(exportData.editors.css.value), parent:'styles'});

              if(exportData.editors.js.value) _mock.drive.upload({title:'scripts.js',type:'application/javascript', value: btoa(exportData.editors.js.value), parent:'scripts'});
            });

            
          
          }
        }else
        if(data.model.type === 'local'){

          if(data.model.packaged){
            
            if(data.model.versioned){ 
              version = '_' + new Date().toLocaleDateString().replace(/[\/20]+/g, '') +'_'+new Date().toLocaleTimeString().replace(/[\:]+/g, '').split(' ')[0];
              exportData.projectFolderName = exportData.projectFolderName+version; 
            }
            
            // Save as ZIP
            _mock.local.saveZip(exportData);
          }else{
            // Collect all files to be saved
            // Var to cache the files data
            files = {};
            type = null;
            // Generate all blob files from the editors
            for(type in exportData.editors){
              if(exportData.editors.hasOwnProperty(type)){
                // Create Blob
                blob = new Blob([exportData.editors[type].value], {type:'text/'+type});
                // New file blob
                files[type] = {
                  filename:exportData.editors[type].title === 'main' ? 'index'+ '.' + type : exportData.editors[type].title + '.' + type,
                  filedata:blob
                };
              }
            }
            // Save all files to local
            _mock.local.saveFiles({ files: files, folderName: exportData.projectFolderName+gui });
          }
        }else

        if(data.model.type === 'ftp'){
          // Display Notification
          _mock.notification.send({type:'info', message:'Exporting to: '+data.model.host, persist:true});
          
          // Initialize Collection and Counter
          files = [];
          
          // Substitude Spaces for Underscores in Project Name
          data.model.projectname = exportData.projectName.replace(/\s/g,'_');
          
          // If Zip Export
          if(data.model.packaged){
            
            if(data.model.versioned){ 
              version = '_' + new Date().toLocaleDateString().replace(/[\/20]+/g, '') +'_'+new Date().toLocaleTimeString().replace(/[\:]+/g, '').split(' ')[0];
              exportData.projectFolderName = exportData.projectFolderName+version; 
            }

            // Get Zip File from Utils Method
            files[0] = {
              name: exportData.projectFolderName+'.zip',
              data: _mock.utils.getExportPackage(exportData.editors, 'arraybuffer')
            };            

            // Send to FTP
            _mock.ftp.send(data.model, files);
          
          // If Files Export
          }else{
            // Initialize File Counter for "Done" watch
            var filesToCreate = 0;
            type = null;
            // Loop through Editors Collection 
            for(type in exportData.editors){

              // Verify it has data to export
              if(exportData.editors.hasOwnProperty(type) && exportData.editors[type].value){
                // Increment Counter
                filesToCreate++;
                
                // Create Blob from Editor Data
                blob = new Blob([exportData.editors[type].value], {type:'text/'+type});
                
                // Convert Blob to ArrayBuffer for FTP transfer
                _mock.utils.blobToArrayBuffer(blob, type, function(result, type){
                  
                  // Collect in files array
                  files.push({
                    folder:_mock.utils.getFolderForType(type),
                    name:exportData.editors[type].title === 'main' ? 'index'+ '.' + type : exportData.editors[type].title + '.' + type,
                    data:result
                  });

                  // Check if all files have been converted
                  if(files.length === filesToCreate){
                    // Send all files to FTP
                    _mock.ftp.send(data.model, files);
                  }

                });
                
              }
            }
          }
        }

        break;

      default: return;
    }
  });

}());