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

  chrome.app.window.create('popout_export.html', {
    'id': 'export',
    'frame':'none',
    'hidden':true,
    'minWidth':320,
    'minHeight':568,
    'bounds': {
      'width': 800,
      'height': 600
    }
  });

  chrome.app.window.create('popout_mocks.html', {
    'id': 'mocks',
    'frame':'none',
    'hidden':true,
    'resizable':false,
    'bounds': {
      'width': 600,
      'height': 460
    }
  });

  chrome.app.window.create('popout_settings.html', {
    'id': 'settings',
    'frame':'none',
    'hidden':true,
    'minWidth':320,
    'minHeight':568,
    'bounds': {
      'width': 800,
      'height': 600
    }
  });

  chrome.app.window.create('popout_confirm.html', {
    'id': 'confirm',
    'frame':'none',
    'hidden':true,
    'resizable':false,
    'bounds': {
      'width': 400,
      'height': 200
    }
  });

});