_mock.templates = (function(){
  'use strict';

  function getBodyHeader(params){
    var htmlHeader = "<!doctype html><html><head><meta charset='utf-8'><title>' + params.title + ' - MockBox Prototype</title><link rel='stylesheet' href='styles/styles.css'></head>";

    return htmlHeader;
  }

  function getBodyFooter(params){
    var htmlFooter = "<script src='scripts/scripts.js'></script>";

    return htmlFooter;
  }

  function getTemplates(){
    return [
    {
      'name': 'CSS Animation - Slides',
      'html': '<section id="arrows"><span id="previous" class="arrow top transition"><i class="fa fa-arrow-up"></i></span><span id="next" class="arrow bottom transition"><i class="fa fa-arrow-down"></i></span></section><section id="slides" class="slides"><section class="slide_0 selected"></section><section class="slide_1"><p>Desert</p></section><section class="slide_2"><p>Jellyfish</p></section><section class="slide_3"><p>Koala</p></section><section class="slide_4"><p>Lighthouse</p></section></section>',
      'css' : 'body{background-color:#222}.transition{-webkit-transition:all .12s}.arrow.top{top:0}.arrow.bottom{bottom:0}.arrow{position:absolute;padding:10px;background:#000;color:#FFF;opacity:.5;height:10px;text-align:center;line-height:10px;width:100%;z-index:10}.arrow:hover{background-color:#333;font-size:22px;height:20px}.slides{width:100%;height:100%;color:#FFF}.slides section{width:100%;height:100%;opacity:0;background-size:cover;background-position:50%;position:absolute;top:0;-webkit-transition:all .5s;-webkit-filter:blur(20px)}.slides p{position:absolute;bottom:-webkit-calc(0% - -55px);font-size:20px;background:rgba(0,0,0,.5);padding:10px;right:0}.selected{opacity:1!important;-webkit-filter:blur(0px)!important}.slide_0{background-image:url(/images/template_assets/mockbox.png)}.slide_1{background-image:url(/images/template_assets/Desert.jpg)}.slide_2{background-image:url(/images/template_assets/Jellyfish.jpg)}.slide_3{background-image:url(/images/template_assets/Koala.jpg)}.slide_4{background-image:url(/images/template_assets/Lighthouse.jpg)}',
      'js'  : 'function onNext(){selected=selected++>=slides.length-1?0:selected++,setSelected(selected)}function onPrevious(){selected=0===selected--?slides.length-1:selected++,setSelected(selected)}function setSelected(a){for(var b=0;b<slides.length;b++)apollo.removeClass(slides[b],"selected");apollo.addClass(slides[a],"selected")}var slides=document.getElementById("slides").getElementsByTagName("section"),selected=0,arrows={up:document.getElementById("previous"),down:document.getElementById("next")};arrows.up.addEventListener("click",onNext),arrows.down.addEventListener("click",onPrevious);',
      'layout': [50,50,50],
      'author': '@luisreyesdev',
      'properties':{
        'html':{
          'html': [],
          'head': ''
        },
        'css':{
          'normalize': false,
          'sources': ['http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/css/font-awesome.min.css']
        },
        'js':{
          'framework': 'none',
          'apollo': true,
          'sources': []
        }
      }
    },
    {
      'name': 'AngularJS - Basic Bindings',
      'html': '<section>Angular two-way binding</section><fieldset><span>Enter your name:</span><br/><input type="text" placeholder="First" ng-model="firstname" /><input type="text" placeholder="Last" ng-model="lastname" /><br/><br/><span>Sex:</span><br/><input type="radio" ng-model="sex" value="Mr." /><label>Male</label><br/><input type="radio" ng-model="sex" value="Mrs."/><label>Female</label><br/><input type="radio" ng-model="sex" value="" /><label>None</label></fieldset><h1 ng-if="firstname || lastname">Hello {{ sex + firstname + \' \' + lastname }}</h1>',
      'css' : 'body{margin:10px;color:#666;}fieldset{padding:10px;margin:10px 5px;background-color:#EEE;border:1px solid #BBB;}',
      'js'  : '',
      'layout': [80,45,25],
      'author': '@luisreyesdev',
      'properties':{
        'html':{
          'html': [],
          'head': ''
        },
        'css':{
          'normalize': false,
          'sources': []
        },
        'js':{
          'framework': 'angular',
          'apollo': false,
          'sources': []
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