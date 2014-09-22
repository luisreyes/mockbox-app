  _mock.database.init();
  window.addEventListener("DOMContentLoaded", _mock.init, false);
  //Expose
  mockbox = {
    getSettings: function(){
      return _mock.getSettings();
    },
    getAll:function(table,callback){
      return _mock.database.getAll(table,callback);
    },
    popout:_mock.popout,
    reset:function(){
      return _mock.reset();
    },
    utils:_mock.utils,
    notify:function(o){
      _mock.notification.send(o);
      //_mock.notify.send(o);
    },
    getCurrentProperties:function(){
      return _mock.getCurrentProperties();
    },
    getTokens: function(){
      return _mock.tokens();
    },
    isDirty:_mock.utils.isDirty
  };

}());