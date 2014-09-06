  window.addEventListener("DOMContentLoaded", _mock.init, false);

  //Expose
  mockbox = {
    getSettings: function(){
      return _mock.getSettings();
    },
    getAllMocks:function(callback){
      return _mock.database.getAll(callback);
    },
    popout:_mock.popout,
    reset:function(){
      return _mock.reset();
    },
    utils:_mock.utils,
    notify:function(o){
      _mock.notify.send(o);
    },
    getTokens: function(){
      return _mock.tokens();
    },
    isDirty:_mock.utils.isDirty
  };

}());