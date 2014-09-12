_mock.templates = (function(){
  'use strict';

  function getTemplates(){
    return [
    {
      name: 'Hello Template',
      html: '<div class="wheel"><ul class="umbrella"><li class="color"></li><li class="color"></li><li class="color"></li><li class="color"></li><li class="color"></li><li class="color"></li><li class="color"></li><li class="color"></li><li class="color"></li><li class="color"></li><li class="color"></li><li class="color"></li></ul></div>',
      css : '.color,.umbrella,.wheel{content:"";position:absolute;border-radius:50%;left:calc(50% - 7.5em);top:calc(50% - 7.5em);width:15em;height:15em}.wheel{overflow:hidden;width:15em;height:15em;position:relative}.umbrella{position:relative;-webkit-filter:blur(1.7em);-webkit-transform:scale(1.35)}.color,.color:nth-child(n+7):after{clip:rect(0,15em,15em,7.5em)}.color:after,.color:nth-child(n+7){content:"";position:absolute;border-radius:50%;left:calc(50% - 7.5em);top:calc(50% - 7.5em);width:15em;height:15em;clip:rect(0,7.5em,15em,0)}.color:nth-child(1):after{background-color:#9ED110;transform:rotate(30deg);z-index:12}.color:nth-child(2):after{background-color:#50B517;transform:rotate(60deg);z-index:11}.color:nth-child(3):after{background-color:#179067;transform:rotate(90deg);z-index:10}.color:nth-child(4):after{background-color:#476EAF;transform:rotate(120deg);z-index:9}.color:nth-child(5):after{background-color:#9f49ac;transform:rotate(150deg);z-index:8}.color:nth-child(6):after{background-color:#CC42A2;transform:rotate(180deg);z-index:7}.color:nth-child(7):after{background-color:#FF3BA7;transform:rotate(180deg)}.color:nth-child(8):after{background-color:#FF5800;transform:rotate(210deg)}.color:nth-child(9):after{background-color:#FF8100;transform:rotate(240deg)}.color:nth-child(10):after{background-color:#FEAC00;transform:rotate(270deg)}.color:nth-child(11):after{background-color:#FC0;transform:rotate(300deg)}.color:nth-child(12):after{background-color:#EDE604;transform:rotate(330deg)}body{background:#f2f2f2;padding:50px}',
      js  : '// No JavaScript',
      layout: [50,50,50],
      author: '@luisreyesdev'
    },
    {
      name: 'MockBox Template',
      html: '<!-- MockBox HTML -->',
      css : '/* MockBox CSS */',
      js  : '// JavaScript Here',
      layout: [60,70,50],
      author: '@luisreyesdev'
    }];

  }    

  return {
    getAll:function(){
      return getTemplates();
    }
  };

}());