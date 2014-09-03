_mock.oauth = (function(){
  'use strict';
  var profile = {};
  var userId;

  function _getToken(type,callback){
    chrome.identity.getAuthToken(type,callback);
  }

  function _getProfile(){
    chrome.identity.getProfileUserInfo(function(userInfo){
      //make url request here
      if(userInfo.id){
        userId = userInfo.id;
        
        var url = 'https://www.googleapis.com/plus/v1/people/'+userInfo.id+'?fields=displayName%2C+name/givenName%2C+image/url&key=AIzaSyCgvqfmrNPXDPB-p1JGUINbqhhKG_awYOY',
            response = {},
            xhr = new XMLHttpRequest();
        
        xhr.open("GET", url, true);
        
        xhr.onload = function (e) {
        
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
           
              response = JSON.parse(xhr.responseText);
              profile = response;
              loadImgBlob(response.image.url);
           
            } else {
              console.error(xhr.statusText);
            }
          }
        };

        xhr.onerror = function (e) {
          console.error(xhr.statusText);
        };
        
        xhr.send();

      }
    });

    function loadImgBlob(url){
     
      var response = {},
          xhr = new XMLHttpRequest();
        
        xhr.open("GET", url, true);
        
        xhr.responseType = 'blob';
        
        xhr.onload = function (e) {
        
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {

              profile.image.url = window.URL.createObjectURL( xhr.response );
              chrome.runtime.sendMessage({message:'onProfileData', profile:profile});
           
            } else {
              console.error(xhr.statusText);
            }
          }
        };

        xhr.onerror = function (e) {
          console.error(xhr.statusText);
        };
        
        xhr.send();

    }
  }
  
  function _getLicense() {
    debugger;    
    //var CWS_LICENSE_API_URL = 'https://www.googleapis.com/chromewebstore/v1.1/userlicenses/';
    var CWS_LICENSE_API_URL = 'https://www.googleapis.com/appsmarket/v2/licenseNotification/';
    var req = new XMLHttpRequest();

    chrome.identity.getAuthToken({'interactive':true},function(token){
      debugger;
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
    getProfile:function(){
      _getProfile();
    },
    getLicense: function(){
      _getLicense();
    }
  };

}());