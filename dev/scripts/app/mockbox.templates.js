_mock.templates = (function(){
  "use strict";

  function getBodyHeader(params){
    var htmlHeader = '<!doctype html><html><head><meta charset="utf-8"><title>' + params.title + ' - MockBox Prototype</title><link rel="stylesheet" href="styles/styles.css"></head>';

    return htmlHeader;
  }

  function getBodyFooter(params){
    var htmlFooter = '<script src="scripts/scripts.js"></script>';

    return htmlFooter;
  }

  function getTemplates(){
    return [
    {
      "name": "MockBox Template",
      "html": "<!-- MockBox HTML -->",
      "css" : "/* MockBox CSS */",
      "js"  : "// JavaScript Here",
      "layout": [50,50,50],
      "author": "@luisreyesdev",
      "properties":{
        "html":{
          "html": "",
          "head": ""
        },
        "css":{
          "normalize": true,
          "sources": []
        },
        "js":{
          "framework": "none",
          "apollo": true,
          "sources": []
        }
      }
    }];

  }   

  return {
    getAll:function(){
      return getTemplates();
    },
    getBodyHeader: function(type){ return getBodyHeader(type) },
    getBodyFooter: function(type){ return getBodyFooter(type) }
  };

}());