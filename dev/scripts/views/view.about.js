_v.about = (function(){
  'use strict';

  var doc,
      buttons = {},
      links = {
        twitter:'https://twitter.com/mockboxio',
        email:'mailto:mockbox@luisreyes.com?subject=Hello MockBox'
      };

  function init(){
    doc = chrome.app.window.get('about').contentWindow.document;
    doc.getElementById('about-version').innerHTML = 'v' + chrome.runtime.getManifest().version;

    buttons = {
      twitter: doc.getElementById('about-footer').querySelector('.twitter'),
      email: doc.getElementById('about-footer').querySelector('.email')
    };

    addListeners();

    checkUpdate();
  }

  function addListeners(){
    buttons.twitter.addEventListener( 'click', function(){
      // Open external page
      openLink('twitter');
    });

    buttons.email.addEventListener( 'click', function(){
      // Open external page
      //openLink('email');
      testGooglePayments();
    });
  }

  function openLink(loc){
    // Open external page
    window.open(links[loc], '_blank');
  }

  function testGooglePayments(){
    google.payments.inapp.getPurchases({
        'success': function(){
          console.log('Purch Success');
        },
        'failure': function(){
          console.log('Purch fail');   
        }
      });

      google.payments.inapp.getSkuDetails({
          'parameters': {'env': 'prod'},
          'success': function(){
            console.log('SKU Success');
            console.log(arguments);
          },
          'failure': function(){
            console.log('SKU fail');
            console.log(arguments);   
          }
        });
  }

  function checkUpdate(){
    chrome.runtime.requestUpdateCheck(function(status){
      var msg;
      switch(status){
        case 'no_update':
          msg = 'You are running on the latest version';
          break;
        case 'update_available':
          msg = 'An update is avalable';
          break;
        case 'throttled':
          msg = 'There are no updates available';
          break;
      }

      doc.getElementById('about-update').innerHTML = msg;
      

    });
  }

  function onLoad(){
    checkUpdate();
  }
  return {
    init: function(){
      if(!doc){
        init();
      }else{
        onLoad();
      }
    }
  };

}());