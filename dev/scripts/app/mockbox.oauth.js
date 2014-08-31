_mock.oauth = (function(){
  'use strict';
  var profile = {};

  function _getToken(type,callback){
    
    chrome.identity.getAuthToken(type, callback);
  }

  function _getProfile(){
    chrome.identity.getProfileUserInfo(function(userInfo){
      //make url request here
      if(userInfo.id){
        
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

  return {
    getToken:function(t,c){
      _getToken(t,c);
    },
    getProfile:function(){
      _getProfile();
    }
  }

}());