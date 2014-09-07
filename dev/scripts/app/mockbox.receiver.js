_mock.receiver = (function(){
  'use strict';

  chrome.runtime.onMessage.addListener(function(data) {
    switch(data.message){
      
      case 'onClosePopout': 
        // Close the popout with the passed id
        _mock.popout.close(data.popoutId);
        break;

      case 'onLoadItem': 
        // Restore working project from db by id
        _mock.database.restoreEditorsFromId(data.gui);
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
        var exportData = {
          projectName: document.getElementById('app-header').querySelector('.project-name').innerHTML,
          editors: _mock.getEditorData()
        };
       
        if(data.type === 'drive'){
          
          if(data.packaged){
            // Get zip file from utils
            var zip = _mock.utils.getExportPackage(exportData.editors);
            // Upload zip file to drive
            _mock.drive.upload({title:'MockBox-'+exportData.projectName+'.zip',type:zip.type,value: zip}, function(){
              console.log('DONE');  
            });
          
          }else{
            // Create Individual folders in drive
            _mock.drive.generateFolders(exportData, function(){
              // Export only if the editor has data.
              exportData.editors.html && _mock.drive.upload({title:'index.html',type:'text/html', value: btoa(exportData.editors.html), parent:'main'});
              exportData.editors.css && _mock.drive.upload({title:'styles.css',type:'text/css', value: btoa(exportData.editors.css), parent:'styles'});
              exportData.editors.js && _mock.drive.upload({title:'scripts.js',type:'application/javascript', value: btoa(exportData.editors.js), parent:'scripts'});
            });
          
          }
        }

        
       break;

      default: return;
    }
  });

}());