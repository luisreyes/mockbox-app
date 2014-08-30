_mock.oauth = (function(){
  'use strict';

  function _getToken(type,callback){
    
    chrome.identity.getAuthToken(type, callback);
  }

  function _getProfile(){
    chrome.identity.getProfileUserInfo(function(userInfo){
      //make url request here
      
      if(userInfo.id){
        var url = 'https://www.googleapis.com/plus/v1/people/'+userInfo.id+'?fields=displayName%2C+image/url&key=AIzaSyCgvqfmrNPXDPB-p1JGUINbqhhKG_awYOY';
        var response = {};
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function (e) {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              response = JSON.parse(xhr.responseText);
              chrome.runtime.sendMessage({message:'onProfileData', profile:response});
            } else {
              console.error(xhr.statusText);
            }
          }
        };
        xhr.onerror = function (e) {
          console.error(xhr.statusText);
        };
        xhr.send(null);
      }
    });
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