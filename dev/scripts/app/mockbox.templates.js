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
      "name": "Hello Template",
      "html": "<div class='wheel'><ul class='umbrella'><li class='color'></li><li class='color'></li><li class='color'></li><li class='color'></li><li class='color'></li><li class='color'></li><li class='color'></li><li class='color'></li><li class='color'></li><li class='color'></li><li class='color'></li><li class='color'></li></ul></div>",
      "css" : "@import url(http://fonts.googleapis.com/css?family='Philosopher');html,body{height: 100%;padding: 0;margin: 0;}body{font-family: 'Philosopher';background: #444444;}#header{background: no-repeat center;background-size: cover;position: fixed;bottom: 0;right: 0;left: 0;top: 0;}#header .center{background: rgba(0, 0, 0, 0.25);text-align: center;position: absolute;color: #FFFFFF;color: #F5F7FA;bottom: 0;right: 0;left: 0;top: 0;}#header .center .middle{position: absolute;margin-top: -6em;right: 0;left: 0;top: 50%;}#header .center .middle h1{font-weight: normal;line-height: 1em;font-size: 11em;margin: 0;}#header .center .middle span{line-height: 1em;font-size: 1em;}#pageHr,#pageHrBorder{position: absolute;border-bottom: 25px solid #69ACE0;margin-top: -40px;height: 20px;display: block;right: 0px;left: 0px;top: 100%;}#pageHr .a:before,#pageHr .a:after,#pageHrBorder .a:before,#pageHrBorder .a:after{border-color: #69ACE0 transparent;border-style: solid;position: absolute;display: block;content: '';}#pageHr .a:before,#pageHrBorder .a:before{border-width: 0 20px 20px 0;margin-left: 10px;right: 50%;}#pageHr .a:after,#pageHrBorder .a:after{border-width: 0 0 20px 20px;margin-right: 10px;left: 50%;}#pageHr .s:before,#pageHr .s:after,#pageHrBorder .s:before,#pageHrBorder .s:after{background: #69ACE0;position: absolute;display: block;content: '';right: 0;left: 0;}#pageHr .s:before,#pageHrBorder .s:before{margin-right: 20px;height: 20px;right: 50%;}#pageHr .s:after,#pageHrBorder .s:after{margin-left: 20px;height: 20px;left: 50%;}#pageHrBorder{border-bottom-color: #F5F7FA;margin-top: -45px;}#pageHrBorder .a:before,#pageHrBorder .a:after{border-color: #F5F7FA transparent;}#pageHrBorder .a:before{margin-right: -2.5px;}#pageHrBorder .a:after{margin-left: -2.5px;}#pageHrBorder .s:before,#pageHrBorder .s:after{background: #F5F7FA;}#pageHrBorder .s:before{margin-right: 17.36842px;}#pageHrBorder .s:after{margin-left: 17.36842px;}#page{background: #69ACE0;position: relative;height: 123.45%;top: 100%;}",
      "js"  : "// No JavaScript",
      "layout": [50,50,50],
      "author": "@luisreyesdev"
    },
    {
      "name": "MockBox Template",
      "html": "<!-- MockBox HTML -->",
      "css" : "/* MockBox CSS */",
      "js"  : "// JavaScript Here",
      "layout": [50,50,50],
      "author": "@luisreyesdev"
    },
    {
      "name": "Static Background",
      "html": '<section id="header"><section class="center"><section class="middle"><h1>MockBox</h1><span>Fixed header with a triangle indicator</span></section></section></section><section id="pageHrBorder"><i class="s"></i><i class="a"></i></section><section id="pageHr"><i class="s"></i><i class="a"></i></section><section id="page"></section>',
      "css" : '@import url(http://fonts.googleapis.com/css?family="Philosopher");html,body{height: 100%;padding: 0;margin: 0;}body{font-family: "Philosopher";background: #444444;}#header{background: no-repeat center;background-size: cover;position: fixed;bottom: 0;right: 0;left: 0;top: 0;}#header .center{background: rgba(0, 0, 0, 0.25);text-align: center;position: absolute;color: #FFFFFF;color: #F5F7FA;bottom: 0;right: 0;left: 0;top: 0;}#header .center .middle{position: absolute;margin-top: -6em;right: 0;left: 0;top: 50%;}#header .center .middle h1{font-weight: normal;line-height: 1em;font-size: 11em;margin: 0;}#header .center .middle span{line-height: 1em;font-size: 1em;}#pageHr,#pageHrBorder{position: absolute;border-bottom: 25px solid #69ACE0;margin-top: -40px;height: 20px;display: block;right: 0px;left: 0px;top: 100%;}#pageHr .a:before,#pageHr .a:after,#pageHrBorder .a:before,#pageHrBorder .a:after{border-color: #69ACE0 transparent;border-style: solid;position: absolute;display: block;content: "";}#pageHr .a:before,#pageHrBorder .a:before{border-width: 0 20px 20px 0;margin-left: 10px;right: 50%;}#pageHr .a:after,#pageHrBorder .a:after{border-width: 0 0 20px 20px;margin-right: 10px;left: 50%;}#pageHr .s:before,#pageHr .s:after,#pageHrBorder .s:before,#pageHrBorder .s:after{background: #69ACE0;position: absolute;display: block;content: "";right: 0;left: 0;}#pageHr .s:before,#pageHrBorder .s:before{margin-right: 20px;height: 20px;right: 50%;}#pageHr .s:after,#pageHrBorder .s:after{margin-left: 20px;height: 20px;left: 50%;}#pageHrBorder{border-bottom-color: #F5F7FA;margin-top: -45px;}#pageHrBorder .a:before,#pageHrBorder .a:after{border-color: #F5F7FA transparent;}#pageHrBorder .a:before{margin-right: -2.5px;}#pageHrBorder .a:after{margin-left: -2.5px;}#pageHrBorder .s:before,#pageHrBorder .s:after{background: #F5F7FA;}#pageHrBorder .s:before{margin-right: 17.36842px;}#pageHrBorder .s:after{margin-left: 17.36842px;}#page{background: #69ACE0;position: relative;height: 123.45%;top: 100%;}',
      "js"  : "",
      "layout": [90,50,50],
      "author": "@luisreyesdev"
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