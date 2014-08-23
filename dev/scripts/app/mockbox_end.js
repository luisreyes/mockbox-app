  _mock.init();

  //Expose
  MockBox = {
    load:function(gui){
      _mock.database.restoreEditorsFromId(gui);
    }
  };

}());