  window.addEventListener("DOMContentLoaded", _mock.init, false);

  //Expose
  mockbox = {
    load:function(gui){
      _mock.database.restoreEditorsFromId(gui);
    },
    getSettings: function(){
      return _mock.getSettings();
    },
    getAll:function(callback){
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
    isAuthenticated: function(){
      return _mock.isAuthenticated();
    },
    isDirty:_mock.utils.isDirty
  };

}());