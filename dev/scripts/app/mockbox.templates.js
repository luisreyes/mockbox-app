_mock.templates = (function(){
  "use strict";



  function getTemplates(){
    return [
    {
      "name": "Hello Template",
      "html": "<div class='wheel'><ul class='umbrella'><li class='color'></li><li class='color'></li><li class='color'></li><li class='color'></li><li class='color'></li><li class='color'></li><li class='color'></li><li class='color'></li><li class='color'></li><li class='color'></li><li class='color'></li><li class='color'></li></ul></div>",
      "css" : ".color,.umbrella,.wheel{content:'';position:absolute;border-radius:50%;left:calc(50% - 7.5em);top:calc(50% - 7.5em);width:15em;height:15em}.wheel{overflow:hidden;width:15em;height:15em;position:relative}.umbrella{position:relative;-webkit-filter:blur(1.7em);-webkit-transform:scale(1.35)}.color,.color:nth-child(n+7):after{clip:rect(0,15em,15em,7.5em)}.color:after,.color:nth-child(n+7){content:'';position:absolute;border-radius:50%;left:calc(50% - 7.5em);top:calc(50% - 7.5em);width:15em;height:15em;clip:rect(0,7.5em,15em,0)}.color:nth-child(1):after{background-color:#9ED110;transform:rotate(30deg);z-index:12}.color:nth-child(2):after{background-color:#50B517;transform:rotate(60deg);z-index:11}.color:nth-child(3):after{background-color:#179067;transform:rotate(90deg);z-index:10}.color:nth-child(4):after{background-color:#476EAF;transform:rotate(120deg);z-index:9}.color:nth-child(5):after{background-color:#9f49ac;transform:rotate(150deg);z-index:8}.color:nth-child(6):after{background-color:#CC42A2;transform:rotate(180deg);z-index:7}.color:nth-child(7):after{background-color:#FF3BA7;transform:rotate(180deg)}.color:nth-child(8):after{background-color:#FF5800;transform:rotate(210deg)}.color:nth-child(9):after{background-color:#FF8100;transform:rotate(240deg)}.color:nth-child(10):after{background-color:#FEAC00;transform:rotate(270deg)}.color:nth-child(11):after{background-color:#FC0;transform:rotate(300deg)}.color:nth-child(12):after{background-color:#EDE604;transform:rotate(330deg)}body{background:#f2f2f2;padding:50px}",
      "js"  : "// No JavaScript",
      "layout": [50,50,50],
      "author": "@luisreyesdev"
    },
    {
      "name": "MockBox Template",
      "html": "<!-- MockBox HTML -->",
      "css" : "/* MockBox CSS */",
      "js"  : "// JavaScript Here",
      "layout": [60,70,50],
      "author": "@luisreyesdev"
    },
    {
      "name": "Static Background",
      "html": '<div id="header"> <div class="center"> <div class="middle"> <h1>Blur</h1> <span>Fixed header with a triangle indicator</span> </div> </div> </div> <div id="pageHrBorder"> <!-- just simply remove this if not needed --> <i class="s"></i> <i class="a"></i> </div> <div id="pageHr"> <i class="s"></i> <i class="a"></i> </div> <div id="page"></div>',
      "css" : '@import url(http://fonts.googleapis.com/css?family=Varela+Round); html, body { height: 100%; padding: 0; margin: 0; } body { font-family: "Varela Round"; background: #444444; } #header { background: url(http://suplemenbadan.com/wp-content/uploads/2014/05/plants-and-sunlight-background-blur-with-bokeh-f4.jpg) no-repeat center; background-size: cover; position: fixed; bottom: 0; right: 0; left: 0; top: 0; } #header .center { background: rgba(0, 0, 0, 0.25); text-align: center; position: absolute; color: #FFFFFF; color: #F5F7FA; bottom: 0; right: 0; left: 0; top: 0; } #header .center .middle { position: absolute; margin-top: -6em; right: 0; left: 0; top: 50%; } #header .center .middle h1 { font-weight: normal; line-height: 1em; font-size: 11em; margin: 0; } #header .center .middle span { line-height: 1em; font-size: 1em; } #pageHr, #pageHrBorder { position: absolute; border-bottom: 25px solid #48CFAD; margin-top: -40px; height: 20px; display: block; right: 0px; left: 0px; top: 100%; } #pageHr .a:before, #pageHr .a:after, #pageHrBorder .a:before, #pageHrBorder .a:after { border-color: #48CFAD transparent; border-style: solid; position: absolute; display: block; content: ""; } #pageHr .a:before, #pageHrBorder .a:before { border-width: 0 20px 20px 0; margin-left: 10px; right: 50%; } #pageHr .a:after, #pageHrBorder .a:after { border-width: 0 0 20px 20px; margin-right: 10px; left: 50%; } #pageHr .s:before, #pageHr .s:after, #pageHrBorder .s:before, #pageHrBorder .s:after { background: #48CFAD; position: absolute; display: block; content: ""; right: 0; left: 0; } #pageHr .s:before, #pageHrBorder .s:before { margin-right: 20px; height: 20px; right: 50%; } #pageHr .s:after, #pageHrBorder .s:after { margin-left: 20px; height: 20px; left: 50%; } #pageHrBorder { border-bottom-color: #F5F7FA; margin-top: -45px; } #pageHrBorder .a:before, #pageHrBorder .a:after { border-color: #F5F7FA transparent; } #pageHrBorder .a:before { margin-right: -2.5px; } #pageHrBorder .a:after { margin-left: -2.5px; } #pageHrBorder .s:before, #pageHrBorder .s:after { background: #F5F7FA; } #pageHrBorder .s:before { margin-right: 17.36842px; } #pageHrBorder .s:after { margin-left: 17.36842px; } #page { background: #37BC9B; position: relative; height: 123.45%; top: 100%; } ',
      "js"  : "",
      "layout": [60,70,50],
      "author": "@luisreyesdev"
    }];

  } 

  function getExport(type){
      switch(type){
        case 'html': 
        break;

      }

    var type = [
    {
      "html" : ".col"
    }];

  }    

  return {
    getAll:function(){
      return getTemplates();
    }
  };

}());