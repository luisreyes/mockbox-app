_v.about = (function(){
  'use strict';

  var doc,
      buttons = {},
      links = {
        twitter:'https://twitter.com/mockboxio',
        email:'mailto:support@mockbox.io?subject=Hello MockBox'
      };

  function init(){
    doc = chrome.app.window.get('about').contentWindow.document;
    doc.getElementById('about-version').innerHTML = 'Current version: ' + chrome.runtime.getManifest().version;

    buttons = {
      twitter: doc.getElementById('about-footer').querySelector('.twitter'),
      email: doc.getElementById('about-footer').querySelector('.email')
    };

    addListeners();
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
  return {
    init: function(){
      !doc && init();
    }
  };

}());