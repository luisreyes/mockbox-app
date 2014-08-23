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