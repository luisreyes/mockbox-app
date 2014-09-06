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
       var editors = _mock.getEditorData();
       debugger;
        if(data.type === 'drive'){
          _mock.drive.generateFolders(editors, function(){
            // Export only if the editor has data.
            editors.html && _mock.drive.upload({title:'index.html',type:'text/html',value: editors.html});
            editors.css && _mock.drive.upload({title:'styles.css',type:'text/css',value:editors.css, parent:'styles'});
            editors.js && _mock.drive.upload({title:'scripts.js',type:'application/javascript',value:editors.js, parent:'scripts'});
          });
        }
       break;

      default: return;
    }
  });

}());