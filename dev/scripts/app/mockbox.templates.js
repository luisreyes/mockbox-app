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
      "name": "MockBox Color Shift",
      "html": "<main>MockBox</main>",
      "css" : "body{background:#50a1ed;color:#fff;-webkit-animation-name:colorShift;-webkit-animation-duration:5s;-webkit-animation-timing-function:ease-in-out;-webkit-animation-delay:0;-webkit-animation-iteration-count:infinite;-webkit-animation-direction:alternate;-webkit-animation-play-state:running}@-webkit-keyframes colorShift{0%{background:#50a1ed;color:#fff}100%{background:#333;color:#50a1ed}}main{width:100%;position:absolute;top:50%;text-align:center;font-size:60px;line-height:0}",
      "js"  : "// JavaScript Here",
      "layout": [50,50,50],
      "author": "@luisreyesdev",
      "properties":{
        "html":{
          "preprocessor": "haml",
          "html": "",
          "head": ""
        },
        "css":{
          "preprocessor": "none",
          "normalize": true,
          "animate": true,
          "sources": []
        },
        "js":{
          "preprocessor": "none",
          "framework": "none",
          "apollo": true,
          "modernizer": true,
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