chrome.app.runtime.onLaunched.addListener(function() {
  
  chrome.app.window.create('mockbox.html', {
    'id': 'main',
    'frame':'none',
    'minWidth':320,
    'minHeight':568,
    'bounds': {
      'width': 1024,
      'height': 768
    }
  });

});

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        //console.log("This is a first install!");
    }else if(details.reason == "update"){
        //var thisVersion = chrome.runtime.getManifest().version;
        //console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});