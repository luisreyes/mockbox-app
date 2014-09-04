_mock.oauth = (function(){
  'use strict';
  var profile = {};
  var userId;

  function _getToken(type,callback){
    chrome.identity.getAuthToken(type, callback);
  }
  
  function _getLicense() {
    var CWS_LICENSE_API_URL = 'https://www.googleapis.com/chromewebstore/v1.1/userlicenses/';
    var req = new XMLHttpRequest();

    chrome.identity.getAuthToken({'interactive':true},function(token){
      req.open('GET', CWS_LICENSE_API_URL + chrome.runtime.id);
      req.setRequestHeader('Authorization', 'Bearer ' + token);
      
      req.onreadystatechange = function() {
        if (req.readyState == 4) {
          var license = JSON.parse(req.responseText);
          console.log(license);
        }
      }
      
      req.send();  
    });

    
    
  }

  return {
    getToken:function(t,c){
      _getToken(t,c);
    },
    getLicense: function(){
      _getLicense();
    }
  };

}());