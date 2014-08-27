  _mock.init();

  //Expose
  mockbox = {
    load:function(gui){
      _mock.database.restoreEditorsFromId(gui);
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
    isDirty:_mock.utils.isDirty
  };

}());