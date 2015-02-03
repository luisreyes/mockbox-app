(function() { var f=this,g=function(a,d){var c=a.split("."),b=window||f;c[0]in b||!b.execScript||b.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===d?b=b[e]?b[e]:b[e]={}:b[e]=d};var h=function(a){var d=chrome.runtime.connect("nmmhkkegccagdldgiimedpiccmgmieda",{}),c=!1;d.onMessage.addListener(function(b){c=!0;"response"in b&&!("errorType"in b.response)?a.success&&a.success(b):a.failure&&a.failure(b)});d.onDisconnect.addListener(function(){!c&&a.failure&&a.failure({request:{},response:{errorType:"INTERNAL_SERVER_ERROR"}})});d.postMessage(a)};g("google.payments.inapp.buy",function(a){a.method="buy";h(a)});
g("google.payments.inapp.getPurchases",function(a){a.method="getPurchases";h(a)});g("google.payments.inapp.getSkuDetails",function(a){a.method="getSkuDetails";h(a)}); })();
/*! apollo.js v1.7.0 | (c) 2014 @toddmotto | https://github.com/toddmotto/apollo */
!function(n,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t:n.apollo=t()}(this,function(){"use strict";var n,t,s,e,o={},c=function(n,t){"[object Array]"!==Object.prototype.toString.call(n)&&(n=n.split(" "));for(var s=0;s<n.length;s++)t(n[s],s)};return"classList"in document.documentElement?(n=function(n,t){return n.classList.contains(t)},t=function(n,t){n.classList.add(t)},s=function(n,t){n.classList.remove(t)},e=function(n,t){n.classList.toggle(t)}):(n=function(n,t){return new RegExp("(^|\\s)"+t+"(\\s|$)").test(n.className)},t=function(t,s){n(t,s)||(t.className+=(t.className?" ":"")+s)},s=function(t,s){n(t,s)&&(t.className=t.className.replace(new RegExp("(^|\\s)*"+s+"(\\s|$)*","g"),""))},e=function(e,o){(n(e,o)?s:t)(e,o)}),o.hasClass=function(t,s){return n(t,s)},o.addClass=function(n,s){c(s,function(s){t(n,s)})},o.removeClass=function(n,t){c(t,function(t){s(n,t)})},o.toggleClass=function(n,t){c(t,function(t){e(n,t)})},o});
/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

 JS Beautifier
---------------


  Written by Einar Lielmanis, <einar@jsbeautifier.org>
      http://jsbeautifier.org/

  Originally converted to javascript by Vital, <vital76@gmail.com>
  "End braces on own line" added by Chris J. Shull, <chrisjshull@gmail.com>
  Parsing improvements for brace-less statements by Liam Newman <bitwiseman@gmail.com>


  Usage:
    js_beautify(js_source_text);
    js_beautify(js_source_text, options);

  The options are:
    indent_size (default 4)          - indentation size,
    indent_char (default space)      - character to indent with,
    preserve_newlines (default true) - whether existing line breaks should be preserved,
    max_preserve_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk,

    jslint_happy (default false) - if true, then jslint-stricter mode is enforced.

            jslint_happy       !jslint_happy
            ---------------------------------
            function ()        function()

    brace_style (default "collapse") - "collapse" | "expand" | "end-expand"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line.

    space_before_conditional (default true) - should the space before conditional statement be added, "if(true)" vs "if (true)",

    unescape_strings (default false) - should printable characters in strings encoded in \xNN notation be unescaped, "example" vs "\x65\x78\x61\x6d\x70\x6c\x65"

    wrap_line_length (default unlimited) - lines should wrap at next opportunity after this number of characters.
          NOTE: This is not a hard limit. Lines will continue until a point where a newline would
                be preserved if it were present.

    e.g

    js_beautify(js_source_text, {
      'indent_size': 1,
      'indent_char': '\t'
    });

*/

(function() {

    var acorn = {};
    (function (exports) {
      // This section of code is taken from acorn.
      //
      // Acorn was written by Marijn Haverbeke and released under an MIT
      // license. The Unicode regexps (for identifiers and whitespace) were
      // taken from [Esprima](http://esprima.org) by Ariya Hidayat.
      //
      // Git repositories for Acorn are available at
      //
      //     http://marijnhaverbeke.nl/git/acorn
      //     https://github.com/marijnh/acorn.git

      // ## Character categories

      // Big ugly regular expressions that match characters in the
      // whitespace, identifier, and identifier-start categories. These
      // are only applied when a character is found to actually have a
      // code point above 128.

      var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
      var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
      var nonASCIIidentifierChars = "\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u0620-\u0649\u0672-\u06d3\u06e7-\u06e8\u06fb-\u06fc\u0730-\u074a\u0800-\u0814\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0840-\u0857\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962-\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09d7\u09df-\u09e0\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5f-\u0b60\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d46-\u0d48\u0d57\u0d62-\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e34-\u0e3a\u0e40-\u0e45\u0e50-\u0e59\u0eb4-\u0eb9\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f41-\u0f47\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1029\u1040-\u1049\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u170e-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17b2\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1920-\u192b\u1930-\u193b\u1951-\u196d\u19b0-\u19c0\u19c8-\u19c9\u19d0-\u19d9\u1a00-\u1a15\u1a20-\u1a53\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b46-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1bb0-\u1bb9\u1be6-\u1bf3\u1c00-\u1c22\u1c40-\u1c49\u1c5b-\u1c7d\u1cd0-\u1cd2\u1d00-\u1dbe\u1e01-\u1f15\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2d81-\u2d96\u2de0-\u2dff\u3021-\u3028\u3099\u309a\ua640-\ua66d\ua674-\ua67d\ua69f\ua6f0-\ua6f1\ua7f8-\ua800\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8f3-\ua8f7\ua900-\ua909\ua926-\ua92d\ua930-\ua945\ua980-\ua983\ua9b3-\ua9c0\uaa00-\uaa27\uaa40-\uaa41\uaa4c-\uaa4d\uaa50-\uaa59\uaa7b\uaae0-\uaae9\uaaf2-\uaaf3\uabc0-\uabe1\uabec\uabed\uabf0-\uabf9\ufb20-\ufb28\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";
      var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
      var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

      // Whether a single character denotes a newline.

      var newline = /[\n\r\u2028\u2029]/;

      // Matches a whole line break (where CRLF is considered a single
      // line break). Used to count lines.

      var lineBreak = /\r\n|[\n\r\u2028\u2029]/g;

      // Test whether a given character code starts an identifier.

      var isIdentifierStart = exports.isIdentifierStart = function(code) {
        if (code < 65) return code === 36;
        if (code < 91) return true;
        if (code < 97) return code === 95;
        if (code < 123)return true;
        return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
      };

      // Test whether a given character is part of an identifier.

      var isIdentifierChar = exports.isIdentifierChar = function(code) {
        if (code < 48) return code === 36;
        if (code < 58) return true;
        if (code < 65) return false;
        if (code < 91) return true;
        if (code < 97) return code === 95;
        if (code < 123)return true;
        return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
      };
    })(acorn);

    function js_beautify(js_source_text, options) {
        "use strict";
        var beautifier = new Beautifier(js_source_text, options);
        return beautifier.beautify();
    }

    function Beautifier(js_source_text, options) {
        "use strict";
        var input, output_lines;
        var token_text, token_type, last_type, last_last_text, indent_string;
        var flags, previous_flags, flag_store;
        var whitespace, wordchar, punct, parser_pos, line_starters, reserved_words, digits;
        var prefix;
        var input_wanted_newline;
        var output_space_before_token;
        var input_length, n_newlines, whitespace_before_token;
        var handlers, MODE, opt;
        var preindent_string = '';



        whitespace = "\n\r\t ".split('');
        wordchar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$'.split('');
        digits = '0123456789'.split('');

        punct = '+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! ~ , : ? ^ ^= |= :: =>';
        punct += ' <%= <% %> <?= <? ?>'; // try to be a good boy and try not to break the markup language identifiers
        punct = punct.split(' ');

        // words which should always start on new line.
        line_starters = 'continue,try,throw,return,var,let,const,if,switch,case,default,for,while,break,function,yield'.split(',');
        reserved_words = line_starters.concat(['do', 'in', 'else', 'get', 'set', 'new', 'catch', 'finally', 'typeof']);


        MODE = {
            BlockStatement: 'BlockStatement', // 'BLOCK'
            Statement: 'Statement', // 'STATEMENT'
            ObjectLiteral: 'ObjectLiteral', // 'OBJECT',
            ArrayLiteral: 'ArrayLiteral', //'[EXPRESSION]',
            ForInitializer: 'ForInitializer', //'(FOR-EXPRESSION)',
            Conditional: 'Conditional', //'(COND-EXPRESSION)',
            Expression: 'Expression' //'(EXPRESSION)'
        };

        handlers = {
            'TK_START_EXPR': handle_start_expr,
            'TK_END_EXPR': handle_end_expr,
            'TK_START_BLOCK': handle_start_block,
            'TK_END_BLOCK': handle_end_block,
            'TK_WORD': handle_word,
            'TK_RESERVED': handle_word,
            'TK_SEMICOLON': handle_semicolon,
            'TK_STRING': handle_string,
            'TK_EQUALS': handle_equals,
            'TK_OPERATOR': handle_operator,
            'TK_COMMA': handle_comma,
            'TK_BLOCK_COMMENT': handle_block_comment,
            'TK_INLINE_COMMENT': handle_inline_comment,
            'TK_COMMENT': handle_comment,
            'TK_DOT': handle_dot,
            'TK_UNKNOWN': handle_unknown
        };

        function create_flags(flags_base, mode) {
            var next_indent_level = 0;
            if (flags_base) {
                next_indent_level = flags_base.indentation_level;
                if (!just_added_newline() &&
                    flags_base.line_indent_level > next_indent_level) {
                    next_indent_level = flags_base.line_indent_level;
                }
            }

            var next_flags = {
                mode: mode,
                parent: flags_base,
                last_text: flags_base ? flags_base.last_text : '', // last token text
                last_word: flags_base ? flags_base.last_word : '', // last 'TK_WORD' passed
                declaration_statement: false,
                declaration_assignment: false,
                in_html_comment: false,
                multiline_frame: false,
                if_block: false,
                else_block: false,
                do_block: false,
                do_while: false,
                in_case_statement: false, // switch(..){ INSIDE HERE }
                in_case: false, // we're on the exact line with "case 0:"
                case_body: false, // the indented case-action block
                indentation_level: next_indent_level,
                line_indent_level: flags_base ? flags_base.line_indent_level : next_indent_level,
                start_line_index: output_lines.length,
                had_comment: false,
                ternary_depth: 0
            };
            return next_flags;
        }

        // Using object instead of string to allow for later expansion of info about each line

        function create_output_line() {
            return {
                text: []
            };
        }

        // Some interpreters have unexpected results with foo = baz || bar;
        options = options ? options : {};
        opt = {};

        // compatibility
        if (options.space_after_anon_function !== undefined && options.jslint_happy === undefined) {
            options.jslint_happy = options.space_after_anon_function;
        }
        if (options.braces_on_own_line !== undefined) { //graceful handling of deprecated option
            opt.brace_style = options.braces_on_own_line ? "expand" : "collapse";
        }
        opt.brace_style = options.brace_style ? options.brace_style : (opt.brace_style ? opt.brace_style : "collapse");

        // graceful handling of deprecated option
        if (opt.brace_style === "expand-strict") {
            opt.brace_style = "expand";
        }


        opt.indent_size = options.indent_size ? parseInt(options.indent_size, 10) : 4;
        opt.indent_char = options.indent_char ? options.indent_char : ' ';
        opt.preserve_newlines = (options.preserve_newlines === undefined) ? true : options.preserve_newlines;
        opt.break_chained_methods = (options.break_chained_methods === undefined) ? false : options.break_chained_methods;
        opt.max_preserve_newlines = (options.max_preserve_newlines === undefined) ? 0 : parseInt(options.max_preserve_newlines, 10);
        opt.space_in_paren = (options.space_in_paren === undefined) ? false : options.space_in_paren;
        opt.space_in_empty_paren = (options.space_in_empty_paren === undefined) ? false : options.space_in_empty_paren;
        opt.jslint_happy = (options.jslint_happy === undefined) ? false : options.jslint_happy;
        opt.keep_array_indentation = (options.keep_array_indentation === undefined) ? false : options.keep_array_indentation;
        opt.space_before_conditional = (options.space_before_conditional === undefined) ? true : options.space_before_conditional;
        opt.unescape_strings = (options.unescape_strings === undefined) ? false : options.unescape_strings;
        opt.wrap_line_length = (options.wrap_line_length === undefined) ? 0 : parseInt(options.wrap_line_length, 10);
        opt.e4x = (options.e4x === undefined) ? false : options.e4x;

        if(options.indent_with_tabs){
            opt.indent_char = '\t';
            opt.indent_size = 1;
        }

        //----------------------------------
        indent_string = '';
        while (opt.indent_size > 0) {
            indent_string += opt.indent_char;
            opt.indent_size -= 1;
        }

        while (js_source_text && (js_source_text.charAt(0) === ' ' || js_source_text.charAt(0) === '\t')) {
            preindent_string += js_source_text.charAt(0);
            js_source_text = js_source_text.substring(1);
        }
        input = js_source_text;
        // cache the source's length.
        input_length = js_source_text.length;

        last_type = 'TK_START_BLOCK'; // last token type
        last_last_text = ''; // pre-last token text
        output_lines = [create_output_line()];
        output_space_before_token = false;
        whitespace_before_token = [];

        // Stack of parsing/formatting states, including MODE.
        // We tokenize, parse, and output in an almost purely a forward-only stream of token input
        // and formatted output.  This makes the beautifier less accurate than full parsers
        // but also far more tolerant of syntax errors.
        //
        // For example, the default mode is MODE.BlockStatement. If we see a '{' we push a new frame of type
        // MODE.BlockStatement on the the stack, even though it could be object literal.  If we later
        // encounter a ":", we'll switch to to MODE.ObjectLiteral.  If we then see a ";",
        // most full parsers would die, but the beautifier gracefully falls back to
        // MODE.BlockStatement and continues on.
        flag_store = [];
        set_mode(MODE.BlockStatement);

        parser_pos = 0;

        this.beautify = function() {
            /*jshint onevar:true */
            var t, i, keep_whitespace, sweet_code;

            while (true) {
                t = get_next_token();
                token_text = t[0];
                token_type = t[1];

                if (token_type === 'TK_EOF') {
                    // Unwind any open statements
                    while (flags.mode === MODE.Statement) {
                        restore_mode();
                    }
                    break;
                }

                keep_whitespace = opt.keep_array_indentation && is_array(flags.mode);
                input_wanted_newline = n_newlines > 0;

                if (keep_whitespace) {
                    for (i = 0; i < n_newlines; i += 1) {
                        print_newline(i > 0);
                    }
                } else {
                    if (opt.max_preserve_newlines && n_newlines > opt.max_preserve_newlines) {
                        n_newlines = opt.max_preserve_newlines;
                    }

                    if (opt.preserve_newlines) {
                        if (n_newlines > 1) {
                            print_newline();
                            for (i = 1; i < n_newlines; i += 1) {
                                print_newline(true);
                            }
                        }
                    }
                }

                handlers[token_type]();

                // The cleanest handling of inline comments is to treat them as though they aren't there.
                // Just continue formatting and the behavior should be logical.
                // Also ignore unknown tokens.  Again, this should result in better behavior.
                if (token_type !== 'TK_INLINE_COMMENT' && token_type !== 'TK_COMMENT' &&
                    token_type !== 'TK_BLOCK_COMMENT' && token_type !== 'TK_UNKNOWN') {
                    last_last_text = flags.last_text;
                    last_type = token_type;
                    flags.last_text = token_text;
                }
                flags.had_comment = (token_type === 'TK_INLINE_COMMENT' || token_type === 'TK_COMMENT'
                    || token_type === 'TK_BLOCK_COMMENT');
            }


            sweet_code = output_lines[0].text.join('');
            for (var line_index = 1; line_index < output_lines.length; line_index++) {
                sweet_code += '\n' + output_lines[line_index].text.join('');
            }
            sweet_code = sweet_code.replace(/[\r\n ]+$/, '');
            return sweet_code;
        };

        function trim_output(eat_newlines) {
            eat_newlines = (eat_newlines === undefined) ? false : eat_newlines;

            if (output_lines.length) {
                trim_output_line(output_lines[output_lines.length - 1], eat_newlines);

                while (eat_newlines && output_lines.length > 1 &&
                    output_lines[output_lines.length - 1].text.length === 0) {
                    output_lines.pop();
                    trim_output_line(output_lines[output_lines.length - 1], eat_newlines);
                }
            }
        }

        function trim_output_line(line) {
            while (line.text.length &&
                (line.text[line.text.length - 1] === ' ' ||
                    line.text[line.text.length - 1] === indent_string ||
                    line.text[line.text.length - 1] === preindent_string)) {
                line.text.pop();
            }
        }

        function trim(s) {
            return s.replace(/^\s+|\s+$/g, '');
        }

        // we could use just string.split, but
        // IE doesn't like returning empty strings

        function split_newlines(s) {
            //return s.split(/\x0d\x0a|\x0a/);

            s = s.replace(/\x0d/g, '');
            var out = [],
                idx = s.indexOf("\n");
            while (idx !== -1) {
                out.push(s.substring(0, idx));
                s = s.substring(idx + 1);
                idx = s.indexOf("\n");
            }
            if (s.length) {
                out.push(s);
            }
            return out;
        }

        function just_added_newline() {
            var line = output_lines[output_lines.length - 1];
            return line.text.length === 0;
        }

        function just_added_blankline() {
            if (just_added_newline()) {
                if (output_lines.length === 1) {
                    return true; // start of the file and newline = blank
                }

                var line = output_lines[output_lines.length - 2];
                return line.text.length === 0;
            }
            return false;
        }

        function allow_wrap_or_preserved_newline(force_linewrap) {
            force_linewrap = (force_linewrap === undefined) ? false : force_linewrap;
            if (opt.wrap_line_length && !force_linewrap) {
                var line = output_lines[output_lines.length - 1];
                var proposed_line_length = 0;
                // never wrap the first token of a line.
                if (line.text.length > 0) {
                    proposed_line_length = line.text.join('').length + token_text.length +
                        (output_space_before_token ? 1 : 0);
                    if (proposed_line_length >= opt.wrap_line_length) {
                        force_linewrap = true;
                    }
                }
            }
            if (((opt.preserve_newlines && input_wanted_newline) || force_linewrap) && !just_added_newline()) {
                print_newline(false, true);

            }
        }

        function print_newline(force_newline, preserve_statement_flags) {
            output_space_before_token = false;

            if (!preserve_statement_flags) {
                if (flags.last_text !== ';' && flags.last_text !== ',' && flags.last_text !== '=' && last_type !== 'TK_OPERATOR') {
                    while (flags.mode === MODE.Statement && !flags.if_block && !flags.do_block) {
                        restore_mode();
                    }
                }
            }

            if (output_lines.length === 1 && just_added_newline()) {
                return; // no newline on start of file
            }

            if (force_newline || !just_added_newline()) {
                flags.multiline_frame = true;
                output_lines.push(create_output_line());
            }
        }

        function print_token_line_indentation() {
            if (just_added_newline()) {
                var line = output_lines[output_lines.length - 1];
                if (opt.keep_array_indentation && is_array(flags.mode) && input_wanted_newline) {
                    // prevent removing of this whitespace as redundant
                    line.text.push('');
                    for (var i = 0; i < whitespace_before_token.length; i += 1) {
                        line.text.push(whitespace_before_token[i]);
                    }
                } else {
                    if (preindent_string) {
                        line.text.push(preindent_string);
                    }

                    print_indent_string(flags.indentation_level);
                }
            }
        }

        function print_indent_string(level) {
            // Never indent your first output indent at the start of the file
            if (output_lines.length > 1) {
                var line = output_lines[output_lines.length - 1];

                flags.line_indent_level = level;
                for (var i = 0; i < level; i += 1) {
                    line.text.push(indent_string);
                }
            }
        }

        function print_token_space_before() {
            var line = output_lines[output_lines.length - 1];
            if (output_space_before_token && line.text.length) {
                var last_output = line.text[line.text.length - 1];
                if (last_output !== ' ' && last_output !== indent_string) { // prevent occassional duplicate space
                    line.text.push(' ');
                }
            }
        }

        function print_token(printable_token) {
            printable_token = printable_token || token_text;
            print_token_line_indentation();
            print_token_space_before();
            output_space_before_token = false;
            output_lines[output_lines.length - 1].text.push(printable_token);
        }

        function indent() {
            flags.indentation_level += 1;
        }

        function deindent() {
            if (flags.indentation_level > 0 &&
                ((!flags.parent) || flags.indentation_level > flags.parent.indentation_level))
                flags.indentation_level -= 1;
        }

        function remove_redundant_indentation(frame) {
            // This implementation is effective but has some issues:
            //     - less than great performance due to array splicing
            //     - can cause line wrap to happen too soon due to indent removal
            //           after wrap points are calculated
            // These issues are minor compared to ugly indentation.

            if (frame.multiline_frame) return;

            // remove one indent from each line inside this section
            var index = frame.start_line_index;
            var splice_index = 0;
            var line;

            while (index < output_lines.length) {
                line = output_lines[index];
                index++;

                // skip empty lines
                if (line.text.length === 0) {
                    continue;
                }

                // skip the preindent string if present
                if (preindent_string && line.text[0] === preindent_string) {
                    splice_index = 1;
                } else {
                    splice_index = 0;
                }

                // remove one indent, if present
                if (line.text[splice_index] === indent_string) {
                    line.text.splice(splice_index, 1);
                }
            }
        }

        function set_mode(mode) {
            if (flags) {
                flag_store.push(flags);
                previous_flags = flags;
            } else {
                previous_flags = create_flags(null, mode);
            }

            flags = create_flags(previous_flags, mode);
        }

        function is_array(mode) {
            return mode === MODE.ArrayLiteral;
        }

        function is_expression(mode) {
            return in_array(mode, [MODE.Expression, MODE.ForInitializer, MODE.Conditional]);
        }

        function restore_mode() {
            if (flag_store.length > 0) {
                previous_flags = flags;
                flags = flag_store.pop();
                if (previous_flags.mode === MODE.Statement) {
                    remove_redundant_indentation(previous_flags);
                }
            }
        }

        function start_of_object_property() {
            return flags.parent.mode === MODE.ObjectLiteral && flags.mode === MODE.Statement && flags.last_text === ':' &&
                flags.ternary_depth === 0;
        }

        function start_of_statement() {
            if (
                    (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const']) && token_type === 'TK_WORD') ||
                    (last_type === 'TK_RESERVED' && flags.last_text === 'do') ||
                    (last_type === 'TK_RESERVED' && flags.last_text === 'return' && !input_wanted_newline) ||
                    (last_type === 'TK_RESERVED' && flags.last_text === 'else' && !(token_type === 'TK_RESERVED' && token_text === 'if')) ||
                    (last_type === 'TK_END_EXPR' && (previous_flags.mode === MODE.ForInitializer || previous_flags.mode === MODE.Conditional)) ||
                    (last_type === 'TK_WORD' && flags.mode === MODE.BlockStatement
                        && !flags.in_case
                        && !(token_text === '--' || token_text === '++')
                        && token_type !== 'TK_WORD' && token_type !== 'TK_RESERVED') ||
                    (flags.mode === MODE.ObjectLiteral && flags.last_text === ':' && flags.ternary_depth === 0)

                ) {

                set_mode(MODE.Statement);
                indent();

                if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const']) && token_type === 'TK_WORD') {
                    flags.declaration_statement = true;
                }

                // Issue #276:
                // If starting a new statement with [if, for, while, do], push to a new line.
                // if (a) if (b) if(c) d(); else e(); else f();
                if (!start_of_object_property()) {
                    allow_wrap_or_preserved_newline(
                        token_type === 'TK_RESERVED' && in_array(token_text, ['do', 'for', 'if', 'while']));
                }

                return true;
            }
            return false;
        }

        function all_lines_start_with(lines, c) {
            for (var i = 0; i < lines.length; i++) {
                var line = trim(lines[i]);
                if (line.charAt(0) !== c) {
                    return false;
                }
            }
            return true;
        }

        function each_line_matches_indent(lines, indent) {
            var i = 0,
                len = lines.length,
                line;
            for (; i < len; i++) {
                line = lines[i];
                // allow empty lines to pass through
                if (line && line.indexOf(indent) !== 0) {
                    return false;
                }
            }
            return true;
        }

        function is_special_word(word) {
            return in_array(word, ['case', 'return', 'do', 'if', 'throw', 'else']);
        }

        function in_array(what, arr) {
            for (var i = 0; i < arr.length; i += 1) {
                if (arr[i] === what) {
                    return true;
                }
            }
            return false;
        }

        function unescape_string(s) {
            var esc = false,
                out = '',
                pos = 0,
                s_hex = '',
                escaped = 0,
                c;

            while (esc || pos < s.length) {

                c = s.charAt(pos);
                pos++;

                if (esc) {
                    esc = false;
                    if (c === 'x') {
                        // simple hex-escape \x24
                        s_hex = s.substr(pos, 2);
                        pos += 2;
                    } else if (c === 'u') {
                        // unicode-escape, \u2134
                        s_hex = s.substr(pos, 4);
                        pos += 4;
                    } else {
                        // some common escape, e.g \n
                        out += '\\' + c;
                        continue;
                    }
                    if (!s_hex.match(/^[0123456789abcdefABCDEF]+$/)) {
                        // some weird escaping, bail out,
                        // leaving whole string intact
                        return s;
                    }

                    escaped = parseInt(s_hex, 16);

                    if (escaped >= 0x00 && escaped < 0x20) {
                        // leave 0x00...0x1f escaped
                        if (c === 'x') {
                            out += '\\x' + s_hex;
                        } else {
                            out += '\\u' + s_hex;
                        }
                        continue;
                    } else if (escaped === 0x22 || escaped === 0x27 || escaped === 0x5c) {
                        // single-quote, apostrophe, backslash - escape these
                        out += '\\' + String.fromCharCode(escaped);
                    } else if (c === 'x' && escaped > 0x7e && escaped <= 0xff) {
                        // we bail out on \x7f..\xff,
                        // leaving whole string escaped,
                        // as it's probably completely binary
                        return s;
                    } else {
                        out += String.fromCharCode(escaped);
                    }
                } else if (c === '\\') {
                    esc = true;
                } else {
                    out += c;
                }
            }
            return out;
        }

        function is_next(find) {
            var local_pos = parser_pos;
            var c = input.charAt(local_pos);
            while (in_array(c, whitespace) && c !== find) {
                local_pos++;
                if (local_pos >= input_length) {
                    return false;
                }
                c = input.charAt(local_pos);
            }
            return c === find;
        }

        function get_next_token() {
            var i, resulting_string;

            n_newlines = 0;

            if (parser_pos >= input_length) {
                return ['', 'TK_EOF'];
            }

            input_wanted_newline = false;
            whitespace_before_token = [];

            var c = input.charAt(parser_pos);
            parser_pos += 1;

            while (in_array(c, whitespace)) {

                if (c === '\n') {
                    n_newlines += 1;
                    whitespace_before_token = [];
                } else if (n_newlines) {
                    if (c === indent_string) {
                        whitespace_before_token.push(indent_string);
                    } else if (c !== '\r') {
                        whitespace_before_token.push(' ');
                    }
                }

                if (parser_pos >= input_length) {
                    return ['', 'TK_EOF'];
                }

                c = input.charAt(parser_pos);
                parser_pos += 1;
            }

            // NOTE: because beautifier doesn't fully parse, it doesn't use acorn.isIdentifierStart.
            // It just treats all identifiers and numbers and such the same.
            if (acorn.isIdentifierChar(input.charCodeAt(parser_pos-1))) {
                if (parser_pos < input_length) {
                    while (acorn.isIdentifierChar(input.charCodeAt(parser_pos))) {
                        c += input.charAt(parser_pos);
                        parser_pos += 1;
                        if (parser_pos === input_length) {
                            break;
                        }
                    }
                }

                // small and surprisingly unugly hack for 1E-10 representation
                if (parser_pos !== input_length && c.match(/^[0-9]+[Ee]$/) && (input.charAt(parser_pos) === '-' || input.charAt(parser_pos) === '+')) {

                    var sign = input.charAt(parser_pos);
                    parser_pos += 1;

                    var t = get_next_token();
                    c += sign + t[0];
                    return [c, 'TK_WORD'];
                }

                if (!(last_type === 'TK_DOT' ||
                        (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['set', 'get'])))
                    && in_array(c, reserved_words)) {
                    if (c === 'in') { // hack for 'in' operator
                        return [c, 'TK_OPERATOR'];
                    }
                    return [c, 'TK_RESERVED'];
                }
                return [c, 'TK_WORD'];
            }

            if (c === '(' || c === '[') {
                return [c, 'TK_START_EXPR'];
            }

            if (c === ')' || c === ']') {
                return [c, 'TK_END_EXPR'];
            }

            if (c === '{') {
                return [c, 'TK_START_BLOCK'];
            }

            if (c === '}') {
                return [c, 'TK_END_BLOCK'];
            }

            if (c === ';') {
                return [c, 'TK_SEMICOLON'];
            }

            if (c === '/') {
                var comment = '';
                // peek for comment /* ... */
                var inline_comment = true;
                if (input.charAt(parser_pos) === '*') {
                    parser_pos += 1;
                    if (parser_pos < input_length) {
                        while (parser_pos < input_length && !(input.charAt(parser_pos) === '*' && input.charAt(parser_pos + 1) && input.charAt(parser_pos + 1) === '/')) {
                            c = input.charAt(parser_pos);
                            comment += c;
                            if (c === "\n" || c === "\r") {
                                inline_comment = false;
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                break;
                            }
                        }
                    }
                    parser_pos += 2;
                    if (inline_comment && n_newlines === 0) {
                        return ['/*' + comment + '*/', 'TK_INLINE_COMMENT'];
                    } else {
                        return ['/*' + comment + '*/', 'TK_BLOCK_COMMENT'];
                    }
                }
                // peek for comment // ...
                if (input.charAt(parser_pos) === '/') {
                    comment = c;
                    while (input.charAt(parser_pos) !== '\r' && input.charAt(parser_pos) !== '\n') {
                        comment += input.charAt(parser_pos);
                        parser_pos += 1;
                        if (parser_pos >= input_length) {
                            break;
                        }
                    }
                    return [comment, 'TK_COMMENT'];
                }

            }


            if (c === '`' || c === "'" || c === '"' || // string
                (
                    (c === '/') || // regexp
                    (opt.e4x && c === "<" && input.slice(parser_pos - 1).match(/^<([-a-zA-Z:0-9_.]+|{[^{}]*}|!\[CDATA\[[\s\S]*?\]\])\s*([-a-zA-Z:0-9_.]+=('[^']*'|"[^"]*"|{[^{}]*})\s*)*\/?\s*>/)) // xml
                ) && ( // regex and xml can only appear in specific locations during parsing
                    (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) ||
                    (last_type === 'TK_END_EXPR' && in_array(previous_flags.mode, [MODE.Conditional, MODE.ForInitializer])) ||
                    (in_array(last_type, ['TK_COMMENT', 'TK_START_EXPR', 'TK_START_BLOCK',
                        'TK_END_BLOCK', 'TK_OPERATOR', 'TK_EQUALS', 'TK_EOF', 'TK_SEMICOLON', 'TK_COMMA'
                    ]))
                )) {

                var sep = c,
                    esc = false,
                    has_char_escapes = false;

                resulting_string = c;

                if (parser_pos < input_length) {
                    if (sep === '/') {
                        //
                        // handle regexp
                        //
                        var in_char_class = false;
                        while (esc || in_char_class || input.charAt(parser_pos) !== sep) {
                            resulting_string += input.charAt(parser_pos);
                            if (!esc) {
                                esc = input.charAt(parser_pos) === '\\';
                                if (input.charAt(parser_pos) === '[') {
                                    in_char_class = true;
                                } else if (input.charAt(parser_pos) === ']') {
                                    in_char_class = false;
                                }
                            } else {
                                esc = false;
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                // incomplete string/rexp when end-of-file reached.
                                // bail out with what had been received so far.
                                return [resulting_string, 'TK_STRING'];
                            }
                        }
                    } else if (opt.e4x && sep === '<') {
                        //
                        // handle e4x xml literals
                        //
                        var xmlRegExp = /<(\/?)([-a-zA-Z:0-9_.]+|{[^{}]*}|!\[CDATA\[[\s\S]*?\]\])\s*([-a-zA-Z:0-9_.]+=('[^']*'|"[^"]*"|{[^{}]*})\s*)*(\/?)\s*>/g;
                        var xmlStr = input.slice(parser_pos - 1);
                        var match = xmlRegExp.exec(xmlStr);
                        if (match && match.index === 0) {
                            var rootTag = match[2];
                            var depth = 0;
                            while (match) {
                                var isEndTag = !! match[1];
                                var tagName = match[2];
                                var isSingletonTag = ( !! match[match.length - 1]) || (tagName.slice(0, 8) === "![CDATA[");
                                if (tagName === rootTag && !isSingletonTag) {
                                    if (isEndTag) {
                                        --depth;
                                    } else {
                                        ++depth;
                                    }
                                }
                                if (depth <= 0) {
                                    break;
                                }
                                match = xmlRegExp.exec(xmlStr);
                            }
                            var xmlLength = match ? match.index + match[0].length : xmlStr.length;
                            parser_pos += xmlLength - 1;
                            return [xmlStr.slice(0, xmlLength), "TK_STRING"];
                        }
                    } else {
                        //
                        // handle string
                        //
                        while (esc || input.charAt(parser_pos) !== sep) {
                            resulting_string += input.charAt(parser_pos);
                            if (esc) {
                                if (input.charAt(parser_pos) === 'x' || input.charAt(parser_pos) === 'u') {
                                    has_char_escapes = true;
                                }
                                esc = false;
                            } else {
                                esc = input.charAt(parser_pos) === '\\';
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                // incomplete string/rexp when end-of-file reached.
                                // bail out with what had been received so far.
                                return [resulting_string, 'TK_STRING'];
                            }
                        }

                    }
                }

                parser_pos += 1;
                resulting_string += sep;

                if (has_char_escapes && opt.unescape_strings) {
                    resulting_string = unescape_string(resulting_string);
                }

                if (sep === '/') {
                    // regexps may have modifiers /regexp/MOD , so fetch those, too
                    while (parser_pos < input_length && in_array(input.charAt(parser_pos), wordchar)) {
                        resulting_string += input.charAt(parser_pos);
                        parser_pos += 1;
                    }
                }
                return [resulting_string, 'TK_STRING'];
            }

            if (c === '#') {


                if (output_lines.length === 1 && output_lines[0].text.length === 0 &&
                    input.charAt(parser_pos) === '!') {
                    // shebang
                    resulting_string = c;
                    while (parser_pos < input_length && c !== '\n') {
                        c = input.charAt(parser_pos);
                        resulting_string += c;
                        parser_pos += 1;
                    }
                    return [trim(resulting_string) + '\n', 'TK_UNKNOWN'];
                }



                // Spidermonkey-specific sharp variables for circular references
                // https://developer.mozilla.org/En/Sharp_variables_in_JavaScript
                // http://mxr.mozilla.org/mozilla-central/source/js/src/jsscan.cpp around line 1935
                var sharp = '#';
                if (parser_pos < input_length && in_array(input.charAt(parser_pos), digits)) {
                    do {
                        c = input.charAt(parser_pos);
                        sharp += c;
                        parser_pos += 1;
                    } while (parser_pos < input_length && c !== '#' && c !== '=');
                    if (c === '#') {
                        //
                    } else if (input.charAt(parser_pos) === '[' && input.charAt(parser_pos + 1) === ']') {
                        sharp += '[]';
                        parser_pos += 2;
                    } else if (input.charAt(parser_pos) === '{' && input.charAt(parser_pos + 1) === '}') {
                        sharp += '{}';
                        parser_pos += 2;
                    }
                    return [sharp, 'TK_WORD'];
                }
            }

            if (c === '<' && input.substring(parser_pos - 1, parser_pos + 3) === '<!--') {
                parser_pos += 3;
                c = '<!--';
                while (input.charAt(parser_pos) !== '\n' && parser_pos < input_length) {
                    c += input.charAt(parser_pos);
                    parser_pos++;
                }
                flags.in_html_comment = true;
                return [c, 'TK_COMMENT'];
            }

            if (c === '-' && flags.in_html_comment && input.substring(parser_pos - 1, parser_pos + 2) === '-->') {
                flags.in_html_comment = false;
                parser_pos += 2;
                return ['-->', 'TK_COMMENT'];
            }

            if (c === '.') {
                return [c, 'TK_DOT'];
            }

            if (in_array(c, punct)) {
                while (parser_pos < input_length && in_array(c + input.charAt(parser_pos), punct)) {
                    c += input.charAt(parser_pos);
                    parser_pos += 1;
                    if (parser_pos >= input_length) {
                        break;
                    }
                }

                if (c === ',') {
                    return [c, 'TK_COMMA'];
                } else if (c === '=') {
                    return [c, 'TK_EQUALS'];
                } else {
                    return [c, 'TK_OPERATOR'];
                }
            }

            return [c, 'TK_UNKNOWN'];
        }

        function handle_start_expr() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            }

            var next_mode = MODE.Expression;
            if (token_text === '[') {

                if (last_type === 'TK_WORD' || flags.last_text === ')') {
                    // this is array index specifier, break immediately
                    // a[x], fn()[x]
                    if (last_type === 'TK_RESERVED' && in_array(flags.last_text, line_starters)) {
                        output_space_before_token = true;
                    }
                    set_mode(next_mode);
                    print_token();
                    indent();
                    if (opt.space_in_paren) {
                        output_space_before_token = true;
                    }
                    return;
                }

                next_mode = MODE.ArrayLiteral;
                if (is_array(flags.mode)) {
                    if (flags.last_text === '[' ||
                        (flags.last_text === ',' && (last_last_text === ']' || last_last_text === '}'))) {
                        // ], [ goes to new line
                        // }, [ goes to new line
                        if (!opt.keep_array_indentation) {
                            print_newline();
                        }
                    }
                }

            } else {
                if (last_type === 'TK_RESERVED' && flags.last_text === 'for') {
                    next_mode = MODE.ForInitializer;
                } else if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['if', 'while'])) {
                    next_mode = MODE.Conditional;
                } else {
                    // next_mode = MODE.Expression;
                }
            }

            if (flags.last_text === ';' || last_type === 'TK_START_BLOCK') {
                print_newline();
            } else if (last_type === 'TK_END_EXPR' || last_type === 'TK_START_EXPR' || last_type === 'TK_END_BLOCK' || flags.last_text === '.') {
                // TODO: Consider whether forcing this is required.  Review failing tests when removed.
                allow_wrap_or_preserved_newline(input_wanted_newline);
                // do nothing on (( and )( and ][ and ]( and .(
            } else if (!(last_type === 'TK_RESERVED' && token_text === '(') && last_type !== 'TK_WORD' && last_type !== 'TK_OPERATOR') {
                output_space_before_token = true;
            } else if ((last_type === 'TK_RESERVED' && (flags.last_word === 'function' || flags.last_word === 'typeof')) ||
                (flags.last_text === '*' && last_last_text === 'function')) {
                // function() vs function ()
                if (opt.jslint_happy) {
                    output_space_before_token = true;
                }
            } else if (last_type === 'TK_RESERVED' && (in_array(flags.last_text, line_starters) || flags.last_text === 'catch')) {
                if (opt.space_before_conditional) {
                    output_space_before_token = true;
                }
            }

            // Support of this kind of newline preservation.
            // a = (b &&
            //     (c || d));
            if (token_text === '(') {
                if (last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                    if (!start_of_object_property()) {
                        allow_wrap_or_preserved_newline();
                    }
                }
            }

            set_mode(next_mode);
            print_token();
            if (opt.space_in_paren) {
                output_space_before_token = true;
            }

            // In all cases, if we newline while inside an expression it should be indented.
            indent();
        }

        function handle_end_expr() {
            // statements inside expressions are not valid syntax, but...
            // statements must all be closed when their container closes
            while (flags.mode === MODE.Statement) {
                restore_mode();
            }

            if (flags.multiline_frame) {
                allow_wrap_or_preserved_newline(token_text === ']' && is_array(flags.mode) && !opt.keep_array_indentation);
            }

            if (opt.space_in_paren) {
                if (last_type === 'TK_START_EXPR' && ! opt.space_in_empty_paren) {
                    // () [] no inner space in empty parens like these, ever, ref #320
                    trim_output();
                    output_space_before_token = false;
                } else {
                    output_space_before_token = true;
                }
            }
            if (token_text === ']' && opt.keep_array_indentation) {
                print_token();
                restore_mode();
            } else {
                restore_mode();
                print_token();
            }
            remove_redundant_indentation(previous_flags);

            // do {} while () // no statement required after
            if (flags.do_while && previous_flags.mode === MODE.Conditional) {
                previous_flags.mode = MODE.Expression;
                flags.do_block = false;
                flags.do_while = false;

            }
        }

        function handle_start_block() {
            set_mode(MODE.BlockStatement);

            var empty_braces = is_next('}');
            var empty_anonymous_function = empty_braces && flags.last_word === 'function' &&
                last_type === 'TK_END_EXPR';

            if (opt.brace_style === "expand") {
                if (last_type !== 'TK_OPERATOR' &&
                    (empty_anonymous_function ||
                        last_type === 'TK_EQUALS' ||
                        (last_type === 'TK_RESERVED' && is_special_word(flags.last_text) && flags.last_text !== 'else'))) {
                    output_space_before_token = true;
                } else {
                    print_newline(false, true);
                }
            } else { // collapse
                if (last_type !== 'TK_OPERATOR' && last_type !== 'TK_START_EXPR') {
                    if (last_type === 'TK_START_BLOCK') {
                        print_newline();
                    } else {
                        output_space_before_token = true;
                    }
                } else {
                    // if TK_OPERATOR or TK_START_EXPR
                    if (is_array(previous_flags.mode) && flags.last_text === ',') {
                        if (last_last_text === '}') {
                            // }, { in array context
                            output_space_before_token = true;
                        } else {
                            print_newline(); // [a, b, c, {
                        }
                    }
                }
            }
            print_token();
            indent();
        }

        function handle_end_block() {
            // statements must all be closed when their container closes
            while (flags.mode === MODE.Statement) {
                restore_mode();
            }
            var empty_braces = last_type === 'TK_START_BLOCK';

            if (opt.brace_style === "expand") {
                if (!empty_braces) {
                    print_newline();
                }
            } else {
                // skip {}
                if (!empty_braces) {
                    if (is_array(flags.mode) && opt.keep_array_indentation) {
                        // we REALLY need a newline here, but newliner would skip that
                        opt.keep_array_indentation = false;
                        print_newline();
                        opt.keep_array_indentation = true;

                    } else {
                        print_newline();
                    }
                }
            }
            restore_mode();
            print_token();
        }

        function handle_word() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            } else if (input_wanted_newline && !is_expression(flags.mode) &&
                (last_type !== 'TK_OPERATOR' || (flags.last_text === '--' || flags.last_text === '++')) &&
                last_type !== 'TK_EQUALS' &&
                (opt.preserve_newlines || !(last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const', 'set', 'get'])))) {

                print_newline();
            }

            if (flags.do_block && !flags.do_while) {
                if (token_type === 'TK_RESERVED' && token_text === 'while') {
                    // do {} ## while ()
                    output_space_before_token = true;
                    print_token();
                    output_space_before_token = true;
                    flags.do_while = true;
                    return;
                } else {
                    // do {} should always have while as the next word.
                    // if we don't see the expected while, recover
                    print_newline();
                    flags.do_block = false;
                }
            }

            // if may be followed by else, or not
            // Bare/inline ifs are tricky
            // Need to unwind the modes correctly: if (a) if (b) c(); else d(); else e();
            if (flags.if_block) {
                if (!flags.else_block && (token_type === 'TK_RESERVED' && token_text === 'else')) {
                    flags.else_block = true;
                } else {
                    while (flags.mode === MODE.Statement) {
                        restore_mode();
                    }
                    flags.if_block = false;
                    flags.else_block = false;
                }
            }

            if (token_type === 'TK_RESERVED' && (token_text === 'case' || (token_text === 'default' && flags.in_case_statement))) {
                print_newline();
                if (flags.case_body || opt.jslint_happy) {
                    // switch cases following one another
                    deindent();
                    flags.case_body = false;
                }
                print_token();
                flags.in_case = true;
                flags.in_case_statement = true;
                return;
            }

            if (token_type === 'TK_RESERVED' && token_text === 'function') {
                if (in_array(flags.last_text, ['}', ';']) || (just_added_newline() && ! in_array(flags.last_text, ['[', '{', ':', '=', ',']))) {
                    // make sure there is a nice clean space of at least one blank line
                    // before a new function definition
                    if ( ! just_added_blankline() && ! flags.had_comment) {
                        print_newline();
                        print_newline(true);
                    }
                }
                if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD') {
                    if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['get', 'set', 'new', 'return'])) {
                        output_space_before_token = true;
                    } else {
                        print_newline();
                    }
                } else if (last_type === 'TK_OPERATOR' || flags.last_text === '=') {
                    // foo = function
                    output_space_before_token = true;
                } else if (is_expression(flags.mode)) {
                    // (function
                } else {
                    print_newline();
                }
            }

            if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' || last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                if (!start_of_object_property()) {
                    allow_wrap_or_preserved_newline();
                }
            }

            if (token_type === 'TK_RESERVED' && token_text === 'function') {
                print_token();
                flags.last_word = token_text;
                return;
            }

            prefix = 'NONE';

            if (last_type === 'TK_END_BLOCK') {
                if (!(token_type === 'TK_RESERVED' && in_array(token_text, ['else', 'catch', 'finally']))) {
                    prefix = 'NEWLINE';
                } else {
                    if (opt.brace_style === "expand" || opt.brace_style === "end-expand") {
                        prefix = 'NEWLINE';
                    } else {
                        prefix = 'SPACE';
                        output_space_before_token = true;
                    }
                }
            } else if (last_type === 'TK_SEMICOLON' && flags.mode === MODE.BlockStatement) {
                // TODO: Should this be for STATEMENT as well?
                prefix = 'NEWLINE';
            } else if (last_type === 'TK_SEMICOLON' && is_expression(flags.mode)) {
                prefix = 'SPACE';
            } else if (last_type === 'TK_STRING') {
                prefix = 'NEWLINE';
            } else if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD' ||
                (flags.last_text === '*' && last_last_text === 'function')) {
                prefix = 'SPACE';
            } else if (last_type === 'TK_START_BLOCK') {
                prefix = 'NEWLINE';
            } else if (last_type === 'TK_END_EXPR') {
                output_space_before_token = true;
                prefix = 'NEWLINE';
            }

            if (token_type === 'TK_RESERVED' && in_array(token_text, line_starters) && flags.last_text !== ')') {
                if (flags.last_text === 'else') {
                    prefix = 'SPACE';
                } else {
                    prefix = 'NEWLINE';
                }

            }

            if (token_type === 'TK_RESERVED' && in_array(token_text, ['else', 'catch', 'finally'])) {
                if (last_type !== 'TK_END_BLOCK' || opt.brace_style === "expand" || opt.brace_style === "end-expand") {
                    print_newline();
                } else {
                    trim_output(true);
                    var line = output_lines[output_lines.length - 1];
                    // If we trimmed and there's something other than a close block before us
                    // put a newline back in.  Handles '} // comment' scenario.
                    if (line.text[line.text.length - 1] !== '}') {
                        print_newline();
                    }
                    output_space_before_token = true;
                }
            } else if (prefix === 'NEWLINE') {
                if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
                    // no newline between 'return nnn'
                    output_space_before_token = true;
                } else if (last_type !== 'TK_END_EXPR') {
                    if ((last_type !== 'TK_START_EXPR' || !(token_type === 'TK_RESERVED' && in_array(token_text, ['var', 'let', 'const']))) && flags.last_text !== ':') {
                        // no need to force newline on 'var': for (var x = 0...)
                        if (token_type === 'TK_RESERVED' && token_text === 'if' && flags.last_word === 'else' && flags.last_text !== '{') {
                            // no newline for } else if {
                            output_space_before_token = true;
                        } else {
                            print_newline();
                        }
                    }
                } else if (token_type === 'TK_RESERVED' && in_array(token_text, line_starters) && flags.last_text !== ')') {
                    print_newline();
                }
            } else if (is_array(flags.mode) && flags.last_text === ',' && last_last_text === '}') {
                print_newline(); // }, in lists get a newline treatment
            } else if (prefix === 'SPACE') {
                output_space_before_token = true;
            }
            print_token();
            flags.last_word = token_text;

            if (token_type === 'TK_RESERVED' && token_text === 'do') {
                flags.do_block = true;
            }

            if (token_type === 'TK_RESERVED' && token_text === 'if') {
                flags.if_block = true;
            }
        }

        function handle_semicolon() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
                // Semicolon can be the start (and end) of a statement
                output_space_before_token = false;
            }
            while (flags.mode === MODE.Statement && !flags.if_block && !flags.do_block) {
                restore_mode();
            }
            print_token();
            if (flags.mode === MODE.ObjectLiteral) {
                // if we're in OBJECT mode and see a semicolon, its invalid syntax
                // recover back to treating this as a BLOCK
                flags.mode = MODE.BlockStatement;
            }
        }

        function handle_string() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
                // One difference - strings want at least a space before
                output_space_before_token = true;
            } else if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD') {
                output_space_before_token = true;
            } else if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' || last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                if (!start_of_object_property()) {
                    allow_wrap_or_preserved_newline();
                }
            } else {
                print_newline();
            }
            print_token();
        }

        function handle_equals() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            }

            if (flags.declaration_statement) {
                // just got an '=' in a var-line, different formatting/line-breaking, etc will now be done
                flags.declaration_assignment = true;
            }
            output_space_before_token = true;
            print_token();
            output_space_before_token = true;
        }

        function handle_comma() {
            if (flags.declaration_statement) {
                if (is_expression(flags.parent.mode)) {
                    // do not break on comma, for(var a = 1, b = 2)
                    flags.declaration_assignment = false;
                }

                print_token();

                if (flags.declaration_assignment) {
                    flags.declaration_assignment = false;
                    print_newline(false, true);
                } else {
                    output_space_before_token = true;
                }
                return;
            }

            print_token();
            if (flags.mode === MODE.ObjectLiteral ||
                (flags.mode === MODE.Statement && flags.parent.mode === MODE.ObjectLiteral)) {
                if (flags.mode === MODE.Statement) {
                    restore_mode();
                }
                print_newline();
            } else {
                // EXPR or DO_BLOCK
                output_space_before_token = true;
            }

        }

        function handle_operator() {
            // Check if this is a BlockStatement that should be treated as a ObjectLiteral
            if (token_text === ':' && flags.mode === MODE.BlockStatement &&
                    last_last_text === '{' &&
                    (last_type === 'TK_WORD' || last_type === 'TK_RESERVED')){
                flags.mode = MODE.ObjectLiteral;
            }

            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            }

            var space_before = true;
            var space_after = true;
            if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
                // "return" had a special handling in TK_WORD. Now we need to return the favor
                output_space_before_token = true;
                print_token();
                return;
            }

            // hack for actionscript's import .*;
            if (token_text === '*' && last_type === 'TK_DOT' && !last_last_text.match(/^\d+$/)) {
                print_token();
                return;
            }

            if (token_text === ':' && flags.in_case) {
                flags.case_body = true;
                indent();
                print_token();
                print_newline();
                flags.in_case = false;
                return;
            }

            if (token_text === '::') {
                // no spaces around exotic namespacing syntax operator
                print_token();
                return;
            }

            // http://www.ecma-international.org/ecma-262/5.1/#sec-7.9.1
            // if there is a newline between -- or ++ and anything else we should preserve it.
            if (input_wanted_newline && (token_text === '--' || token_text === '++')) {
                print_newline(false, true);
            }

            // Allow line wrapping between operators
            if (last_type === 'TK_OPERATOR') {
                allow_wrap_or_preserved_newline();
            }

            if (in_array(token_text, ['--', '++', '!', '~']) || (in_array(token_text, ['-', '+']) && (in_array(last_type, ['TK_START_BLOCK', 'TK_START_EXPR', 'TK_EQUALS', 'TK_OPERATOR']) || in_array(flags.last_text, line_starters) || flags.last_text === ','))) {
                // unary operators (and binary +/- pretending to be unary) special cases

                space_before = false;
                space_after = false;

                if (flags.last_text === ';' && is_expression(flags.mode)) {
                    // for (;; ++i)
                    //        ^^^
                    space_before = true;
                }

                if (last_type === 'TK_RESERVED' || last_type === 'TK_END_EXPR') {
                    space_before = true;
                }

                if ((flags.mode === MODE.BlockStatement || flags.mode === MODE.Statement) && (flags.last_text === '{' || flags.last_text === ';')) {
                    // { foo; --i }
                    // foo(); --bar;
                    print_newline();
                }
            } else if (token_text === ':') {
                if (flags.ternary_depth === 0) {
                    if (flags.mode === MODE.BlockStatement) {
                        flags.mode = MODE.ObjectLiteral;
                    }
                    space_before = false;
                } else {
                    flags.ternary_depth -= 1;
                }
            } else if (token_text === '?') {
                flags.ternary_depth += 1;
            } else if (token_text === '*' && last_type === 'TK_RESERVED' && flags.last_text === 'function') {
                space_before = false;
                space_after = false;
            }
            output_space_before_token = output_space_before_token || space_before;
            print_token();
            output_space_before_token = space_after;
        }

        function handle_block_comment() {
            var lines = split_newlines(token_text);
            var j; // iterator for this case
            var javadoc = false;
            var starless = false;
            var lastIndent = whitespace_before_token.join('');
            var lastIndentLength = lastIndent.length;

            // block comment starts with a new line
            print_newline(false, true);
            if (lines.length > 1) {
                if (all_lines_start_with(lines.slice(1), '*')) {
                    javadoc = true;
                }
                else if (each_line_matches_indent(lines.slice(1), lastIndent)) {
                    starless = true;
                }
            }

            // first line always indented
            print_token(lines[0]);
            for (j = 1; j < lines.length; j++) {
                print_newline(false, true);
                if (javadoc) {
                    // javadoc: reformat and re-indent
                    print_token(' ' + trim(lines[j]));
                } else if (starless && lines[j].length > lastIndentLength) {
                    // starless: re-indent non-empty content, avoiding trim
                    print_token(lines[j].substring(lastIndentLength));
                } else {
                    // normal comments output raw
                    output_lines[output_lines.length - 1].text.push(lines[j]);
                }
            }

            // for comments of more than one line, make sure there's a new line after
            print_newline(false, true);
        }

        function handle_inline_comment() {
            output_space_before_token = true;
            print_token();
            output_space_before_token = true;
        }

        function handle_comment() {
            if (input_wanted_newline) {
                print_newline(false, true);
            } else {
                trim_output(true);
            }

            output_space_before_token = true;
            print_token();
            print_newline(false, true);
        }

        function handle_dot() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            }

            if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
                output_space_before_token = true;
            } else {
                // allow preserved newlines before dots in general
                // force newlines on dots after close paren when break_chained - for bar().baz()
                allow_wrap_or_preserved_newline(flags.last_text === ')' && opt.break_chained_methods);
            }

            print_token();
        }

        function handle_unknown() {
            print_token();

            if (token_text[token_text.length - 1] === '\n') {
                print_newline();
            }
        }
    }


    if (typeof define === "function" && define.amd) {
        // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
        define([], function() {
            return { js_beautify: js_beautify };
        });
    } else if (typeof exports !== "undefined") {
        // Add support for CommonJS. Just put this file somewhere on your require.paths
        // and you will be able to `var js_beautify = require("beautify").js_beautify`.
        exports.js_beautify = js_beautify;
    } else if (typeof window !== "undefined") {
        // If we're running a web page and don't have either of the above, add our one global
        window.js_beautify = js_beautify;
    } else if (typeof global !== "undefined") {
        // If we don't even have window, try global.
        global.js_beautify = js_beautify;
    }

}());
/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.


 CSS Beautifier
---------------

    Written by Harutyun Amirjanyan, (amirjanyan@gmail.com)

    Based on code initially developed by: Einar Lielmanis, <einar@jsbeautifier.org>
        http://jsbeautifier.org/

    Usage:
        css_beautify(source_text);
        css_beautify(source_text, options);

    The options are (default in brackets):
        indent_size (4)                   — indentation size,
        indent_char (space)               — character to indent with,
        selector_separator_newline (true) - separate selectors with newline or
                                            not (e.g. "a,\nbr" or "a, br")
        end_with_newline (false)          - end with a newline

    e.g

    css_beautify(css_source_text, {
      'indent_size': 1,
      'indent_char': '\t',
      'selector_separator': ' ',
      'end_with_newline': false,
    });
*/

// http://www.w3.org/TR/CSS21/syndata.html#tokenization
// http://www.w3.org/TR/css3-syntax/

(function () {
    function css_beautify(source_text, options) {
        options = options || {};
        var indentSize = options.indent_size || 4;
        var indentCharacter = options.indent_char || ' ';
        var selectorSeparatorNewline = (options.selector_separator_newline === undefined) ? true : options.selector_separator_newline;
        var endWithNewline = (options.end_with_newline === undefined) ? false : options.end_with_newline;

        // compatibility
        if (typeof indentSize === "string") {
            indentSize = parseInt(indentSize, 10);
        }


        // tokenizer
        var whiteRe = /^\s+$/;
        var wordRe = /[\w$\-_]/;

        var pos = -1,
            ch;

        function next() {
            ch = source_text.charAt(++pos);
            return ch;
        }

        function peek() {
            return source_text.charAt(pos + 1);
        }

        function eatString(endChar) {
            var start = pos;
            while (next()) {
                if (ch === "\\") {
                    next();
                    next();
                } else if (ch === endChar) {
                    break;
                } else if (ch === "\n") {
                    break;
                }
            }
            return source_text.substring(start, pos + 1);
        }

        function eatWhitespace() {
            var start = pos;
            while (whiteRe.test(peek())) {
                pos++;
            }
            return pos !== start;
        }

        function skipWhitespace() {
            var start = pos;
            do {} while (whiteRe.test(next()));
            return pos !== start + 1;
        }

        function eatComment(singleLine) {
            var start = pos;
            next();
            while (next()) {
                if (ch === "*" && peek() === "/") {
                    pos++;
                    break;
                } else if (singleLine && ch === "\n") {
                    break;
                }
            }

            return source_text.substring(start, pos + 1);
        }


        function lookBack(str) {
            return source_text.substring(pos - str.length, pos).toLowerCase() ===
                str;
        }

        function isCommentOnLine() {
            var endOfLine = source_text.indexOf('\n', pos);
            if (endOfLine === -1) {
                return false;
            }
            var restOfLine = source_text.substring(pos, endOfLine);
            return restOfLine.indexOf('//') !== -1;
        }

        // printer
        var indentString = source_text.match(/^[\r\n]*[\t ]*/)[0];
        var singleIndent = new Array(indentSize + 1).join(indentCharacter);
        var indentLevel = 0;
        var nestedLevel = 0;

        function indent() {
            indentLevel++;
            indentString += singleIndent;
        }

        function outdent() {
            indentLevel--;
            indentString = indentString.slice(0, -indentSize);
        }

        var print = {};
        print["{"] = function (ch) {
            print.singleSpace();
            output.push(ch);
            print.newLine();
        };
        print["}"] = function (ch) {
            print.newLine();
            output.push(ch);
            print.newLine();
        };

        print._lastCharWhitespace = function () {
            return whiteRe.test(output[output.length - 1]);
        };

        print.newLine = function (keepWhitespace) {
            if (!keepWhitespace) {
                while (print._lastCharWhitespace()) {
                    output.pop();
                }
            }

            if (output.length) {
                output.push('\n');
            }
            if (indentString) {
                output.push(indentString);
            }
        };
        print.singleSpace = function () {
            if (output.length && !print._lastCharWhitespace()) {
                output.push(' ');
            }
        };
        var output = [];
        if (indentString) {
            output.push(indentString);
        }
        /*_____________________--------------------_____________________*/

        var insideRule = false;
        var enteringConditionalGroup = false;

        while (true) {
            var isAfterSpace = skipWhitespace();

            if (!ch) {
                break;
            } else if (ch === '/' && peek() === '*') { /* css comment */
                print.newLine();
                output.push(eatComment(), "\n", indentString);
                var header = lookBack("");
                if (header) {
                    print.newLine();
                }
            } else if (ch === '/' && peek() === '/') { // single line comment
                output.push(eatComment(true), indentString);
            } else if (ch === '@') {
                // strip trailing space, if present, for hash property checks
                var atRule = eatString(" ").replace(/ $/, '');

                // pass along the space we found as a separate item
                output.push(atRule, ch);

                // might be a nesting at-rule
                if (atRule in css_beautify.NESTED_AT_RULE) {
                    nestedLevel += 1;
                    if (atRule in css_beautify.CONDITIONAL_GROUP_RULE) {
                        enteringConditionalGroup = true;
                    }
                }
            } else if (ch === '{') {
                eatWhitespace();
                if (peek() === '}') {
                    next();
                    output.push(" {}");
                } else {
                    indent();
                    print["{"](ch);
                    // when entering conditional groups, only rulesets are allowed
                    if (enteringConditionalGroup) {
                        enteringConditionalGroup = false;
                        insideRule = (indentLevel > nestedLevel);
                    } else {
                        // otherwise, declarations are also allowed
                        insideRule = (indentLevel >= nestedLevel);
                    }
                }
            } else if (ch === '}') {
                outdent();
                print["}"](ch);
                insideRule = false;
                if (nestedLevel) {
                    nestedLevel--;
                }
            } else if (ch === ":") {
                eatWhitespace();
                if (insideRule || enteringConditionalGroup) {
                    // 'property: value' delimiter
                    // which could be in a conditional group query
                    output.push(ch, " ");
                } else {
                    if (peek() === ":") {
                        // pseudo-element
                        next();
                        output.push("::");
                    } else {
                        // pseudo-class
                        output.push(ch);
                    }
                }
            } else if (ch === '"' || ch === '\'') {
                output.push(eatString(ch));
            } else if (ch === ';') {
                if (isCommentOnLine()) {
                    var beforeComment = eatString('/');
                    var comment = eatComment(true);
                    output.push(beforeComment, comment.substring(1, comment.length - 1), '\n', indentString);
                } else {
                    output.push(ch, '\n', indentString);
                }
            } else if (ch === '(') { // may be a url
                if (lookBack("url")) {
                    output.push(ch);
                    eatWhitespace();
                    if (next()) {
                        if (ch !== ')' && ch !== '"' && ch !== '\'') {
                            output.push(eatString(')'));
                        } else {
                            pos--;
                        }
                    }
                } else {
                    if (isAfterSpace) {
                        print.singleSpace();
                    }
                    output.push(ch);
                    eatWhitespace();
                }
            } else if (ch === ')') {
                output.push(ch);
            } else if (ch === ',') {
                eatWhitespace();
                output.push(ch);
                if (!insideRule && selectorSeparatorNewline) {
                    print.newLine();
                } else {
                    print.singleSpace();
                }
            } else if (ch === ']') {
                output.push(ch);
            } else if (ch === '[') {
                if (isAfterSpace) {
                    print.singleSpace();
                }
                output.push(ch);
            } else if (ch === '=') { // no whitespace before or after
                eatWhitespace();
                output.push(ch);
            } else {
                if (isAfterSpace) {
                    print.singleSpace();
                }

                output.push(ch);
            }
        }


        var sweetCode = output.join('').replace(/[\n ]+$/, '');

        // establish end_with_newline
        var should = endWithNewline;
        var actually = /\n$/.test(sweetCode);
        if (should && !actually) {
            sweetCode += "\n";
        } else if (!should && actually) {
            sweetCode = sweetCode.slice(0, -1);
        }

        return sweetCode;
    }

    // https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
    css_beautify.NESTED_AT_RULE = {
        "@page": true,
        "@font-face": true,
        "@keyframes": true,
        // also in CONDITIONAL_GROUP_RULE below
        "@media": true,
        "@supports": true,
        "@document": true
    };
    css_beautify.CONDITIONAL_GROUP_RULE = {
        "@media": true,
        "@supports": true,
        "@document": true
    };

    /*global define */
    if (typeof define === "function" && define.amd) {
        // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
        define([], function () {
            return { css_beautify: css_beautify };
        });
    } else if (typeof exports !== "undefined") {
        // Add support for CommonJS. Just put this file somewhere on your require.paths
        // and you will be able to `var html_beautify = require("beautify").html_beautify`.
        exports.css_beautify = css_beautify;
    } else if (typeof window !== "undefined") {
        // If we're running a web page and don't have either of the above, add our one global
        window.css_beautify = css_beautify;
    } else if (typeof global !== "undefined") {
        // If we don't even have window, try global.
        global.css_beautify = css_beautify;
    }

}());
/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.


 Style HTML
---------------

  Written by Nochum Sossonko, (nsossonko@hotmail.com)

  Based on code initially developed by: Einar Lielmanis, <einar@jsbeautifier.org>
    http://jsbeautifier.org/

  Usage:
    style_html(html_source);

    style_html(html_source, options);

  The options are:
    indent_inner_html (default false)  — indent <head> and <body> sections,
    indent_size (default 4)          — indentation size,
    indent_char (default space)      — character to indent with,
    wrap_line_length (default 250)            -  maximum amount of characters per line (0 = disable)
    brace_style (default "collapse") - "collapse" | "expand" | "end-expand"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line.
    unformatted (defaults to inline tags) - list of tags, that shouldn't be reformatted
    indent_scripts (default normal)  - "keep"|"separate"|"normal"
    preserve_newlines (default true) - whether existing line breaks before elements should be preserved
                                        Only works before elements, not inside tags or for text.
    max_preserve_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk
    indent_handlebars (default false) - format and indent {{#foo}} and {{/foo}}

    e.g.

    style_html(html_source, {
      'indent_inner_html': false,
      'indent_size': 2,
      'indent_char': ' ',
      'wrap_line_length': 78,
      'brace_style': 'expand',
      'unformatted': ['a', 'sub', 'sup', 'b', 'i', 'u'],
      'preserve_newlines': true,
      'max_preserve_newlines': 5,
      'indent_handlebars': false
    });
*/

(function() {

    function trim(s) {
        return s.replace(/^\s+|\s+$/g, '');
    }

    function ltrim(s) {
        return s.replace(/^\s+/g, '');
    }

    function style_html(html_source, options, js_beautify, css_beautify) {
        //Wrapper function to invoke all the necessary constructors and deal with the output.

        var multi_parser,
            indent_inner_html,
            indent_size,
            indent_character,
            wrap_line_length,
            brace_style,
            unformatted,
            preserve_newlines,
            max_preserve_newlines,
            indent_handlebars;

        options = options || {};

        // backwards compatibility to 1.3.4
        if ((options.wrap_line_length === undefined || parseInt(options.wrap_line_length, 10) === 0) &&
                (options.max_char !== undefined && parseInt(options.max_char, 10) !== 0)) {
            options.wrap_line_length = options.max_char;
        }

        indent_inner_html = (options.indent_inner_html === undefined) ? false : options.indent_inner_html;
        indent_size = (options.indent_size === undefined) ? 4 : parseInt(options.indent_size, 10);
        indent_character = (options.indent_char === undefined) ? ' ' : options.indent_char;
        brace_style = (options.brace_style === undefined) ? 'collapse' : options.brace_style;
        wrap_line_length =  parseInt(options.wrap_line_length, 10) === 0 ? 32786 : parseInt(options.wrap_line_length || 250, 10);
        unformatted = options.unformatted || ['a', 'span', 'bdo', 'em', 'strong', 'dfn', 'code', 'samp', 'kbd', 'var', 'cite', 'abbr', 'acronym', 'q', 'sub', 'sup', 'tt', 'i', 'b', 'big', 'small', 'u', 's', 'strike', 'font', 'ins', 'del', 'pre', 'address', 'dt', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        preserve_newlines = (options.preserve_newlines === undefined) ? true : options.preserve_newlines;
        max_preserve_newlines = preserve_newlines ?
            (isNaN(parseInt(options.max_preserve_newlines, 10)) ? 32786 : parseInt(options.max_preserve_newlines, 10))
            : 0;
        indent_handlebars = (options.indent_handlebars === undefined) ? false : options.indent_handlebars;

        function Parser() {

            this.pos = 0; //Parser position
            this.token = '';
            this.current_mode = 'CONTENT'; //reflects the current Parser mode: TAG/CONTENT
            this.tags = { //An object to hold tags, their position, and their parent-tags, initiated with default values
                parent: 'parent1',
                parentcount: 1,
                parent1: ''
            };
            this.tag_type = '';
            this.token_text = this.last_token = this.last_text = this.token_type = '';
            this.newlines = 0;
            this.indent_content = indent_inner_html;

            this.Utils = { //Uilities made available to the various functions
                whitespace: "\n\r\t ".split(''),
                single_token: 'br,input,link,meta,!doctype,basefont,base,area,hr,wbr,param,img,isindex,?xml,embed,?php,?,?='.split(','), //all the single tags for HTML
                extra_liners: 'head,body,/html'.split(','), //for tags that need a line of whitespace before them
                in_array: function(what, arr) {
                    for (var i = 0; i < arr.length; i++) {
                        if (what === arr[i]) {
                            return true;
                        }
                    }
                    return false;
                }
            };

            this.traverse_whitespace = function() {
                var input_char = '';

                input_char = this.input.charAt(this.pos);
                if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
                    this.newlines = 0;
                    while (this.Utils.in_array(input_char, this.Utils.whitespace)) {
                        if (preserve_newlines && input_char === '\n' && this.newlines <= max_preserve_newlines) {
                            this.newlines += 1;
                        }

                        this.pos++;
                        input_char = this.input.charAt(this.pos);
                    }
                    return true;
                }
                return false;
            };

            this.get_content = function() { //function to capture regular content between tags

                var input_char = '',
                    content = [],
                    space = false; //if a space is needed

                while (this.input.charAt(this.pos) !== '<') {
                    if (this.pos >= this.input.length) {
                        return content.length ? content.join('') : ['', 'TK_EOF'];
                    }

                    if (this.traverse_whitespace()) {
                        if (content.length) {
                            space = true;
                        }
                        continue; //don't want to insert unnecessary space
                    }

                    if (indent_handlebars) {
                        // Handlebars parsing is complicated.
                        // {{#foo}} and {{/foo}} are formatted tags.
                        // {{something}} should get treated as content, except:
                        // {{else}} specifically behaves like {{#if}} and {{/if}}
                        var peek3 = this.input.substr(this.pos, 3);
                        if (peek3 === '{{#' || peek3 === '{{/') {
                            // These are tags and not content.
                            break;
                        } else if (this.input.substr(this.pos, 2) === '{{') {
                            if (this.get_tag(true) === '{{else}}') {
                                break;
                            }
                        }
                    }

                    input_char = this.input.charAt(this.pos);
                    this.pos++;

                    if (space) {
                        if (this.line_char_count >= this.wrap_line_length) { //insert a line when the wrap_line_length is reached
                            this.print_newline(false, content);
                            this.print_indentation(content);
                        } else {
                            this.line_char_count++;
                            content.push(' ');
                        }
                        space = false;
                    }
                    this.line_char_count++;
                    content.push(input_char); //letter at-a-time (or string) inserted to an array
                }
                return content.length ? content.join('') : '';
            };

            this.get_contents_to = function(name) { //get the full content of a script or style to pass to js_beautify
                if (this.pos === this.input.length) {
                    return ['', 'TK_EOF'];
                }
                var input_char = '';
                var content = '';
                var reg_match = new RegExp('</' + name + '\\s*>', 'igm');
                reg_match.lastIndex = this.pos;
                var reg_array = reg_match.exec(this.input);
                var end_script = reg_array ? reg_array.index : this.input.length; //absolute end of script
                if (this.pos < end_script) { //get everything in between the script tags
                    content = this.input.substring(this.pos, end_script);
                    this.pos = end_script;
                }
                return content;
            };

            this.record_tag = function(tag) { //function to record a tag and its parent in this.tags Object
                if (this.tags[tag + 'count']) { //check for the existence of this tag type
                    this.tags[tag + 'count']++;
                    this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
                } else { //otherwise initialize this tag type
                    this.tags[tag + 'count'] = 1;
                    this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
                }
                this.tags[tag + this.tags[tag + 'count'] + 'parent'] = this.tags.parent; //set the parent (i.e. in the case of a div this.tags.div1parent)
                this.tags.parent = tag + this.tags[tag + 'count']; //and make this the current parent (i.e. in the case of a div 'div1')
            };

            this.retrieve_tag = function(tag) { //function to retrieve the opening tag to the corresponding closer
                if (this.tags[tag + 'count']) { //if the openener is not in the Object we ignore it
                    var temp_parent = this.tags.parent; //check to see if it's a closable tag.
                    while (temp_parent) { //till we reach '' (the initial value);
                        if (tag + this.tags[tag + 'count'] === temp_parent) { //if this is it use it
                            break;
                        }
                        temp_parent = this.tags[temp_parent + 'parent']; //otherwise keep on climbing up the DOM Tree
                    }
                    if (temp_parent) { //if we caught something
                        this.indent_level = this.tags[tag + this.tags[tag + 'count']]; //set the indent_level accordingly
                        this.tags.parent = this.tags[temp_parent + 'parent']; //and set the current parent
                    }
                    delete this.tags[tag + this.tags[tag + 'count'] + 'parent']; //delete the closed tags parent reference...
                    delete this.tags[tag + this.tags[tag + 'count']]; //...and the tag itself
                    if (this.tags[tag + 'count'] === 1) {
                        delete this.tags[tag + 'count'];
                    } else {
                        this.tags[tag + 'count']--;
                    }
                }
            };

            this.indent_to_tag = function(tag) {
                // Match the indentation level to the last use of this tag, but don't remove it.
                if (!this.tags[tag + 'count']) {
                    return;
                }
                var temp_parent = this.tags.parent;
                while (temp_parent) {
                    if (tag + this.tags[tag + 'count'] === temp_parent) {
                        break;
                    }
                    temp_parent = this.tags[temp_parent + 'parent'];
                }
                if (temp_parent) {
                    this.indent_level = this.tags[tag + this.tags[tag + 'count']];
                }
            };

            this.get_tag = function(peek) { //function to get a full tag and parse its type
                var input_char = '',
                    content = [],
                    comment = '',
                    space = false,
                    tag_start, tag_end,
                    tag_start_char,
                    orig_pos = this.pos,
                    orig_line_char_count = this.line_char_count;

                peek = peek !== undefined ? peek : false;

                do {
                    if (this.pos >= this.input.length) {
                        if (peek) {
                            this.pos = orig_pos;
                            this.line_char_count = orig_line_char_count;
                        }
                        return content.length ? content.join('') : ['', 'TK_EOF'];
                    }

                    input_char = this.input.charAt(this.pos);
                    this.pos++;

                    if (this.Utils.in_array(input_char, this.Utils.whitespace)) { //don't want to insert unnecessary space
                        space = true;
                        continue;
                    }

                    if (input_char === "'" || input_char === '"') {
                        input_char += this.get_unformatted(input_char);
                        space = true;

                    }

                    if (input_char === '=') { //no space before =
                        space = false;
                    }

                    if (content.length && content[content.length - 1] !== '=' && input_char !== '>' && space) {
                        //no space after = or before >
                        if (this.line_char_count >= this.wrap_line_length) {
                            this.print_newline(false, content);
                            this.print_indentation(content);
                        } else {
                            content.push(' ');
                            this.line_char_count++;
                        }
                        space = false;
                    }

                    if (indent_handlebars && tag_start_char === '<') {
                        // When inside an angle-bracket tag, put spaces around
                        // handlebars not inside of strings.
                        if ((input_char + this.input.charAt(this.pos)) === '{{') {
                            input_char += this.get_unformatted('}}');
                            if (content.length && content[content.length - 1] !== ' ' && content[content.length - 1] !== '<') {
                                input_char = ' ' + input_char;
                            }
                            space = true;
                        }
                    }

                    if (input_char === '<' && !tag_start_char) {
                        tag_start = this.pos - 1;
                        tag_start_char = '<';
                    }

                    if (indent_handlebars && !tag_start_char) {
                        if (content.length >= 2 && content[content.length - 1] === '{' && content[content.length - 2] == '{') {
                            if (input_char === '#' || input_char === '/') {
                                tag_start = this.pos - 3;
                            } else {
                                tag_start = this.pos - 2;
                            }
                            tag_start_char = '{';
                        }
                    }

                    this.line_char_count++;
                    content.push(input_char); //inserts character at-a-time (or string)

                    if (content[1] && content[1] === '!') { //if we're in a comment, do something special
                        // We treat all comments as literals, even more than preformatted tags
                        // we just look for the appropriate close tag
                        content = [this.get_comment(tag_start)];
                        break;
                    }

                    if (indent_handlebars && tag_start_char === '{' && content.length > 2 && content[content.length - 2] === '}' && content[content.length - 1] === '}') {
                        break;
                    }
                } while (input_char !== '>');

                var tag_complete = content.join('');
                var tag_index;
                var tag_offset;

                if (tag_complete.indexOf(' ') !== -1) { //if there's whitespace, thats where the tag name ends
                    tag_index = tag_complete.indexOf(' ');
                } else if (tag_complete[0] === '{') {
                    tag_index = tag_complete.indexOf('}');
                } else { //otherwise go with the tag ending
                    tag_index = tag_complete.indexOf('>');
                }
                if (tag_complete[0] === '<' || !indent_handlebars) {
                    tag_offset = 1;
                } else {
                    tag_offset = tag_complete[2] === '#' ? 3 : 2;
                }
                var tag_check = tag_complete.substring(tag_offset, tag_index).toLowerCase();
                if (tag_complete.charAt(tag_complete.length - 2) === '/' ||
                    this.Utils.in_array(tag_check, this.Utils.single_token)) { //if this tag name is a single tag type (either in the list or has a closing /)
                    if (!peek) {
                        this.tag_type = 'SINGLE';
                    }
                } else if (indent_handlebars && tag_complete[0] === '{' && tag_check === 'else') {
                    if (!peek) {
                        this.indent_to_tag('if');
                        this.tag_type = 'HANDLEBARS_ELSE';
                        this.indent_content = true;
                        this.traverse_whitespace();
                    }
                } else if (this.is_unformatted(tag_check, unformatted)) { // do not reformat the "unformatted" tags
                    comment = this.get_unformatted('</' + tag_check + '>', tag_complete); //...delegate to get_unformatted function
                    content.push(comment);
                    // Preserve collapsed whitespace either before or after this tag.
                    if (tag_start > 0 && this.Utils.in_array(this.input.charAt(tag_start - 1), this.Utils.whitespace)) {
                        content.splice(0, 0, this.input.charAt(tag_start - 1));
                    }
                    tag_end = this.pos - 1;
                    if (this.Utils.in_array(this.input.charAt(tag_end + 1), this.Utils.whitespace)) {
                        content.push(this.input.charAt(tag_end + 1));
                    }
                    this.tag_type = 'SINGLE';
                } else if (tag_check === 'script' &&
                    (tag_complete.search('type') === -1 ||
                    (tag_complete.search('type') > -1 &&
                    tag_complete.search(/\b(text|application)\/(x-)?(javascript|ecmascript|jscript|livescript)/) > -1))) {
                    if (!peek) {
                        this.record_tag(tag_check);
                        this.tag_type = 'SCRIPT';
                    }
                } else if (tag_check === 'style' &&
                    (tag_complete.search('type') === -1 ||
                    (tag_complete.search('type') > -1 && tag_complete.search('text/css') > -1))) {
                    if (!peek) {
                        this.record_tag(tag_check);
                        this.tag_type = 'STYLE';
                    }
                } else if (tag_check.charAt(0) === '!') { //peek for <! comment
                    // for comments content is already correct.
                    if (!peek) {
                        this.tag_type = 'SINGLE';
                        this.traverse_whitespace();
                    }
                } else if (!peek) {
                    if (tag_check.charAt(0) === '/') { //this tag is a double tag so check for tag-ending
                        this.retrieve_tag(tag_check.substring(1)); //remove it and all ancestors
                        this.tag_type = 'END';
                        this.traverse_whitespace();
                    } else { //otherwise it's a start-tag
                        this.record_tag(tag_check); //push it on the tag stack
                        if (tag_check.toLowerCase() !== 'html') {
                            this.indent_content = true;
                        }
                        this.tag_type = 'START';

                        // Allow preserving of newlines after a start tag
                        this.traverse_whitespace();
                    }
                    if (this.Utils.in_array(tag_check, this.Utils.extra_liners)) { //check if this double needs an extra line
                        this.print_newline(false, this.output);
                        if (this.output.length && this.output[this.output.length - 2] !== '\n') {
                            this.print_newline(true, this.output);
                        }
                    }
                }

                if (peek) {
                    this.pos = orig_pos;
                    this.line_char_count = orig_line_char_count;
                }

                return content.join(''); //returns fully formatted tag
            };

            this.get_comment = function(start_pos) { //function to return comment content in its entirety
                // this is will have very poor perf, but will work for now.
                var comment = '',
                    delimiter = '>',
                    matched = false;

                this.pos = start_pos;
                input_char = this.input.charAt(this.pos);
                this.pos++;

                while (this.pos <= this.input.length) {
                    comment += input_char;

                    // only need to check for the delimiter if the last chars match
                    if (comment[comment.length - 1] === delimiter[delimiter.length - 1] &&
                        comment.indexOf(delimiter) !== -1) {
                        break;
                    }

                    // only need to search for custom delimiter for the first few characters
                    if (!matched && comment.length < 10) {
                        if (comment.indexOf('<![if') === 0) { //peek for <![if conditional comment
                            delimiter = '<![endif]>';
                            matched = true;
                        } else if (comment.indexOf('<![cdata[') === 0) { //if it's a <[cdata[ comment...
                            delimiter = ']]>';
                            matched = true;
                        } else if (comment.indexOf('<![') === 0) { // some other ![ comment? ...
                            delimiter = ']>';
                            matched = true;
                        } else if (comment.indexOf('<!--') === 0) { // <!-- comment ...
                            delimiter = '-->';
                            matched = true;
                        }
                    }

                    input_char = this.input.charAt(this.pos);
                    this.pos++;
                }

                return comment;
            };

            this.get_unformatted = function(delimiter, orig_tag) { //function to return unformatted content in its entirety

                if (orig_tag && orig_tag.toLowerCase().indexOf(delimiter) !== -1) {
                    return '';
                }
                var input_char = '';
                var content = '';
                var min_index = 0;
                var space = true;
                do {

                    if (this.pos >= this.input.length) {
                        return content;
                    }

                    input_char = this.input.charAt(this.pos);
                    this.pos++;

                    if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
                        if (!space) {
                            this.line_char_count--;
                            continue;
                        }
                        if (input_char === '\n' || input_char === '\r') {
                            content += '\n';
                            /*  Don't change tab indention for unformatted blocks.  If using code for html editing, this will greatly affect <pre> tags if they are specified in the 'unformatted array'
                for (var i=0; i<this.indent_level; i++) {
                  content += this.indent_string;
                }
                space = false; //...and make sure other indentation is erased
                */
                            this.line_char_count = 0;
                            continue;
                        }
                    }
                    content += input_char;
                    this.line_char_count++;
                    space = true;

                    if (indent_handlebars && input_char === '{' && content.length && content[content.length - 2] === '{') {
                        // Handlebars expressions in strings should also be unformatted.
                        content += this.get_unformatted('}}');
                        // These expressions are opaque.  Ignore delimiters found in them.
                        min_index = content.length;
                    }
                } while (content.toLowerCase().indexOf(delimiter, min_index) === -1);
                return content;
            };

            this.get_token = function() { //initial handler for token-retrieval
                var token;

                if (this.last_token === 'TK_TAG_SCRIPT' || this.last_token === 'TK_TAG_STYLE') { //check if we need to format javascript
                    var type = this.last_token.substr(7);
                    token = this.get_contents_to(type);
                    if (typeof token !== 'string') {
                        return token;
                    }
                    return [token, 'TK_' + type];
                }
                if (this.current_mode === 'CONTENT') {
                    token = this.get_content();
                    if (typeof token !== 'string') {
                        return token;
                    } else {
                        return [token, 'TK_CONTENT'];
                    }
                }

                if (this.current_mode === 'TAG') {
                    token = this.get_tag();
                    if (typeof token !== 'string') {
                        return token;
                    } else {
                        var tag_name_type = 'TK_TAG_' + this.tag_type;
                        return [token, tag_name_type];
                    }
                }
            };

            this.get_full_indent = function(level) {
                level = this.indent_level + level || 0;
                if (level < 1) {
                    return '';
                }

                return Array(level + 1).join(this.indent_string);
            };

            this.is_unformatted = function(tag_check, unformatted) {
                //is this an HTML5 block-level link?
                if (!this.Utils.in_array(tag_check, unformatted)) {
                    return false;
                }

                if (tag_check.toLowerCase() !== 'a' || !this.Utils.in_array('a', unformatted)) {
                    return true;
                }

                //at this point we have an  tag; is its first child something we want to remain
                //unformatted?
                var next_tag = this.get_tag(true /* peek. */ );

                // test next_tag to see if it is just html tag (no external content)
                var tag = (next_tag || "").match(/^\s*<\s*\/?([a-z]*)\s*[^>]*>\s*$/);

                // if next_tag comes back but is not an isolated tag, then
                // let's treat the 'a' tag as having content
                // and respect the unformatted option
                if (!tag || this.Utils.in_array(tag, unformatted)) {
                    return true;
                } else {
                    return false;
                }
            };

            this.printer = function(js_source, indent_character, indent_size, wrap_line_length, brace_style) { //handles input/output and some other printing functions

                this.input = js_source || ''; //gets the input for the Parser
                this.output = [];
                this.indent_character = indent_character;
                this.indent_string = '';
                this.indent_size = indent_size;
                this.brace_style = brace_style;
                this.indent_level = 0;
                this.wrap_line_length = wrap_line_length;
                this.line_char_count = 0; //count to see if wrap_line_length was exceeded

                for (var i = 0; i < this.indent_size; i++) {
                    this.indent_string += this.indent_character;
                }

                this.print_newline = function(force, arr) {
                    this.line_char_count = 0;
                    if (!arr || !arr.length) {
                        return;
                    }
                    if (force || (arr[arr.length - 1] !== '\n')) { //we might want the extra line
                        arr.push('\n');
                    }
                };

                this.print_indentation = function(arr) {
                    for (var i = 0; i < this.indent_level; i++) {
                        arr.push(this.indent_string);
                        this.line_char_count += this.indent_string.length;
                    }
                };

                this.print_token = function(text) {
                    if (text || text !== '') {
                        if (this.output.length && this.output[this.output.length - 1] === '\n') {
                            this.print_indentation(this.output);
                            text = ltrim(text);
                        }
                    }
                    this.print_token_raw(text);
                };

                this.print_token_raw = function(text) {
                    if (text && text !== '') {
                        if (text.length > 1 && text[text.length - 1] === '\n') {
                            // unformatted tags can grab newlines as their last character
                            this.output.push(text.slice(0, -1));
                            this.print_newline(false, this.output);
                        } else {
                            this.output.push(text);
                        }
                    }

                    for (var n = 0; n < this.newlines; n++) {
                        this.print_newline(n > 0, this.output);
                    }
                    this.newlines = 0;
                };

                this.indent = function() {
                    this.indent_level++;
                };

                this.unindent = function() {
                    if (this.indent_level > 0) {
                        this.indent_level--;
                    }
                };
            };
            return this;
        }

        /*_____________________--------------------_____________________*/

        multi_parser = new Parser(); //wrapping functions Parser
        multi_parser.printer(html_source, indent_character, indent_size, wrap_line_length, brace_style); //initialize starting values

        while (true) {
            var t = multi_parser.get_token();
            multi_parser.token_text = t[0];
            multi_parser.token_type = t[1];

            if (multi_parser.token_type === 'TK_EOF') {
                break;
            }

            switch (multi_parser.token_type) {
                case 'TK_TAG_START':
                    multi_parser.print_newline(false, multi_parser.output);
                    multi_parser.print_token(multi_parser.token_text);
                    if (multi_parser.indent_content) {
                        multi_parser.indent();
                        multi_parser.indent_content = false;
                    }
                    multi_parser.current_mode = 'CONTENT';
                    break;
                case 'TK_TAG_STYLE':
                case 'TK_TAG_SCRIPT':
                    multi_parser.print_newline(false, multi_parser.output);
                    multi_parser.print_token(multi_parser.token_text);
                    multi_parser.current_mode = 'CONTENT';
                    break;
                case 'TK_TAG_END':
                    //Print new line only if the tag has no content and has child
                    if (multi_parser.last_token === 'TK_CONTENT' && multi_parser.last_text === '') {
                        var tag_name = multi_parser.token_text.match(/\w+/)[0];
                        var tag_extracted_from_last_output = null;
                        if (multi_parser.output.length) {
                            tag_extracted_from_last_output = multi_parser.output[multi_parser.output.length - 1].match(/(?:<|{{#)\s*(\w+)/);
                        }
                        if (tag_extracted_from_last_output === null ||
                            tag_extracted_from_last_output[1] !== tag_name) {
                            multi_parser.print_newline(false, multi_parser.output);
                        }
                    }
                    multi_parser.print_token(multi_parser.token_text);
                    multi_parser.current_mode = 'CONTENT';
                    break;
                case 'TK_TAG_SINGLE':
                    // Don't add a newline before elements that should remain unformatted.
                    var tag_check = multi_parser.token_text.match(/^\s*<([a-z]+)/i);
                    if (!tag_check || !multi_parser.Utils.in_array(tag_check[1], unformatted)) {
                        multi_parser.print_newline(false, multi_parser.output);
                    }
                    multi_parser.print_token(multi_parser.token_text);
                    multi_parser.current_mode = 'CONTENT';
                    break;
                case 'TK_TAG_HANDLEBARS_ELSE':
                    multi_parser.print_token(multi_parser.token_text);
                    if (multi_parser.indent_content) {
                        multi_parser.indent();
                        multi_parser.indent_content = false;
                    }
                    multi_parser.current_mode = 'CONTENT';
                    break;
                case 'TK_CONTENT':
                    multi_parser.print_token(multi_parser.token_text);
                    multi_parser.current_mode = 'TAG';
                    break;
                case 'TK_STYLE':
                case 'TK_SCRIPT':
                    if (multi_parser.token_text !== '') {
                        multi_parser.print_newline(false, multi_parser.output);
                        var text = multi_parser.token_text,
                            _beautifier,
                            script_indent_level = 1;
                        if (multi_parser.token_type === 'TK_SCRIPT') {
                            _beautifier = typeof js_beautify === 'function' && js_beautify;
                        } else if (multi_parser.token_type === 'TK_STYLE') {
                            _beautifier = typeof css_beautify === 'function' && css_beautify;
                        }

                        if (options.indent_scripts === "keep") {
                            script_indent_level = 0;
                        } else if (options.indent_scripts === "separate") {
                            script_indent_level = -multi_parser.indent_level;
                        }

                        var indentation = multi_parser.get_full_indent(script_indent_level);
                        if (_beautifier) {
                            // call the Beautifier if avaliable
                            text = _beautifier(text.replace(/^\s*/, indentation), options);
                        } else {
                            // simply indent the string otherwise
                            var white = text.match(/^\s*/)[0];
                            var _level = white.match(/[^\n\r]*$/)[0].split(multi_parser.indent_string).length - 1;
                            var reindent = multi_parser.get_full_indent(script_indent_level - _level);
                            text = text.replace(/^\s*/, indentation)
                                .replace(/\r\n|\r|\n/g, '\n' + reindent)
                                .replace(/\s+$/, '');
                        }
                        if (text) {
                            multi_parser.print_token_raw(indentation + trim(text));
                            multi_parser.print_newline(false, multi_parser.output);
                        }
                    }
                    multi_parser.current_mode = 'TAG';
                    break;
            }
            multi_parser.last_token = multi_parser.token_type;
            multi_parser.last_text = multi_parser.token_text;
        }
        return multi_parser.output.join('');
    }

    if (typeof define === "function" && define.amd) {
        // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
        define(["require", "./beautify", "./beautify-css"], function(requireamd) {
            var js_beautify =  requireamd("./beautify");
            var css_beautify =  requireamd("./beautify-css");

            return {
              html_beautify: function(html_source, options) {
                return style_html(html_source, options, js_beautify.js_beautify, css_beautify.css_beautify);
              }
            };
        });
    } else if (typeof exports !== "undefined") {
        // Add support for CommonJS. Just put this file somewhere on your require.paths
        // and you will be able to `var html_beautify = require("beautify").html_beautify`.
        var js_beautify = require('./beautify.js');
        var css_beautify = require('./beautify-css.js');

        exports.html_beautify = function(html_source, options) {
            return style_html(html_source, options, js_beautify.js_beautify, css_beautify.css_beautify);
        };
    } else if (typeof window !== "undefined") {
        // If we're running a web page and don't have either of the above, add our one global
        window.html_beautify = function(html_source, options) {
            return style_html(html_source, options, window.js_beautify, window.css_beautify);
        };
    } else if (typeof global !== "undefined") {
        // If we don't even have window, try global.
        global.html_beautify = function(html_source, options) {
            return style_html(html_source, options, global.js_beautify, global.css_beautify);
        };
    }

}());
/* CodeMirror - Minified & Bundled
   Generated on 9/10/2014 with http://codemirror.net/doc/compress.html
   Version: HEAD

   CodeMirror Library:
   - codemirror.js
   Modes:
   - coffeescript.js
   - css.js
   - haml.js
   - htmlembedded.js
   - htmlmixed.js
   - jade.js
   - javascript.js
   - livescript.js
   - sass.js
   - slim.js
   - xml.js
   Add-ons:
   - active-line.js
   - closebrackets.js
   - css-hint.js
   - dialog.js
   - html-hint.js
   - javascript-hint.js
   - javascript-lint.js
   - lint.js
   - mark-selection.js
   - match-highlighter.js
   - matchbrackets.js
   - matchtags.js
   - overlay.js
   - rulers.js
   - search.js
   - searchcursor.js
   - show-hint.js
   - trailingspace.js
   - xml-hint.js
   - yaml-lint.js
   Keymaps:
   - sublime.js
 */

!function(a){if("object"==typeof exports&&"object"==typeof module)module.exports=a();else{if("function"==typeof define&&define.amd)return define([],a);this.CodeMirror=a()}}(function(){"use strict";function w(a,b){if(!(this instanceof w))return new w(a,b);this.options=b=b||{},Og(ie,b,!1),K(b);var c=b.value;"string"==typeof c&&(c=new Jf(c,b.mode)),this.doc=c;var f=this.display=new x(a,c);f.wrapper.CodeMirror=this,G(this),E(this),b.lineWrapping&&(this.display.wrapper.className+=" CodeMirror-wrap"),b.autofocus&&!o&&ad(this),this.state={keyMaps:[],overlays:[],modeGen:0,overwrite:!1,focused:!1,suppressEdits:!1,pasteIncoming:!1,cutIncoming:!1,draggingText:!1,highlight:new Eg},d&&11>e&&setTimeout(Pg(_c,this,!0),20),dd(this),gh();var g=this;Kc(this,function(){g.curOp.forceUpdate=!0,Nf(g,c),b.autofocus&&!o||_g()==f.input?setTimeout(Pg(Hd,g),20):Id(g);for(var a in je)je.hasOwnProperty(a)&&je[a](g,b[a],le);Q(g);for(var d=0;d<pe.length;++d)pe[d](g)})}function x(a,b){var c=this,g=c.input=Wg("textarea",null,null,"position: absolute; padding: 0; width: 1px; height: 1em; outline: none");f?g.style.width="1000px":g.setAttribute("wrap","off"),n&&(g.style.border="1px solid black"),g.setAttribute("autocorrect","off"),g.setAttribute("autocapitalize","off"),g.setAttribute("spellcheck","false"),c.inputDiv=Wg("div",[g],null,"overflow: hidden; position: relative; width: 3px; height: 0px;"),c.scrollbarH=Wg("div",[Wg("div",null,null,"height: 100%; min-height: 1px")],"CodeMirror-hscrollbar"),c.scrollbarV=Wg("div",[Wg("div",null,null,"min-width: 1px")],"CodeMirror-vscrollbar"),c.scrollbarFiller=Wg("div",null,"CodeMirror-scrollbar-filler"),c.gutterFiller=Wg("div",null,"CodeMirror-gutter-filler"),c.lineDiv=Wg("div",null,"CodeMirror-code"),c.selectionDiv=Wg("div",null,null,"position: relative; z-index: 1"),c.cursorDiv=Wg("div",null,"CodeMirror-cursors"),c.measure=Wg("div",null,"CodeMirror-measure"),c.lineMeasure=Wg("div",null,"CodeMirror-measure"),c.lineSpace=Wg("div",[c.measure,c.lineMeasure,c.selectionDiv,c.cursorDiv,c.lineDiv],null,"position: relative; outline: none"),c.mover=Wg("div",[Wg("div",[c.lineSpace],"CodeMirror-lines")],null,"position: relative"),c.sizer=Wg("div",[c.mover],"CodeMirror-sizer"),c.heightForcer=Wg("div",null,null,"position: absolute; height: "+zg+"px; width: 1px;"),c.gutters=Wg("div",null,"CodeMirror-gutters"),c.lineGutter=null,c.scroller=Wg("div",[c.sizer,c.heightForcer,c.gutters],"CodeMirror-scroll"),c.scroller.setAttribute("tabIndex","-1"),c.wrapper=Wg("div",[c.inputDiv,c.scrollbarH,c.scrollbarV,c.scrollbarFiller,c.gutterFiller,c.scroller],"CodeMirror"),d&&8>e&&(c.gutters.style.zIndex=-1,c.scroller.style.paddingRight=0),n&&(g.style.width="0px"),f||(c.scroller.draggable=!0),k&&(c.inputDiv.style.height="1px",c.inputDiv.style.position="absolute"),d&&8>e&&(c.scrollbarH.style.minHeight=c.scrollbarV.style.minWidth="18px"),a.appendChild?a.appendChild(c.wrapper):a(c.wrapper),c.viewFrom=c.viewTo=b.first,c.view=[],c.externalMeasured=null,c.viewOffset=0,c.lastSizeC=0,c.updateLineNumbers=null,c.lineNumWidth=c.lineNumInnerWidth=c.lineNumChars=null,c.prevInput="",c.alignWidgets=!1,c.pollingFast=!1,c.poll=new Eg,c.cachedCharWidth=c.cachedTextHeight=c.cachedPaddingH=null,c.inaccurateSelection=!1,c.maxLine=null,c.maxLineLength=0,c.maxLineChanged=!1,c.wheelDX=c.wheelDY=c.wheelStartX=c.wheelStartY=null,c.shift=!1,c.selForContextMenu=null}function y(a){a.doc.mode=w.getMode(a.options,a.doc.modeOption),z(a)}function z(a){a.doc.iter(function(a){a.stateAfter&&(a.stateAfter=null),a.styles&&(a.styles=null)}),a.doc.frontier=a.doc.first,Ub(a,100),a.state.modeGen++,a.curOp&&Qc(a)}function A(a){a.options.lineWrapping?(ch(a.display.wrapper,"CodeMirror-wrap"),a.display.sizer.style.minWidth=""):(bh(a.display.wrapper,"CodeMirror-wrap"),J(a)),C(a),Qc(a),lc(a),setTimeout(function(){N(a)},100)}function B(a){var b=xc(a.display),c=a.options.lineWrapping,d=c&&Math.max(5,a.display.scroller.clientWidth/yc(a.display)-3);return function(e){if(df(a.doc,e))return 0;var f=0;if(e.widgets)for(var g=0;g<e.widgets.length;g++)e.widgets[g].height&&(f+=e.widgets[g].height);return c?f+(Math.ceil(e.text.length/d)||1)*b:f+b}}function C(a){var b=a.doc,c=B(a);b.iter(function(a){var b=c(a);b!=a.height&&Rf(a,b)})}function D(a){var b=ue[a.options.keyMap],c=b.style;a.display.wrapper.className=a.display.wrapper.className.replace(/\s*cm-keymap-\S+/g,"")+(c?" cm-keymap-"+c:"")}function E(a){a.display.wrapper.className=a.display.wrapper.className.replace(/\s*cm-s-\S+/g,"")+a.options.theme.replace(/(^|\s)\s*/g," cm-s-"),lc(a)}function F(a){G(a),Qc(a),setTimeout(function(){P(a)},20)}function G(a){var b=a.display.gutters,c=a.options.gutters;Yg(b);for(var d=0;d<c.length;++d){var e=c[d],f=b.appendChild(Wg("div",null,"CodeMirror-gutter "+e));"CodeMirror-linenumbers"==e&&(a.display.lineGutter=f,f.style.width=(a.display.lineNumWidth||1)+"px")}b.style.display=d?"":"none",H(a)}function H(a){var b=a.display.gutters.offsetWidth;a.display.sizer.style.marginLeft=b+"px",a.display.scrollbarH.style.left=a.options.fixedGutter?b+"px":0}function I(a){if(0==a.height)return 0;for(var c,b=a.text.length,d=a;c=Ye(d);){var e=c.find(0,!0);d=e.from.line,b+=e.from.ch-e.to.ch}for(d=a;c=Ze(d);){var e=c.find(0,!0);b-=d.text.length-e.from.ch,d=e.to.line,b+=d.text.length-e.to.ch}return b}function J(a){var b=a.display,c=a.doc;b.maxLine=Of(c,c.first),b.maxLineLength=I(b.maxLine),b.maxLineChanged=!0,c.iter(function(a){var c=I(a);c>b.maxLineLength&&(b.maxLineLength=c,b.maxLine=a)})}function K(a){var b=Lg(a.gutters,"CodeMirror-linenumbers");-1==b&&a.lineNumbers?a.gutters=a.gutters.concat(["CodeMirror-linenumbers"]):b>-1&&!a.lineNumbers&&(a.gutters=a.gutters.slice(0),a.gutters.splice(b,1))}function L(a){return a.display.scroller.clientHeight-a.display.wrapper.clientHeight<zg-3}function M(a){var b=a.display.scroller;return{clientHeight:b.clientHeight,barHeight:a.display.scrollbarV.clientHeight,scrollWidth:b.scrollWidth,clientWidth:b.clientWidth,hScrollbarTakesSpace:L(a),barWidth:a.display.scrollbarH.clientWidth,docHeight:Math.round(a.doc.height+Zb(a.display))}}function N(a,b){b||(b=M(a));var c=a.display,d=kh(c.measure),e=b.docHeight+zg,f=b.scrollWidth>b.clientWidth;f&&b.scrollWidth<=b.clientWidth+1&&d>0&&!b.hScrollbarTakesSpace&&(f=!1);var g=e>b.clientHeight;if(g?(c.scrollbarV.style.display="block",c.scrollbarV.style.bottom=f?d+"px":"0",c.scrollbarV.firstChild.style.height=Math.max(0,e-b.clientHeight+(b.barHeight||c.scrollbarV.clientHeight))+"px"):(c.scrollbarV.style.display="",c.scrollbarV.firstChild.style.height="0"),f?(c.scrollbarH.style.display="block",c.scrollbarH.style.right=g?d+"px":"0",c.scrollbarH.firstChild.style.width=b.scrollWidth-b.clientWidth+(b.barWidth||c.scrollbarH.clientWidth)+"px"):(c.scrollbarH.style.display="",c.scrollbarH.firstChild.style.width="0"),f&&g?(c.scrollbarFiller.style.display="block",c.scrollbarFiller.style.height=c.scrollbarFiller.style.width=d+"px"):c.scrollbarFiller.style.display="",f&&a.options.coverGutterNextToScrollbar&&a.options.fixedGutter?(c.gutterFiller.style.display="block",c.gutterFiller.style.height=d+"px",c.gutterFiller.style.width=c.gutters.offsetWidth+"px"):c.gutterFiller.style.display="",!a.state.checkedOverlayScrollbar&&b.clientHeight>0){if(0===d){var h=p&&!l?"12px":"18px";c.scrollbarV.style.minWidth=c.scrollbarH.style.minHeight=h;var i=function(b){ng(b)!=c.scrollbarV&&ng(b)!=c.scrollbarH&&Lc(a,hd)(b)};pg(c.scrollbarV,"mousedown",i),pg(c.scrollbarH,"mousedown",i)}a.state.checkedOverlayScrollbar=!0}}function O(a,b,c){var d=c&&null!=c.top?Math.max(0,c.top):a.scroller.scrollTop;d=Math.floor(d-Yb(a));var e=c&&null!=c.bottom?c.bottom:d+a.wrapper.clientHeight,f=Tf(b,d),g=Tf(b,e);if(c&&c.ensure){var h=c.ensure.from.line,i=c.ensure.to.line;if(f>h)return{from:h,to:Tf(b,Uf(Of(b,h))+a.wrapper.clientHeight)};if(Math.min(i,b.lastLine())>=g)return{from:Tf(b,Uf(Of(b,i))-a.wrapper.clientHeight),to:i}}return{from:f,to:Math.max(g,f+1)}}function P(a){var b=a.display,c=b.view;if(b.alignWidgets||b.gutters.firstChild&&a.options.fixedGutter){for(var d=S(b)-b.scroller.scrollLeft+a.doc.scrollLeft,e=b.gutters.offsetWidth,f=d+"px",g=0;g<c.length;g++)if(!c[g].hidden){a.options.fixedGutter&&c[g].gutter&&(c[g].gutter.style.left=f);var h=c[g].alignable;if(h)for(var i=0;i<h.length;i++)h[i].style.left=f}a.options.fixedGutter&&(b.gutters.style.left=d+e+"px")}}function Q(a){if(!a.options.lineNumbers)return!1;var b=a.doc,c=R(a.options,b.first+b.size-1),d=a.display;if(c.length!=d.lineNumChars){var e=d.measure.appendChild(Wg("div",[Wg("div",c)],"CodeMirror-linenumber CodeMirror-gutter-elt")),f=e.firstChild.offsetWidth,g=e.offsetWidth-f;return d.lineGutter.style.width="",d.lineNumInnerWidth=Math.max(f,d.lineGutter.offsetWidth-g),d.lineNumWidth=d.lineNumInnerWidth+g,d.lineNumChars=d.lineNumInnerWidth?c.length:-1,d.lineGutter.style.width=d.lineNumWidth+"px",H(a),!0}return!1}function R(a,b){return String(a.lineNumberFormatter(b+a.firstLineNumber))}function S(a){return a.scroller.getBoundingClientRect().left-a.sizer.getBoundingClientRect().left}function T(a,b,c){var d=a.display;this.viewport=b,this.visible=O(d,a.doc,b),this.editorIsHidden=!d.wrapper.offsetWidth,this.wrapperHeight=d.wrapper.clientHeight,this.oldViewFrom=d.viewFrom,this.oldViewTo=d.viewTo,this.oldScrollerWidth=d.scroller.clientWidth,this.force=c,this.dims=_(a)}function U(a,b){var c=a.display,d=a.doc;if(b.editorIsHidden)return Sc(a),!1;if(!b.force&&b.visible.from>=c.viewFrom&&b.visible.to<=c.viewTo&&(null==c.updateLineNumbers||c.updateLineNumbers>=c.viewTo)&&0==Wc(a))return!1;Q(a)&&(Sc(a),b.dims=_(a));var e=d.first+d.size,f=Math.max(b.visible.from-a.options.viewportMargin,d.first),g=Math.min(e,b.visible.to+a.options.viewportMargin);c.viewFrom<f&&f-c.viewFrom<20&&(f=Math.max(d.first,c.viewFrom)),c.viewTo>g&&c.viewTo-g<20&&(g=Math.min(e,c.viewTo)),v&&(f=bf(a.doc,f),g=cf(a.doc,g));var h=f!=c.viewFrom||g!=c.viewTo||c.lastSizeC!=b.wrapperHeight;Vc(a,f,g),c.viewOffset=Uf(Of(a.doc,c.viewFrom)),a.display.mover.style.top=c.viewOffset+"px";var i=Wc(a);if(!h&&0==i&&!b.force&&(null==c.updateLineNumbers||c.updateLineNumbers>=c.viewTo))return!1;var j=_g();return i>4&&(c.lineDiv.style.display="none"),ab(a,c.updateLineNumbers,b.dims),i>4&&(c.lineDiv.style.display=""),j&&_g()!=j&&j.offsetHeight&&j.focus(),Yg(c.cursorDiv),Yg(c.selectionDiv),h&&(c.lastSizeC=b.wrapperHeight,Ub(a,400)),c.updateLineNumbers=null,!0}function V(a,b){for(var c=b.force,d=b.viewport,e=!0;;e=!1){if(e&&a.options.lineWrapping&&b.oldScrollerWidth!=a.display.scroller.clientWidth)c=!0;else if(c=!1,d&&null!=d.top&&(d={top:Math.min(a.doc.height+Zb(a.display)-zg-a.display.scroller.clientHeight,d.top)}),b.visible=O(a.display,a.doc,d),b.visible.from>=a.display.viewFrom&&b.visible.to<=a.display.viewTo)break;if(!U(a,b))break;Z(a);var f=M(a);Qb(a),X(a,f),N(a,f)}tg(a,"update",a),(a.display.viewFrom!=b.oldViewFrom||a.display.viewTo!=b.oldViewTo)&&tg(a,"viewportChange",a,a.display.viewFrom,a.display.viewTo)}function W(a,b){var c=new T(a,b);if(U(a,c)){Z(a),V(a,c);var d=M(a);Qb(a),X(a,d),N(a,d)}}function X(a,b){a.display.sizer.style.minHeight=a.display.heightForcer.style.top=b.docHeight+"px",a.display.gutters.style.height=Math.max(b.docHeight,b.clientHeight-zg)+"px"}function Y(a,b){a.display.sizer.offsetWidth+a.display.gutters.offsetWidth<a.display.scroller.clientWidth-1&&(a.display.sizer.style.minHeight=a.display.heightForcer.style.top="0px",a.display.gutters.style.height=b.docHeight+"px")}function Z(a){for(var b=a.display,c=b.lineDiv.offsetTop,f=0;f<b.view.length;f++){var h,g=b.view[f];if(!g.hidden){if(d&&8>e){var i=g.node.offsetTop+g.node.offsetHeight;h=i-c,c=i}else{var j=g.node.getBoundingClientRect();h=j.bottom-j.top}var k=g.line.height-h;if(2>h&&(h=xc(b)),(k>.001||-.001>k)&&(Rf(g.line,h),$(g.line),g.rest))for(var l=0;l<g.rest.length;l++)$(g.rest[l])}}}function $(a){if(a.widgets)for(var b=0;b<a.widgets.length;++b)a.widgets[b].height=a.widgets[b].node.offsetHeight}function _(a){for(var b=a.display,c={},d={},e=b.gutters.firstChild,f=0;e;e=e.nextSibling,++f)c[a.options.gutters[f]]=e.offsetLeft,d[a.options.gutters[f]]=e.offsetWidth;return{fixedPos:S(b),gutterTotalWidth:b.gutters.offsetWidth,gutterLeft:c,gutterWidth:d,wrapperWidth:b.wrapper.clientWidth}}function ab(a,b,c){function i(b){var c=b.nextSibling;return f&&p&&a.display.currentWheelTarget==b?b.style.display="none":b.parentNode.removeChild(b),c}for(var d=a.display,e=a.options.lineNumbers,g=d.lineDiv,h=g.firstChild,j=d.view,k=d.viewFrom,l=0;l<j.length;l++){var m=j[l];if(m.hidden);else if(m.node){for(;h!=m.node;)h=i(h);var o=e&&null!=b&&k>=b&&m.lineNumber;m.changes&&(Lg(m.changes,"gutter")>-1&&(o=!1),bb(a,m,k,c)),o&&(Yg(m.lineNumber),m.lineNumber.appendChild(document.createTextNode(R(a.options,k)))),h=m.node.nextSibling}else{var n=jb(a,m,k,c);g.insertBefore(n,h)}k+=m.size}for(;h;)h=i(h)}function bb(a,b,c,d){for(var e=0;e<b.changes.length;e++){var f=b.changes[e];"text"==f?fb(a,b):"gutter"==f?hb(a,b,c,d):"class"==f?gb(b):"widget"==f&&ib(b,d)}b.changes=null}function cb(a){return a.node==a.text&&(a.node=Wg("div",null,null,"position: relative"),a.text.parentNode&&a.text.parentNode.replaceChild(a.node,a.text),a.node.appendChild(a.text),d&&8>e&&(a.node.style.zIndex=2)),a.node}function db(a){var b=a.bgClass?a.bgClass+" "+(a.line.bgClass||""):a.line.bgClass;if(b&&(b+=" CodeMirror-linebackground"),a.background)b?a.background.className=b:(a.background.parentNode.removeChild(a.background),a.background=null);else if(b){var c=cb(a);a.background=c.insertBefore(Wg("div",null,b),c.firstChild)}}function eb(a,b){var c=a.display.externalMeasured;return c&&c.line==b.line?(a.display.externalMeasured=null,b.measure=c.measure,c.built):xf(a,b)}function fb(a,b){var c=b.text.className,d=eb(a,b);b.text==b.node&&(b.node=d.pre),b.text.parentNode.replaceChild(d.pre,b.text),b.text=d.pre,d.bgClass!=b.bgClass||d.textClass!=b.textClass?(b.bgClass=d.bgClass,b.textClass=d.textClass,gb(b)):c&&(b.text.className=c)}function gb(a){db(a),a.line.wrapClass?cb(a).className=a.line.wrapClass:a.node!=a.text&&(a.node.className="");var b=a.textClass?a.textClass+" "+(a.line.textClass||""):a.line.textClass;a.text.className=b||""}function hb(a,b,c,d){b.gutter&&(b.node.removeChild(b.gutter),b.gutter=null);var e=b.line.gutterMarkers;if(a.options.lineNumbers||e){var f=cb(b),g=b.gutter=f.insertBefore(Wg("div",null,"CodeMirror-gutter-wrapper","position: absolute; left: "+(a.options.fixedGutter?d.fixedPos:-d.gutterTotalWidth)+"px"),b.text);if(!a.options.lineNumbers||e&&e["CodeMirror-linenumbers"]||(b.lineNumber=g.appendChild(Wg("div",R(a.options,c),"CodeMirror-linenumber CodeMirror-gutter-elt","left: "+d.gutterLeft["CodeMirror-linenumbers"]+"px; width: "+a.display.lineNumInnerWidth+"px"))),e)for(var h=0;h<a.options.gutters.length;++h){var i=a.options.gutters[h],j=e.hasOwnProperty(i)&&e[i];j&&g.appendChild(Wg("div",[j],"CodeMirror-gutter-elt","left: "+d.gutterLeft[i]+"px; width: "+d.gutterWidth[i]+"px"))}}}function ib(a,b){a.alignable&&(a.alignable=null);for(var d,c=a.node.firstChild;c;c=d){var d=c.nextSibling;"CodeMirror-linewidget"==c.className&&a.node.removeChild(c)}kb(a,b)}function jb(a,b,c,d){var e=eb(a,b);return b.text=b.node=e.pre,e.bgClass&&(b.bgClass=e.bgClass),e.textClass&&(b.textClass=e.textClass),gb(b),hb(a,b,c,d),kb(b,d),b.node}function kb(a,b){if(lb(a.line,a,b,!0),a.rest)for(var c=0;c<a.rest.length;c++)lb(a.rest[c],a,b,!1)}function lb(a,b,c,d){if(a.widgets)for(var e=cb(b),f=0,g=a.widgets;f<g.length;++f){var h=g[f],i=Wg("div",[h.node],"CodeMirror-linewidget");h.handleMouseEvents||(i.ignoreEvents=!0),mb(h,i,b,c),d&&h.above?e.insertBefore(i,b.gutter||b.text):e.appendChild(i),tg(h,"redraw")}}function mb(a,b,c,d){if(a.noHScroll){(c.alignable||(c.alignable=[])).push(b);var e=d.wrapperWidth;b.style.left=d.fixedPos+"px",a.coverGutter||(e-=d.gutterTotalWidth,b.style.paddingLeft=d.gutterTotalWidth+"px"),b.style.width=e+"px"}a.coverGutter&&(b.style.zIndex=5,b.style.position="relative",a.noHScroll||(b.style.marginLeft=-d.gutterTotalWidth+"px"))}function pb(a){return nb(a.line,a.ch)}function qb(a,b){return ob(a,b)<0?b:a}function rb(a,b){return ob(a,b)<0?a:b}function sb(a,b){this.ranges=a,this.primIndex=b}function tb(a,b){this.anchor=a,this.head=b}function ub(a,b){var c=a[b];a.sort(function(a,b){return ob(a.from(),b.from())}),b=Lg(a,c);for(var d=1;d<a.length;d++){var e=a[d],f=a[d-1];if(ob(f.to(),e.from())>=0){var g=rb(f.from(),e.from()),h=qb(f.to(),e.to()),i=f.empty()?e.from()==e.head:f.from()==f.head;b>=d&&--b,a.splice(--d,2,new tb(i?h:g,i?g:h))}}return new sb(a,b)}function vb(a,b){return new sb([new tb(a,b||a)],0)}function wb(a,b){return Math.max(a.first,Math.min(b,a.first+a.size-1))}function xb(a,b){if(b.line<a.first)return nb(a.first,0);var c=a.first+a.size-1;return b.line>c?nb(c,Of(a,c).text.length):yb(b,Of(a,b.line).text.length)}function yb(a,b){var c=a.ch;return null==c||c>b?nb(a.line,b):0>c?nb(a.line,0):a}function zb(a,b){return b>=a.first&&b<a.first+a.size}function Ab(a,b){for(var c=[],d=0;d<b.length;d++)c[d]=xb(a,b[d]);return c}function Bb(a,b,c,d){if(a.cm&&a.cm.display.shift||a.extend){var e=b.anchor;if(d){var f=ob(c,e)<0;f!=ob(d,e)<0?(e=c,c=d):f!=ob(c,d)<0&&(c=d)}return new tb(e,c)}return new tb(d||c,c)}function Cb(a,b,c,d){Ib(a,new sb([Bb(a,a.sel.primary(),b,c)],0),d)}function Db(a,b,c){for(var d=[],e=0;e<a.sel.ranges.length;e++)d[e]=Bb(a,a.sel.ranges[e],b[e],null);var f=ub(d,a.sel.primIndex);Ib(a,f,c)}function Eb(a,b,c,d){var e=a.sel.ranges.slice(0);e[b]=c,Ib(a,ub(e,a.sel.primIndex),d)}function Fb(a,b,c,d){Ib(a,vb(b,c),d)}function Gb(a,b){var c={ranges:b.ranges,update:function(b){this.ranges=[];for(var c=0;c<b.length;c++)this.ranges[c]=new tb(xb(a,b[c].anchor),xb(a,b[c].head))}};return rg(a,"beforeSelectionChange",a,c),a.cm&&rg(a.cm,"beforeSelectionChange",a.cm,c),c.ranges!=b.ranges?ub(c.ranges,c.ranges.length-1):b}function Hb(a,b,c){var d=a.history.done,e=Jg(d);e&&e.ranges?(d[d.length-1]=b,Jb(a,b,c)):Ib(a,b,c)}function Ib(a,b,c){Jb(a,b,c),ag(a,a.sel,a.cm?a.cm.curOp.id:0/0,c)}function Jb(a,b,c){(xg(a,"beforeSelectionChange")||a.cm&&xg(a.cm,"beforeSelectionChange"))&&(b=Gb(a,b));var d=c&&c.bias||(ob(b.primary().head,a.sel.primary().head)<0?-1:1);Kb(a,Mb(a,b,d,!0)),c&&c.scroll===!1||!a.cm||be(a.cm)}function Kb(a,b){b.equals(a.sel)||(a.sel=b,a.cm&&(a.cm.curOp.updateInput=a.cm.curOp.selectionChanged=!0,wg(a.cm)),tg(a,"cursorActivity",a))}function Lb(a){Kb(a,Mb(a,a.sel,null,!1),Bg)}function Mb(a,b,c,d){for(var e,f=0;f<b.ranges.length;f++){var g=b.ranges[f],h=Nb(a,g.anchor,c,d),i=Nb(a,g.head,c,d);(e||h!=g.anchor||i!=g.head)&&(e||(e=b.ranges.slice(0,f)),e[f]=new tb(h,i))}return e?ub(e,b.primIndex):b}function Nb(a,b,c,d){var e=!1,f=b,g=c||1;a.cantEdit=!1;a:for(;;){var h=Of(a,f.line);if(h.markedSpans)for(var i=0;i<h.markedSpans.length;++i){var j=h.markedSpans[i],k=j.marker;if((null==j.from||(k.inclusiveLeft?j.from<=f.ch:j.from<f.ch))&&(null==j.to||(k.inclusiveRight?j.to>=f.ch:j.to>f.ch))){if(d&&(rg(k,"beforeCursorEnter"),k.explicitlyCleared)){if(h.markedSpans){--i;continue}break}if(!k.atomic)continue;var l=k.find(0>g?-1:1);if(0==ob(l,f)&&(l.ch+=g,l.ch<0?l=l.line>a.first?xb(a,nb(l.line-1)):null:l.ch>h.text.length&&(l=l.line<a.first+a.size-1?nb(l.line+1,0):null),!l)){if(e)return d?(a.cantEdit=!0,nb(a.first,0)):Nb(a,b,c,!0);e=!0,l=b,g=-g}f=l;continue a}}return f}}function Ob(a){for(var b=a.display,c=a.doc,d={},e=d.cursors=document.createDocumentFragment(),f=d.selection=document.createDocumentFragment(),g=0;g<c.sel.ranges.length;g++){var h=c.sel.ranges[g],i=h.empty();(i||a.options.showCursorWhenSelecting)&&Rb(a,h,e),i||Sb(a,h,f)}if(a.options.moveInputWithCursor){var j=rc(a,c.sel.primary().head,"div"),k=b.wrapper.getBoundingClientRect(),l=b.lineDiv.getBoundingClientRect();d.teTop=Math.max(0,Math.min(b.wrapper.clientHeight-10,j.top+l.top-k.top)),d.teLeft=Math.max(0,Math.min(b.wrapper.clientWidth-10,j.left+l.left-k.left))}return d}function Pb(a,b){Zg(a.display.cursorDiv,b.cursors),Zg(a.display.selectionDiv,b.selection),null!=b.teTop&&(a.display.inputDiv.style.top=b.teTop+"px",a.display.inputDiv.style.left=b.teLeft+"px")}function Qb(a){Pb(a,Ob(a))}function Rb(a,b,c){var d=rc(a,b.head,"div",null,null,!a.options.singleCursorHeightPerLine),e=c.appendChild(Wg("div","\xa0","CodeMirror-cursor"));if(e.style.left=d.left+"px",e.style.top=d.top+"px",e.style.height=Math.max(0,d.bottom-d.top)*a.options.cursorHeight+"px",d.other){var f=c.appendChild(Wg("div","\xa0","CodeMirror-cursor CodeMirror-secondarycursor"));f.style.display="",f.style.left=d.other.left+"px",f.style.top=d.other.top+"px",f.style.height=.85*(d.other.bottom-d.other.top)+"px"}}function Sb(a,b,c){function j(a,b,c,d){0>b&&(b=0),b=Math.round(b),d=Math.round(d),f.appendChild(Wg("div",null,"CodeMirror-selected","position: absolute; left: "+a+"px; top: "+b+"px; width: "+(null==c?i-a:c)+"px; height: "+(d-b)+"px"))}function k(b,c,d){function m(c,d){return qc(a,nb(b,c),"div",f,d)}var k,l,f=Of(e,b),g=f.text.length;return vh(Vf(f),c||0,null==d?g:d,function(a,b,e){var n,o,p,f=m(a,"left");if(a==b)n=f,o=p=f.left;else{if(n=m(b-1,"right"),"rtl"==e){var q=f;f=n,n=q}o=f.left,p=n.right}null==c&&0==a&&(o=h),n.top-f.top>3&&(j(o,f.top,null,f.bottom),o=h,f.bottom<n.top&&j(o,f.bottom,null,n.top)),null==d&&b==g&&(p=i),(!k||f.top<k.top||f.top==k.top&&f.left<k.left)&&(k=f),(!l||n.bottom>l.bottom||n.bottom==l.bottom&&n.right>l.right)&&(l=n),h+1>o&&(o=h),j(o,n.top,p-o,n.bottom)}),{start:k,end:l}}var d=a.display,e=a.doc,f=document.createDocumentFragment(),g=$b(a.display),h=g.left,i=d.lineSpace.offsetWidth-g.right,l=b.from(),m=b.to();if(l.line==m.line)k(l.line,l.ch,m.ch);else{var n=Of(e,l.line),o=Of(e,m.line),p=_e(n)==_e(o),q=k(l.line,l.ch,p?n.text.length+1:null).end,r=k(m.line,p?0:null,m.ch).start;p&&(q.top<r.top-2?(j(q.right,q.top,null,q.bottom),j(h,r.top,r.left,r.bottom)):j(q.right,q.top,r.left-q.right,q.bottom)),q.bottom<r.top&&j(h,q.bottom,null,r.top)}c.appendChild(f)}function Tb(a){if(a.state.focused){var b=a.display;clearInterval(b.blinker);var c=!0;b.cursorDiv.style.visibility="",a.options.cursorBlinkRate>0?b.blinker=setInterval(function(){b.cursorDiv.style.visibility=(c=!c)?"":"hidden"},a.options.cursorBlinkRate):a.options.cursorBlinkRate<0&&(b.cursorDiv.style.visibility="hidden")}}function Ub(a,b){a.doc.mode.startState&&a.doc.frontier<a.display.viewTo&&a.state.highlight.set(b,Pg(Vb,a))}function Vb(a){var b=a.doc;if(b.frontier<b.first&&(b.frontier=b.first),!(b.frontier>=a.display.viewTo)){var c=+new Date+a.options.workTime,d=re(b.mode,Xb(a,b.frontier)),e=[];b.iter(b.frontier,Math.min(b.first+b.size,a.display.viewTo+500),function(f){if(b.frontier>=a.display.viewFrom){var g=f.styles,h=rf(a,f,d,!0);f.styles=h.styles;var i=f.styleClasses,j=h.classes;j?f.styleClasses=j:i&&(f.styleClasses=null);for(var k=!g||g.length!=f.styles.length||i!=j&&(!i||!j||i.bgClass!=j.bgClass||i.textClass!=j.textClass),l=0;!k&&l<g.length;++l)k=g[l]!=f.styles[l];k&&e.push(b.frontier),f.stateAfter=re(b.mode,d)}else tf(a,f.text,d),f.stateAfter=0==b.frontier%5?re(b.mode,d):null;return++b.frontier,+new Date>c?(Ub(a,a.options.workDelay),!0):void 0}),e.length&&Kc(a,function(){for(var b=0;b<e.length;b++)Rc(a,e[b],"text")})}}function Wb(a,b,c){for(var d,e,f=a.doc,g=c?-1:b-(a.doc.mode.innerMode?1e3:100),h=b;h>g;--h){if(h<=f.first)return f.first;var i=Of(f,h-1);if(i.stateAfter&&(!c||h<=f.frontier))return h;var j=Fg(i.text,null,a.options.tabSize);(null==e||d>j)&&(e=h-1,d=j)}return e}function Xb(a,b,c){var d=a.doc,e=a.display;if(!d.mode.startState)return!0;var f=Wb(a,b,c),g=f>d.first&&Of(d,f-1).stateAfter;return g=g?re(d.mode,g):se(d.mode),d.iter(f,b,function(c){tf(a,c.text,g);var h=f==b-1||0==f%5||f>=e.viewFrom&&f<e.viewTo;c.stateAfter=h?re(d.mode,g):null,++f}),c&&(d.frontier=f),g}function Yb(a){return a.lineSpace.offsetTop}function Zb(a){return a.mover.offsetHeight-a.lineSpace.offsetHeight}function $b(a){if(a.cachedPaddingH)return a.cachedPaddingH;var b=Zg(a.measure,Wg("pre","x")),c=window.getComputedStyle?window.getComputedStyle(b):b.currentStyle,d={left:parseInt(c.paddingLeft),right:parseInt(c.paddingRight)};return isNaN(d.left)||isNaN(d.right)||(a.cachedPaddingH=d),d}function _b(a,b,c){var d=a.options.lineWrapping,e=d&&a.display.scroller.clientWidth;if(!b.measure.heights||d&&b.measure.width!=e){var f=b.measure.heights=[];if(d){b.measure.width=e;for(var g=b.text.firstChild.getClientRects(),h=0;h<g.length-1;h++){var i=g[h],j=g[h+1];Math.abs(i.bottom-j.bottom)>2&&f.push((i.bottom+j.top)/2-c.top)}}f.push(c.bottom-c.top)}}function ac(a,b,c){if(a.line==b)return{map:a.measure.map,cache:a.measure.cache};for(var d=0;d<a.rest.length;d++)if(a.rest[d]==b)return{map:a.measure.maps[d],cache:a.measure.caches[d]};for(var d=0;d<a.rest.length;d++)if(Sf(a.rest[d])>c)return{map:a.measure.maps[d],cache:a.measure.caches[d],before:!0}}function bc(a,b){b=_e(b);var c=Sf(b),d=a.display.externalMeasured=new Oc(a.doc,b,c);d.lineN=c;var e=d.built=xf(a,d);return d.text=e.pre,Zg(a.display.lineMeasure,e.pre),d}function cc(a,b,c,d){return fc(a,ec(a,b),c,d)}function dc(a,b){if(b>=a.display.viewFrom&&b<a.display.viewTo)return a.display.view[Tc(a,b)];var c=a.display.externalMeasured;return c&&b>=c.lineN&&b<c.lineN+c.size?c:void 0}function ec(a,b){var c=Sf(b),d=dc(a,c);d&&!d.text?d=null:d&&d.changes&&bb(a,d,c,_(a)),d||(d=bc(a,b));var e=ac(d,b,c);return{line:b,view:d,rect:null,map:e.map,cache:e.cache,before:e.before,hasHeights:!1}}function fc(a,b,c,d,e){b.before&&(c=-1);var g,f=c+(d||"");return b.cache.hasOwnProperty(f)?g=b.cache[f]:(b.rect||(b.rect=b.view.text.getBoundingClientRect()),b.hasHeights||(_b(a,b.view,b.rect),b.hasHeights=!0),g=hc(a,b,c,d),g.bogus||(b.cache[f]=g)),{left:g.left,right:g.right,top:e?g.rtop:g.top,bottom:e?g.rbottom:g.bottom}}function hc(a,b,c,f){for(var h,i,j,k,g=b.map,l=0;l<g.length;l+=3){var m=g[l],n=g[l+1];if(m>c?(i=0,j=1,k="left"):n>c?(i=c-m,j=i+1):(l==g.length-3||c==n&&g[l+3]>c)&&(j=n-m,i=j-1,c>=n&&(k="right")),null!=i){if(h=g[l+2],m==n&&f==(h.insertLeft?"left":"right")&&(k=f),"left"==f&&0==i)for(;l&&g[l-2]==g[l-3]&&g[l-1].insertLeft;)h=g[(l-=3)+2],k="left";if("right"==f&&i==n-m)for(;l<g.length-3&&g[l+3]==g[l+4]&&!g[l+5].insertLeft;)h=g[(l+=3)+2],k="right";break}}var o;if(3==h.nodeType){for(var l=0;4>l;l++){for(;i&&Vg(b.line.text.charAt(m+i));)--i;for(;n>m+j&&Vg(b.line.text.charAt(m+j));)++j;if(d&&9>e&&0==i&&j==n-m)o=h.parentNode.getBoundingClientRect();else if(d&&a.options.lineWrapping){var p=Xg(h,i,j).getClientRects();o=p.length?p["right"==f?p.length-1:0]:gc}else o=Xg(h,i,j).getBoundingClientRect()||gc;if(o.left||o.right||0==i)break;j=i,i-=1,k="right"}d&&11>e&&(o=ic(a.display.measure,o))}else{i>0&&(k=f="right");var p;o=a.options.lineWrapping&&(p=h.getClientRects()).length>1?p["right"==f?p.length-1:0]:h.getBoundingClientRect()}if(d&&9>e&&!i&&(!o||!o.left&&!o.right)){var q=h.parentNode.getClientRects()[0];o=q?{left:q.left,right:q.left+yc(a.display),top:q.top,bottom:q.bottom}:gc}for(var r=o.top-b.rect.top,s=o.bottom-b.rect.top,t=(r+s)/2,u=b.view.measure.heights,l=0;l<u.length-1&&!(t<u[l]);l++);var v=l?u[l-1]:0,w=u[l],x={left:("right"==k?o.right:o.left)-b.rect.left,right:("left"==k?o.left:o.right)-b.rect.left,top:v,bottom:w};return o.left||o.right||(x.bogus=!0),a.options.singleCursorHeightPerLine||(x.rtop=r,x.rbottom=s),x}function ic(a,b){if(!window.screen||null==screen.logicalXDPI||screen.logicalXDPI==screen.deviceXDPI||!th(a))return b;var c=screen.logicalXDPI/screen.deviceXDPI,d=screen.logicalYDPI/screen.deviceYDPI;return{left:b.left*c,right:b.right*c,top:b.top*d,bottom:b.bottom*d}}function jc(a){if(a.measure&&(a.measure.cache={},a.measure.heights=null,a.rest))for(var b=0;b<a.rest.length;b++)a.measure.caches[b]={}}function kc(a){a.display.externalMeasure=null,Yg(a.display.lineMeasure);for(var b=0;b<a.display.view.length;b++)jc(a.display.view[b])}function lc(a){kc(a),a.display.cachedCharWidth=a.display.cachedTextHeight=a.display.cachedPaddingH=null,a.options.lineWrapping||(a.display.maxLineChanged=!0),a.display.lineNumChars=null}function mc(){return window.pageXOffset||(document.documentElement||document.body).scrollLeft}function nc(){return window.pageYOffset||(document.documentElement||document.body).scrollTop}function oc(a,b,c,d){if(b.widgets)for(var e=0;e<b.widgets.length;++e)if(b.widgets[e].above){var f=hf(b.widgets[e]);c.top+=f,c.bottom+=f}if("line"==d)return c;d||(d="local");var g=Uf(b);if("local"==d?g+=Yb(a.display):g-=a.display.viewOffset,"page"==d||"window"==d){var h=a.display.lineSpace.getBoundingClientRect();g+=h.top+("window"==d?0:nc());var i=h.left+("window"==d?0:mc());c.left+=i,c.right+=i}return c.top+=g,c.bottom+=g,c}function pc(a,b,c){if("div"==c)return b;var d=b.left,e=b.top;if("page"==c)d-=mc(),e-=nc();else if("local"==c||!c){var f=a.display.sizer.getBoundingClientRect();d+=f.left,e+=f.top}var g=a.display.lineSpace.getBoundingClientRect();return{left:d-g.left,top:e-g.top}}function qc(a,b,c,d,e){return d||(d=Of(a.doc,b.line)),oc(a,d,cc(a,d,b.ch,e),c)}function rc(a,b,c,d,e,f){function g(b,g){var h=fc(a,e,b,g?"right":"left",f);return g?h.left=h.right:h.right=h.left,oc(a,d,h,c)}function h(a,b){var c=i[b],d=c.level%2;return a==wh(c)&&b&&c.level<i[b-1].level?(c=i[--b],a=xh(c)-(c.level%2?0:1),d=!0):a==xh(c)&&b<i.length-1&&c.level<i[b+1].level&&(c=i[++b],a=wh(c)-c.level%2,d=!1),d&&a==c.to&&a>c.from?g(a-1):g(a,d)}d=d||Of(a.doc,b.line),e||(e=ec(a,d));var i=Vf(d),j=b.ch;if(!i)return g(j);var k=Fh(i,j),l=h(j,k);return null!=Eh&&(l.other=h(j,Eh)),l}function sc(a,b){var c=0,b=xb(a.doc,b);a.options.lineWrapping||(c=yc(a.display)*b.ch);var d=Of(a.doc,b.line),e=Uf(d)+Yb(a.display);return{left:c,right:c,top:e,bottom:e+d.height}}function tc(a,b,c,d){var e=nb(a,b);return e.xRel=d,c&&(e.outside=!0),e}function uc(a,b,c){var d=a.doc;if(c+=a.display.viewOffset,0>c)return tc(d.first,0,!0,-1);var e=Tf(d,c),f=d.first+d.size-1;if(e>f)return tc(d.first+d.size-1,Of(d,f).text.length,!0,1);0>b&&(b=0);for(var g=Of(d,e);;){var h=vc(a,g,e,b,c),i=Ze(g),j=i&&i.find(0,!0);if(!i||!(h.ch>j.from.ch||h.ch==j.from.ch&&h.xRel>0))return h;e=Sf(g=j.to.line)}}function vc(a,b,c,d,e){function j(d){var e=rc(a,nb(c,d),"line",b,i);return g=!0,f>e.bottom?e.left-h:f<e.top?e.left+h:(g=!1,e.left)}var f=e-Uf(b),g=!1,h=2*a.display.wrapper.clientWidth,i=ec(a,b),k=Vf(b),l=b.text.length,m=yh(b),n=zh(b),o=j(m),p=g,q=j(n),r=g;if(d>q)return tc(c,n,r,1);for(;;){if(k?n==m||n==Hh(b,m,1):1>=n-m){for(var s=o>d||q-d>=d-o?m:n,t=d-(s==m?o:q);Vg(b.text.charAt(s));)++s;var u=tc(c,s,s==m?p:r,-1>t?-1:t>1?1:0);return u}var v=Math.ceil(l/2),w=m+v;if(k){w=m;for(var x=0;v>x;++x)w=Hh(b,w,1)}var y=j(w);y>d?(n=w,q=y,(r=g)&&(q+=1e3),l=v):(m=w,o=y,p=g,l-=v)}}function xc(a){if(null!=a.cachedTextHeight)return a.cachedTextHeight;if(null==wc){wc=Wg("pre");for(var b=0;49>b;++b)wc.appendChild(document.createTextNode("x")),wc.appendChild(Wg("br"));wc.appendChild(document.createTextNode("x"))}Zg(a.measure,wc);var c=wc.offsetHeight/50;return c>3&&(a.cachedTextHeight=c),Yg(a.measure),c||1}function yc(a){if(null!=a.cachedCharWidth)return a.cachedCharWidth;var b=Wg("span","xxxxxxxxxx"),c=Wg("pre",[b]);Zg(a.measure,c);var d=b.getBoundingClientRect(),e=(d.right-d.left)/10;return e>2&&(a.cachedCharWidth=e),e||10}function Bc(a){a.curOp={cm:a,viewChanged:!1,startHeight:a.doc.height,forceUpdate:!1,updateInput:null,typing:!1,changeObjs:null,cursorActivityHandlers:null,cursorActivityCalled:0,selectionChanged:!1,updateMaxLine:!1,scrollLeft:null,scrollTop:null,scrollToPos:null,id:++Ac},zc?zc.ops.push(a.curOp):a.curOp.ownsGroup=zc={ops:[a.curOp],delayedCallbacks:[]}}function Cc(a){var b=a.delayedCallbacks,c=0;do{for(;c<b.length;c++)b[c]();for(var d=0;d<a.ops.length;d++){var e=a.ops[d];if(e.cursorActivityHandlers)for(;e.cursorActivityCalled<e.cursorActivityHandlers.length;)e.cursorActivityHandlers[e.cursorActivityCalled++](e.cm)}}while(c<b.length)}function Dc(a){var b=a.curOp,c=b.ownsGroup;if(c)try{Cc(c)}finally{zc=null;for(var d=0;d<c.ops.length;d++)c.ops[d].cm.curOp=null;Ec(c)}}function Ec(a){for(var b=a.ops,c=0;c<b.length;c++)Fc(b[c]);for(var c=0;c<b.length;c++)Gc(b[c]);for(var c=0;c<b.length;c++)Hc(b[c]);for(var c=0;c<b.length;c++)Ic(b[c]);for(var c=0;c<b.length;c++)Jc(b[c])}function Fc(a){var b=a.cm,c=b.display;
a.updateMaxLine&&J(b),a.mustUpdate=a.viewChanged||a.forceUpdate||null!=a.scrollTop||a.scrollToPos&&(a.scrollToPos.from.line<c.viewFrom||a.scrollToPos.to.line>=c.viewTo)||c.maxLineChanged&&b.options.lineWrapping,a.update=a.mustUpdate&&new T(b,a.mustUpdate&&{top:a.scrollTop,ensure:a.scrollToPos},a.forceUpdate)}function Gc(a){a.updatedDisplay=a.mustUpdate&&U(a.cm,a.update)}function Hc(a){var b=a.cm,c=b.display;a.updatedDisplay&&Z(b),a.barMeasure=M(b),c.maxLineChanged&&!b.options.lineWrapping&&(a.adjustWidthTo=cc(b,c.maxLine,c.maxLine.text.length).left+3,a.maxScrollLeft=Math.max(0,c.sizer.offsetLeft+a.adjustWidthTo+zg-c.scroller.clientWidth)),(a.updatedDisplay||a.selectionChanged)&&(a.newSelectionNodes=Ob(b))}function Ic(a){var b=a.cm;null!=a.adjustWidthTo&&(b.display.sizer.style.minWidth=a.adjustWidthTo+"px",a.maxScrollLeft<b.doc.scrollLeft&&td(b,Math.min(b.display.scroller.scrollLeft,a.maxScrollLeft),!0),b.display.maxLineChanged=!1),a.newSelectionNodes&&Pb(b,a.newSelectionNodes),a.updatedDisplay&&X(b,a.barMeasure),(a.updatedDisplay||a.startHeight!=b.doc.height)&&N(b,a.barMeasure),a.selectionChanged&&Tb(b),b.state.focused&&a.updateInput&&_c(b,a.typing)}function Jc(a){var b=a.cm,c=b.display,d=b.doc;if(null!=a.adjustWidthTo&&Math.abs(a.barMeasure.scrollWidth-b.display.scroller.scrollWidth)>1&&N(b),a.updatedDisplay&&V(b,a.update),null==c.wheelStartX||null==a.scrollTop&&null==a.scrollLeft&&!a.scrollToPos||(c.wheelStartX=c.wheelStartY=null),null!=a.scrollTop&&(c.scroller.scrollTop!=a.scrollTop||a.forceScroll)){var e=Math.max(0,Math.min(c.scroller.scrollHeight-c.scroller.clientHeight,a.scrollTop));c.scroller.scrollTop=c.scrollbarV.scrollTop=d.scrollTop=e}if(null!=a.scrollLeft&&(c.scroller.scrollLeft!=a.scrollLeft||a.forceScroll)){var g=Math.max(0,Math.min(c.scroller.scrollWidth-c.scroller.clientWidth,a.scrollLeft));c.scroller.scrollLeft=c.scrollbarH.scrollLeft=d.scrollLeft=g,P(b)}if(a.scrollToPos){var h=Zd(b,xb(d,a.scrollToPos.from),xb(d,a.scrollToPos.to),a.scrollToPos.margin);a.scrollToPos.isCursor&&b.state.focused&&Yd(b,h)}var i=a.maybeHiddenMarkers,j=a.maybeUnhiddenMarkers;if(i)for(var k=0;k<i.length;++k)i[k].lines.length||rg(i[k],"hide");if(j)for(var k=0;k<j.length;++k)j[k].lines.length&&rg(j[k],"unhide");c.wrapper.offsetHeight&&(d.scrollTop=b.display.scroller.scrollTop),a.updatedDisplay&&f&&(b.options.lineWrapping&&Y(b,a.barMeasure),a.barMeasure.scrollWidth>a.barMeasure.clientWidth&&a.barMeasure.scrollWidth<a.barMeasure.clientWidth+1&&!L(b)&&N(b)),a.changeObjs&&rg(b,"changes",b,a.changeObjs)}function Kc(a,b){if(a.curOp)return b();Bc(a);try{return b()}finally{Dc(a)}}function Lc(a,b){return function(){if(a.curOp)return b.apply(a,arguments);Bc(a);try{return b.apply(a,arguments)}finally{Dc(a)}}}function Mc(a){return function(){if(this.curOp)return a.apply(this,arguments);Bc(this);try{return a.apply(this,arguments)}finally{Dc(this)}}}function Nc(a){return function(){var b=this.cm;if(!b||b.curOp)return a.apply(this,arguments);Bc(b);try{return a.apply(this,arguments)}finally{Dc(b)}}}function Oc(a,b,c){this.line=b,this.rest=af(b),this.size=this.rest?Sf(Jg(this.rest))-c+1:1,this.node=this.text=null,this.hidden=df(a,b)}function Pc(a,b,c){for(var e,d=[],f=b;c>f;f=e){var g=new Oc(a.doc,Of(a.doc,f),f);e=f+g.size,d.push(g)}return d}function Qc(a,b,c,d){null==b&&(b=a.doc.first),null==c&&(c=a.doc.first+a.doc.size),d||(d=0);var e=a.display;if(d&&c<e.viewTo&&(null==e.updateLineNumbers||e.updateLineNumbers>b)&&(e.updateLineNumbers=b),a.curOp.viewChanged=!0,b>=e.viewTo)v&&bf(a.doc,b)<e.viewTo&&Sc(a);else if(c<=e.viewFrom)v&&cf(a.doc,c+d)>e.viewFrom?Sc(a):(e.viewFrom+=d,e.viewTo+=d);else if(b<=e.viewFrom&&c>=e.viewTo)Sc(a);else if(b<=e.viewFrom){var f=Uc(a,c,c+d,1);f?(e.view=e.view.slice(f.index),e.viewFrom=f.lineN,e.viewTo+=d):Sc(a)}else if(c>=e.viewTo){var f=Uc(a,b,b,-1);f?(e.view=e.view.slice(0,f.index),e.viewTo=f.lineN):Sc(a)}else{var g=Uc(a,b,b,-1),h=Uc(a,c,c+d,1);g&&h?(e.view=e.view.slice(0,g.index).concat(Pc(a,g.lineN,h.lineN)).concat(e.view.slice(h.index)),e.viewTo+=d):Sc(a)}var i=e.externalMeasured;i&&(c<i.lineN?i.lineN+=d:b<i.lineN+i.size&&(e.externalMeasured=null))}function Rc(a,b,c){a.curOp.viewChanged=!0;var d=a.display,e=a.display.externalMeasured;if(e&&b>=e.lineN&&b<e.lineN+e.size&&(d.externalMeasured=null),!(b<d.viewFrom||b>=d.viewTo)){var f=d.view[Tc(a,b)];if(null!=f.node){var g=f.changes||(f.changes=[]);-1==Lg(g,c)&&g.push(c)}}}function Sc(a){a.display.viewFrom=a.display.viewTo=a.doc.first,a.display.view=[],a.display.viewOffset=0}function Tc(a,b){if(b>=a.display.viewTo)return null;if(b-=a.display.viewFrom,0>b)return null;for(var c=a.display.view,d=0;d<c.length;d++)if(b-=c[d].size,0>b)return d}function Uc(a,b,c,d){var f,e=Tc(a,b),g=a.display.view;if(!v||c==a.doc.first+a.doc.size)return{index:e,lineN:c};for(var h=0,i=a.display.viewFrom;e>h;h++)i+=g[h].size;if(i!=b){if(d>0){if(e==g.length-1)return null;f=i+g[e].size-b,e++}else f=i-b;b+=f,c+=f}for(;bf(a.doc,c)!=c;){if(e==(0>d?0:g.length-1))return null;c+=d*g[e-(0>d?1:0)].size,e+=d}return{index:e,lineN:c}}function Vc(a,b,c){var d=a.display,e=d.view;0==e.length||b>=d.viewTo||c<=d.viewFrom?(d.view=Pc(a,b,c),d.viewFrom=b):(d.viewFrom>b?d.view=Pc(a,b,d.viewFrom).concat(d.view):d.viewFrom<b&&(d.view=d.view.slice(Tc(a,b))),d.viewFrom=b,d.viewTo<c?d.view=d.view.concat(Pc(a,d.viewTo,c)):d.viewTo>c&&(d.view=d.view.slice(0,Tc(a,c)))),d.viewTo=c}function Wc(a){for(var b=a.display.view,c=0,d=0;d<b.length;d++){var e=b[d];e.hidden||e.node&&!e.changes||++c}return c}function Xc(a){a.display.pollingFast||a.display.poll.set(a.options.pollInterval,function(){$c(a),a.state.focused&&Xc(a)})}function Yc(a){function c(){var d=$c(a);d||b?(a.display.pollingFast=!1,Xc(a)):(b=!0,a.display.poll.set(60,c))}var b=!1;a.display.pollingFast=!0,a.display.poll.set(20,c)}function $c(a){var b=a.display.input,c=a.display.prevInput,f=a.doc;if(!a.state.focused||qh(b)&&!c||cd(a)||a.options.disableInput)return!1;a.state.pasteIncoming&&a.state.fakedLastChar&&(b.value=b.value.substring(0,b.value.length-1),a.state.fakedLastChar=!1);var g=b.value;if(g==c&&!a.somethingSelected())return!1;if(d&&e>=9&&a.display.inputHasSelection===g||p&&/[\uf700-\uf7ff]/.test(g))return _c(a),!1;var h=!a.curOp;h&&Bc(a),a.display.shift=!1,8203!=g.charCodeAt(0)||f.sel!=a.display.selForContextMenu||c||(c="\u200b");for(var i=0,j=Math.min(c.length,g.length);j>i&&c.charCodeAt(i)==g.charCodeAt(i);)++i;var k=g.slice(i),l=ph(k),m=null;a.state.pasteIncoming&&f.sel.ranges.length>1&&(Zc&&Zc.join("\n")==k?m=0==f.sel.ranges.length%Zc.length&&Mg(Zc,ph):l.length==f.sel.ranges.length&&(m=Mg(l,function(a){return[a]})));for(var n=f.sel.ranges.length-1;n>=0;n--){var o=f.sel.ranges[n],q=o.from(),r=o.to();i<c.length?q=nb(q.line,q.ch-(c.length-i)):a.state.overwrite&&o.empty()&&!a.state.pasteIncoming&&(r=nb(r.line,Math.min(Of(f,r.line).text.length,r.ch+Jg(l).length)));var s=a.curOp.updateInput,t={from:q,to:r,text:m?m[n%m.length]:l,origin:a.state.pasteIncoming?"paste":a.state.cutIncoming?"cut":"+input"};if(Rd(a.doc,t),tg(a,"inputRead",a,t),k&&!a.state.pasteIncoming&&a.options.electricChars&&a.options.smartIndent&&o.head.ch<100&&(!n||f.sel.ranges[n-1].head.line!=o.head.line)){var u=a.getModeAt(o.head);if(u.electricChars){for(var v=0;v<u.electricChars.length;v++)if(k.indexOf(u.electricChars.charAt(v))>-1){de(a,o.head.line,"smart");break}}else if(u.electricInput){var w=Ld(t);u.electricInput.test(Of(f,w.line).text.slice(0,w.ch))&&de(a,o.head.line,"smart")}}}return be(a),a.curOp.updateInput=s,a.curOp.typing=!0,g.length>1e3||g.indexOf("\n")>-1?b.value=a.display.prevInput="":a.display.prevInput=g,h&&Dc(a),a.state.pasteIncoming=a.state.cutIncoming=!1,!0}function _c(a,b){var c,f,g=a.doc;if(a.somethingSelected()){a.display.prevInput="";var h=g.sel.primary();c=rh&&(h.to().line-h.from().line>100||(f=a.getSelection()).length>1e3);var i=c?"-":f||a.getSelection();a.display.input.value=i,a.state.focused&&Kg(a.display.input),d&&e>=9&&(a.display.inputHasSelection=i)}else b||(a.display.prevInput=a.display.input.value="",d&&e>=9&&(a.display.inputHasSelection=null));a.display.inaccurateSelection=c}function ad(a){"nocursor"==a.options.readOnly||o&&_g()==a.display.input||a.display.input.focus()}function bd(a){a.state.focused||(ad(a),Hd(a))}function cd(a){return a.options.readOnly||a.doc.cantEdit}function dd(a){function c(){a.state.focused&&setTimeout(Pg(ad,a),0)}function g(b){vg(a,b)||mg(b)}function h(c){if(a.somethingSelected())Zc=a.getSelections(),b.inaccurateSelection&&(b.prevInput="",b.inaccurateSelection=!1,b.input.value=Zc.join("\n"),Kg(b.input));else{for(var d=[],e=[],f=0;f<a.doc.sel.ranges.length;f++){var g=a.doc.sel.ranges[f].head.line,h={anchor:nb(g,0),head:nb(g+1,0)};e.push(h),d.push(a.getRange(h.anchor,h.head))}"cut"==c.type?a.setSelections(e,null,Bg):(b.prevInput="",b.input.value=d.join("\n"),Kg(b.input)),Zc=d}"cut"==c.type&&(a.state.cutIncoming=!0)}var b=a.display;pg(b.scroller,"mousedown",Lc(a,hd)),d&&11>e?pg(b.scroller,"dblclick",Lc(a,function(b){if(!vg(a,b)){var c=gd(a,b);if(c&&!od(a,b)&&!fd(a.display,b)){jg(b);var d=a.findWordAt(c);Cb(a.doc,d.anchor,d.head)}}})):pg(b.scroller,"dblclick",function(b){vg(a,b)||jg(b)}),pg(b.lineSpace,"selectstart",function(a){fd(b,a)||jg(a)}),t||pg(b.scroller,"contextmenu",function(b){Jd(a,b)}),pg(b.scroller,"scroll",function(){b.scroller.clientHeight&&(sd(a,b.scroller.scrollTop),td(a,b.scroller.scrollLeft,!0),rg(a,"scroll",a))}),pg(b.scrollbarV,"scroll",function(){b.scroller.clientHeight&&sd(a,b.scrollbarV.scrollTop)}),pg(b.scrollbarH,"scroll",function(){b.scroller.clientHeight&&td(a,b.scrollbarH.scrollLeft)}),pg(b.scroller,"mousewheel",function(b){wd(a,b)}),pg(b.scroller,"DOMMouseScroll",function(b){wd(a,b)}),pg(b.scrollbarH,"mousedown",c),pg(b.scrollbarV,"mousedown",c),pg(b.wrapper,"scroll",function(){b.wrapper.scrollTop=b.wrapper.scrollLeft=0}),pg(b.input,"keyup",function(b){Fd.call(a,b)}),pg(b.input,"input",function(){d&&e>=9&&a.display.inputHasSelection&&(a.display.inputHasSelection=null),Yc(a)}),pg(b.input,"keydown",Lc(a,Dd)),pg(b.input,"keypress",Lc(a,Gd)),pg(b.input,"focus",Pg(Hd,a)),pg(b.input,"blur",Pg(Id,a)),a.options.dragDrop&&(pg(b.scroller,"dragstart",function(b){rd(a,b)}),pg(b.scroller,"dragenter",g),pg(b.scroller,"dragover",g),pg(b.scroller,"drop",Lc(a,qd))),pg(b.scroller,"paste",function(c){fd(b,c)||(a.state.pasteIncoming=!0,ad(a),Yc(a))}),pg(b.input,"paste",function(){if(f&&!a.state.fakedLastChar&&!(new Date-a.state.lastMiddleDown<200)){var c=b.input.selectionStart,d=b.input.selectionEnd;b.input.value+="$",b.input.selectionEnd=d,b.input.selectionStart=c,a.state.fakedLastChar=!0}a.state.pasteIncoming=!0,Yc(a)}),pg(b.input,"cut",h),pg(b.input,"copy",h),k&&pg(b.sizer,"mouseup",function(){_g()==b.input&&b.input.blur(),ad(a)})}function ed(a){var b=a.display;b.cachedCharWidth=b.cachedTextHeight=b.cachedPaddingH=null,a.setSize()}function fd(a,b){for(var c=ng(b);c!=a.wrapper;c=c.parentNode)if(!c||c.ignoreEvents||c.parentNode==a.sizer&&c!=a.mover)return!0}function gd(a,b,c,d){var e=a.display;if(!c){var f=ng(b);if(f==e.scrollbarH||f==e.scrollbarV||f==e.scrollbarFiller||f==e.gutterFiller)return null}var g,h,i=e.lineSpace.getBoundingClientRect();try{g=b.clientX-i.left,h=b.clientY-i.top}catch(b){return null}var k,j=uc(a,g,h);if(d&&1==j.xRel&&(k=Of(a.doc,j.line).text).length==j.ch){var l=Fg(k,k.length,a.options.tabSize)-k.length;j=nb(j.line,Math.max(0,Math.round((g-$b(a.display).left)/yc(a.display))-l))}return j}function hd(a){if(!vg(this,a)){var b=this,c=b.display;if(c.shift=a.shiftKey,fd(c,a))return f||(c.scroller.draggable=!1,setTimeout(function(){c.scroller.draggable=!0},100)),void 0;if(!od(b,a)){var d=gd(b,a);switch(window.focus(),og(a)){case 1:d?kd(b,a,d):ng(a)==c.scroller&&jg(a);break;case 2:f&&(b.state.lastMiddleDown=+new Date),d&&Cb(b.doc,d),setTimeout(Pg(ad,b),20),jg(a);break;case 3:t&&Jd(b,a)}}}}function kd(a,b,c){setTimeout(Pg(bd,a),0);var e,d=+new Date;jd&&jd.time>d-400&&0==ob(jd.pos,c)?e="triple":id&&id.time>d-400&&0==ob(id.pos,c)?(e="double",jd={time:d,pos:c}):(e="single",id={time:d,pos:c});var f=a.doc.sel,g=p?b.metaKey:b.ctrlKey;a.options.dragDrop&&ih&&!cd(a)&&"single"==e&&f.contains(c)>-1&&f.somethingSelected()?ld(a,b,c,g):md(a,b,c,e,g)}function ld(a,b,c,g){var h=a.display,i=Lc(a,function(j){f&&(h.scroller.draggable=!1),a.state.draggingText=!1,qg(document,"mouseup",i),qg(h.scroller,"drop",i),Math.abs(b.clientX-j.clientX)+Math.abs(b.clientY-j.clientY)<10&&(jg(j),g||Cb(a.doc,c),ad(a),d&&9==e&&setTimeout(function(){document.body.focus(),ad(a)},20))});f&&(h.scroller.draggable=!0),a.state.draggingText=i,h.scroller.dragDrop&&h.scroller.dragDrop(),pg(document,"mouseup",i),pg(h.scroller,"drop",i)}function md(a,b,c,d,e){function n(b){if(0!=ob(m,b))if(m=b,"rect"==d){for(var e=[],f=a.options.tabSize,k=Fg(Of(g,c.line).text,c.ch,f),l=Fg(Of(g,b.line).text,b.ch,f),n=Math.min(k,l),o=Math.max(k,l),p=Math.min(c.line,b.line),q=Math.min(a.lastLine(),Math.max(c.line,b.line));q>=p;p++){var r=Of(g,p).text,s=Gg(r,n,f);n==o?e.push(new tb(nb(p,s),nb(p,s))):r.length>s&&e.push(new tb(nb(p,s),nb(p,Gg(r,o,f))))}e.length||e.push(new tb(c,c)),Ib(g,ub(j.ranges.slice(0,i).concat(e),i),{origin:"*mouse",scroll:!1}),a.scrollIntoView(b)}else{var t=h,u=t.anchor,v=b;if("single"!=d){if("double"==d)var w=a.findWordAt(b);else var w=new tb(nb(b.line,0),xb(g,nb(b.line+1,0)));ob(w.anchor,u)>0?(v=w.head,u=rb(t.from(),w.anchor)):(v=w.anchor,u=qb(t.to(),w.head))}var e=j.ranges.slice(0);e[i]=new tb(xb(g,u),v),Ib(g,ub(e,i),Cg)}}function q(b){var c=++p,e=gd(a,b,!0,"rect"==d);if(e)if(0!=ob(e,m)){bd(a),n(e);var h=O(f,g);(e.line>=h.to||e.line<h.from)&&setTimeout(Lc(a,function(){p==c&&q(b)}),150)}else{var i=b.clientY<o.top?-20:b.clientY>o.bottom?20:0;i&&setTimeout(Lc(a,function(){p==c&&(f.scroller.scrollTop+=i,q(b))}),50)}}function r(b){p=1/0,jg(b),ad(a),qg(document,"mousemove",s),qg(document,"mouseup",t),g.history.lastSelOrigin=null}var f=a.display,g=a.doc;jg(b);var h,i,j=g.sel;if(e&&!b.shiftKey?(i=g.sel.contains(c),h=i>-1?g.sel.ranges[i]:new tb(c,c)):h=g.sel.primary(),b.altKey)d="rect",e||(h=new tb(c,c)),c=gd(a,b,!0,!0),i=-1;else if("double"==d){var k=a.findWordAt(c);h=a.display.shift||g.extend?Bb(g,h,k.anchor,k.head):k}else if("triple"==d){var l=new tb(nb(c.line,0),xb(g,nb(c.line+1,0)));h=a.display.shift||g.extend?Bb(g,h,l.anchor,l.head):l}else h=Bb(g,h,c);e?i>-1?Eb(g,i,h,Cg):(i=g.sel.ranges.length,Ib(g,ub(g.sel.ranges.concat([h]),i),{scroll:!1,origin:"*mouse"})):(i=0,Ib(g,new sb([h],0),Cg),j=g.sel);var m=c,o=f.wrapper.getBoundingClientRect(),p=0,s=Lc(a,function(a){og(a)?q(a):r(a)}),t=Lc(a,r);pg(document,"mousemove",s),pg(document,"mouseup",t)}function nd(a,b,c,d,e){try{var f=b.clientX,g=b.clientY}catch(b){return!1}if(f>=Math.floor(a.display.gutters.getBoundingClientRect().right))return!1;d&&jg(b);var h=a.display,i=h.lineDiv.getBoundingClientRect();if(g>i.bottom||!xg(a,c))return lg(b);g-=i.top-h.viewOffset;for(var j=0;j<a.options.gutters.length;++j){var k=h.gutters.childNodes[j];if(k&&k.getBoundingClientRect().right>=f){var l=Tf(a.doc,g),m=a.options.gutters[j];return e(a,c,a,l,m,b),lg(b)}}}function od(a,b){return nd(a,b,"gutterClick",!0,tg)}function qd(a){var b=this;if(!vg(b,a)&&!fd(b.display,a)){jg(a),d&&(pd=+new Date);var c=gd(b,a,!0),e=a.dataTransfer.files;if(c&&!cd(b))if(e&&e.length&&window.FileReader&&window.File)for(var f=e.length,g=Array(f),h=0,i=function(a,d){var e=new FileReader;e.onload=Lc(b,function(){if(g[d]=e.result,++h==f){c=xb(b.doc,c);var a={from:c,to:c,text:ph(g.join("\n")),origin:"paste"};Rd(b.doc,a),Hb(b.doc,vb(c,Ld(a)))}}),e.readAsText(a)},j=0;f>j;++j)i(e[j],j);else{if(b.state.draggingText&&b.doc.sel.contains(c)>-1)return b.state.draggingText(a),setTimeout(Pg(ad,b),20),void 0;try{var g=a.dataTransfer.getData("Text");if(g){if(b.state.draggingText&&!(p?a.metaKey:a.ctrlKey))var k=b.listSelections();if(Jb(b.doc,vb(c,c)),k)for(var j=0;j<k.length;++j)Xd(b.doc,"",k[j].anchor,k[j].head,"drag");b.replaceSelection(g,"around","paste"),ad(b)}}catch(a){}}}}function rd(a,b){if(d&&(!a.state.draggingText||+new Date-pd<100))return mg(b),void 0;if(!vg(a,b)&&!fd(a.display,b)&&(b.dataTransfer.setData("Text",a.getSelection()),b.dataTransfer.setDragImage&&!j)){var c=Wg("img",null,null,"position: fixed; left: 0; top: 0;");c.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",i&&(c.width=c.height=1,a.display.wrapper.appendChild(c),c._top=c.offsetTop),b.dataTransfer.setDragImage(c,0,0),i&&c.parentNode.removeChild(c)}}function sd(b,c){Math.abs(b.doc.scrollTop-c)<2||(b.doc.scrollTop=c,a||W(b,{top:c}),b.display.scroller.scrollTop!=c&&(b.display.scroller.scrollTop=c),b.display.scrollbarV.scrollTop!=c&&(b.display.scrollbarV.scrollTop=c),a&&W(b),Ub(b,100))}function td(a,b,c){(c?b==a.doc.scrollLeft:Math.abs(a.doc.scrollLeft-b)<2)||(b=Math.min(b,a.display.scroller.scrollWidth-a.display.scroller.clientWidth),a.doc.scrollLeft=b,P(a),a.display.scroller.scrollLeft!=b&&(a.display.scroller.scrollLeft=b),a.display.scrollbarH.scrollLeft!=b&&(a.display.scrollbarH.scrollLeft=b))}function wd(b,c){var d=c.wheelDeltaX,e=c.wheelDeltaY;null==d&&c.detail&&c.axis==c.HORIZONTAL_AXIS&&(d=c.detail),null==e&&c.detail&&c.axis==c.VERTICAL_AXIS?e=c.detail:null==e&&(e=c.wheelDelta);var g=b.display,h=g.scroller;if(d&&h.scrollWidth>h.clientWidth||e&&h.scrollHeight>h.clientHeight){if(e&&p&&f)a:for(var j=c.target,k=g.view;j!=h;j=j.parentNode)for(var l=0;l<k.length;l++)if(k[l].node==j){b.display.currentWheelTarget=j;break a}if(d&&!a&&!i&&null!=vd)return e&&sd(b,Math.max(0,Math.min(h.scrollTop+e*vd,h.scrollHeight-h.clientHeight))),td(b,Math.max(0,Math.min(h.scrollLeft+d*vd,h.scrollWidth-h.clientWidth))),jg(c),g.wheelStartX=null,void 0;if(e&&null!=vd){var m=e*vd,n=b.doc.scrollTop,o=n+g.wrapper.clientHeight;0>m?n=Math.max(0,n+m-50):o=Math.min(b.doc.height,o+m+50),W(b,{top:n,bottom:o})}20>ud&&(null==g.wheelStartX?(g.wheelStartX=h.scrollLeft,g.wheelStartY=h.scrollTop,g.wheelDX=d,g.wheelDY=e,setTimeout(function(){if(null!=g.wheelStartX){var a=h.scrollLeft-g.wheelStartX,b=h.scrollTop-g.wheelStartY,c=b&&g.wheelDY&&b/g.wheelDY||a&&g.wheelDX&&a/g.wheelDX;g.wheelStartX=g.wheelStartY=null,c&&(vd=(vd*ud+c)/(ud+1),++ud)}},200)):(g.wheelDX+=d,g.wheelDY+=e))}}function xd(a,b,c){if("string"==typeof b&&(b=te[b],!b))return!1;a.display.pollingFast&&$c(a)&&(a.display.pollingFast=!1);var d=a.display.shift,e=!1;try{cd(a)&&(a.state.suppressEdits=!0),c&&(a.display.shift=!1),e=b(a)!=Ag}finally{a.display.shift=d,a.state.suppressEdits=!1}return e}function yd(a){var b=a.state.keyMaps.slice(0);return a.options.extraKeys&&b.push(a.options.extraKeys),b.push(a.options.keyMap),b}function Ad(a,b){var c=ve(a.options.keyMap),d=c.auto;clearTimeout(zd),d&&!xe(b)&&(zd=setTimeout(function(){ve(a.options.keyMap)==c&&(a.options.keyMap=d.call?d.call(null,a):d,D(a))},50));var e=ye(b,!0),f=!1;if(!e)return!1;var g=yd(a);return f=b.shiftKey?we("Shift-"+e,g,function(b){return xd(a,b,!0)})||we(e,g,function(b){return("string"==typeof b?/^go[A-Z]/.test(b):b.motion)?xd(a,b):void 0}):we(e,g,function(b){return xd(a,b)}),f&&(jg(b),Tb(a),tg(a,"keyHandled",a,e,b)),f}function Bd(a,b,c){var d=we("'"+c+"'",yd(a),function(b){return xd(a,b,!0)});return d&&(jg(b),Tb(a),tg(a,"keyHandled",a,"'"+c+"'",b)),d}function Dd(a){var b=this;if(bd(b),!vg(b,a)){d&&11>e&&27==a.keyCode&&(a.returnValue=!1);var c=a.keyCode;b.display.shift=16==c||a.shiftKey;var f=Ad(b,a);i&&(Cd=f?c:null,!f&&88==c&&!rh&&(p?a.metaKey:a.ctrlKey)&&b.replaceSelection("",null,"cut")),18!=c||/\bCodeMirror-crosshair\b/.test(b.display.lineDiv.className)||Ed(b)}}function Ed(a){function c(a){18!=a.keyCode&&a.altKey||(bh(b,"CodeMirror-crosshair"),qg(document,"keyup",c),qg(document,"mouseover",c))}var b=a.display.lineDiv;ch(b,"CodeMirror-crosshair"),pg(document,"keyup",c),pg(document,"mouseover",c)}function Fd(a){16==a.keyCode&&(this.doc.sel.shift=!1),vg(this,a)}function Gd(a){var b=this;if(!(vg(b,a)||a.ctrlKey&&!a.altKey||p&&a.metaKey)){var c=a.keyCode,f=a.charCode;if(i&&c==Cd)return Cd=null,jg(a),void 0;if(!(i&&(!a.which||a.which<10)||k)||!Ad(b,a)){var g=String.fromCharCode(null==f?c:f);Bd(b,a,g)||(d&&e>=9&&(b.display.inputHasSelection=null),Yc(b))}}}function Hd(a){"nocursor"!=a.options.readOnly&&(a.state.focused||(rg(a,"focus",a),a.state.focused=!0,ch(a.display.wrapper,"CodeMirror-focused"),a.curOp||a.display.selForContextMenu==a.doc.sel||(_c(a),f&&setTimeout(Pg(_c,a,!0),0))),Xc(a),Tb(a))}function Id(a){a.state.focused&&(rg(a,"blur",a),a.state.focused=!1,bh(a.display.wrapper,"CodeMirror-focused")),clearInterval(a.display.blinker),setTimeout(function(){a.state.focused||(a.display.shift=!1)},150)}function Jd(a,b){function m(){if(null!=c.input.selectionStart){var b=a.somethingSelected(),d=c.input.value="\u200b"+(b?c.input.value:"");c.prevInput=b?"":"\u200b",c.input.selectionStart=1,c.input.selectionEnd=d.length,c.selForContextMenu=a.doc.sel}}function n(){if(c.inputDiv.style.position="relative",c.input.style.cssText=k,d&&9>e&&(c.scrollbarV.scrollTop=c.scroller.scrollTop=h),Xc(a),null!=c.input.selectionStart){(!d||d&&9>e)&&m();var b=0,f=function(){c.selForContextMenu==a.doc.sel&&0==c.input.selectionStart?Lc(a,te.selectAll)(a):b++<10?c.detectingSelectAll=setTimeout(f,500):_c(a)};c.detectingSelectAll=setTimeout(f,200)}}if(!vg(a,b,"contextmenu")){var c=a.display;if(!fd(c,b)&&!Kd(a,b)){var g=gd(a,b),h=c.scroller.scrollTop;if(g&&!i){var j=a.options.resetSelectionOnContextMenu;j&&-1==a.doc.sel.contains(g)&&Lc(a,Ib)(a.doc,vb(g),Bg);var k=c.input.style.cssText;if(c.inputDiv.style.position="absolute",c.input.style.cssText="position: fixed; width: 30px; height: 30px; top: "+(b.clientY-5)+"px; left: "+(b.clientX-5)+"px; z-index: 1000; background: "+(d?"rgba(255, 255, 255, .05)":"transparent")+"; outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);",f)var l=window.scrollY;if(ad(a),f&&window.scrollTo(null,l),_c(a),a.somethingSelected()||(c.input.value=c.prevInput=" "),c.selForContextMenu=a.doc.sel,clearTimeout(c.detectingSelectAll),d&&e>=9&&m(),t){mg(b);var o=function(){qg(window,"mouseup",o),setTimeout(n,20)};pg(window,"mouseup",o)}else setTimeout(n,50)}}}}function Kd(a,b){return xg(a,"gutterContextMenu")?nd(a,b,"gutterContextMenu",!1,rg):!1}function Md(a,b){if(ob(a,b.from)<0)return a;if(ob(a,b.to)<=0)return Ld(b);var c=a.line+b.text.length-(b.to.line-b.from.line)-1,d=a.ch;return a.line==b.to.line&&(d+=Ld(b).ch-b.to.ch),nb(c,d)}function Nd(a,b){for(var c=[],d=0;d<a.sel.ranges.length;d++){var e=a.sel.ranges[d];c.push(new tb(Md(e.anchor,b),Md(e.head,b)))}return ub(c,a.sel.primIndex)}function Od(a,b,c){return a.line==b.line?nb(c.line,a.ch-b.ch+c.ch):nb(c.line+(a.line-b.line),a.ch)}function Pd(a,b,c){for(var d=[],e=nb(a.first,0),f=e,g=0;g<b.length;g++){var h=b[g],i=Od(h.from,e,f),j=Od(Ld(h),e,f);if(e=h.to,f=j,"around"==c){var k=a.sel.ranges[g],l=ob(k.head,k.anchor)<0;d[g]=new tb(l?j:i,l?i:j)}else d[g]=new tb(i,i)}return new sb(d,a.sel.primIndex)}function Qd(a,b,c){var d={canceled:!1,from:b.from,to:b.to,text:b.text,origin:b.origin,cancel:function(){this.canceled=!0}};return c&&(d.update=function(b,c,d,e){b&&(this.from=xb(a,b)),c&&(this.to=xb(a,c)),d&&(this.text=d),void 0!==e&&(this.origin=e)}),rg(a,"beforeChange",a,d),a.cm&&rg(a.cm,"beforeChange",a.cm,d),d.canceled?null:{from:d.from,to:d.to,text:d.text,origin:d.origin}}function Rd(a,b,c){if(a.cm){if(!a.cm.curOp)return Lc(a.cm,Rd)(a,b,c);if(a.cm.state.suppressEdits)return}if(!(xg(a,"beforeChange")||a.cm&&xg(a.cm,"beforeChange"))||(b=Qd(a,b,!0))){var d=u&&!c&&Re(a,b.from,b.to);if(d)for(var e=d.length-1;e>=0;--e)Sd(a,{from:d[e].from,to:d[e].to,text:e?[""]:b.text});else Sd(a,b)}}function Sd(a,b){if(1!=b.text.length||""!=b.text[0]||0!=ob(b.from,b.to)){var c=Nd(a,b);$f(a,b,c,a.cm?a.cm.curOp.id:0/0),Vd(a,b,c,Oe(a,b));var d=[];Mf(a,function(a,c){c||-1!=Lg(d,a.history)||(ig(a.history,b),d.push(a.history)),Vd(a,b,null,Oe(a,b))})}}function Td(a,b,c){if(!a.cm||!a.cm.state.suppressEdits){for(var e,d=a.history,f=a.sel,g="undo"==b?d.done:d.undone,h="undo"==b?d.undone:d.done,i=0;i<g.length&&(e=g[i],c?!e.ranges||e.equals(a.sel):e.ranges);i++);if(i!=g.length){for(d.lastOrigin=d.lastSelOrigin=null;e=g.pop(),e.ranges;){if(bg(e,h),c&&!e.equals(a.sel))return Ib(a,e,{clearRedo:!1}),void 0;f=e}var j=[];bg(f,h),h.push({changes:j,generation:d.generation}),d.generation=e.generation||++d.maxGeneration;for(var k=xg(a,"beforeChange")||a.cm&&xg(a.cm,"beforeChange"),i=e.changes.length-1;i>=0;--i){var l=e.changes[i];if(l.origin=b,k&&!Qd(a,l,!1))return g.length=0,void 0;j.push(Xf(a,l));var m=i?Nd(a,l):Jg(g);Vd(a,l,m,Qe(a,l)),!i&&a.cm&&a.cm.scrollIntoView({from:l.from,to:Ld(l)});var n=[];Mf(a,function(a,b){b||-1!=Lg(n,a.history)||(ig(a.history,l),n.push(a.history)),Vd(a,l,null,Qe(a,l))})}}}}function Ud(a,b){if(0!=b&&(a.first+=b,a.sel=new sb(Mg(a.sel.ranges,function(a){return new tb(nb(a.anchor.line+b,a.anchor.ch),nb(a.head.line+b,a.head.ch))}),a.sel.primIndex),a.cm)){Qc(a.cm,a.first,a.first-b,b);for(var c=a.cm.display,d=c.viewFrom;d<c.viewTo;d++)Rc(a.cm,d,"gutter")}}function Vd(a,b,c,d){if(a.cm&&!a.cm.curOp)return Lc(a.cm,Vd)(a,b,c,d);if(b.to.line<a.first)return Ud(a,b.text.length-1-(b.to.line-b.from.line)),void 0;if(!(b.from.line>a.lastLine())){if(b.from.line<a.first){var e=b.text.length-1-(a.first-b.from.line);Ud(a,e),b={from:nb(a.first,0),to:nb(b.to.line+e,b.to.ch),text:[Jg(b.text)],origin:b.origin}}var f=a.lastLine();b.to.line>f&&(b={from:b.from,to:nb(f,Of(a,f).text.length),text:[b.text[0]],origin:b.origin}),b.removed=Pf(a,b.from,b.to),c||(c=Nd(a,b)),a.cm?Wd(a.cm,b,d):Ff(a,b,d),Jb(a,c,Bg)}}function Wd(a,b,c){var d=a.doc,e=a.display,f=b.from,g=b.to,h=!1,i=f.line;a.options.lineWrapping||(i=Sf(_e(Of(d,f.line))),d.iter(i,g.line+1,function(a){return a==e.maxLine?(h=!0,!0):void 0})),d.sel.contains(b.from,b.to)>-1&&wg(a),Ff(d,b,c,B(a)),a.options.lineWrapping||(d.iter(i,f.line+b.text.length,function(a){var b=I(a);b>e.maxLineLength&&(e.maxLine=a,e.maxLineLength=b,e.maxLineChanged=!0,h=!1)}),h&&(a.curOp.updateMaxLine=!0)),d.frontier=Math.min(d.frontier,f.line),Ub(a,400);var j=b.text.length-(g.line-f.line)-1;f.line!=g.line||1!=b.text.length||Ef(a.doc,b)?Qc(a,f.line,g.line+1,j):Rc(a,f.line,"text");var k=xg(a,"changes"),l=xg(a,"change");if(l||k){var m={from:f,to:g,text:b.text,removed:b.removed,origin:b.origin};l&&tg(a,"change",a,m),k&&(a.curOp.changeObjs||(a.curOp.changeObjs=[])).push(m)}a.display.selForContextMenu=null}function Xd(a,b,c,d,e){if(d||(d=c),ob(d,c)<0){var f=d;d=c,c=f}"string"==typeof b&&(b=ph(b)),Rd(a,{from:c,to:d,text:b,origin:e})}function Yd(a,b){var c=a.display,d=c.sizer.getBoundingClientRect(),e=null;if(b.top+d.top<0?e=!0:b.bottom+d.top>(window.innerHeight||document.documentElement.clientHeight)&&(e=!1),null!=e&&!m){var f=Wg("div","\u200b",null,"position: absolute; top: "+(b.top-c.viewOffset-Yb(a.display))+"px; height: "+(b.bottom-b.top+zg)+"px; left: "+b.left+"px; width: 2px;");a.display.lineSpace.appendChild(f),f.scrollIntoView(e),a.display.lineSpace.removeChild(f)}}function Zd(a,b,c,d){for(null==d&&(d=0);;){var e=!1,f=rc(a,b),g=c&&c!=b?rc(a,c):f,h=_d(a,Math.min(f.left,g.left),Math.min(f.top,g.top)-d,Math.max(f.left,g.left),Math.max(f.bottom,g.bottom)+d),i=a.doc.scrollTop,j=a.doc.scrollLeft;if(null!=h.scrollTop&&(sd(a,h.scrollTop),Math.abs(a.doc.scrollTop-i)>1&&(e=!0)),null!=h.scrollLeft&&(td(a,h.scrollLeft),Math.abs(a.doc.scrollLeft-j)>1&&(e=!0)),!e)return f}}function $d(a,b,c,d,e){var f=_d(a,b,c,d,e);null!=f.scrollTop&&sd(a,f.scrollTop),null!=f.scrollLeft&&td(a,f.scrollLeft)}function _d(a,b,c,d,e){var f=a.display,g=xc(a.display);0>c&&(c=0);var h=a.curOp&&null!=a.curOp.scrollTop?a.curOp.scrollTop:f.scroller.scrollTop,i=f.scroller.clientHeight-zg,j={};e-c>i&&(e=c+i);var k=a.doc.height+Zb(f),l=g>c,m=e>k-g;if(h>c)j.scrollTop=l?0:c;else if(e>h+i){var n=Math.min(c,(m?k:e)-i);n!=h&&(j.scrollTop=n)}var o=a.curOp&&null!=a.curOp.scrollLeft?a.curOp.scrollLeft:f.scroller.scrollLeft,p=f.scroller.clientWidth-zg-f.gutters.offsetWidth,q=d-b>p;return q&&(d=c+i),10>b?j.scrollLeft=0:o>b?j.scrollLeft=Math.max(0,b-(q?0:10)):d>p+o-3&&(j.scrollLeft=d+(q?0:10)-p),j}function ae(a,b,c){(null!=b||null!=c)&&ce(a),null!=b&&(a.curOp.scrollLeft=(null==a.curOp.scrollLeft?a.doc.scrollLeft:a.curOp.scrollLeft)+b),null!=c&&(a.curOp.scrollTop=(null==a.curOp.scrollTop?a.doc.scrollTop:a.curOp.scrollTop)+c)}function be(a){ce(a);var b=a.getCursor(),c=b,d=b;a.options.lineWrapping||(c=b.ch?nb(b.line,b.ch-1):b,d=nb(b.line,b.ch+1)),a.curOp.scrollToPos={from:c,to:d,margin:a.options.cursorScrollMargin,isCursor:!0}}function ce(a){var b=a.curOp.scrollToPos;if(b){a.curOp.scrollToPos=null;var c=sc(a,b.from),d=sc(a,b.to),e=_d(a,Math.min(c.left,d.left),Math.min(c.top,d.top)-b.margin,Math.max(c.right,d.right),Math.max(c.bottom,d.bottom)+b.margin);a.scrollTo(e.scrollLeft,e.scrollTop)}}function de(a,b,c,d){var f,e=a.doc;null==c&&(c="add"),"smart"==c&&(e.mode.indent?f=Xb(a,b):c="prev");var g=a.options.tabSize,h=Of(e,b),i=Fg(h.text,null,g);h.stateAfter&&(h.stateAfter=null);var k,j=h.text.match(/^\s*/)[0];if(d||/\S/.test(h.text)){if("smart"==c&&(k=e.mode.indent(f,h.text.slice(j.length),h.text),k==Ag||k>150)){if(!d)return;c="prev"}}else k=0,c="not";"prev"==c?k=b>e.first?Fg(Of(e,b-1).text,null,g):0:"add"==c?k=i+a.options.indentUnit:"subtract"==c?k=i-a.options.indentUnit:"number"==typeof c&&(k=i+c),k=Math.max(0,k);var l="",m=0;if(a.options.indentWithTabs)for(var n=Math.floor(k/g);n;--n)m+=g,l+="   ";if(k>m&&(l+=Ig(k-m)),l!=j)Xd(e,l,nb(b,0),nb(b,j.length),"+input");else for(var n=0;n<e.sel.ranges.length;n++){var o=e.sel.ranges[n];if(o.head.line==b&&o.head.ch<j.length){var m=nb(b,j.length);Eb(e,n,new tb(m,m));break}}h.stateAfter=null}function ee(a,b,c,d){var e=b,f=b;return"number"==typeof b?f=Of(a,wb(a,b)):e=Sf(b),null==e?null:(d(f,e)&&a.cm&&Rc(a.cm,e,c),f)}function fe(a,b){for(var c=a.doc.sel.ranges,d=[],e=0;e<c.length;e++){for(var f=b(c[e]);d.length&&ob(f.from,Jg(d).to)<=0;){var g=d.pop();if(ob(g.from,f.from)<0){f.from=g.from;break}}d.push(f)}Kc(a,function(){for(var b=d.length-1;b>=0;b--)Xd(a.doc,"",d[b].from,d[b].to,"+delete");be(a)})}function ge(a,b,c,d,e){function k(){var b=f+c;return b<a.first||b>=a.first+a.size?j=!1:(f=b,i=Of(a,b))}function l(a){var b=(e?Hh:Ih)(i,g,c,!0);if(null==b){if(a||!k())return j=!1;g=e?(0>c?zh:yh)(i):0>c?i.text.length:0}else g=b;return!0}var f=b.line,g=b.ch,h=c,i=Of(a,f),j=!0;if("char"==d)l();else if("column"==d)l(!0);else if("word"==d||"group"==d)for(var m=null,n="group"==d,o=a.cm&&a.cm.getHelper(b,"wordChars"),p=!0;!(0>c)||l(!p);p=!1){var q=i.text.charAt(g)||"\n",r=Sg(q,o)?"w":n&&"\n"==q?"n":!n||/\s/.test(q)?null:"p";if(!n||p||r||(r="s"),m&&m!=r){0>c&&(c=1,l());break}if(r&&(m=r),c>0&&!l(!p))break}var s=Nb(a,nb(f,g),h,!0);return j||(s.hitSide=!0),s}function he(a,b,c,d){var g,e=a.doc,f=b.left;if("page"==d){var h=Math.min(a.display.wrapper.clientHeight,window.innerHeight||document.documentElement.clientHeight);g=b.top+c*(h-(0>c?1.5:.5)*xc(a.display))}else"line"==d&&(g=c>0?b.bottom+3:b.top-3);for(;;){var i=uc(a,f,g);if(!i.outside)break;if(0>c?0>=g:g>=e.height){i.hitSide=!0;break}g+=5*c}return i}function ke(a,b,c,d){w.defaults[a]=b,c&&(je[a]=d?function(a,b,d){d!=le&&c(a,b,d)}:c)}function ve(a){return"string"==typeof a?ue[a]:a}function Ce(a,b,c,d,e){if(d&&d.shared)return Ee(a,b,c,d,e);if(a.cm&&!a.cm.curOp)return Lc(a.cm,Ce)(a,b,c,d,e);var f=new Ae(a,e),g=ob(b,c);if(d&&Og(d,f,!1),g>0||0==g&&f.clearWhenEmpty!==!1)return f;if(f.replacedWith&&(f.collapsed=!0,f.widgetNode=Wg("span",[f.replacedWith],"CodeMirror-widget"),d.handleMouseEvents||(f.widgetNode.ignoreEvents=!0),d.insertLeft&&(f.widgetNode.insertLeft=!0)),f.collapsed){if($e(a,b.line,b,c,f)||b.line!=c.line&&$e(a,c.line,b,c,f))throw new Error("Inserting collapsed marker partially overlapping an existing one");v=!0}f.addToHistory&&$f(a,{from:b,to:c,origin:"markText"},a.sel,0/0);var j,h=b.line,i=a.cm;if(a.iter(h,c.line+1,function(a){i&&f.collapsed&&!i.options.lineWrapping&&_e(a)==i.display.maxLine&&(j=!0),f.collapsed&&h!=b.line&&Rf(a,0),Le(a,new Ie(f,h==b.line?b.ch:null,h==c.line?c.ch:null)),++h}),f.collapsed&&a.iter(b.line,c.line+1,function(b){df(a,b)&&Rf(b,0)}),f.clearOnEnter&&pg(f,"beforeCursorEnter",function(){f.clear()
}),f.readOnly&&(u=!0,(a.history.done.length||a.history.undone.length)&&a.clearHistory()),f.collapsed&&(f.id=++Be,f.atomic=!0),i){if(j&&(i.curOp.updateMaxLine=!0),f.collapsed)Qc(i,b.line,c.line+1);else if(f.className||f.title||f.startStyle||f.endStyle)for(var k=b.line;k<=c.line;k++)Rc(i,k,"text");f.atomic&&Lb(i.doc),tg(i,"markerAdded",i,f)}return f}function Ee(a,b,c,d,e){d=Og(d),d.shared=!1;var f=[Ce(a,b,c,d,e)],g=f[0],h=d.widgetNode;return Mf(a,function(a){h&&(d.widgetNode=h.cloneNode(!0)),f.push(Ce(a,xb(a,b),xb(a,c),d,e));for(var i=0;i<a.linked.length;++i)if(a.linked[i].isParent)return;g=Jg(f)}),new De(f,g)}function Fe(a){return a.findMarks(nb(a.first,0),a.clipPos(nb(a.lastLine())),function(a){return a.parent})}function Ge(a,b){for(var c=0;c<b.length;c++){var d=b[c],e=d.find(),f=a.clipPos(e.from),g=a.clipPos(e.to);if(ob(f,g)){var h=Ce(a,f,g,d.primary,d.primary.type);d.markers.push(h),h.parent=d}}}function He(a){for(var b=0;b<a.length;b++){var c=a[b],d=[c.primary.doc];Mf(c.primary.doc,function(a){d.push(a)});for(var e=0;e<c.markers.length;e++){var f=c.markers[e];-1==Lg(d,f.doc)&&(f.parent=null,c.markers.splice(e--,1))}}}function Ie(a,b,c){this.marker=a,this.from=b,this.to=c}function Je(a,b){if(a)for(var c=0;c<a.length;++c){var d=a[c];if(d.marker==b)return d}}function Ke(a,b){for(var c,d=0;d<a.length;++d)a[d]!=b&&(c||(c=[])).push(a[d]);return c}function Le(a,b){a.markedSpans=a.markedSpans?a.markedSpans.concat([b]):[b],b.marker.attachLine(a)}function Me(a,b,c){if(a)for(var e,d=0;d<a.length;++d){var f=a[d],g=f.marker,h=null==f.from||(g.inclusiveLeft?f.from<=b:f.from<b);if(h||f.from==b&&"bookmark"==g.type&&(!c||!f.marker.insertLeft)){var i=null==f.to||(g.inclusiveRight?f.to>=b:f.to>b);(e||(e=[])).push(new Ie(g,f.from,i?null:f.to))}}return e}function Ne(a,b,c){if(a)for(var e,d=0;d<a.length;++d){var f=a[d],g=f.marker,h=null==f.to||(g.inclusiveRight?f.to>=b:f.to>b);if(h||f.from==b&&"bookmark"==g.type&&(!c||f.marker.insertLeft)){var i=null==f.from||(g.inclusiveLeft?f.from<=b:f.from<b);(e||(e=[])).push(new Ie(g,i?null:f.from-b,null==f.to?null:f.to-b))}}return e}function Oe(a,b){var c=zb(a,b.from.line)&&Of(a,b.from.line).markedSpans,d=zb(a,b.to.line)&&Of(a,b.to.line).markedSpans;if(!c&&!d)return null;var e=b.from.ch,f=b.to.ch,g=0==ob(b.from,b.to),h=Me(c,e,g),i=Ne(d,f,g),j=1==b.text.length,k=Jg(b.text).length+(j?e:0);if(h)for(var l=0;l<h.length;++l){var m=h[l];if(null==m.to){var n=Je(i,m.marker);n?j&&(m.to=null==n.to?null:n.to+k):m.to=e}}if(i)for(var l=0;l<i.length;++l){var m=i[l];if(null!=m.to&&(m.to+=k),null==m.from){var n=Je(h,m.marker);n||(m.from=k,j&&(h||(h=[])).push(m))}else m.from+=k,j&&(h||(h=[])).push(m)}h&&(h=Pe(h)),i&&i!=h&&(i=Pe(i));var o=[h];if(!j){var q,p=b.text.length-2;if(p>0&&h)for(var l=0;l<h.length;++l)null==h[l].to&&(q||(q=[])).push(new Ie(h[l].marker,null,null));for(var l=0;p>l;++l)o.push(q);o.push(i)}return o}function Pe(a){for(var b=0;b<a.length;++b){var c=a[b];null!=c.from&&c.from==c.to&&c.marker.clearWhenEmpty!==!1&&a.splice(b--,1)}return a.length?a:null}function Qe(a,b){var c=eg(a,b),d=Oe(a,b);if(!c)return d;if(!d)return c;for(var e=0;e<c.length;++e){var f=c[e],g=d[e];if(f&&g)a:for(var h=0;h<g.length;++h){for(var i=g[h],j=0;j<f.length;++j)if(f[j].marker==i.marker)continue a;f.push(i)}else g&&(c[e]=g)}return c}function Re(a,b,c){var d=null;if(a.iter(b.line,c.line+1,function(a){if(a.markedSpans)for(var b=0;b<a.markedSpans.length;++b){var c=a.markedSpans[b].marker;!c.readOnly||d&&-1!=Lg(d,c)||(d||(d=[])).push(c)}}),!d)return null;for(var e=[{from:b,to:c}],f=0;f<d.length;++f)for(var g=d[f],h=g.find(0),i=0;i<e.length;++i){var j=e[i];if(!(ob(j.to,h.from)<0||ob(j.from,h.to)>0)){var k=[i,1],l=ob(j.from,h.from),m=ob(j.to,h.to);(0>l||!g.inclusiveLeft&&!l)&&k.push({from:j.from,to:h.from}),(m>0||!g.inclusiveRight&&!m)&&k.push({from:h.to,to:j.to}),e.splice.apply(e,k),i+=k.length-1}}return e}function Se(a){var b=a.markedSpans;if(b){for(var c=0;c<b.length;++c)b[c].marker.detachLine(a);a.markedSpans=null}}function Te(a,b){if(b){for(var c=0;c<b.length;++c)b[c].marker.attachLine(a);a.markedSpans=b}}function Ue(a){return a.inclusiveLeft?-1:0}function Ve(a){return a.inclusiveRight?1:0}function We(a,b){var c=a.lines.length-b.lines.length;if(0!=c)return c;var d=a.find(),e=b.find(),f=ob(d.from,e.from)||Ue(a)-Ue(b);if(f)return-f;var g=ob(d.to,e.to)||Ve(a)-Ve(b);return g?g:b.id-a.id}function Xe(a,b){var d,c=v&&a.markedSpans;if(c)for(var e,f=0;f<c.length;++f)e=c[f],e.marker.collapsed&&null==(b?e.from:e.to)&&(!d||We(d,e.marker)<0)&&(d=e.marker);return d}function Ye(a){return Xe(a,!0)}function Ze(a){return Xe(a,!1)}function $e(a,b,c,d,e){var f=Of(a,b),g=v&&f.markedSpans;if(g)for(var h=0;h<g.length;++h){var i=g[h];if(i.marker.collapsed){var j=i.marker.find(0),k=ob(j.from,c)||Ue(i.marker)-Ue(e),l=ob(j.to,d)||Ve(i.marker)-Ve(e);if(!(k>=0&&0>=l||0>=k&&l>=0)&&(0>=k&&(ob(j.to,c)>0||i.marker.inclusiveRight&&e.inclusiveLeft)||k>=0&&(ob(j.from,d)<0||i.marker.inclusiveLeft&&e.inclusiveRight)))return!0}}}function _e(a){for(var b;b=Ye(a);)a=b.find(-1,!0).line;return a}function af(a){for(var b,c;b=Ze(a);)a=b.find(1,!0).line,(c||(c=[])).push(a);return c}function bf(a,b){var c=Of(a,b),d=_e(c);return c==d?b:Sf(d)}function cf(a,b){if(b>a.lastLine())return b;var d,c=Of(a,b);if(!df(a,c))return b;for(;d=Ze(c);)c=d.find(1,!0).line;return Sf(c)+1}function df(a,b){var c=v&&b.markedSpans;if(c)for(var d,e=0;e<c.length;++e)if(d=c[e],d.marker.collapsed){if(null==d.from)return!0;if(!d.marker.widgetNode&&0==d.from&&d.marker.inclusiveLeft&&ef(a,b,d))return!0}}function ef(a,b,c){if(null==c.to){var d=c.marker.find(1,!0);return ef(a,d.line,Je(d.line.markedSpans,c.marker))}if(c.marker.inclusiveRight&&c.to==b.text.length)return!0;for(var e,f=0;f<b.markedSpans.length;++f)if(e=b.markedSpans[f],e.marker.collapsed&&!e.marker.widgetNode&&e.from==c.to&&(null==e.to||e.to!=c.from)&&(e.marker.inclusiveLeft||c.marker.inclusiveRight)&&ef(a,b,e))return!0}function gf(a,b,c){Uf(b)<(a.curOp&&a.curOp.scrollTop||a.doc.scrollTop)&&ae(a,null,c)}function hf(a){if(null!=a.height)return a.height;if(!$g(document.body,a.node)){var b="position: relative;";a.coverGutter&&(b+="margin-left: -"+a.cm.getGutterElement().offsetWidth+"px;"),Zg(a.cm.display.measure,Wg("div",[a.node],null,b))}return a.height=a.node.offsetHeight}function jf(a,b,c,d){var e=new ff(a,c,d);return e.noHScroll&&(a.display.alignWidgets=!0),ee(a.doc,b,"widget",function(b){var c=b.widgets||(b.widgets=[]);if(null==e.insertAt?c.push(e):c.splice(Math.min(c.length-1,Math.max(0,e.insertAt)),0,e),e.line=b,!df(a.doc,b)){var d=Uf(b)<a.doc.scrollTop;Rf(b,b.height+hf(e)),d&&ae(a,null,e.height),a.curOp.forceUpdate=!0}return!0}),e}function lf(a,b,c,d){a.text=b,a.stateAfter&&(a.stateAfter=null),a.styles&&(a.styles=null),null!=a.order&&(a.order=null),Se(a),Te(a,c);var e=d?d(a):1;e!=a.height&&Rf(a,e)}function mf(a){a.parent=null,Se(a)}function nf(a,b){if(a)for(;;){var c=a.match(/(?:^|\s+)line-(background-)?(\S+)/);if(!c)break;a=a.slice(0,c.index)+a.slice(c.index+c[0].length);var d=c[1]?"bgClass":"textClass";null==b[d]?b[d]=c[2]:new RegExp("(?:^|s)"+c[2]+"(?:$|s)").test(b[d])||(b[d]+=" "+c[2])}return a}function of(a,b){if(a.blankLine)return a.blankLine(b);if(a.innerMode){var c=w.innerMode(a,b);return c.mode.blankLine?c.mode.blankLine(c.state):void 0}}function pf(a,b,c){for(var d=0;10>d;d++){var e=a.token(b,c);if(b.pos>b.start)return e}throw new Error("Mode "+a.name+" failed to advance stream.")}function qf(a,b,c,d,e,f,g){var h=c.flattenSpans;null==h&&(h=a.options.flattenSpans);var l,i=0,j=null,k=new ze(b,a.options.tabSize);for(""==b&&nf(of(c,d),f);!k.eol();){if(k.pos>a.options.maxHighlightLength?(h=!1,g&&tf(a,b,d,k.pos),k.pos=b.length,l=null):l=nf(pf(c,k,d),f),a.options.addModeClass){var m=w.innerMode(c,d).mode.name;m&&(l="m-"+(l?m+" "+l:m))}h&&j==l||(i<k.start&&e(k.start,j),i=k.start,j=l),k.start=k.pos}for(;i<k.pos;){var n=Math.min(k.pos,i+5e4);e(n,j),i=n}}function rf(a,b,c,d){var e=[a.state.modeGen],f={};qf(a,b.text,a.doc.mode,c,function(a,b){e.push(a,b)},f,d);for(var g=0;g<a.state.overlays.length;++g){var h=a.state.overlays[g],i=1,j=0;qf(a,b.text,h.mode,!0,function(a,b){for(var c=i;a>j;){var d=e[i];d>a&&e.splice(i,1,a,e[i+1],d),i+=2,j=Math.min(a,d)}if(b)if(h.opaque)e.splice(c,i-c,a,"cm-overlay "+b),i=c+2;else for(;i>c;c+=2){var f=e[c+1];e[c+1]=(f?f+" ":"")+"cm-overlay "+b}},f)}return{styles:e,classes:f.bgClass||f.textClass?f:null}}function sf(a,b){if(!b.styles||b.styles[0]!=a.state.modeGen){var c=rf(a,b,b.stateAfter=Xb(a,Sf(b)));b.styles=c.styles,c.classes?b.styleClasses=c.classes:b.styleClasses&&(b.styleClasses=null)}return b.styles}function tf(a,b,c,d){var e=a.doc.mode,f=new ze(b,a.options.tabSize);for(f.start=f.pos=d||0,""==b&&of(e,c);!f.eol()&&f.pos<=a.options.maxHighlightLength;)pf(e,f,c),f.start=f.pos}function wf(a,b){if(!a||/^\s*$/.test(a))return null;var c=b.addModeClass?vf:uf;return c[a]||(c[a]=a.replace(/\S+/g,"cm-$&"))}function xf(a,b){var c=Wg("span",null,null,f?"padding-right: .1px":null),e={pre:Wg("pre",[c]),content:c,col:0,pos:0,cm:a};b.measure={};for(var g=0;g<=(b.rest?b.rest.length:0);g++){var i,h=g?b.rest[g-1]:b.line;e.pos=0,e.addToken=zf,(d||f)&&a.getOption("lineWrapping")&&(e.addToken=Af(e.addToken)),oh(a.display.measure)&&(i=Vf(h))&&(e.addToken=Bf(e.addToken,i)),e.map=[],Df(h,e,sf(a,h)),h.styleClasses&&(h.styleClasses.bgClass&&(e.bgClass=dh(h.styleClasses.bgClass,e.bgClass||"")),h.styleClasses.textClass&&(e.textClass=dh(h.styleClasses.textClass,e.textClass||""))),0==e.map.length&&e.map.push(0,0,e.content.appendChild(mh(a.display.measure))),0==g?(b.measure.map=e.map,b.measure.cache={}):((b.measure.maps||(b.measure.maps=[])).push(e.map),(b.measure.caches||(b.measure.caches=[])).push({}))}return rg(a,"renderLine",a,b.line,e.pre),e.pre.className&&(e.textClass=dh(e.pre.className,e.textClass||"")),e}function yf(a){var b=Wg("span","\u2022","cm-invalidchar");return b.title="\\u"+a.charCodeAt(0).toString(16),b}function zf(a,b,c,f,g,h){if(b){var i=a.cm.options.specialChars,j=!1;if(i.test(b))for(var k=document.createDocumentFragment(),l=0;;){i.lastIndex=l;var m=i.exec(b),n=m?m.index-l:b.length-l;if(n){var o=document.createTextNode(b.slice(l,l+n));d&&9>e?k.appendChild(Wg("span",[o])):k.appendChild(o),a.map.push(a.pos,a.pos+n,o),a.col+=n,a.pos+=n}if(!m)break;if(l+=n+1," "==m[0]){var p=a.cm.options.tabSize,q=p-a.col%p,o=k.appendChild(Wg("span",Ig(q),"cm-tab"));a.col+=q}else{var o=a.cm.options.specialCharPlaceholder(m[0]);d&&9>e?k.appendChild(Wg("span",[o])):k.appendChild(o),a.col+=1}a.map.push(a.pos,a.pos+1,o),a.pos++}else{a.col+=b.length;var k=document.createTextNode(b);a.map.push(a.pos,a.pos+b.length,k),d&&9>e&&(j=!0),a.pos+=b.length}if(c||f||g||j){var r=c||"";f&&(r+=f),g&&(r+=g);var s=Wg("span",[k],r);return h&&(s.title=h),a.content.appendChild(s)}a.content.appendChild(k)}}function Af(a){function b(a){for(var b=" ",c=0;c<a.length-2;++c)b+=c%2?" ":"\xa0";return b+=" "}return function(c,d,e,f,g,h){a(c,d.replace(/ {3,}/g,b),e,f,g,h)}}function Bf(a,b){return function(c,d,e,f,g,h){e=e?e+" cm-force-border":"cm-force-border";for(var i=c.pos,j=i+d.length;;){for(var k=0;k<b.length;k++){var l=b[k];if(l.to>i&&l.from<=i)break}if(l.to>=j)return a(c,d,e,f,g,h);a(c,d.slice(0,l.to-i),e,f,null,h),f=null,d=d.slice(l.to-i),i=l.to}}}function Cf(a,b,c,d){var e=!d&&c.widgetNode;e&&(a.map.push(a.pos,a.pos+b,e),a.content.appendChild(e)),a.pos+=b}function Df(a,b,c){var d=a.markedSpans,e=a.text,f=0;if(d)for(var k,m,n,o,p,q,h=e.length,i=0,g=1,j="",l=0;;){if(l==i){m=n=o=p="",q=null,l=1/0;for(var r=[],s=0;s<d.length;++s){var t=d[s],u=t.marker;t.from<=i&&(null==t.to||t.to>i)?(null!=t.to&&l>t.to&&(l=t.to,n=""),u.className&&(m+=" "+u.className),u.startStyle&&t.from==i&&(o+=" "+u.startStyle),u.endStyle&&t.to==l&&(n+=" "+u.endStyle),u.title&&!p&&(p=u.title),u.collapsed&&(!q||We(q.marker,u)<0)&&(q=t)):t.from>i&&l>t.from&&(l=t.from),"bookmark"==u.type&&t.from==i&&u.widgetNode&&r.push(u)}if(q&&(q.from||0)==i&&(Cf(b,(null==q.to?h+1:q.to)-i,q.marker,null==q.from),null==q.to))return;if(!q&&r.length)for(var s=0;s<r.length;++s)Cf(b,0,r[s])}if(i>=h)break;for(var v=Math.min(h,l);;){if(j){var w=i+j.length;if(!q){var x=w>v?j.slice(0,v-i):j;b.addToken(b,x,k?k+m:m,o,i+x.length==l?n:"",p)}if(w>=v){j=j.slice(v-i),i=v;break}i=w,o=""}j=e.slice(f,f=c[g++]),k=wf(c[g++],b.cm.options)}}else for(var g=1;g<c.length;g+=2)b.addToken(b,e.slice(f,f=c[g]),wf(c[g+1],b.cm.options))}function Ef(a,b){return 0==b.from.ch&&0==b.to.ch&&""==Jg(b.text)&&(!a.cm||a.cm.options.wholeLineUpdateBefore)}function Ff(a,b,c,d){function e(a){return c?c[a]:null}function f(a,c,e){lf(a,c,e,d),tg(a,"change",a,b)}var g=b.from,h=b.to,i=b.text,j=Of(a,g.line),k=Of(a,h.line),l=Jg(i),m=e(i.length-1),n=h.line-g.line;if(Ef(a,b)){for(var o=0,p=[];o<i.length-1;++o)p.push(new kf(i[o],e(o),d));f(k,k.text,m),n&&a.remove(g.line,n),p.length&&a.insert(g.line,p)}else if(j==k)if(1==i.length)f(j,j.text.slice(0,g.ch)+l+j.text.slice(h.ch),m);else{for(var p=[],o=1;o<i.length-1;++o)p.push(new kf(i[o],e(o),d));p.push(new kf(l+j.text.slice(h.ch),m,d)),f(j,j.text.slice(0,g.ch)+i[0],e(0)),a.insert(g.line+1,p)}else if(1==i.length)f(j,j.text.slice(0,g.ch)+i[0]+k.text.slice(h.ch),e(0)),a.remove(g.line+1,n);else{f(j,j.text.slice(0,g.ch)+i[0],e(0)),f(k,l+k.text.slice(h.ch),m);for(var o=1,p=[];o<i.length-1;++o)p.push(new kf(i[o],e(o),d));n>1&&a.remove(g.line+1,n-1),a.insert(g.line+1,p)}tg(a,"change",a,b)}function Gf(a){this.lines=a,this.parent=null;for(var b=0,c=0;b<a.length;++b)a[b].parent=this,c+=a[b].height;this.height=c}function Hf(a){this.children=a;for(var b=0,c=0,d=0;d<a.length;++d){var e=a[d];b+=e.chunkSize(),c+=e.height,e.parent=this}this.size=b,this.height=c,this.parent=null}function Mf(a,b,c){function d(a,e,f){if(a.linked)for(var g=0;g<a.linked.length;++g){var h=a.linked[g];if(h.doc!=e){var i=f&&h.sharedHist;(!c||i)&&(b(h.doc,i),d(h.doc,a,i))}}}d(a,null,!0)}function Nf(a,b){if(b.cm)throw new Error("This document is already in use.");a.doc=b,b.cm=a,C(a),y(a),a.options.lineWrapping||J(a),a.options.mode=b.modeOption,Qc(a)}function Of(a,b){if(b-=a.first,0>b||b>=a.size)throw new Error("There is no line "+(b+a.first)+" in the document.");for(var c=a;!c.lines;)for(var d=0;;++d){var e=c.children[d],f=e.chunkSize();if(f>b){c=e;break}b-=f}return c.lines[b]}function Pf(a,b,c){var d=[],e=b.line;return a.iter(b.line,c.line+1,function(a){var f=a.text;e==c.line&&(f=f.slice(0,c.ch)),e==b.line&&(f=f.slice(b.ch)),d.push(f),++e}),d}function Qf(a,b,c){var d=[];return a.iter(b,c,function(a){d.push(a.text)}),d}function Rf(a,b){var c=b-a.height;if(c)for(var d=a;d;d=d.parent)d.height+=c}function Sf(a){if(null==a.parent)return null;for(var b=a.parent,c=Lg(b.lines,a),d=b.parent;d;b=d,d=d.parent)for(var e=0;d.children[e]!=b;++e)c+=d.children[e].chunkSize();return c+b.first}function Tf(a,b){var c=a.first;a:do{for(var d=0;d<a.children.length;++d){var e=a.children[d],f=e.height;if(f>b){a=e;continue a}b-=f,c+=e.chunkSize()}return c}while(!a.lines);for(var d=0;d<a.lines.length;++d){var g=a.lines[d],h=g.height;if(h>b)break;b-=h}return c+d}function Uf(a){a=_e(a);for(var b=0,c=a.parent,d=0;d<c.lines.length;++d){var e=c.lines[d];if(e==a)break;b+=e.height}for(var f=c.parent;f;c=f,f=c.parent)for(var d=0;d<f.children.length;++d){var g=f.children[d];if(g==c)break;b+=g.height}return b}function Vf(a){var b=a.order;return null==b&&(b=a.order=Jh(a.text)),b}function Wf(a){this.done=[],this.undone=[],this.undoDepth=1/0,this.lastModTime=this.lastSelTime=0,this.lastOp=this.lastSelOp=null,this.lastOrigin=this.lastSelOrigin=null,this.generation=this.maxGeneration=a||1}function Xf(a,b){var c={from:pb(b.from),to:Ld(b),text:Pf(a,b.from,b.to)};return cg(a,c,b.from.line,b.to.line+1),Mf(a,function(a){cg(a,c,b.from.line,b.to.line+1)},!0),c}function Yf(a){for(;a.length;){var b=Jg(a);if(!b.ranges)break;a.pop()}}function Zf(a,b){return b?(Yf(a.done),Jg(a.done)):a.done.length&&!Jg(a.done).ranges?Jg(a.done):a.done.length>1&&!a.done[a.done.length-2].ranges?(a.done.pop(),Jg(a.done)):void 0}function $f(a,b,c,d){var e=a.history;e.undone.length=0;var g,f=+new Date;if((e.lastOp==d||e.lastOrigin==b.origin&&b.origin&&("+"==b.origin.charAt(0)&&a.cm&&e.lastModTime>f-a.cm.options.historyEventDelay||"*"==b.origin.charAt(0)))&&(g=Zf(e,e.lastOp==d))){var h=Jg(g.changes);0==ob(b.from,b.to)&&0==ob(b.from,h.to)?h.to=Ld(b):g.changes.push(Xf(a,b))}else{var i=Jg(e.done);for(i&&i.ranges||bg(a.sel,e.done),g={changes:[Xf(a,b)],generation:e.generation},e.done.push(g);e.done.length>e.undoDepth;)e.done.shift(),e.done[0].ranges||e.done.shift()}e.done.push(c),e.generation=++e.maxGeneration,e.lastModTime=e.lastSelTime=f,e.lastOp=e.lastSelOp=d,e.lastOrigin=e.lastSelOrigin=b.origin,h||rg(a,"historyAdded")}function _f(a,b,c,d){var e=b.charAt(0);return"*"==e||"+"==e&&c.ranges.length==d.ranges.length&&c.somethingSelected()==d.somethingSelected()&&new Date-a.history.lastSelTime<=(a.cm?a.cm.options.historyEventDelay:500)}function ag(a,b,c,d){var e=a.history,f=d&&d.origin;c==e.lastSelOp||f&&e.lastSelOrigin==f&&(e.lastModTime==e.lastSelTime&&e.lastOrigin==f||_f(a,f,Jg(e.done),b))?e.done[e.done.length-1]=b:bg(b,e.done),e.lastSelTime=+new Date,e.lastSelOrigin=f,e.lastSelOp=c,d&&d.clearRedo!==!1&&Yf(e.undone)}function bg(a,b){var c=Jg(b);c&&c.ranges&&c.equals(a)||b.push(a)}function cg(a,b,c,d){var e=b["spans_"+a.id],f=0;a.iter(Math.max(a.first,c),Math.min(a.first+a.size,d),function(c){c.markedSpans&&((e||(e=b["spans_"+a.id]={}))[f]=c.markedSpans),++f})}function dg(a){if(!a)return null;for(var c,b=0;b<a.length;++b)a[b].marker.explicitlyCleared?c||(c=a.slice(0,b)):c&&c.push(a[b]);return c?c.length?c:null:a}function eg(a,b){var c=b["spans_"+a.id];if(!c)return null;for(var d=0,e=[];d<b.text.length;++d)e.push(dg(c[d]));return e}function fg(a,b,c){for(var d=0,e=[];d<a.length;++d){var f=a[d];if(f.ranges)e.push(c?sb.prototype.deepCopy.call(f):f);else{var g=f.changes,h=[];e.push({changes:h});for(var i=0;i<g.length;++i){var k,j=g[i];if(h.push({from:j.from,to:j.to,text:j.text}),b)for(var l in j)(k=l.match(/^spans_(\d+)$/))&&Lg(b,Number(k[1]))>-1&&(Jg(h)[l]=j[l],delete j[l])}}}return e}function gg(a,b,c,d){c<a.line?a.line+=d:b<a.line&&(a.line=b,a.ch=0)}function hg(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e],g=!0;if(f.ranges){f.copied||(f=a[e]=f.deepCopy(),f.copied=!0);for(var h=0;h<f.ranges.length;h++)gg(f.ranges[h].anchor,b,c,d),gg(f.ranges[h].head,b,c,d)}else{for(var h=0;h<f.changes.length;++h){var i=f.changes[h];if(c<i.from.line)i.from=nb(i.from.line+d,i.from.ch),i.to=nb(i.to.line+d,i.to.ch);else if(b<=i.to.line){g=!1;break}}g||(a.splice(0,e+1),e=0)}}}function ig(a,b){var c=b.from.line,d=b.to.line,e=b.text.length-(d-c)-1;hg(a.done,c,d,e),hg(a.undone,c,d,e)}function lg(a){return null!=a.defaultPrevented?a.defaultPrevented:0==a.returnValue}function ng(a){return a.target||a.srcElement}function og(a){var b=a.which;return null==b&&(1&a.button?b=1:2&a.button?b=3:4&a.button&&(b=2)),p&&a.ctrlKey&&1==b&&(b=3),b}function tg(a,b){function f(a){return function(){a.apply(null,d)}}var c=a._handlers&&a._handlers[b];if(c){var e,d=Array.prototype.slice.call(arguments,2);zc?e=zc.delayedCallbacks:sg?e=sg:(e=sg=[],setTimeout(ug,0));for(var g=0;g<c.length;++g)e.push(f(c[g]))}}function ug(){var a=sg;sg=null;for(var b=0;b<a.length;++b)a[b]()}function vg(a,b,c){return rg(a,c||b.type,a,b),lg(b)||b.codemirrorIgnore}function wg(a){var b=a._handlers&&a._handlers.cursorActivity;if(b)for(var c=a.curOp.cursorActivityHandlers||(a.curOp.cursorActivityHandlers=[]),d=0;d<b.length;++d)-1==Lg(c,b[d])&&c.push(b[d])}function xg(a,b){var c=a._handlers&&a._handlers[b];return c&&c.length>0}function yg(a){a.prototype.on=function(a,b){pg(this,a,b)},a.prototype.off=function(a,b){qg(this,a,b)}}function Eg(){this.id=null}function Gg(a,b,c){for(var d=0,e=0;;){var f=a.indexOf("  ",d);-1==f&&(f=a.length);var g=f-d;if(f==a.length||e+g>=b)return d+Math.min(g,b-e);if(e+=f-d,e+=c-e%c,d=f+1,e>=b)return d}}function Ig(a){for(;Hg.length<=a;)Hg.push(Jg(Hg)+" ");return Hg[a]}function Jg(a){return a[a.length-1]}function Lg(a,b){for(var c=0;c<a.length;++c)if(a[c]==b)return c;return-1}function Mg(a,b){for(var c=[],d=0;d<a.length;d++)c[d]=b(a[d],d);return c}function Ng(a,b){var c;if(Object.create)c=Object.create(a);else{var d=function(){};d.prototype=a,c=new d}return b&&Og(b,c),c}function Og(a,b,c){b||(b={});for(var d in a)!a.hasOwnProperty(d)||c===!1&&b.hasOwnProperty(d)||(b[d]=a[d]);return b}function Pg(a){var b=Array.prototype.slice.call(arguments,1);return function(){return a.apply(null,b)}}function Sg(a,b){return b?b.source.indexOf("\\w")>-1&&Rg(a)?!0:b.test(a):Rg(a)}function Tg(a){for(var b in a)if(a.hasOwnProperty(b)&&a[b])return!1;return!0}function Vg(a){return a.charCodeAt(0)>=768&&Ug.test(a)}function Wg(a,b,c,d){var e=document.createElement(a);if(c&&(e.className=c),d&&(e.style.cssText=d),"string"==typeof b)e.appendChild(document.createTextNode(b));else if(b)for(var f=0;f<b.length;++f)e.appendChild(b[f]);return e}function Yg(a){for(var b=a.childNodes.length;b>0;--b)a.removeChild(a.firstChild);return a}function Zg(a,b){return Yg(a).appendChild(b)}function $g(a,b){if(a.contains)return a.contains(b);for(;b=b.parentNode;)if(b==a)return!0}function _g(){return document.activeElement}function ah(a){return new RegExp("\\b"+a+"\\b\\s*")}function bh(a,b){var c=ah(b);c.test(a.className)&&(a.className=a.className.replace(c,""))}function ch(a,b){ah(b).test(a.className)||(a.className+=" "+b)}function dh(a,b){for(var c=a.split(" "),d=0;d<c.length;d++)c[d]&&!ah(c[d]).test(b)&&(b+=" "+c[d]);return b}function eh(a){if(document.body.getElementsByClassName)for(var b=document.body.getElementsByClassName("CodeMirror"),c=0;c<b.length;c++){var d=b[c].CodeMirror;d&&a(d)}}function gh(){fh||(hh(),fh=!0)}function hh(){var a;pg(window,"resize",function(){null==a&&(a=setTimeout(function(){a=null,jh=null,eh(ed)},100))}),pg(window,"blur",function(){eh(Id)})}function kh(a){if(null!=jh)return jh;var b=Wg("div",null,null,"width: 50px; height: 50px; overflow-x: scroll");return Zg(a,b),b.offsetWidth&&(jh=b.offsetHeight-b.clientHeight),jh||0}function mh(a){if(null==lh){var b=Wg("span","\u200b");Zg(a,Wg("span",[b,document.createTextNode("x")])),0!=a.firstChild.offsetHeight&&(lh=b.offsetWidth<=1&&b.offsetHeight>2&&!(d&&8>e))}return lh?Wg("span","\u200b"):Wg("span","\xa0",null,"display: inline-block; width: 1px; margin-right: -1px")}function oh(a){if(null!=nh)return nh;var b=Zg(a,document.createTextNode("A\u062eA")),c=Xg(b,0,1).getBoundingClientRect();if(!c||c.left==c.right)return!1;var d=Xg(b,1,2).getBoundingClientRect();return nh=d.right-c.right<3}function th(a){if(null!=sh)return sh;var b=Zg(a,Wg("span","x")),c=b.getBoundingClientRect(),d=Xg(b,0,1).getBoundingClientRect();return sh=Math.abs(c.left-d.left)>1}function vh(a,b,c,d){if(!a)return d(b,c,"ltr");for(var e=!1,f=0;f<a.length;++f){var g=a[f];(g.from<c&&g.to>b||b==c&&g.to==b)&&(d(Math.max(g.from,b),Math.min(g.to,c),1==g.level?"rtl":"ltr"),e=!0)}e||d(b,c,"ltr")}function wh(a){return a.level%2?a.to:a.from}function xh(a){return a.level%2?a.from:a.to}function yh(a){var b=Vf(a);return b?wh(b[0]):0}function zh(a){var b=Vf(a);return b?xh(Jg(b)):a.text.length}function Ah(a,b){var c=Of(a.doc,b),d=_e(c);d!=c&&(b=Sf(d));var e=Vf(d),f=e?e[0].level%2?zh(d):yh(d):0;return nb(b,f)}function Bh(a,b){for(var c,d=Of(a.doc,b);c=Ze(d);)d=c.find(1,!0).line,b=null;var e=Vf(d),f=e?e[0].level%2?yh(d):zh(d):d.text.length;return nb(null==b?Sf(d):b,f)}function Ch(a,b){var c=Ah(a,b.line),d=Of(a.doc,c.line),e=Vf(d);if(!e||0==e[0].level){var f=Math.max(0,d.text.search(/\S/)),g=b.line==c.line&&b.ch<=f&&b.ch;return nb(c.line,g?0:f)}return c}function Dh(a,b,c){var d=a[0].level;return b==d?!0:c==d?!1:c>b}function Fh(a,b){Eh=null;for(var d,c=0;c<a.length;++c){var e=a[c];if(e.from<b&&e.to>b)return c;if(e.from==b||e.to==b){if(null!=d)return Dh(a,e.level,a[d].level)?(e.from!=e.to&&(Eh=d),c):(e.from!=e.to&&(Eh=c),d);d=c}}return d}function Gh(a,b,c,d){if(!d)return b+c;do b+=c;while(b>0&&Vg(a.text.charAt(b)));return b}function Hh(a,b,c,d){var e=Vf(a);if(!e)return Ih(a,b,c,d);for(var f=Fh(e,b),g=e[f],h=Gh(a,b,g.level%2?-c:c,d);;){if(h>g.from&&h<g.to)return h;if(h==g.from||h==g.to)return Fh(e,h)==f?h:(g=e[f+=c],c>0==g.level%2?g.to:g.from);if(g=e[f+=c],!g)return null;h=c>0==g.level%2?Gh(a,g.to,-1,d):Gh(a,g.from,1,d)}}function Ih(a,b,c,d){var e=b+c;if(d)for(;e>0&&Vg(a.text.charAt(e));)e+=c;return 0>e||e>a.text.length?null:e}var a=/gecko\/\d/i.test(navigator.userAgent),b=/MSIE \d/.test(navigator.userAgent),c=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent),d=b||c,e=d&&(b?document.documentMode||6:c[1]),f=/WebKit\//.test(navigator.userAgent),g=f&&/Qt\/\d+\.\d+/.test(navigator.userAgent),h=/Chrome\//.test(navigator.userAgent),i=/Opera\//.test(navigator.userAgent),j=/Apple Computer/.test(navigator.vendor),k=/KHTML\//.test(navigator.userAgent),l=/Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent),m=/PhantomJS/.test(navigator.userAgent),n=/AppleWebKit/.test(navigator.userAgent)&&/Mobile\/\w+/.test(navigator.userAgent),o=n||/Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent),p=n||/Mac/.test(navigator.platform),q=/win/i.test(navigator.platform),r=i&&navigator.userAgent.match(/Version\/(\d*\.\d*)/);r&&(r=Number(r[1])),r&&r>=15&&(i=!1,f=!0);var s=p&&(g||i&&(null==r||12.11>r)),t=a||d&&e>=9,u=!1,v=!1,nb=w.Pos=function(a,b){return this instanceof nb?(this.line=a,this.ch=b,void 0):new nb(a,b)},ob=w.cmpPos=function(a,b){return a.line-b.line||a.ch-b.ch};sb.prototype={primary:function(){return this.ranges[this.primIndex]},equals:function(a){if(a==this)return!0;if(a.primIndex!=this.primIndex||a.ranges.length!=this.ranges.length)return!1;for(var b=0;b<this.ranges.length;b++){var c=this.ranges[b],d=a.ranges[b];if(0!=ob(c.anchor,d.anchor)||0!=ob(c.head,d.head))return!1}return!0},deepCopy:function(){for(var a=[],b=0;b<this.ranges.length;b++)a[b]=new tb(pb(this.ranges[b].anchor),pb(this.ranges[b].head));return new sb(a,this.primIndex)},somethingSelected:function(){for(var a=0;a<this.ranges.length;a++)if(!this.ranges[a].empty())return!0;return!1},contains:function(a,b){b||(b=a);for(var c=0;c<this.ranges.length;c++){var d=this.ranges[c];if(ob(b,d.from())>=0&&ob(a,d.to())<=0)return c}return-1}},tb.prototype={from:function(){return rb(this.anchor,this.head)},to:function(){return qb(this.anchor,this.head)},empty:function(){return this.head.line==this.anchor.line&&this.head.ch==this.anchor.ch}};var wc,id,jd,gc={left:0,right:0,top:0,bottom:0},zc=null,Ac=0,Zc=null,pd=0,ud=0,vd=null;d?vd=-.53:a?vd=15:h?vd=-.7:j&&(vd=-1/3);var zd,Cd=null,Ld=w.changeEnd=function(a){return a.text?nb(a.from.line+a.text.length-1,Jg(a.text).length+(1==a.text.length?a.from.ch:0)):a.to};w.prototype={constructor:w,focus:function(){window.focus(),ad(this),Yc(this)},setOption:function(a,b){var c=this.options,d=c[a];(c[a]!=b||"mode"==a)&&(c[a]=b,je.hasOwnProperty(a)&&Lc(this,je[a])(this,b,d))},getOption:function(a){return this.options[a]},getDoc:function(){return this.doc},addKeyMap:function(a,b){this.state.keyMaps[b?"push":"unshift"](a)},removeKeyMap:function(a){for(var b=this.state.keyMaps,c=0;c<b.length;++c)if(b[c]==a||"string"!=typeof b[c]&&b[c].name==a)return b.splice(c,1),!0},addOverlay:Mc(function(a,b){var c=a.token?a:w.getMode(this.options,a);if(c.startState)throw new Error("Overlays may not be stateful.");this.state.overlays.push({mode:c,modeSpec:a,opaque:b&&b.opaque}),this.state.modeGen++,Qc(this)}),removeOverlay:Mc(function(a){for(var b=this.state.overlays,c=0;c<b.length;++c){var d=b[c].modeSpec;if(d==a||"string"==typeof a&&d.name==a)return b.splice(c,1),this.state.modeGen++,Qc(this),void 0}}),indentLine:Mc(function(a,b,c){"string"!=typeof b&&"number"!=typeof b&&(b=null==b?this.options.smartIndent?"smart":"prev":b?"add":"subtract"),zb(this.doc,a)&&de(this,a,b,c)}),indentSelection:Mc(function(a){for(var b=this.doc.sel.ranges,c=-1,d=0;d<b.length;d++){var e=b[d];if(e.empty())e.head.line>c&&(de(this,e.head.line,a,!0),c=e.head.line,d==this.doc.sel.primIndex&&be(this));else{var f=e.from(),g=e.to(),h=Math.max(c,f.line);c=Math.min(this.lastLine(),g.line-(g.ch?0:1))+1;for(var i=h;c>i;++i)de(this,i,a);var j=this.doc.sel.ranges;0==f.ch&&b.length==j.length&&j[d].from().ch>0&&Eb(this.doc,d,new tb(f,j[d].to()),Bg)}}}),getTokenAt:function(a,b){var c=this.doc;a=xb(c,a);for(var d=Xb(this,a.line,b),e=this.doc.mode,f=Of(c,a.line),g=new ze(f.text,this.options.tabSize);g.pos<a.ch&&!g.eol();){g.start=g.pos;var h=pf(e,g,d)}return{start:g.start,end:g.pos,string:g.current(),type:h||null,state:d}},getTokenTypeAt:function(a){a=xb(this.doc,a);var f,b=sf(this,Of(this.doc,a.line)),c=0,d=(b.length-1)/2,e=a.ch;if(0==e)f=b[2];else for(;;){var g=c+d>>1;if((g?b[2*g-1]:0)>=e)d=g;else{if(!(b[2*g+1]<e)){f=b[2*g+2];break}c=g+1}}var h=f?f.indexOf("cm-overlay "):-1;return 0>h?f:0==h?null:f.slice(0,h-1)},getModeAt:function(a){var b=this.doc.mode;return b.innerMode?w.innerMode(b,this.getTokenAt(a).state).mode:b},getHelper:function(a,b){return this.getHelpers(a,b)[0]},getHelpers:function(a,b){var c=[];if(!qe.hasOwnProperty(b))return qe;var d=qe[b],e=this.getModeAt(a);if("string"==typeof e[b])d[e[b]]&&c.push(d[e[b]]);else if(e[b])for(var f=0;f<e[b].length;f++){var g=d[e[b][f]];g&&c.push(g)}else e.helperType&&d[e.helperType]?c.push(d[e.helperType]):d[e.name]&&c.push(d[e.name]);for(var f=0;f<d._global.length;f++){var h=d._global[f];h.pred(e,this)&&-1==Lg(c,h.val)&&c.push(h.val)}return c},getStateAfter:function(a,b){var c=this.doc;return a=wb(c,null==a?c.first+c.size-1:a),Xb(this,a+1,b)},cursorCoords:function(a,b){var c,d=this.doc.sel.primary();return c=null==a?d.head:"object"==typeof a?xb(this.doc,a):a?d.from():d.to(),rc(this,c,b||"page")},charCoords:function(a,b){return qc(this,xb(this.doc,a),b||"page")},coordsChar:function(a,b){return a=pc(this,a,b||"page"),uc(this,a.left,a.top)},lineAtHeight:function(a,b){return a=pc(this,{top:a,left:0},b||"page").top,Tf(this.doc,a+this.display.viewOffset)},heightAtLine:function(a,b){var c=!1,d=this.doc.first+this.doc.size-1;a<this.doc.first?a=this.doc.first:a>d&&(a=d,c=!0);var e=Of(this.doc,a);return oc(this,e,{top:0,left:0},b||"page").top+(c?this.doc.height-Uf(e):0)},defaultTextHeight:function(){return xc(this.display)},defaultCharWidth:function(){return yc(this.display)},setGutterMarker:Mc(function(a,b,c){return ee(this.doc,a,"gutter",function(a){var d=a.gutterMarkers||(a.gutterMarkers={});return d[b]=c,!c&&Tg(d)&&(a.gutterMarkers=null),!0})}),clearGutter:Mc(function(a){var b=this,c=b.doc,d=c.first;c.iter(function(c){c.gutterMarkers&&c.gutterMarkers[a]&&(c.gutterMarkers[a]=null,Rc(b,d,"gutter"),Tg(c.gutterMarkers)&&(c.gutterMarkers=null)),++d})}),addLineWidget:Mc(function(a,b,c){return jf(this,a,b,c)}),removeLineWidget:function(a){a.clear()},lineInfo:function(a){if("number"==typeof a){if(!zb(this.doc,a))return null;var b=a;if(a=Of(this.doc,a),!a)return null}else{var b=Sf(a);if(null==b)return null}return{line:b,handle:a,text:a.text,gutterMarkers:a.gutterMarkers,textClass:a.textClass,bgClass:a.bgClass,wrapClass:a.wrapClass,widgets:a.widgets}},getViewport:function(){return{from:this.display.viewFrom,to:this.display.viewTo}},addWidget:function(a,b,c,d,e){var f=this.display;a=rc(this,xb(this.doc,a));var g=a.bottom,h=a.left;if(b.style.position="absolute",f.sizer.appendChild(b),"over"==d)g=a.top;else if("above"==d||"near"==d){var i=Math.max(f.wrapper.clientHeight,this.doc.height),j=Math.max(f.sizer.clientWidth,f.lineSpace.clientWidth);("above"==d||a.bottom+b.offsetHeight>i)&&a.top>b.offsetHeight?g=a.top-b.offsetHeight:a.bottom+b.offsetHeight<=i&&(g=a.bottom),h+b.offsetWidth>j&&(h=j-b.offsetWidth)}b.style.top=g+"px",b.style.left=b.style.right="","right"==e?(h=f.sizer.clientWidth-b.offsetWidth,b.style.right="0px"):("left"==e?h=0:"middle"==e&&(h=(f.sizer.clientWidth-b.offsetWidth)/2),b.style.left=h+"px"),c&&$d(this,h,g,h+b.offsetWidth,g+b.offsetHeight)},triggerOnKeyDown:Mc(Dd),triggerOnKeyPress:Mc(Gd),triggerOnKeyUp:Fd,execCommand:function(a){return te.hasOwnProperty(a)?te[a](this):void 0},findPosH:function(a,b,c,d){var e=1;0>b&&(e=-1,b=-b);for(var f=0,g=xb(this.doc,a);b>f&&(g=ge(this.doc,g,e,c,d),!g.hitSide);++f);return g
},moveH:Mc(function(a,b){var c=this;c.extendSelectionsBy(function(d){return c.display.shift||c.doc.extend||d.empty()?ge(c.doc,d.head,a,b,c.options.rtlMoveVisually):0>a?d.from():d.to()},Dg)}),deleteH:Mc(function(a,b){var c=this.doc.sel,d=this.doc;c.somethingSelected()?d.replaceSelection("",null,"+delete"):fe(this,function(c){var e=ge(d,c.head,a,b,!1);return 0>a?{from:e,to:c.head}:{from:c.head,to:e}})}),findPosV:function(a,b,c,d){var e=1,f=d;0>b&&(e=-1,b=-b);for(var g=0,h=xb(this.doc,a);b>g;++g){var i=rc(this,h,"div");if(null==f?f=i.left:i.left=f,h=he(this,i,e,c),h.hitSide)break}return h},moveV:Mc(function(a,b){var c=this,d=this.doc,e=[],f=!c.display.shift&&!d.extend&&d.sel.somethingSelected();if(d.extendSelectionsBy(function(g){if(f)return 0>a?g.from():g.to();var h=rc(c,g.head,"div");null!=g.goalColumn&&(h.left=g.goalColumn),e.push(h.left);var i=he(c,h,a,b);return"page"==b&&g==d.sel.primary()&&ae(c,null,qc(c,i,"div").top-h.top),i},Dg),e.length)for(var g=0;g<d.sel.ranges.length;g++)d.sel.ranges[g].goalColumn=e[g]}),findWordAt:function(a){var b=this.doc,c=Of(b,a.line).text,d=a.ch,e=a.ch;if(c){var f=this.getHelper(a,"wordChars");(a.xRel<0||e==c.length)&&d?--d:++e;for(var g=c.charAt(d),h=Sg(g,f)?function(a){return Sg(a,f)}:/\s/.test(g)?function(a){return/\s/.test(a)}:function(a){return!/\s/.test(a)&&!Sg(a)};d>0&&h(c.charAt(d-1));)--d;for(;e<c.length&&h(c.charAt(e));)++e}return new tb(nb(a.line,d),nb(a.line,e))},toggleOverwrite:function(a){(null==a||a!=this.state.overwrite)&&((this.state.overwrite=!this.state.overwrite)?ch(this.display.cursorDiv,"CodeMirror-overwrite"):bh(this.display.cursorDiv,"CodeMirror-overwrite"),rg(this,"overwriteToggle",this,this.state.overwrite))},hasFocus:function(){return _g()==this.display.input},scrollTo:Mc(function(a,b){(null!=a||null!=b)&&ce(this),null!=a&&(this.curOp.scrollLeft=a),null!=b&&(this.curOp.scrollTop=b)}),getScrollInfo:function(){var a=this.display.scroller,b=zg;return{left:a.scrollLeft,top:a.scrollTop,height:a.scrollHeight-b,width:a.scrollWidth-b,clientHeight:a.clientHeight-b,clientWidth:a.clientWidth-b}},scrollIntoView:Mc(function(a,b){if(null==a?(a={from:this.doc.sel.primary().head,to:null},null==b&&(b=this.options.cursorScrollMargin)):"number"==typeof a?a={from:nb(a,0),to:null}:null==a.from&&(a={from:a,to:null}),a.to||(a.to=a.from),a.margin=b||0,null!=a.from.line)ce(this),this.curOp.scrollToPos=a;else{var c=_d(this,Math.min(a.from.left,a.to.left),Math.min(a.from.top,a.to.top)-a.margin,Math.max(a.from.right,a.to.right),Math.max(a.from.bottom,a.to.bottom)+a.margin);this.scrollTo(c.scrollLeft,c.scrollTop)}}),setSize:Mc(function(a,b){function d(a){return"number"==typeof a||/^\d+$/.test(String(a))?a+"px":a}var c=this;null!=a&&(c.display.wrapper.style.width=d(a)),null!=b&&(c.display.wrapper.style.height=d(b)),c.options.lineWrapping&&kc(this);var e=c.display.viewFrom;c.doc.iter(e,c.display.viewTo,function(a){if(a.widgets)for(var b=0;b<a.widgets.length;b++)if(a.widgets[b].noHScroll){Rc(c,e,"widget");break}++e}),c.curOp.forceUpdate=!0,rg(c,"refresh",this)}),operation:function(a){return Kc(this,a)},refresh:Mc(function(){var a=this.display.cachedTextHeight;Qc(this),this.curOp.forceUpdate=!0,lc(this),this.scrollTo(this.doc.scrollLeft,this.doc.scrollTop),H(this),(null==a||Math.abs(a-xc(this.display))>.5)&&C(this),rg(this,"refresh",this)}),swapDoc:Mc(function(a){var b=this.doc;return b.cm=null,Nf(this,a),lc(this),_c(this),this.scrollTo(a.scrollLeft,a.scrollTop),this.curOp.forceScroll=!0,tg(this,"swapDoc",this,b),b}),getInputField:function(){return this.display.input},getWrapperElement:function(){return this.display.wrapper},getScrollerElement:function(){return this.display.scroller},getGutterElement:function(){return this.display.gutters}},yg(w);var ie=w.defaults={},je=w.optionHandlers={},le=w.Init={toString:function(){return"CodeMirror.Init"}};ke("value","",function(a,b){a.setValue(b)},!0),ke("mode",null,function(a,b){a.doc.modeOption=b,y(a)},!0),ke("indentUnit",2,y,!0),ke("indentWithTabs",!1),ke("smartIndent",!0),ke("tabSize",4,function(a){z(a),lc(a),Qc(a)},!0),ke("specialChars",/[\t\u0000-\u0019\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g,function(a,b){a.options.specialChars=new RegExp(b.source+(b.test("  ")?"":"| "),"g"),a.refresh()},!0),ke("specialCharPlaceholder",yf,function(a){a.refresh()},!0),ke("electricChars",!0),ke("rtlMoveVisually",!q),ke("wholeLineUpdateBefore",!0),ke("theme","default",function(a){E(a),F(a)},!0),ke("keyMap","default",D),ke("extraKeys",null),ke("lineWrapping",!1,A,!0),ke("gutters",[],function(a){K(a.options),F(a)},!0),ke("fixedGutter",!0,function(a,b){a.display.gutters.style.left=b?S(a.display)+"px":"0",a.refresh()},!0),ke("coverGutterNextToScrollbar",!1,N,!0),ke("lineNumbers",!1,function(a){K(a.options),F(a)},!0),ke("firstLineNumber",1,F,!0),ke("lineNumberFormatter",function(a){return a},F,!0),ke("showCursorWhenSelecting",!1,Qb,!0),ke("resetSelectionOnContextMenu",!0),ke("readOnly",!1,function(a,b){"nocursor"==b?(Id(a),a.display.input.blur(),a.display.disabled=!0):(a.display.disabled=!1,b||_c(a))}),ke("disableInput",!1,function(a,b){b||_c(a)},!0),ke("dragDrop",!0),ke("cursorBlinkRate",530),ke("cursorScrollMargin",0),ke("cursorHeight",1,Qb,!0),ke("singleCursorHeightPerLine",!0,Qb,!0),ke("workTime",100),ke("workDelay",100),ke("flattenSpans",!0,z,!0),ke("addModeClass",!1,z,!0),ke("pollInterval",100),ke("undoDepth",200,function(a,b){a.doc.history.undoDepth=b}),ke("historyEventDelay",1250),ke("viewportMargin",10,function(a){a.refresh()},!0),ke("maxHighlightLength",1e4,z,!0),ke("moveInputWithCursor",!0,function(a,b){b||(a.display.inputDiv.style.top=a.display.inputDiv.style.left=0)}),ke("tabindex",null,function(a,b){a.display.input.tabIndex=b||""}),ke("autofocus",null);var me=w.modes={},ne=w.mimeModes={};w.defineMode=function(a,b){if(w.defaults.mode||"null"==a||(w.defaults.mode=a),arguments.length>2){b.dependencies=[];for(var c=2;c<arguments.length;++c)b.dependencies.push(arguments[c])}me[a]=b},w.defineMIME=function(a,b){ne[a]=b},w.resolveMode=function(a){if("string"==typeof a&&ne.hasOwnProperty(a))a=ne[a];else if(a&&"string"==typeof a.name&&ne.hasOwnProperty(a.name)){var b=ne[a.name];"string"==typeof b&&(b={name:b}),a=Ng(b,a),a.name=b.name}else if("string"==typeof a&&/^[\w\-]+\/[\w\-]+\+xml$/.test(a))return w.resolveMode("application/xml");return"string"==typeof a?{name:a}:a||{name:"null"}},w.getMode=function(a,b){var b=w.resolveMode(b),c=me[b.name];if(!c)return w.getMode(a,"text/plain");var d=c(a,b);if(oe.hasOwnProperty(b.name)){var e=oe[b.name];for(var f in e)e.hasOwnProperty(f)&&(d.hasOwnProperty(f)&&(d["_"+f]=d[f]),d[f]=e[f])}if(d.name=b.name,b.helperType&&(d.helperType=b.helperType),b.modeProps)for(var f in b.modeProps)d[f]=b.modeProps[f];return d},w.defineMode("null",function(){return{token:function(a){a.skipToEnd()}}}),w.defineMIME("text/plain","null");var oe=w.modeExtensions={};w.extendMode=function(a,b){var c=oe.hasOwnProperty(a)?oe[a]:oe[a]={};Og(b,c)},w.defineExtension=function(a,b){w.prototype[a]=b},w.defineDocExtension=function(a,b){Jf.prototype[a]=b},w.defineOption=ke;var pe=[];w.defineInitHook=function(a){pe.push(a)};var qe=w.helpers={};w.registerHelper=function(a,b,c){qe.hasOwnProperty(a)||(qe[a]=w[a]={_global:[]}),qe[a][b]=c},w.registerGlobalHelper=function(a,b,c,d){w.registerHelper(a,b,d),qe[a]._global.push({pred:c,val:d})};var re=w.copyState=function(a,b){if(b===!0)return b;if(a.copyState)return a.copyState(b);var c={};for(var d in b){var e=b[d];e instanceof Array&&(e=e.concat([])),c[d]=e}return c},se=w.startState=function(a,b,c){return a.startState?a.startState(b,c):!0};w.innerMode=function(a,b){for(;a.innerMode;){var c=a.innerMode(b);if(!c||c.mode==a)break;b=c.state,a=c.mode}return c||{mode:a,state:b}};var te=w.commands={selectAll:function(a){a.setSelection(nb(a.firstLine(),0),nb(a.lastLine()),Bg)},singleSelection:function(a){a.setSelection(a.getCursor("anchor"),a.getCursor("head"),Bg)},killLine:function(a){fe(a,function(b){if(b.empty()){var c=Of(a.doc,b.head.line).text.length;return b.head.ch==c&&b.head.line<a.lastLine()?{from:b.head,to:nb(b.head.line+1,0)}:{from:b.head,to:nb(b.head.line,c)}}return{from:b.from(),to:b.to()}})},deleteLine:function(a){fe(a,function(b){return{from:nb(b.from().line,0),to:xb(a.doc,nb(b.to().line+1,0))}})},delLineLeft:function(a){fe(a,function(a){return{from:nb(a.from().line,0),to:a.from()}})},delWrappedLineLeft:function(a){fe(a,function(b){var c=a.charCoords(b.head,"div").top+5,d=a.coordsChar({left:0,top:c},"div");return{from:d,to:b.from()}})},delWrappedLineRight:function(a){fe(a,function(b){var c=a.charCoords(b.head,"div").top+5,d=a.coordsChar({left:a.display.lineDiv.offsetWidth+100,top:c},"div");return{from:b.from(),to:d}})},undo:function(a){a.undo()},redo:function(a){a.redo()},undoSelection:function(a){a.undoSelection()},redoSelection:function(a){a.redoSelection()},goDocStart:function(a){a.extendSelection(nb(a.firstLine(),0))},goDocEnd:function(a){a.extendSelection(nb(a.lastLine()))},goLineStart:function(a){a.extendSelectionsBy(function(b){return Ah(a,b.head.line)},{origin:"+move",bias:1})},goLineStartSmart:function(a){a.extendSelectionsBy(function(b){return Ch(a,b.head)},{origin:"+move",bias:1})},goLineEnd:function(a){a.extendSelectionsBy(function(b){return Bh(a,b.head.line)},{origin:"+move",bias:-1})},goLineRight:function(a){a.extendSelectionsBy(function(b){var c=a.charCoords(b.head,"div").top+5;return a.coordsChar({left:a.display.lineDiv.offsetWidth+100,top:c},"div")},Dg)},goLineLeft:function(a){a.extendSelectionsBy(function(b){var c=a.charCoords(b.head,"div").top+5;return a.coordsChar({left:0,top:c},"div")},Dg)},goLineLeftSmart:function(a){a.extendSelectionsBy(function(b){var c=a.charCoords(b.head,"div").top+5,d=a.coordsChar({left:0,top:c},"div");return d.ch<a.getLine(d.line).search(/\S/)?Ch(a,b.head):d},Dg)},goLineUp:function(a){a.moveV(-1,"line")},goLineDown:function(a){a.moveV(1,"line")},goPageUp:function(a){a.moveV(-1,"page")},goPageDown:function(a){a.moveV(1,"page")},goCharLeft:function(a){a.moveH(-1,"char")},goCharRight:function(a){a.moveH(1,"char")},goColumnLeft:function(a){a.moveH(-1,"column")},goColumnRight:function(a){a.moveH(1,"column")},goWordLeft:function(a){a.moveH(-1,"word")},goGroupRight:function(a){a.moveH(1,"group")},goGroupLeft:function(a){a.moveH(-1,"group")},goWordRight:function(a){a.moveH(1,"word")},delCharBefore:function(a){a.deleteH(-1,"char")},delCharAfter:function(a){a.deleteH(1,"char")},delWordBefore:function(a){a.deleteH(-1,"word")},delWordAfter:function(a){a.deleteH(1,"word")},delGroupBefore:function(a){a.deleteH(-1,"group")},delGroupAfter:function(a){a.deleteH(1,"group")},indentAuto:function(a){a.indentSelection("smart")},indentMore:function(a){a.indentSelection("add")},indentLess:function(a){a.indentSelection("subtract")},insertTab:function(a){a.replaceSelection("   ")},insertSoftTab:function(a){for(var b=[],c=a.listSelections(),d=a.options.tabSize,e=0;e<c.length;e++){var f=c[e].from(),g=Fg(a.getLine(f.line),f.ch,d);b.push(new Array(d-g%d+1).join(" "))}a.replaceSelections(b)},defaultTab:function(a){a.somethingSelected()?a.indentSelection("add"):a.execCommand("insertTab")},transposeChars:function(a){Kc(a,function(){for(var b=a.listSelections(),c=[],d=0;d<b.length;d++){var e=b[d].head,f=Of(a.doc,e.line).text;if(f)if(e.ch==f.length&&(e=new nb(e.line,e.ch-1)),e.ch>0)e=new nb(e.line,e.ch+1),a.replaceRange(f.charAt(e.ch-1)+f.charAt(e.ch-2),nb(e.line,e.ch-2),e,"+transpose");else if(e.line>a.doc.first){var g=Of(a.doc,e.line-1).text;g&&a.replaceRange(f.charAt(0)+"\n"+g.charAt(g.length-1),nb(e.line-1,g.length-1),nb(e.line,1),"+transpose")}c.push(new tb(e,e))}a.setSelections(c)})},newlineAndIndent:function(a){Kc(a,function(){for(var b=a.listSelections().length,c=0;b>c;c++){var d=a.listSelections()[c];a.replaceRange("\n",d.anchor,d.head,"+input"),a.indentLine(d.from().line+1,null,!0),be(a)}})},toggleOverwrite:function(a){a.toggleOverwrite()}},ue=w.keyMap={};ue.basic={Left:"goCharLeft",Right:"goCharRight",Up:"goLineUp",Down:"goLineDown",End:"goLineEnd",Home:"goLineStartSmart",PageUp:"goPageUp",PageDown:"goPageDown",Delete:"delCharAfter",Backspace:"delCharBefore","Shift-Backspace":"delCharBefore",Tab:"defaultTab","Shift-Tab":"indentAuto",Enter:"newlineAndIndent",Insert:"toggleOverwrite",Esc:"singleSelection"},ue.pcDefault={"Ctrl-A":"selectAll","Ctrl-D":"deleteLine","Ctrl-Z":"undo","Shift-Ctrl-Z":"redo","Ctrl-Y":"redo","Ctrl-Home":"goDocStart","Ctrl-Up":"goDocStart","Ctrl-End":"goDocEnd","Ctrl-Down":"goDocEnd","Ctrl-Left":"goGroupLeft","Ctrl-Right":"goGroupRight","Alt-Left":"goLineStart","Alt-Right":"goLineEnd","Ctrl-Backspace":"delGroupBefore","Ctrl-Delete":"delGroupAfter","Ctrl-S":"save","Ctrl-F":"find","Ctrl-G":"findNext","Shift-Ctrl-G":"findPrev","Shift-Ctrl-F":"replace","Shift-Ctrl-R":"replaceAll","Ctrl-[":"indentLess","Ctrl-]":"indentMore","Ctrl-U":"undoSelection","Shift-Ctrl-U":"redoSelection","Alt-U":"redoSelection",fallthrough:"basic"},ue.macDefault={"Cmd-A":"selectAll","Cmd-D":"deleteLine","Cmd-Z":"undo","Shift-Cmd-Z":"redo","Cmd-Y":"redo","Cmd-Home":"goDocStart","Cmd-Up":"goDocStart","Cmd-End":"goDocEnd","Cmd-Down":"goDocEnd","Alt-Left":"goGroupLeft","Alt-Right":"goGroupRight","Cmd-Left":"goLineLeft","Cmd-Right":"goLineRight","Alt-Backspace":"delGroupBefore","Ctrl-Alt-Backspace":"delGroupAfter","Alt-Delete":"delGroupAfter","Cmd-S":"save","Cmd-F":"find","Cmd-G":"findNext","Shift-Cmd-G":"findPrev","Cmd-Alt-F":"replace","Shift-Cmd-Alt-F":"replaceAll","Cmd-[":"indentLess","Cmd-]":"indentMore","Cmd-Backspace":"delWrappedLineLeft","Cmd-Delete":"delWrappedLineRight","Cmd-U":"undoSelection","Shift-Cmd-U":"redoSelection",fallthrough:["basic","emacsy"]},ue.emacsy={"Ctrl-F":"goCharRight","Ctrl-B":"goCharLeft","Ctrl-P":"goLineUp","Ctrl-N":"goLineDown","Alt-F":"goWordRight","Alt-B":"goWordLeft","Ctrl-A":"goLineStart","Ctrl-E":"goLineEnd","Ctrl-V":"goPageDown","Shift-Ctrl-V":"goPageUp","Ctrl-D":"delCharAfter","Ctrl-H":"delCharBefore","Alt-D":"delWordAfter","Alt-Backspace":"delWordBefore","Ctrl-K":"killLine","Ctrl-T":"transposeChars"},ue["default"]=p?ue.macDefault:ue.pcDefault;var we=w.lookupKey=function(a,b,c){function d(b){b=ve(b);var e=b[a];if(e===!1)return"stop";if(null!=e&&c(e))return!0;if(b.nofallthrough)return"stop";var f=b.fallthrough;if(null==f)return!1;if("[object Array]"!=Object.prototype.toString.call(f))return d(f);for(var g=0;g<f.length;++g){var h=d(f[g]);if(h)return h}return!1}for(var e=0;e<b.length;++e){var f=d(b[e]);if(f)return"stop"!=f}},xe=w.isModifierKey=function(a){var b=uh[a.keyCode];return"Ctrl"==b||"Alt"==b||"Shift"==b||"Mod"==b},ye=w.keyName=function(a,b){if(i&&34==a.keyCode&&a["char"])return!1;var c=uh[a.keyCode];return null==c||a.altGraphKey?!1:(a.altKey&&(c="Alt-"+c),(s?a.metaKey:a.ctrlKey)&&(c="Ctrl-"+c),(s?a.ctrlKey:a.metaKey)&&(c="Cmd-"+c),!b&&a.shiftKey&&(c="Shift-"+c),c)};w.fromTextArea=function(a,b){function d(){a.value=i.getValue()}if(b||(b={}),b.value=a.value,!b.tabindex&&a.tabindex&&(b.tabindex=a.tabindex),!b.placeholder&&a.placeholder&&(b.placeholder=a.placeholder),null==b.autofocus){var c=_g();b.autofocus=c==a||null!=a.getAttribute("autofocus")&&c==document.body}if(a.form&&(pg(a.form,"submit",d),!b.leaveSubmitMethodAlone)){var e=a.form,f=e.submit;try{var g=e.submit=function(){d(),e.submit=f,e.submit(),e.submit=g}}catch(h){}}a.style.display="none";var i=w(function(b){a.parentNode.insertBefore(b,a.nextSibling)},b);return i.save=d,i.getTextArea=function(){return a},i.toTextArea=function(){d(),a.parentNode.removeChild(i.getWrapperElement()),a.style.display="",a.form&&(qg(a.form,"submit",d),"function"==typeof a.form.submit&&(a.form.submit=f))},i};var ze=w.StringStream=function(a,b){this.pos=this.start=0,this.string=a,this.tabSize=b||8,this.lastColumnPos=this.lastColumnValue=0,this.lineStart=0};ze.prototype={eol:function(){return this.pos>=this.string.length},sol:function(){return this.pos==this.lineStart},peek:function(){return this.string.charAt(this.pos)||void 0},next:function(){return this.pos<this.string.length?this.string.charAt(this.pos++):void 0},eat:function(a){var b=this.string.charAt(this.pos);if("string"==typeof a)var c=b==a;else var c=b&&(a.test?a.test(b):a(b));return c?(++this.pos,b):void 0},eatWhile:function(a){for(var b=this.pos;this.eat(a););return this.pos>b},eatSpace:function(){for(var a=this.pos;/[\s\u00a0]/.test(this.string.charAt(this.pos));)++this.pos;return this.pos>a},skipToEnd:function(){this.pos=this.string.length},skipTo:function(a){var b=this.string.indexOf(a,this.pos);return b>-1?(this.pos=b,!0):void 0},backUp:function(a){this.pos-=a},column:function(){return this.lastColumnPos<this.start&&(this.lastColumnValue=Fg(this.string,this.start,this.tabSize,this.lastColumnPos,this.lastColumnValue),this.lastColumnPos=this.start),this.lastColumnValue-(this.lineStart?Fg(this.string,this.lineStart,this.tabSize):0)},indentation:function(){return Fg(this.string,null,this.tabSize)-(this.lineStart?Fg(this.string,this.lineStart,this.tabSize):0)},match:function(a,b,c){if("string"!=typeof a){var f=this.string.slice(this.pos).match(a);return f&&f.index>0?null:(f&&b!==!1&&(this.pos+=f[0].length),f)}var d=function(a){return c?a.toLowerCase():a},e=this.string.substr(this.pos,a.length);return d(e)==d(a)?(b!==!1&&(this.pos+=a.length),!0):void 0},current:function(){return this.string.slice(this.start,this.pos)},hideFirstChars:function(a,b){this.lineStart+=a;try{return b()}finally{this.lineStart-=a}}};var Ae=w.TextMarker=function(a,b){this.lines=[],this.type=b,this.doc=a};yg(Ae),Ae.prototype.clear=function(){if(!this.explicitlyCleared){var a=this.doc.cm,b=a&&!a.curOp;if(b&&Bc(a),xg(this,"clear")){var c=this.find();c&&tg(this,"clear",c.from,c.to)}for(var d=null,e=null,f=0;f<this.lines.length;++f){var g=this.lines[f],h=Je(g.markedSpans,this);a&&!this.collapsed?Rc(a,Sf(g),"text"):a&&(null!=h.to&&(e=Sf(g)),null!=h.from&&(d=Sf(g))),g.markedSpans=Ke(g.markedSpans,h),null==h.from&&this.collapsed&&!df(this.doc,g)&&a&&Rf(g,xc(a.display))}if(a&&this.collapsed&&!a.options.lineWrapping)for(var f=0;f<this.lines.length;++f){var i=_e(this.lines[f]),j=I(i);j>a.display.maxLineLength&&(a.display.maxLine=i,a.display.maxLineLength=j,a.display.maxLineChanged=!0)}null!=d&&a&&this.collapsed&&Qc(a,d,e+1),this.lines.length=0,this.explicitlyCleared=!0,this.atomic&&this.doc.cantEdit&&(this.doc.cantEdit=!1,a&&Lb(a.doc)),a&&tg(a,"markerCleared",a,this),b&&Dc(a),this.parent&&this.parent.clear()}},Ae.prototype.find=function(a,b){null==a&&"bookmark"==this.type&&(a=1);for(var c,d,e=0;e<this.lines.length;++e){var f=this.lines[e],g=Je(f.markedSpans,this);if(null!=g.from&&(c=nb(b?f:Sf(f),g.from),-1==a))return c;if(null!=g.to&&(d=nb(b?f:Sf(f),g.to),1==a))return d}return c&&{from:c,to:d}},Ae.prototype.changed=function(){var a=this.find(-1,!0),b=this,c=this.doc.cm;a&&c&&Kc(c,function(){var d=a.line,e=Sf(a.line),f=dc(c,e);if(f&&(jc(f),c.curOp.selectionChanged=c.curOp.forceUpdate=!0),c.curOp.updateMaxLine=!0,!df(b.doc,d)&&null!=b.height){var g=b.height;b.height=null;var h=hf(b)-g;h&&Rf(d,d.height+h)}})},Ae.prototype.attachLine=function(a){if(!this.lines.length&&this.doc.cm){var b=this.doc.cm.curOp;b.maybeHiddenMarkers&&-1!=Lg(b.maybeHiddenMarkers,this)||(b.maybeUnhiddenMarkers||(b.maybeUnhiddenMarkers=[])).push(this)}this.lines.push(a)},Ae.prototype.detachLine=function(a){if(this.lines.splice(Lg(this.lines,a),1),!this.lines.length&&this.doc.cm){var b=this.doc.cm.curOp;(b.maybeHiddenMarkers||(b.maybeHiddenMarkers=[])).push(this)}};var Be=0,De=w.SharedTextMarker=function(a,b){this.markers=a,this.primary=b;for(var c=0;c<a.length;++c)a[c].parent=this};yg(De),De.prototype.clear=function(){if(!this.explicitlyCleared){this.explicitlyCleared=!0;for(var a=0;a<this.markers.length;++a)this.markers[a].clear();tg(this,"clear")}},De.prototype.find=function(a,b){return this.primary.find(a,b)};var ff=w.LineWidget=function(a,b,c){if(c)for(var d in c)c.hasOwnProperty(d)&&(this[d]=c[d]);this.cm=a,this.node=b};yg(ff),ff.prototype.clear=function(){var a=this.cm,b=this.line.widgets,c=this.line,d=Sf(c);if(null!=d&&b){for(var e=0;e<b.length;++e)b[e]==this&&b.splice(e--,1);b.length||(c.widgets=null);var f=hf(this);Kc(a,function(){gf(a,c,-f),Rc(a,d,"widget"),Rf(c,Math.max(0,c.height-f))})}},ff.prototype.changed=function(){var a=this.height,b=this.cm,c=this.line;this.height=null;var d=hf(this)-a;d&&Kc(b,function(){b.curOp.forceUpdate=!0,gf(b,c,d),Rf(c,c.height+d)})};var kf=w.Line=function(a,b,c){this.text=a,Te(this,b),this.height=c?c(this):1};yg(kf),kf.prototype.lineNo=function(){return Sf(this)};var uf={},vf={};Gf.prototype={chunkSize:function(){return this.lines.length},removeInner:function(a,b){for(var c=a,d=a+b;d>c;++c){var e=this.lines[c];this.height-=e.height,mf(e),tg(e,"delete")}this.lines.splice(a,b)},collapse:function(a){a.push.apply(a,this.lines)},insertInner:function(a,b,c){this.height+=c,this.lines=this.lines.slice(0,a).concat(b).concat(this.lines.slice(a));for(var d=0;d<b.length;++d)b[d].parent=this},iterN:function(a,b,c){for(var d=a+b;d>a;++a)if(c(this.lines[a]))return!0}},Hf.prototype={chunkSize:function(){return this.size},removeInner:function(a,b){this.size-=b;for(var c=0;c<this.children.length;++c){var d=this.children[c],e=d.chunkSize();if(e>a){var f=Math.min(b,e-a),g=d.height;if(d.removeInner(a,f),this.height-=g-d.height,e==f&&(this.children.splice(c--,1),d.parent=null),0==(b-=f))break;a=0}else a-=e}if(this.size-b<25&&(this.children.length>1||!(this.children[0]instanceof Gf))){var h=[];this.collapse(h),this.children=[new Gf(h)],this.children[0].parent=this}},collapse:function(a){for(var b=0;b<this.children.length;++b)this.children[b].collapse(a)},insertInner:function(a,b,c){this.size+=b.length,this.height+=c;for(var d=0;d<this.children.length;++d){var e=this.children[d],f=e.chunkSize();if(f>=a){if(e.insertInner(a,b,c),e.lines&&e.lines.length>50){for(;e.lines.length>50;){var g=e.lines.splice(e.lines.length-25,25),h=new Gf(g);e.height-=h.height,this.children.splice(d+1,0,h),h.parent=this}this.maybeSpill()}break}a-=f}},maybeSpill:function(){if(!(this.children.length<=10)){var a=this;do{var b=a.children.splice(a.children.length-5,5),c=new Hf(b);if(a.parent){a.size-=c.size,a.height-=c.height;var e=Lg(a.parent.children,a);a.parent.children.splice(e+1,0,c)}else{var d=new Hf(a.children);d.parent=a,a.children=[d,c],a=d}c.parent=a.parent}while(a.children.length>10);a.parent.maybeSpill()}},iterN:function(a,b,c){for(var d=0;d<this.children.length;++d){var e=this.children[d],f=e.chunkSize();if(f>a){var g=Math.min(b,f-a);if(e.iterN(a,g,c))return!0;if(0==(b-=g))break;a=0}else a-=f}}};var If=0,Jf=w.Doc=function(a,b,c){if(!(this instanceof Jf))return new Jf(a,b,c);null==c&&(c=0),Hf.call(this,[new Gf([new kf("",null)])]),this.first=c,this.scrollTop=this.scrollLeft=0,this.cantEdit=!1,this.cleanGeneration=1,this.frontier=c;var d=nb(c,0);this.sel=vb(d),this.history=new Wf(null),this.id=++If,this.modeOption=b,"string"==typeof a&&(a=ph(a)),Ff(this,{from:d,to:d,text:a}),Ib(this,vb(d),Bg)};Jf.prototype=Ng(Hf.prototype,{constructor:Jf,iter:function(a,b,c){c?this.iterN(a-this.first,b-a,c):this.iterN(this.first,this.first+this.size,a)},insert:function(a,b){for(var c=0,d=0;d<b.length;++d)c+=b[d].height;this.insertInner(a-this.first,b,c)},remove:function(a,b){this.removeInner(a-this.first,b)},getValue:function(a){var b=Qf(this,this.first,this.first+this.size);return a===!1?b:b.join(a||"\n")},setValue:Nc(function(a){var b=nb(this.first,0),c=this.first+this.size-1;Rd(this,{from:b,to:nb(c,Of(this,c).text.length),text:ph(a),origin:"setValue"},!0),Ib(this,vb(b))}),replaceRange:function(a,b,c,d){b=xb(this,b),c=c?xb(this,c):b,Xd(this,a,b,c,d)},getRange:function(a,b,c){var d=Pf(this,xb(this,a),xb(this,b));return c===!1?d:d.join(c||"\n")},getLine:function(a){var b=this.getLineHandle(a);return b&&b.text},getLineHandle:function(a){return zb(this,a)?Of(this,a):void 0},getLineNumber:function(a){return Sf(a)},getLineHandleVisualStart:function(a){return"number"==typeof a&&(a=Of(this,a)),_e(a)},lineCount:function(){return this.size},firstLine:function(){return this.first},lastLine:function(){return this.first+this.size-1},clipPos:function(a){return xb(this,a)},getCursor:function(a){var c,b=this.sel.primary();return c=null==a||"head"==a?b.head:"anchor"==a?b.anchor:"end"==a||"to"==a||a===!1?b.to():b.from()},listSelections:function(){return this.sel.ranges},somethingSelected:function(){return this.sel.somethingSelected()},setCursor:Nc(function(a,b,c){Fb(this,xb(this,"number"==typeof a?nb(a,b||0):a),null,c)}),setSelection:Nc(function(a,b,c){Fb(this,xb(this,a),xb(this,b||a),c)}),extendSelection:Nc(function(a,b,c){Cb(this,xb(this,a),b&&xb(this,b),c)}),extendSelections:Nc(function(a,b){Db(this,Ab(this,a,b))}),extendSelectionsBy:Nc(function(a,b){Db(this,Mg(this.sel.ranges,a),b)}),setSelections:Nc(function(a,b,c){if(a.length){for(var d=0,e=[];d<a.length;d++)e[d]=new tb(xb(this,a[d].anchor),xb(this,a[d].head));null==b&&(b=Math.min(a.length-1,this.sel.primIndex)),Ib(this,ub(e,b),c)}}),addSelection:Nc(function(a,b,c){var d=this.sel.ranges.slice(0);d.push(new tb(xb(this,a),xb(this,b||a))),Ib(this,ub(d,d.length-1),c)}),getSelection:function(a){for(var c,b=this.sel.ranges,d=0;d<b.length;d++){var e=Pf(this,b[d].from(),b[d].to());c=c?c.concat(e):e}return a===!1?c:c.join(a||"\n")},getSelections:function(a){for(var b=[],c=this.sel.ranges,d=0;d<c.length;d++){var e=Pf(this,c[d].from(),c[d].to());a!==!1&&(e=e.join(a||"\n")),b[d]=e}return b},replaceSelection:function(a,b,c){for(var d=[],e=0;e<this.sel.ranges.length;e++)d[e]=a;this.replaceSelections(d,b,c||"+input")},replaceSelections:Nc(function(a,b,c){for(var d=[],e=this.sel,f=0;f<e.ranges.length;f++){var g=e.ranges[f];d[f]={from:g.from(),to:g.to(),text:ph(a[f]),origin:c}}for(var h=b&&"end"!=b&&Pd(this,d,b),f=d.length-1;f>=0;f--)Rd(this,d[f]);h?Hb(this,h):this.cm&&be(this.cm)}),undo:Nc(function(){Td(this,"undo")}),redo:Nc(function(){Td(this,"redo")}),undoSelection:Nc(function(){Td(this,"undo",!0)}),redoSelection:Nc(function(){Td(this,"redo",!0)}),setExtending:function(a){this.extend=a},getExtending:function(){return this.extend},historySize:function(){for(var a=this.history,b=0,c=0,d=0;d<a.done.length;d++)a.done[d].ranges||++b;for(var d=0;d<a.undone.length;d++)a.undone[d].ranges||++c;return{undo:b,redo:c}},clearHistory:function(){this.history=new Wf(this.history.maxGeneration)},markClean:function(){this.cleanGeneration=this.changeGeneration(!0)},changeGeneration:function(a){return a&&(this.history.lastOp=this.history.lastSelOp=this.history.lastOrigin=null),this.history.generation},isClean:function(a){return this.history.generation==(a||this.cleanGeneration)},getHistory:function(){return{done:fg(this.history.done),undone:fg(this.history.undone)}},setHistory:function(a){var b=this.history=new Wf(this.history.maxGeneration);b.done=fg(a.done.slice(0),null,!0),b.undone=fg(a.undone.slice(0),null,!0)},addLineClass:Nc(function(a,b,c){return ee(this,a,"class",function(a){var d="text"==b?"textClass":"background"==b?"bgClass":"wrapClass";if(a[d]){if(new RegExp("(?:^|\\s)"+c+"(?:$|\\s)").test(a[d]))return!1;a[d]+=" "+c}else a[d]=c;return!0})}),removeLineClass:Nc(function(a,b,c){return ee(this,a,"class",function(a){var d="text"==b?"textClass":"background"==b?"bgClass":"wrapClass",e=a[d];if(!e)return!1;if(null==c)a[d]=null;else{var f=e.match(new RegExp("(?:^|\\s+)"+c+"(?:$|\\s+)"));if(!f)return!1;var g=f.index+f[0].length;a[d]=e.slice(0,f.index)+(f.index&&g!=e.length?" ":"")+e.slice(g)||null}return!0})}),markText:function(a,b,c){return Ce(this,xb(this,a),xb(this,b),c,"range")},setBookmark:function(a,b){var c={replacedWith:b&&(null==b.nodeType?b.widget:b),insertLeft:b&&b.insertLeft,clearWhenEmpty:!1,shared:b&&b.shared};return a=xb(this,a),Ce(this,a,a,c,"bookmark")},findMarksAt:function(a){a=xb(this,a);var b=[],c=Of(this,a.line).markedSpans;if(c)for(var d=0;d<c.length;++d){var e=c[d];(null==e.from||e.from<=a.ch)&&(null==e.to||e.to>=a.ch)&&b.push(e.marker.parent||e.marker)}return b},findMarks:function(a,b,c){a=xb(this,a),b=xb(this,b);var d=[],e=a.line;return this.iter(a.line,b.line+1,function(f){var g=f.markedSpans;if(g)for(var h=0;h<g.length;h++){var i=g[h];e==a.line&&a.ch>i.to||null==i.from&&e!=a.line||e==b.line&&i.from>b.ch||c&&!c(i.marker)||d.push(i.marker.parent||i.marker)}++e}),d},getAllMarks:function(){var a=[];return this.iter(function(b){var c=b.markedSpans;if(c)for(var d=0;d<c.length;++d)null!=c[d].from&&a.push(c[d].marker)}),a},posFromIndex:function(a){var b,c=this.first;return this.iter(function(d){var e=d.text.length+1;return e>a?(b=a,!0):(a-=e,++c,void 0)}),xb(this,nb(c,b))},indexFromPos:function(a){a=xb(this,a);var b=a.ch;return a.line<this.first||a.ch<0?0:(this.iter(this.first,a.line,function(a){b+=a.text.length+1}),b)},copy:function(a){var b=new Jf(Qf(this,this.first,this.first+this.size),this.modeOption,this.first);return b.scrollTop=this.scrollTop,b.scrollLeft=this.scrollLeft,b.sel=this.sel,b.extend=!1,a&&(b.history.undoDepth=this.history.undoDepth,b.setHistory(this.getHistory())),b},linkedDoc:function(a){a||(a={});var b=this.first,c=this.first+this.size;null!=a.from&&a.from>b&&(b=a.from),null!=a.to&&a.to<c&&(c=a.to);var d=new Jf(Qf(this,b,c),a.mode||this.modeOption,b);return a.sharedHist&&(d.history=this.history),(this.linked||(this.linked=[])).push({doc:d,sharedHist:a.sharedHist}),d.linked=[{doc:this,isParent:!0,sharedHist:a.sharedHist}],Ge(d,Fe(this)),d},unlinkDoc:function(a){if(a instanceof w&&(a=a.doc),this.linked)for(var b=0;b<this.linked.length;++b){var c=this.linked[b];if(c.doc==a){this.linked.splice(b,1),a.unlinkDoc(this),He(Fe(this));break}}if(a.history==this.history){var d=[a.id];Mf(a,function(a){d.push(a.id)},!0),a.history=new Wf(null),a.history.done=fg(this.history.done,d),a.history.undone=fg(this.history.undone,d)}},iterLinkedDocs:function(a){Mf(this,a)},getMode:function(){return this.mode},getEditor:function(){return this.cm}}),Jf.prototype.eachLine=Jf.prototype.iter;var Kf="iter insert remove copy getEditor".split(" ");for(var Lf in Jf.prototype)Jf.prototype.hasOwnProperty(Lf)&&Lg(Kf,Lf)<0&&(w.prototype[Lf]=function(a){return function(){return a.apply(this.doc,arguments)}}(Jf.prototype[Lf]));yg(Jf);var jg=w.e_preventDefault=function(a){a.preventDefault?a.preventDefault():a.returnValue=!1},kg=w.e_stopPropagation=function(a){a.stopPropagation?a.stopPropagation():a.cancelBubble=!0},mg=w.e_stop=function(a){jg(a),kg(a)},pg=w.on=function(a,b,c){if(a.addEventListener)a.addEventListener(b,c,!1);else if(a.attachEvent)a.attachEvent("on"+b,c);else{var d=a._handlers||(a._handlers={}),e=d[b]||(d[b]=[]);e.push(c)}},qg=w.off=function(a,b,c){if(a.removeEventListener)a.removeEventListener(b,c,!1);else if(a.detachEvent)a.detachEvent("on"+b,c);else{var d=a._handlers&&a._handlers[b];if(!d)return;for(var e=0;e<d.length;++e)if(d[e]==c){d.splice(e,1);break}}},rg=w.signal=function(a,b){var c=a._handlers&&a._handlers[b];if(c)for(var d=Array.prototype.slice.call(arguments,2),e=0;e<c.length;++e)c[e].apply(null,d)},sg=null,zg=30,Ag=w.Pass={toString:function(){return"CodeMirror.Pass"}},Bg={scroll:!1},Cg={origin:"*mouse"},Dg={origin:"+move"};Eg.prototype.set=function(a,b){clearTimeout(this.id),this.id=setTimeout(b,a)};var Fg=w.countColumn=function(a,b,c,d,e){null==b&&(b=a.search(/[^\s\u00a0]/),-1==b&&(b=a.length));for(var f=d||0,g=e||0;;){var h=a.indexOf("   ",f);if(0>h||h>=b)return g+(b-f);g+=h-f,g+=c-g%c,f=h+1}},Hg=[""],Kg=function(a){a.select()};n?Kg=function(a){a.selectionStart=0,a.selectionEnd=a.value.length}:d&&(Kg=function(a){try{a.select()}catch(b){}}),[].indexOf&&(Lg=function(a,b){return a.indexOf(b)}),[].map&&(Mg=function(a,b){return a.map(b)});var Xg,Qg=/[\u00df\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,Rg=w.isWordChar=function(a){return/\w/.test(a)||a>"\x80"&&(a.toUpperCase()!=a.toLowerCase()||Qg.test(a))},Ug=/[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
Xg=document.createRange?function(a,b,c){var d=document.createRange();return d.setEnd(a,c),d.setStart(a,b),d}:function(a,b,c){var d=document.body.createTextRange();return d.moveToElementText(a.parentNode),d.collapse(!0),d.moveEnd("character",c),d.moveStart("character",b),d},d&&11>e&&(_g=function(){try{return document.activeElement}catch(a){return document.body}});var jh,lh,nh,fh=!1,ih=function(){if(d&&9>e)return!1;var a=Wg("div");return"draggable"in a||"dragDrop"in a}(),ph=w.splitLines=3!="\n\nb".split(/\n/).length?function(a){for(var b=0,c=[],d=a.length;d>=b;){var e=a.indexOf("\n",b);-1==e&&(e=a.length);var f=a.slice(b,"\r"==a.charAt(e-1)?e-1:e),g=f.indexOf("\r");-1!=g?(c.push(f.slice(0,g)),b+=g+1):(c.push(f),b=e+1)}return c}:function(a){return a.split(/\r\n?|\n/)},qh=window.getSelection?function(a){try{return a.selectionStart!=a.selectionEnd}catch(b){return!1}}:function(a){try{var b=a.ownerDocument.selection.createRange()}catch(c){}return b&&b.parentElement()==a?0!=b.compareEndPoints("StartToEnd",b):!1},rh=function(){var a=Wg("div");return"oncopy"in a?!0:(a.setAttribute("oncopy","return;"),"function"==typeof a.oncopy)}(),sh=null,uh={3:"Enter",8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause",20:"CapsLock",27:"Esc",32:"Space",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",44:"PrintScrn",45:"Insert",46:"Delete",59:";",61:"=",91:"Mod",92:"Mod",93:"Mod",107:"=",109:"-",127:"Delete",173:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'",63232:"Up",63233:"Down",63234:"Left",63235:"Right",63272:"Delete",63273:"Home",63275:"End",63276:"PageUp",63277:"PageDown",63302:"Insert"};w.keyNames=uh,function(){for(var a=0;10>a;a++)uh[a+48]=uh[a+96]=String(a);for(var a=65;90>=a;a++)uh[a]=String.fromCharCode(a);for(var a=1;12>=a;a++)uh[a+111]=uh[a+63235]="F"+a}();var Eh,Jh=function(){function c(c){return 247>=c?a.charAt(c):c>=1424&&1524>=c?"R":c>=1536&&1773>=c?b.charAt(c-1536):c>=1774&&2220>=c?"r":c>=8192&&8203>=c?"w":8204==c?"b":"L"}function j(a,b,c){this.level=a,this.from=b,this.to=c}var a="bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN",b="rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmm",d=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,e=/[stwN]/,f=/[LRr]/,g=/[Lb1n]/,h=/[1n]/,i="L";return function(a){if(!d.test(a))return!1;for(var m,b=a.length,k=[],l=0;b>l;++l)k.push(m=c(a.charCodeAt(l)));for(var l=0,n=i;b>l;++l){var m=k[l];"m"==m?k[l]=n:n=m}for(var l=0,o=i;b>l;++l){var m=k[l];"1"==m&&"r"==o?k[l]="n":f.test(m)&&(o=m,"r"==m&&(k[l]="R"))}for(var l=1,n=k[0];b-1>l;++l){var m=k[l];"+"==m&&"1"==n&&"1"==k[l+1]?k[l]="1":","!=m||n!=k[l+1]||"1"!=n&&"n"!=n||(k[l]=n),n=m}for(var l=0;b>l;++l){var m=k[l];if(","==m)k[l]="N";else if("%"==m){for(var p=l+1;b>p&&"%"==k[p];++p);for(var q=l&&"!"==k[l-1]||b>p&&"1"==k[p]?"1":"N",r=l;p>r;++r)k[r]=q;l=p-1}}for(var l=0,o=i;b>l;++l){var m=k[l];"L"==o&&"1"==m?k[l]="L":f.test(m)&&(o=m)}for(var l=0;b>l;++l)if(e.test(k[l])){for(var p=l+1;b>p&&e.test(k[p]);++p);for(var s="L"==(l?k[l-1]:i),t="L"==(b>p?k[p]:i),q=s||t?"L":"R",r=l;p>r;++r)k[r]=q;l=p-1}for(var v,u=[],l=0;b>l;)if(g.test(k[l])){var w=l;for(++l;b>l&&g.test(k[l]);++l);u.push(new j(0,w,l))}else{var x=l,y=u.length;for(++l;b>l&&"L"!=k[l];++l);for(var r=x;l>r;)if(h.test(k[r])){r>x&&u.splice(y,0,new j(1,x,r));var z=r;for(++r;l>r&&h.test(k[r]);++r);u.splice(y,0,new j(2,z,r)),x=r}else++r;l>x&&u.splice(y,0,new j(1,x,l))}return 1==u[0].level&&(v=a.match(/^\s+/))&&(u[0].from=v[0].length,u.unshift(new j(0,0,v[0].length))),1==Jg(u).level&&(v=a.match(/\s+$/))&&(Jg(u).to-=v[0].length,u.push(new j(0,b-v[0].length,b))),u[0].level!=Jg(u).level&&u.push(new j(u[0].level,b,b)),u}}();return w.version="4.5.1",w}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";a.defineMode("coffeescript",function(a){function c(a){return new RegExp("^(("+a.join(")|(")+"))\\b")}function p(a,c){if(a.sol()){null===c.scope.align&&(c.scope.align=!1);var i=c.scope.offset;if(a.eatSpace()){var j=a.indentation();return j>i&&"coffee"==c.scope.type?"indent":i>j?"dedent":null}i>0&&t(a,c)}if(a.eatSpace())return null;var n=a.peek();if(a.match("####"))return a.skipToEnd(),"comment";if(a.match("###"))return c.tokenize=r,c.tokenize(a,c);if("#"===n)return a.skipToEnd(),"comment";if(a.match(/^-?[0-9\.]/,!1)){var p=!1;if(a.match(/^-?\d*\.\d+(e[\+\-]?\d+)?/i)&&(p=!0),a.match(/^-?\d+\.\d*/)&&(p=!0),a.match(/^-?\.\d+/)&&(p=!0),p)return"."==a.peek()&&a.backUp(1),"number";var s=!1;if(a.match(/^-?0x[0-9a-f]+/i)&&(s=!0),a.match(/^-?[1-9]\d*(e[\+\-]?\d+)?/)&&(s=!0),a.match(/^-?0(?![\dx])/i)&&(s=!0),s)return"number"}if(a.match(l))return c.tokenize=q(a.current(),!1,"string"),c.tokenize(a,c);if(a.match(m)){if("/"!=a.current()||a.match(/^.*\//,!1))return c.tokenize=q(a.current(),!0,"string-2"),c.tokenize(a,c);a.backUp(1)}return a.match(d)||a.match(h)?"operator":a.match(e)?"punctuation":a.match(o)?"atom":a.match(k)?"keyword":a.match(f)?"variable":a.match(g)?"property":(a.next(),b)}function q(c,d,e){return function(f,g){for(;!f.eol();)if(f.eatWhile(/[^'"\/\\]/),f.eat("\\")){if(f.next(),d&&f.eol())return e}else{if(f.match(c))return g.tokenize=p,e;f.eat(/['"\/]/)}return d&&(a.mode.singleLineStringErrors?e=b:g.tokenize=p),e}}function r(a,b){for(;!a.eol();){if(a.eatWhile(/[^#]/),a.match("###")){b.tokenize=p;break}a.eatWhile("#")}return"comment"}function s(b,c,d){d=d||"coffee";for(var e=0,f=!1,g=null,h=c.scope;h;h=h.prev)if("coffee"===h.type){e=h.offset+a.indentUnit;break}"coffee"!==d?(f=null,g=b.column()+b.current().length):c.scope.align&&(c.scope.align=!1),c.scope={offset:e,type:d,prev:c.scope,align:f,alignOffset:g}}function t(a,b){if(b.scope.prev){if("coffee"===b.scope.type){for(var c=a.indentation(),d=!1,e=b.scope;e;e=e.prev)if(c===e.offset){d=!0;break}if(!d)return!0;for(;b.scope.prev&&b.scope.offset!==c;)b.scope=b.scope.prev;return!1}return b.scope=b.scope.prev,!1}}function u(a,c){var d=c.tokenize(a,c),e=a.current();if("."===e)return d=c.tokenize(a,c),e=a.current(),/^\.[\w$]+$/.test(e)?"variable":b;"return"===e&&(c.dedent+=1),("->"!==e&&"=>"!==e||c.lambda||a.peek())&&"indent"!==d||s(a,c);var f="[({".indexOf(e);if(-1!==f&&s(a,c,"])}".slice(f,f+1)),i.exec(e)&&s(a,c),"then"==e&&t(a,c),"dedent"===d&&t(a,c))return b;if(f="])}".indexOf(e),-1!==f){for(;"coffee"==c.scope.type&&c.scope.prev;)c.scope=c.scope.prev;c.scope.type==e&&(c.scope=c.scope.prev)}return c.dedent>0&&a.eol()&&"coffee"==c.scope.type&&(c.scope.prev&&(c.scope=c.scope.prev),c.dedent-=1),d}var b="error",d=/^(?:->|=>|\+[+=]?|-[\-=]?|\*[\*=]?|\/[\/=]?|[=!]=|<[><]?=?|>>?=?|%=?|&=?|\|=?|\^=?|\~|!|\?)/,e=/^(?:[()\[\]{},:`=;]|\.\.?\.?)/,f=/^[_A-Za-z$][_A-Za-z$0-9]*/,g=/^(@|this\.)[_A-Za-z$][_A-Za-z$0-9]*/,h=c(["and","or","not","is","isnt","in","instanceof","typeof"]),i=["for","while","loop","if","unless","else","switch","try","catch","finally","class"],j=["break","by","continue","debugger","delete","do","in","of","new","return","then","this","throw","when","until"],k=c(i.concat(j));i=c(i);var l=/^('{3}|\"{3}|['\"])/,m=/^(\/{3}|\/)/,n=["Infinity","NaN","undefined","null","true","false","on","off","yes","no"],o=c(n),v={startState:function(a){return{tokenize:p,scope:{offset:a||0,type:"coffee",prev:null,align:!1},lastToken:null,lambda:!1,dedent:0}},token:function(a,b){var c=null===b.scope.align&&b.scope;c&&a.sol()&&(c.align=!1);var d=u(a,b);return c&&d&&"comment"!=d&&(c.align=!0),b.lastToken={style:d,content:a.current()},a.eol()&&a.lambda&&(b.lambda=!1),d},indent:function(a,b){if(a.tokenize!=p)return 0;var c=a.scope,d=b&&"])}".indexOf(b.charAt(0))>-1;if(d)for(;"coffee"==c.type&&c.prev;)c=c.prev;var e=d&&c.type===b.charAt(0);return c.align?c.alignOffset-(e?1:0):(e?c.prev:c).offset},lineComment:"#",fold:"indent"};return v}),a.defineMIME("text/x-coffeescript","coffeescript")}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";function b(a){for(var b={},c=0;c<a.length;++c)b[a[c]]=!0;return b}function r(a,b){for(var d,c=!1;null!=(d=a.next());){if(c&&"/"==d){b.tokenize=null;break}c="*"==d}return["comment","comment"]}function s(a,b){return a.skipTo("-->")?(a.match("-->"),b.tokenize=null):a.skipToEnd(),["comment","comment"]}a.defineMode("css",function(b,c){function p(a,b){return n=b,a}function q(a,b){var c=a.next();if(e[c]){var d=e[c](a,b);if(d!==!1)return d}return"@"==c?(a.eatWhile(/[\w\\\-]/),p("def",a.current())):"="==c||("~"==c||"|"==c)&&a.eat("=")?p(null,"compare"):'"'==c||"'"==c?(b.tokenize=r(c),b.tokenize(a,b)):"#"==c?(a.eatWhile(/[\w\\\-]/),p("atom","hash")):"!"==c?(a.match(/^\s*\w*/),p("keyword","important")):/\d/.test(c)||"."==c&&a.eat(/\d/)?(a.eatWhile(/[\w.%]/),p("number","unit")):"-"!==c?/[,+>*\/]/.test(c)?p(null,"select-op"):"."==c&&a.match(/^-?[_a-z][_a-z0-9-]*/i)?p("qualifier","qualifier"):/[:;{}\[\]\(\)]/.test(c)?p(null,c):"u"==c&&a.match("rl(")?(a.backUp(1),b.tokenize=s,p("property","word")):/[\w\\\-]/.test(c)?(a.eatWhile(/[\w\\\-]/),p("property","word")):p(null,null):/[\d.]/.test(a.peek())?(a.eatWhile(/[\w.%]/),p("number","unit")):a.match(/^\w+-/)?p("meta","meta"):void 0}function r(a){return function(b,c){for(var e,d=!1;null!=(e=b.next());){if(e==a&&!d){")"==a&&b.backUp(1);break}d=!d&&"\\"==e}return(e==a||!d&&")"!=a)&&(c.tokenize=null),p("string","string")}}function s(a,b){return a.next(),b.tokenize=a.match(/\s*[\"\')]/,!1)?null:r(")"),p(null,"(")}function t(a,b,c){this.type=a,this.indent=b,this.prev=c}function u(a,b,c){return a.context=new t(c,b.indentation()+d,a.context),c}function v(a){return a.context=a.context.prev,a.context.type}function w(a,b,c){return z[c.context.type](a,b,c)}function x(a,b,c,d){for(var e=d||1;e>0;e--)c.context=c.context.prev;return w(a,b,c)}function y(a){var b=a.current().toLowerCase();o=k.hasOwnProperty(b)?"atom":j.hasOwnProperty(b)?"keyword":"variable"}c.propertyKeywords||(c=a.resolveMode("text/css"));var n,o,d=b.indentUnit,e=c.tokenHooks,f=c.mediaTypes||{},g=c.mediaFeatures||{},h=c.propertyKeywords||{},i=c.nonStandardPropertyKeywords||{},j=c.colorKeywords||{},k=c.valueKeywords||{},l=c.fontProperties||{},m=c.allowNested,z={};return z.top=function(a,b,c){if("{"==a)return u(c,b,"block");if("}"==a&&c.context.prev)return v(c);if("@media"==a)return u(c,b,"media");if("@font-face"==a)return"font_face_before";if(/^@(-(moz|ms|o|webkit)-)?keyframes$/.test(a))return"keyframes";if(a&&"@"==a.charAt(0))return u(c,b,"at");if("hash"==a)o="builtin";else if("word"==a)o="tag";else{if("variable-definition"==a)return"maybeprop";if("interpolation"==a)return u(c,b,"interpolation");if(":"==a)return"pseudo";if(m&&"("==a)return u(c,b,"parens")}return c.context.type},z.block=function(a,b,c){if("word"==a){var d=b.current().toLowerCase();return h.hasOwnProperty(d)?(o="property","maybeprop"):i.hasOwnProperty(d)?(o="string-2","maybeprop"):m?(o=b.match(/^\s*:/,!1)?"property":"tag","block"):(o+=" error","maybeprop")}return"meta"==a?"block":m||"hash"!=a&&"qualifier"!=a?z.top(a,b,c):(o="error","block")},z.maybeprop=function(a,b,c){return":"==a?u(c,b,"prop"):w(a,b,c)},z.prop=function(a,b,c){if(";"==a)return v(c);if("{"==a&&m)return u(c,b,"propBlock");if("}"==a||"{"==a)return x(a,b,c);if("("==a)return u(c,b,"parens");if("hash"!=a||/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(b.current())){if("word"==a)y(b);else if("interpolation"==a)return u(c,b,"interpolation")}else o+=" error";return"prop"},z.propBlock=function(a,b,c){return"}"==a?v(c):"word"==a?(o="property","maybeprop"):c.context.type},z.parens=function(a,b,c){return"{"==a||"}"==a?x(a,b,c):")"==a?v(c):"("==a?u(c,b,"parens"):("word"==a&&y(b),"parens")},z.pseudo=function(a,b,c){return"word"==a?(o="variable-3",c.context.type):w(a,b,c)},z.media=function(a,b,c){if("("==a)return u(c,b,"media_parens");if("}"==a)return x(a,b,c);if("{"==a)return v(c)&&u(c,b,m?"block":"top");if("word"==a){var d=b.current().toLowerCase();o="only"==d||"not"==d||"and"==d?"keyword":f.hasOwnProperty(d)?"attribute":g.hasOwnProperty(d)?"property":"error"}return c.context.type},z.media_parens=function(a,b,c){return")"==a?v(c):"{"==a||"}"==a?x(a,b,c,2):z.media(a,b,c)},z.font_face_before=function(a,b,c){return"{"==a?u(c,b,"font_face"):w(a,b,c)},z.font_face=function(a,b,c){return"}"==a?v(c):"word"==a?(o=l.hasOwnProperty(b.current().toLowerCase())?"property":"error","maybeprop"):"font_face"},z.keyframes=function(a,b,c){return"word"==a?(o="variable","keyframes"):"{"==a?u(c,b,"top"):w(a,b,c)},z.at=function(a,b,c){return";"==a?v(c):"{"==a||"}"==a?x(a,b,c):("word"==a?o="tag":"hash"==a&&(o="builtin"),"at")},z.interpolation=function(a,b,c){return"}"==a?v(c):"{"==a||";"==a?x(a,b,c):("variable"!=a&&(o="error"),"interpolation")},{startState:function(a){return{tokenize:null,state:"top",context:new t("top",a||0,null)}},token:function(a,b){if(!b.tokenize&&a.eatSpace())return null;var c=(b.tokenize||q)(a,b);return c&&"object"==typeof c&&(n=c[1],c=c[0]),o=c,b.state=z[b.state](n,a,b),o},indent:function(a,b){var c=a.context,e=b&&b.charAt(0),f=c.indent;return"prop"!=c.type||"}"!=e&&")"!=e||(c=c.prev),!c.prev||("}"!=e||"block"!=c.type&&"top"!=c.type&&"interpolation"!=c.type&&"font_face"!=c.type)&&(")"!=e||"parens"!=c.type&&"media_parens"!=c.type)&&("{"!=e||"at"!=c.type&&"media"!=c.type)||(f=c.indent-d,c=c.prev),f},electricChars:"}",blockCommentStart:"/*",blockCommentEnd:"*/",fold:"brace"}});var c=["all","aural","braille","handheld","print","projection","screen","tty","tv","embossed"],d=b(c),e=["width","min-width","max-width","height","min-height","max-height","device-width","min-device-width","max-device-width","device-height","min-device-height","max-device-height","aspect-ratio","min-aspect-ratio","max-aspect-ratio","device-aspect-ratio","min-device-aspect-ratio","max-device-aspect-ratio","color","min-color","max-color","color-index","min-color-index","max-color-index","monochrome","min-monochrome","max-monochrome","resolution","min-resolution","max-resolution","scan","grid"],f=b(e),g=["align-content","align-items","align-self","alignment-adjust","alignment-baseline","anchor-point","animation","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-timing-function","appearance","azimuth","backface-visibility","background","background-attachment","background-clip","background-color","background-image","background-origin","background-position","background-repeat","background-size","baseline-shift","binding","bleed","bookmark-label","bookmark-level","bookmark-state","bookmark-target","border","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-decoration-break","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","clear","clip","color","color-profile","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","content","counter-increment","counter-reset","crop","cue","cue-after","cue-before","cursor","direction","display","dominant-baseline","drop-initial-after-adjust","drop-initial-after-align","drop-initial-before-adjust","drop-initial-before-align","drop-initial-size","drop-initial-value","elevation","empty-cells","fit","fit-position","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","float","float-offset","flow-from","flow-into","font","font-feature-settings","font-family","font-kerning","font-language-override","font-size","font-size-adjust","font-stretch","font-style","font-synthesis","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-ligatures","font-variant-numeric","font-variant-position","font-weight","grid","grid-area","grid-auto-columns","grid-auto-flow","grid-auto-position","grid-auto-rows","grid-column","grid-column-end","grid-column-start","grid-row","grid-row-end","grid-row-start","grid-template","grid-template-areas","grid-template-columns","grid-template-rows","hanging-punctuation","height","hyphens","icon","image-orientation","image-rendering","image-resolution","inline-box-align","justify-content","left","letter-spacing","line-break","line-height","line-stacking","line-stacking-ruby","line-stacking-shift","line-stacking-strategy","list-style","list-style-image","list-style-position","list-style-type","margin","margin-bottom","margin-left","margin-right","margin-top","marker-offset","marks","marquee-direction","marquee-loop","marquee-play-count","marquee-speed","marquee-style","max-height","max-width","min-height","min-width","move-to","nav-down","nav-index","nav-left","nav-right","nav-up","object-fit","object-position","opacity","order","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-style","overflow-wrap","overflow-x","overflow-y","padding","padding-bottom","padding-left","padding-right","padding-top","page","page-break-after","page-break-before","page-break-inside","page-policy","pause","pause-after","pause-before","perspective","perspective-origin","pitch","pitch-range","play-during","position","presentation-level","punctuation-trim","quotes","region-break-after","region-break-before","region-break-inside","region-fragment","rendering-intent","resize","rest","rest-after","rest-before","richness","right","rotation","rotation-point","ruby-align","ruby-overhang","ruby-position","ruby-span","shape-image-threshold","shape-inside","shape-margin","shape-outside","size","speak","speak-as","speak-header","speak-numeral","speak-punctuation","speech-rate","stress","string-set","tab-size","table-layout","target","target-name","target-new","target-position","text-align","text-align-last","text-decoration","text-decoration-color","text-decoration-line","text-decoration-skip","text-decoration-style","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-height","text-indent","text-justify","text-outline","text-overflow","text-shadow","text-size-adjust","text-space-collapse","text-transform","text-underline-position","text-wrap","top","transform","transform-origin","transform-style","transition","transition-delay","transition-duration","transition-property","transition-timing-function","unicode-bidi","vertical-align","visibility","voice-balance","voice-duration","voice-family","voice-pitch","voice-range","voice-rate","voice-stress","voice-volume","volume","white-space","widows","width","word-break","word-spacing","word-wrap","z-index","clip-path","clip-rule","mask","enable-background","filter","flood-color","flood-opacity","lighting-color","stop-color","stop-opacity","pointer-events","color-interpolation","color-interpolation-filters","color-rendering","fill","fill-opacity","fill-rule","image-rendering","marker","marker-end","marker-mid","marker-start","shape-rendering","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","text-rendering","baseline-shift","dominant-baseline","glyph-orientation-horizontal","glyph-orientation-vertical","text-anchor","writing-mode"],h=b(g),i=["scrollbar-arrow-color","scrollbar-base-color","scrollbar-dark-shadow-color","scrollbar-face-color","scrollbar-highlight-color","scrollbar-shadow-color","scrollbar-3d-light-color","scrollbar-track-color","shape-inside","searchfield-cancel-button","searchfield-decoration","searchfield-results-button","searchfield-results-decoration","zoom"],j=b(i),k=["aliceblue","antiquewhite","aqua","aquamarine","azure","beige","bisque","black","blanchedalmond","blue","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dodgerblue","firebrick","floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray","grey","green","greenyellow","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightsteelblue","lightyellow","lime","limegreen","linen","magenta","maroon","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","navy","oldlace","olive","olivedrab","orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","purple","rebeccapurple","red","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","silver","skyblue","slateblue","slategray","snow","springgreen","steelblue","tan","teal","thistle","tomato","turquoise","violet","wheat","white","whitesmoke","yellow","yellowgreen"],l=b(k),m=["above","absolute","activeborder","activecaption","afar","after-white-space","ahead","alias","all","all-scroll","alternate","always","amharic","amharic-abegede","antialiased","appworkspace","arabic-indic","armenian","asterisks","auto","avoid","avoid-column","avoid-page","avoid-region","background","backwards","baseline","below","bidi-override","binary","bengali","blink","block","block-axis","bold","bolder","border","border-box","both","bottom","break","break-all","break-word","button","button-bevel","buttonface","buttonhighlight","buttonshadow","buttontext","cambodian","capitalize","caps-lock-indicator","caption","captiontext","caret","cell","center","checkbox","circle","cjk-earthly-branch","cjk-heavenly-stem","cjk-ideographic","clear","clip","close-quote","col-resize","collapse","column","compact","condensed","contain","content","content-box","context-menu","continuous","copy","cover","crop","cross","crosshair","currentcolor","cursive","dashed","decimal","decimal-leading-zero","default","default-button","destination-atop","destination-in","destination-out","destination-over","devanagari","disc","discard","document","dot-dash","dot-dot-dash","dotted","double","down","e-resize","ease","ease-in","ease-in-out","ease-out","element","ellipse","ellipsis","embed","end","ethiopic","ethiopic-abegede","ethiopic-abegede-am-et","ethiopic-abegede-gez","ethiopic-abegede-ti-er","ethiopic-abegede-ti-et","ethiopic-halehame-aa-er","ethiopic-halehame-aa-et","ethiopic-halehame-am-et","ethiopic-halehame-gez","ethiopic-halehame-om-et","ethiopic-halehame-sid-et","ethiopic-halehame-so-et","ethiopic-halehame-ti-er","ethiopic-halehame-ti-et","ethiopic-halehame-tig","ew-resize","expanded","extra-condensed","extra-expanded","fantasy","fast","fill","fixed","flat","footnotes","forwards","from","geometricPrecision","georgian","graytext","groove","gujarati","gurmukhi","hand","hangul","hangul-consonant","hebrew","help","hidden","hide","higher","highlight","highlighttext","hiragana","hiragana-iroha","horizontal","hsl","hsla","icon","ignore","inactiveborder","inactivecaption","inactivecaptiontext","infinite","infobackground","infotext","inherit","initial","inline","inline-axis","inline-block","inline-table","inset","inside","intrinsic","invert","italic","justify","kannada","katakana","katakana-iroha","keep-all","khmer","landscape","lao","large","larger","left","level","lighter","line-through","linear","lines","list-item","listbox","listitem","local","logical","loud","lower","lower-alpha","lower-armenian","lower-greek","lower-hexadecimal","lower-latin","lower-norwegian","lower-roman","lowercase","ltr","malayalam","match","media-controls-background","media-current-time-display","media-fullscreen-button","media-mute-button","media-play-button","media-return-to-realtime-button","media-rewind-button","media-seek-back-button","media-seek-forward-button","media-slider","media-sliderthumb","media-time-remaining-display","media-volume-slider","media-volume-slider-container","media-volume-sliderthumb","medium","menu","menulist","menulist-button","menulist-text","menulist-textfield","menutext","message-box","middle","min-intrinsic","mix","mongolian","monospace","move","multiple","myanmar","n-resize","narrower","ne-resize","nesw-resize","no-close-quote","no-drop","no-open-quote","no-repeat","none","normal","not-allowed","nowrap","ns-resize","nw-resize","nwse-resize","oblique","octal","open-quote","optimizeLegibility","optimizeSpeed","oriya","oromo","outset","outside","outside-shape","overlay","overline","padding","padding-box","painted","page","paused","persian","plus-darker","plus-lighter","pointer","polygon","portrait","pre","pre-line","pre-wrap","preserve-3d","progress","push-button","radio","read-only","read-write","read-write-plaintext-only","rectangle","region","relative","repeat","repeat-x","repeat-y","reset","reverse","rgb","rgba","ridge","right","round","row-resize","rtl","run-in","running","s-resize","sans-serif","scroll","scrollbar","se-resize","searchfield","searchfield-cancel-button","searchfield-decoration","searchfield-results-button","searchfield-results-decoration","semi-condensed","semi-expanded","separate","serif","show","sidama","single","skip-white-space","slide","slider-horizontal","slider-vertical","sliderthumb-horizontal","sliderthumb-vertical","slow","small","small-caps","small-caption","smaller","solid","somali","source-atop","source-in","source-out","source-over","space","square","square-button","start","static","status-bar","stretch","stroke","sub","subpixel-antialiased","super","sw-resize","table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row","table-row-group","telugu","text","text-bottom","text-top","textarea","textfield","thai","thick","thin","threeddarkshadow","threedface","threedhighlight","threedlightshadow","threedshadow","tibetan","tigre","tigrinya-er","tigrinya-er-abegede","tigrinya-et","tigrinya-et-abegede","to","top","transparent","ultra-condensed","ultra-expanded","underline","up","upper-alpha","upper-armenian","upper-greek","upper-hexadecimal","upper-latin","upper-norwegian","upper-roman","uppercase","urdu","url","vertical","vertical-text","visible","visibleFill","visiblePainted","visibleStroke","visual","w-resize","wait","wave","wider","window","windowframe","windowtext","x-large","x-small","xor","xx-large","xx-small"],n=b(m),o=["font-family","src","unicode-range","font-variant","font-feature-settings","font-stretch","font-weight","font-style"],p=b(o),q=c.concat(e).concat(g).concat(i).concat(k).concat(m);a.registerHelper("hintWords","css",q),a.defineMIME("text/css",{mediaTypes:d,mediaFeatures:f,propertyKeywords:h,nonStandardPropertyKeywords:j,colorKeywords:l,valueKeywords:n,fontProperties:p,tokenHooks:{"<":function(a,b){return a.match("!--")?(b.tokenize=s,s(a,b)):!1},"/":function(a,b){return a.eat("*")?(b.tokenize=r,r(a,b)):!1}},name:"css"}),a.defineMIME("text/x-scss",{mediaTypes:d,mediaFeatures:f,propertyKeywords:h,nonStandardPropertyKeywords:j,colorKeywords:l,valueKeywords:n,fontProperties:p,allowNested:!0,tokenHooks:{"/":function(a,b){return a.eat("/")?(a.skipToEnd(),["comment","comment"]):a.eat("*")?(b.tokenize=r,r(a,b)):["operator","operator"]},":":function(a){return a.match(/\s*\{/)?[null,"{"]:!1},$:function(a){return a.match(/^[\w-]+/),a.match(/^\s*:/,!1)?["variable-2","variable-definition"]:["variable-2","variable"]},"#":function(a){return a.eat("{")?[null,"interpolation"]:!1}},name:"css",helperType:"scss"}),a.defineMIME("text/x-less",{mediaTypes:d,mediaFeatures:f,propertyKeywords:h,nonStandardPropertyKeywords:j,colorKeywords:l,valueKeywords:n,fontProperties:p,allowNested:!0,tokenHooks:{"/":function(a,b){return a.eat("/")?(a.skipToEnd(),["comment","comment"]):a.eat("*")?(b.tokenize=r,r(a,b)):["operator","operator"]},"@":function(a){return a.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/,!1)?!1:(a.eatWhile(/[\w\\\-]/),a.match(/^\s*:/,!1)?["variable-2","variable-definition"]:["variable-2","variable"])},"&":function(){return["atom","atom"]}},name:"css",helperType:"less"})}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror"),require("../htmlmixed/htmlmixed"),require("../ruby/ruby")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","../htmlmixed/htmlmixed","../ruby/ruby"],a):a(CodeMirror)}(function(a){"use strict";a.defineMode("haml",function(b){function e(a){return function(b,c){var d=b.peek();return d==a&&1==c.rubyState.tokenize.length?(b.next(),c.tokenize=g,"closeAttributeTag"):f(b,c)}}function f(a,b){return a.match("-#")?(a.skipToEnd(),"comment"):d.token(a,b.rubyState)}function g(a,b){var d=a.peek();if("comment"==b.previousToken.style&&b.indented>b.previousToken.indented)return a.skipToEnd(),"commentLine";if(b.startOfLine){if("!"==d&&a.match("!!"))return a.skipToEnd(),"tag";if(a.match(/^%[\w:#\.]+=/))return b.tokenize=f,"hamlTag";if(a.match(/^%[\w:]+/))return"hamlTag";if("/"==d)return a.skipToEnd(),"comment"}if((b.startOfLine||"hamlTag"==b.previousToken.style)&&("#"==d||"."==d))return a.match(/[\w-#\.]*/),"hamlAttribute";if(b.startOfLine&&!a.match("-->",!1)&&("="==d||"-"==d))return b.tokenize=f,b.tokenize(a,b);if("hamlTag"==b.previousToken.style||"closeAttributeTag"==b.previousToken.style||"hamlAttribute"==b.previousToken.style){if("("==d)return b.tokenize=e(")"),b.tokenize(a,b);if("{"==d)return b.tokenize=e("}"),b.tokenize(a,b)}return c.token(a,b.htmlState)}var c=a.getMode(b,{name:"htmlmixed"}),d=a.getMode(b,"ruby");return{startState:function(){var a=c.startState(),b=d.startState();return{htmlState:a,rubyState:b,indented:0,previousToken:{style:null,indented:0},tokenize:g}},copyState:function(b){return{htmlState:a.copyState(c,b.htmlState),rubyState:a.copyState(d,b.rubyState),indented:b.indented,previousToken:b.previousToken,tokenize:b.tokenize}},token:function(a,b){if(a.sol()&&(b.indented=a.indentation(),b.startOfLine=!0),a.eatSpace())return null;var c=b.tokenize(a,b);if(b.startOfLine=!1,c&&"commentLine"!=c&&(b.previousToken={style:c,indented:b.indented}),a.eol()&&b.tokenize==f){a.backUp(1);var d=a.peek();a.next(),d&&","!=d&&(b.tokenize=g)}return"hamlTag"==c?c="tag":"commentLine"==c?c="comment":"hamlAttribute"==c?c="attribute":"closeAttributeTag"==c&&(c=null),c}}},"htmlmixed","ruby"),a.defineMIME("text/x-haml","haml")}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror"),require("../htmlmixed/htmlmixed")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","../htmlmixed/htmlmixed"],a):a(CodeMirror)}(function(a){"use strict";a.defineMode("htmlembedded",function(b,c){function h(a,b){return a.match(d,!1)?(b.token=i,f.token(a,b.scriptState)):g.token(a,b.htmlState)
}function i(a,b){return a.match(e,!1)?(b.token=h,g.token(a,b.htmlState)):f.token(a,b.scriptState)}var f,g,d=c.scriptStartRegex||/^<%/i,e=c.scriptEndRegex||/^%>/i;return{startState:function(){return f=f||a.getMode(b,c.scriptingModeSpec),g=g||a.getMode(b,"htmlmixed"),{token:c.startOpen?i:h,htmlState:a.startState(g),scriptState:a.startState(f)}},token:function(a,b){return b.token(a,b)},indent:function(a,b){return a.token==h?g.indent(a.htmlState,b):f.indent?f.indent(a.scriptState,b):void 0},copyState:function(b){return{token:b.token,htmlState:a.copyState(g,b.htmlState),scriptState:a.copyState(f,b.scriptState)}},innerMode:function(a){return a.token==i?{state:a.scriptState,mode:f}:{state:a.htmlState,mode:g}}}},"htmlmixed"),a.defineMIME("application/x-ejs",{name:"htmlembedded",scriptingModeSpec:"javascript"}),a.defineMIME("application/x-aspx",{name:"htmlembedded",scriptingModeSpec:"text/x-csharp"}),a.defineMIME("application/x-jsp",{name:"htmlembedded",scriptingModeSpec:"text/x-java"}),a.defineMIME("application/x-erb",{name:"htmlembedded",scriptingModeSpec:"ruby"})}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror"),require("../xml/xml"),require("../javascript/javascript"),require("../css/css")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","../xml/xml","../javascript/javascript","../css/css"],a):a(CodeMirror)}(function(a){"use strict";a.defineMode("htmlmixed",function(b,c){function j(a,b){var c=b.htmlState.tagName,g=d.token(a,b.htmlState);if("script"==c&&/\btag\b/.test(g)&&">"==a.current()){var h=a.string.slice(Math.max(0,a.pos-100),a.pos).match(/\btype\s*=\s*("[^"]+"|'[^']+'|\S+)[^<]*$/i);h=h?h[1]:"",h&&/[\"\']/.test(h.charAt(0))&&(h=h.slice(1,h.length-1));for(var i=0;i<f.length;++i){var j=f[i];if("string"==typeof j.matches?h==j.matches:j.matches.test(h)){j.mode&&(b.token=l,b.localMode=j.mode,b.localState=j.mode.startState&&j.mode.startState(d.indent(b.htmlState,"")));break}}}else"style"==c&&/\btag\b/.test(g)&&">"==a.current()&&(b.token=m,b.localMode=e,b.localState=e.startState(d.indent(b.htmlState,"")));return g}function k(a,b,c){var f,d=a.current(),e=d.search(b);return e>-1?a.backUp(d.length-e):(f=d.match(/<\/?$/))&&(a.backUp(d.length),a.match(b,!1)||a.match(d)),c}function l(a,b){return a.match(/^<\/\s*script\s*>/i,!1)?(b.token=j,b.localState=b.localMode=null,j(a,b)):k(a,/<\/\s*script\s*>/,b.localMode.token(a,b.localState))}function m(a,b){return a.match(/^<\/\s*style\s*>/i,!1)?(b.token=j,b.localState=b.localMode=null,j(a,b)):k(a,/<\/\s*style\s*>/,e.token(a,b.localState))}var d=a.getMode(b,{name:"xml",htmlMode:!0,multilineTagIndentFactor:c.multilineTagIndentFactor,multilineTagIndentPastTag:c.multilineTagIndentPastTag}),e=a.getMode(b,"css"),f=[],g=c&&c.scriptTypes;if(f.push({matches:/^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^$/i,mode:a.getMode(b,"javascript")}),g)for(var h=0;h<g.length;++h){var i=g[h];f.push({matches:i.matches,mode:i.mode&&a.getMode(b,i.mode)})}return f.push({matches:/./,mode:a.getMode(b,"text/plain")}),{startState:function(){var a=d.startState();return{token:j,localMode:null,localState:null,htmlState:a}},copyState:function(b){if(b.localState)var c=a.copyState(b.localMode,b.localState);return{token:b.token,localMode:b.localMode,localState:c,htmlState:a.copyState(d,b.htmlState)}},token:function(a,b){return b.token(a,b)},indent:function(b,c){return!b.localMode||/^\s*<\//.test(c)?d.indent(b.htmlState,c):b.localMode.indent?b.localMode.indent(b.localState,c):a.Pass},innerMode:function(a){return{state:a.localState||a.htmlState,mode:a.localMode||d}}}},"xml","javascript","css"),a.defineMIME("text/html","htmlmixed")}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror"),require("../javascript/javascript"),require("../css/css"),require("../htmlmixed/htmlmixed")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","../javascript/javascript","../css/css","../htmlmixed/htmlmixed"],a):a(CodeMirror)}(function(a){"use strict";a.defineMode("jade",function(b){function i(){this.javaScriptLine=!1,this.javaScriptLineExcludesColon=!1,this.javaScriptArguments=!1,this.javaScriptArgumentsDepth=0,this.isInterpolating=!1,this.interpolationNesting=0,this.jsState=h.startState(),this.restOfLine="",this.isIncludeFiltered=!1,this.isEach=!1,this.lastTag="",this.scriptType="",this.isAttrs=!1,this.attrsNest=[],this.inAttributeName=!0,this.attributeIsType=!1,this.attrValue="",this.indentOf=1/0,this.indentToken="",this.innerMode=null,this.innerState=null,this.innerModeForLine=!1}function j(a,b){if(a.sol()&&(b.javaScriptLine=!1,b.javaScriptLineExcludesColon=!1),b.javaScriptLine){if(b.javaScriptLineExcludesColon&&":"===a.peek())return b.javaScriptLine=!1,b.javaScriptLineExcludesColon=!1,void 0;var c=h.token(a,b.jsState);return a.eol()&&(b.javaScriptLine=!1),c||!0}}function k(a,b){if(b.javaScriptArguments){if(0===b.javaScriptArgumentsDepth&&"("!==a.peek())return b.javaScriptArguments=!1,void 0;if("("===a.peek()?b.javaScriptArgumentsDepth++:")"===a.peek()&&b.javaScriptArgumentsDepth--,0===b.javaScriptArgumentsDepth)return b.javaScriptArguments=!1,void 0;var c=h.token(a,b.jsState);return c||!0}}function l(a){return a.match(/^yield\b/)?"keyword":void 0}function m(a){return a.match(/^(?:doctype) *([^\n]+)?/)?d:void 0}function n(a,b){return a.match("#{")?(b.isInterpolating=!0,b.interpolationNesting=0,"punctuation"):void 0}function o(a,b){if(b.isInterpolating){if("}"===a.peek()){if(b.interpolationNesting--,b.interpolationNesting<0)return a.next(),b.isInterpolating=!1,"puncutation"}else"{"===a.peek()&&b.interpolationNesting++;return h.token(a,b.jsState)||!0}}function p(a,b){return a.match(/^case\b/)?(b.javaScriptLine=!0,c):void 0}function q(a,b){return a.match(/^when\b/)?(b.javaScriptLine=!0,b.javaScriptLineExcludesColon=!0,c):void 0}function r(a){return a.match(/^default\b/)?c:void 0}function s(a,b){return a.match(/^extends?\b/)?(b.restOfLine="string",c):void 0}function t(a,b){return a.match(/^append\b/)?(b.restOfLine="variable",c):void 0}function u(a,b){return a.match(/^prepend\b/)?(b.restOfLine="variable",c):void 0}function v(a,b){return a.match(/^block\b *(?:(prepend|append)\b)?/)?(b.restOfLine="variable",c):void 0}function w(a,b){return a.match(/^include\b/)?(b.restOfLine="string",c):void 0}function x(a,b){return a.match(/^include:([a-zA-Z0-9\-]+)/,!1)&&a.match("include")?(b.isIncludeFiltered=!0,c):void 0}function y(a,b){if(b.isIncludeFiltered){var c=H(a,b);return b.isIncludeFiltered=!1,b.restOfLine="string",c}}function z(a,b){return a.match(/^mixin\b/)?(b.javaScriptLine=!0,c):void 0}function A(a,b){return a.match(/^\+([-\w]+)/)?(a.match(/^\( *[-\w]+ *=/,!1)||(b.javaScriptArguments=!0,b.javaScriptArgumentsDepth=0),"variable"):a.match(/^\+#{/,!1)?(a.next(),b.mixinCallAfter=!0,n(a,b)):void 0}function B(a,b){return b.mixinCallAfter?(b.mixinCallAfter=!1,a.match(/^\( *[-\w]+ *=/,!1)||(b.javaScriptArguments=!0,b.javaScriptArgumentsDepth=0),!0):void 0}function C(a,b){return a.match(/^(if|unless|else if|else)\b/)?(b.javaScriptLine=!0,c):void 0}function D(a,b){return a.match(/^(- *)?(each|for)\b/)?(b.isEach=!0,c):void 0}function E(a,b){if(b.isEach){if(a.match(/^ in\b/))return b.javaScriptLine=!0,b.isEach=!1,c;if(a.sol()||a.eol())b.isEach=!1;else if(a.next()){for(;!a.match(/^ in\b/,!1)&&a.next(););return"variable"}}}function F(a,b){return a.match(/^while\b/)?(b.javaScriptLine=!0,c):void 0}function G(a,b){var c;return(c=a.match(/^(\w(?:[-:\w]*\w)?)\/?/))?(b.lastTag=c[1].toLowerCase(),"script"===b.lastTag&&(b.scriptType="application/javascript"),"tag"):void 0}function H(c,d){if(c.match(/^:([\w\-]+)/)){var e;return b&&b.innerModes&&(e=b.innerModes(c.current().substring(1))),e||(e=c.current().substring(1)),"string"==typeof e&&(e=a.getMode(b,e)),U(c,d,e),"atom"}}function I(a,b){return a.match(/^(!?=|-)/)?(b.javaScriptLine=!0,"punctuation"):void 0}function J(a){return a.match(/^#([\w-]+)/)?e:void 0}function K(a){return a.match(/^\.([\w-]+)/)?f:void 0}function L(a,b){return"("==a.peek()?(a.next(),b.isAttrs=!0,b.attrsNest=[],b.inAttributeName=!0,b.attrValue="",b.attributeIsType=!1,"punctuation"):void 0}function M(a,b){if(b.isAttrs){if(g[a.peek()]&&b.attrsNest.push(g[a.peek()]),b.attrsNest[b.attrsNest.length-1]===a.peek())b.attrsNest.pop();else if(a.eat(")"))return b.isAttrs=!1,"punctuation";if(b.inAttributeName&&a.match(/^[^=,\)!]+/))return("="===a.peek()||"!"===a.peek())&&(b.inAttributeName=!1,b.jsState=h.startState(),b.attributeIsType="script"===b.lastTag&&"type"===a.current().trim().toLowerCase()?!0:!1),"attribute";var c=h.token(a,b.jsState);if(b.attributeIsType&&"string"===c&&(b.scriptType=a.current().toString()),0===b.attrsNest.length&&("string"===c||"variable"===c||"keyword"===c))try{return Function("","var x "+b.attrValue.replace(/,\s*$/,"").replace(/^!/,"")),b.inAttributeName=!0,b.attrValue="",a.backUp(a.current().length),M(a,b)}catch(d){}return b.attrValue+=a.current(),c||!0}}function N(a,b){return a.match(/^&attributes\b/)?(b.javaScriptArguments=!0,b.javaScriptArgumentsDepth=0,"keyword"):void 0}function O(a){return a.sol()&&a.eatSpace()?"indent":void 0}function P(a,b){return a.match(/^ *\/\/(-)?([^\n]*)/)?(b.indentOf=a.indentation(),b.indentToken="comment","comment"):void 0}function Q(a){return a.match(/^: */)?"colon":void 0}function R(a,b){return a.match(/^(?:\| ?| )([^\n]+)/)?"string":a.match(/^(<[^\n]*)/,!1)?(U(a,b,"htmlmixed"),b.innerModeForLine=!0,V(a,b,!0)):void 0}function S(a,b){if(a.eat(".")){var c=null;return"script"===b.lastTag&&-1!=b.scriptType.toLowerCase().indexOf("javascript")?c=b.scriptType.toLowerCase().replace(/"|'/g,""):"style"===b.lastTag&&(c="css"),U(a,b,c),"dot"}}function T(a){return a.next(),null}function U(c,d,e){e=a.mimeModes[e]||e,e=b.innerModes?b.innerModes(e)||e:e,e=a.mimeModes[e]||e,e=a.getMode(b,e),d.indentOf=c.indentation(),e&&"null"!==e.name?d.innerMode=e:d.indentToken="string"}function V(a,b,c){return a.indentation()>b.indentOf||b.innerModeForLine&&!a.sol()||c?b.innerMode?(b.innerState||(b.innerState=b.innerMode.startState?b.innerMode.startState(a.indentation()):{}),a.hideFirstChars(b.indentOf+2,function(){return b.innerMode.token(a,b.innerState)||!0})):(a.skipToEnd(),b.indentToken):(a.sol()&&(b.indentOf=1/0,b.indentToken=null,b.innerMode=null,b.innerState=null),void 0)}function W(a,b){if(a.sol()&&(b.restOfLine=""),b.restOfLine){a.skipToEnd();var c=b.restOfLine;return b.restOfLine="",c}}function X(){return new i}function Y(a){return a.copy()}function Z(a,b){var c=V(a,b)||W(a,b)||o(a,b)||y(a,b)||E(a,b)||M(a,b)||j(a,b)||k(a,b)||B(a,b)||l(a,b)||m(a,b)||n(a,b)||p(a,b)||q(a,b)||r(a,b)||s(a,b)||t(a,b)||u(a,b)||v(a,b)||w(a,b)||x(a,b)||z(a,b)||A(a,b)||C(a,b)||D(a,b)||F(a,b)||G(a,b)||H(a,b)||I(a,b)||J(a,b)||K(a,b)||L(a,b)||N(a,b)||O(a,b)||R(a,b)||P(a,b)||Q(a,b)||S(a,b)||T(a,b);return c===!0?null:c}var c="keyword",d="meta",e="builtin",f="qualifier",g={"{":"}","(":")","[":"]"},h=a.getMode(b,"javascript");return i.prototype.copy=function(){var b=new i;return b.javaScriptLine=this.javaScriptLine,b.javaScriptLineExcludesColon=this.javaScriptLineExcludesColon,b.javaScriptArguments=this.javaScriptArguments,b.javaScriptArgumentsDepth=this.javaScriptArgumentsDepth,b.isInterpolating=this.isInterpolating,b.interpolationNesting=this.intpolationNesting,b.jsState=a.copyState(h,this.jsState),b.innerMode=this.innerMode,this.innerMode&&this.innerState&&(b.innerState=a.copyState(this.innerMode,this.innerState)),b.restOfLine=this.restOfLine,b.isIncludeFiltered=this.isIncludeFiltered,b.isEach=this.isEach,b.lastTag=this.lastTag,b.scriptType=this.scriptType,b.isAttrs=this.isAttrs,b.attrsNest=this.attrsNest.slice(),b.inAttributeName=this.inAttributeName,b.attributeIsType=this.attributeIsType,b.attrValue=this.attrValue,b.indentOf=this.indentOf,b.indentToken=this.indentToken,b.innerModeForLine=this.innerModeForLine,b},{startState:X,copyState:Y,token:Z}}),a.defineMIME("text/x-jade","jade")}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";a.defineMode("javascript",function(b,c){function m(a){for(var c,b=!1,d=!1;null!=(c=a.next());){if(!b){if("/"==c&&!d)return;"["==c?d=!0:d&&"]"==c&&(d=!1)}b=!b&&"\\"==c}}function p(a,b,c){return n=a,o=c,b}function q(a,b){var c=a.next();if('"'==c||"'"==c)return b.tokenize=r(c),b.tokenize(a,b);if("."==c&&a.match(/^\d+(?:[eE][+\-]?\d+)?/))return p("number","number");if("."==c&&a.match(".."))return p("spread","meta");if(/[\[\]{}\(\),;\:\.]/.test(c))return p(c);if("="==c&&a.eat(">"))return p("=>","operator");if("0"==c&&a.eat(/x/i))return a.eatWhile(/[\da-f]/i),p("number","number");if(/\d/.test(c))return a.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/),p("number","number");if("/"==c)return a.eat("*")?(b.tokenize=s,s(a,b)):a.eat("/")?(a.skipToEnd(),p("comment","comment")):"operator"==b.lastType||"keyword c"==b.lastType||"sof"==b.lastType||/^[\[{}\(,;:]$/.test(b.lastType)?(m(a),a.eatWhile(/[gimy]/),p("regexp","string-2")):(a.eatWhile(k),p("operator","operator",a.current()));if("`"==c)return b.tokenize=t,t(a,b);if("#"==c)return a.skipToEnd(),p("error","error");if(k.test(c))return a.eatWhile(k),p("operator","operator",a.current());if(i.test(c)){a.eatWhile(i);var d=a.current(),e=j.propertyIsEnumerable(d)&&j[d];return e&&"."!=b.lastType?p(e.type,e.style,d):p("variable","variable",d)}}function r(a){return function(b,c){var e,d=!1;if(f&&"@"==b.peek()&&b.match(l))return c.tokenize=q,p("jsonld-keyword","meta");for(;null!=(e=b.next())&&(e!=a||d);)d=!d&&"\\"==e;return d||(c.tokenize=q),p("string","string")}}function s(a,b){for(var d,c=!1;d=a.next();){if("/"==d&&c){b.tokenize=q;break}c="*"==d}return p("comment","comment")}function t(a,b){for(var d,c=!1;null!=(d=a.next());){if(!c&&("`"==d||"$"==d&&a.eat("{"))){b.tokenize=q;break}c=!c&&"\\"==d}return p("quasi","string-2",a.current())}function v(a,b){b.fatArrowAt&&(b.fatArrowAt=null);var c=a.string.indexOf("=>",a.start);if(!(0>c)){for(var d=0,e=!1,f=c-1;f>=0;--f){var g=a.string.charAt(f),h=u.indexOf(g);if(h>=0&&3>h){if(!d){++f;break}if(0==--d)break}else if(h>=3&&6>h)++d;else if(i.test(g))e=!0;else if(e&&!d){++f;break}}e&&!d&&(b.fatArrowAt=f)}}function x(a,b,c,d,e,f){this.indented=a,this.column=b,this.type=c,this.prev=e,this.info=f,null!=d&&(this.align=d)}function y(a,b){for(var c=a.localVars;c;c=c.next)if(c.name==b)return!0;for(var d=a.context;d;d=d.prev)for(var c=d.vars;c;c=c.next)if(c.name==b)return!0}function z(a,b,c,d,e){var f=a.cc;for(A.state=a,A.stream=e,A.marked=null,A.cc=f,A.style=b,a.lexical.hasOwnProperty("align")||(a.lexical.align=!0);;){var h=f.length?f.pop():g?L:K;if(h(c,d)){for(;f.length&&f[f.length-1].lex;)f.pop()();return A.marked?A.marked:"variable"==c&&y(a,d)?"variable-2":b}}}function B(){for(var a=arguments.length-1;a>=0;a--)A.cc.push(arguments[a])}function C(){return B.apply(null,arguments),!0}function D(a){function b(b){for(var c=b;c;c=c.next)if(c.name==a)return!0;return!1}var d=A.state;if(d.context){if(A.marked="def",b(d.localVars))return;d.localVars={name:a,next:d.localVars}}else{if(b(d.globalVars))return;c.globalVars&&(d.globalVars={name:a,next:d.globalVars})}}function F(){A.state.context={prev:A.state.context,vars:A.state.localVars},A.state.localVars=E}function G(){A.state.localVars=A.state.context.vars,A.state.context=A.state.context.prev}function H(a,b){var c=function(){var c=A.state,d=c.indented;if("stat"==c.lexical.type)d=c.lexical.indented;else for(var e=c.lexical;e&&")"==e.type&&e.align;e=e.prev)d=e.indented;c.lexical=new x(d,A.stream.column(),a,null,c.lexical,b)};return c.lex=!0,c}function I(){var a=A.state;a.lexical.prev&&(")"==a.lexical.type&&(a.indented=a.lexical.indented),a.lexical=a.lexical.prev)}function J(a){function b(c){return c==a?C():";"==a?B():C(b)}return b}function K(a,b){return"var"==a?C(H("vardef",b.length),eb,J(";"),I):"keyword a"==a?C(H("form"),L,K,I):"keyword b"==a?C(H("form"),K,I):"{"==a?C(H("}"),bb,I):";"==a?C():"if"==a?("else"==A.state.lexical.info&&A.state.cc[A.state.cc.length-1]==I&&A.state.cc.pop()(),C(H("form"),L,K,I,jb)):"function"==a?C(pb):"for"==a?C(H("form"),kb,K,I):"variable"==a?C(H("stat"),W):"switch"==a?C(H("form"),L,H("}","switch"),J("{"),bb,I,I):"case"==a?C(L,J(":")):"default"==a?C(J(":")):"catch"==a?C(H("form"),F,J("("),qb,J(")"),K,I,G):"module"==a?C(H("form"),F,vb,G,I):"class"==a?C(H("form"),rb,I):"export"==a?C(H("form"),wb,I):"import"==a?C(H("form"),xb,I):B(H("stat"),L,J(";"),I)}function L(a){return N(a,!1)}function M(a){return N(a,!0)}function N(a,b){if(A.state.fatArrowAt==A.stream.start){var c=b?V:U;if("("==a)return C(F,H(")"),_(fb,")"),I,J("=>"),c,G);if("variable"==a)return B(F,fb,J("=>"),c,G)}var d=b?R:Q;return w.hasOwnProperty(a)?C(d):"function"==a?C(pb,d):"keyword c"==a?C(b?P:O):"("==a?C(H(")"),O,Cb,J(")"),I,d):"operator"==a||"spread"==a?C(b?M:L):"["==a?C(H("]"),Ab,I,d):"{"==a?ab(Y,"}",null,d):"quasi"==a?B(S,d):C()}function O(a){return a.match(/[;\}\)\],]/)?B():B(L)}function P(a){return a.match(/[;\}\)\],]/)?B():B(M)}function Q(a,b){return","==a?C(L):R(a,b,!1)}function R(a,b,c){var d=0==c?Q:R,e=0==c?L:M;return"=>"==a?C(F,c?V:U,G):"operator"==a?/\+\+|--/.test(b)?C(d):"?"==b?C(L,J(":"),e):C(e):"quasi"==a?B(S,d):";"!=a?"("==a?ab(M,")","call",d):"."==a?C(X,d):"["==a?C(H("]"),O,J("]"),I,d):void 0:void 0}function S(a,b){return"quasi"!=a?B():"${"!=b.slice(b.length-2)?C(S):C(L,T)}function T(a){return"}"==a?(A.marked="string-2",A.state.tokenize=t,C(S)):void 0}function U(a){return v(A.stream,A.state),B("{"==a?K:L)}function V(a){return v(A.stream,A.state),B("{"==a?K:M)}function W(a){return":"==a?C(I,K):B(Q,J(";"),I)}function X(a){return"variable"==a?(A.marked="property",C()):void 0}function Y(a,b){return"variable"==a||"keyword"==A.style?(A.marked="property","get"==b||"set"==b?C(Z):C($)):"number"==a||"string"==a?(A.marked=f?"property":A.style+" property",C($)):"jsonld-keyword"==a?C($):"["==a?C(L,J("]"),$):void 0}function Z(a){return"variable"!=a?B($):(A.marked="property",C(pb))}function $(a){return":"==a?C(M):"("==a?B(pb):void 0}function _(a,b){function c(d){if(","==d){var e=A.state.lexical;return"call"==e.info&&(e.pos=(e.pos||0)+1),C(a,c)}return d==b?C():C(J(b))}return function(d){return d==b?C():B(a,c)}}function ab(a,b,c){for(var d=3;d<arguments.length;d++)A.cc.push(arguments[d]);return C(H(b,c),_(a,b),I)}function bb(a){return"}"==a?C():B(K,bb)}function cb(a){return h&&":"==a?C(db):void 0}function db(a){return"variable"==a?(A.marked="variable-3",C()):void 0}function eb(){return B(fb,cb,hb,ib)}function fb(a,b){return"variable"==a?(D(b),C()):"["==a?ab(fb,"]"):"{"==a?ab(gb,"}"):void 0}function gb(a,b){return"variable"!=a||A.stream.match(/^\s*:/,!1)?("variable"==a&&(A.marked="property"),C(J(":"),fb,hb)):(D(b),C(hb))}function hb(a,b){return"="==b?C(M):void 0}function ib(a){return","==a?C(eb):void 0}function jb(a,b){return"keyword b"==a&&"else"==b?C(H("form","else"),K,I):void 0}function kb(a){return"("==a?C(H(")"),lb,J(")"),I):void 0}function lb(a){return"var"==a?C(eb,J(";"),nb):";"==a?C(nb):"variable"==a?C(mb):B(L,J(";"),nb)}function mb(a,b){return"in"==b||"of"==b?(A.marked="keyword",C(L)):C(Q,nb)}function nb(a,b){return";"==a?C(ob):"in"==b||"of"==b?(A.marked="keyword",C(L)):B(L,J(";"),ob)}function ob(a){")"!=a&&C(L)}function pb(a,b){return"*"==b?(A.marked="keyword",C(pb)):"variable"==a?(D(b),C(pb)):"("==a?C(F,H(")"),_(qb,")"),I,K,G):void 0}function qb(a){return"spread"==a?C(qb):B(fb,cb)}function rb(a,b){return"variable"==a?(D(b),C(sb)):void 0}function sb(a,b){return"extends"==b?C(L,sb):"{"==a?C(H("}"),tb,I):void 0}function tb(a,b){return"variable"==a||"keyword"==A.style?(A.marked="property","get"==b||"set"==b?C(ub,pb,tb):C(pb,tb)):"*"==b?(A.marked="keyword",C(tb)):";"==a?C(tb):"}"==a?C():void 0}function ub(a){return"variable"!=a?B():(A.marked="property",C())}function vb(a,b){return"string"==a?C(K):"variable"==a?(D(b),C(zb)):void 0}function wb(a,b){return"*"==b?(A.marked="keyword",C(zb,J(";"))):"default"==b?(A.marked="keyword",C(L,J(";"))):B(K)}function xb(a){return"string"==a?C():B(yb,zb)}function yb(a,b){return"{"==a?ab(yb,"}"):("variable"==a&&D(b),C())}function zb(a,b){return"from"==b?(A.marked="keyword",C(L)):void 0}function Ab(a){return"]"==a?C():B(M,Bb)}function Bb(a){return"for"==a?B(Cb,J("]")):","==a?C(_(M,"]")):B(_(M,"]"))}function Cb(a){return"for"==a?C(kb,Cb):"if"==a?C(L,Cb):void 0}var n,o,d=b.indentUnit,e=c.statementIndent,f=c.jsonld,g=c.json||f,h=c.typescript,i=c.wordCharacters||/[\w$]/,j=function(){function a(a){return{type:a,style:"keyword"}}var b=a("keyword a"),c=a("keyword b"),d=a("keyword c"),e=a("operator"),f={type:"atom",style:"atom"},g={"if":a("if"),"while":b,"with":b,"else":c,"do":c,"try":c,"finally":c,"return":d,"break":d,"continue":d,"new":d,"delete":d,"throw":d,"debugger":d,"var":a("var"),"const":a("var"),let:a("var"),"function":a("function"),"catch":a("catch"),"for":a("for"),"switch":a("switch"),"case":a("case"),"default":a("default"),"in":e,"typeof":e,"instanceof":e,"true":f,"false":f,"null":f,undefined:f,NaN:f,Infinity:f,"this":a("this"),module:a("module"),"class":a("class"),"super":a("atom"),yield:d,"export":a("export"),"import":a("import"),"extends":d};if(h){var i={type:"variable",style:"variable-3"},j={"interface":a("interface"),"extends":a("extends"),constructor:a("constructor"),"public":a("public"),"private":a("private"),"protected":a("protected"),"static":a("static"),string:i,number:i,bool:i,any:i};for(var k in j)g[k]=j[k]}return g}(),k=/[+\-*&%=<>!?|~^]/,l=/^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/,u="([{}])",w={atom:!0,number:!0,variable:!0,string:!0,regexp:!0,"this":!0,"jsonld-keyword":!0},A={state:null,column:null,marked:null,cc:null},E={name:"this",next:{name:"arguments"}};return I.lex=!0,{startState:function(a){var b={tokenize:q,lastType:"sof",cc:[],lexical:new x((a||0)-d,0,"block",!1),localVars:c.localVars,context:c.localVars&&{vars:c.localVars},indented:0};return c.globalVars&&"object"==typeof c.globalVars&&(b.globalVars=c.globalVars),b},token:function(a,b){if(a.sol()&&(b.lexical.hasOwnProperty("align")||(b.lexical.align=!1),b.indented=a.indentation(),v(a,b)),b.tokenize!=s&&a.eatSpace())return null;var c=b.tokenize(a,b);return"comment"==n?c:(b.lastType="operator"!=n||"++"!=o&&"--"!=o?n:"incdec",z(b,c,n,o,a))},indent:function(b,f){if(b.tokenize==s)return a.Pass;if(b.tokenize!=q)return 0;var g=f&&f.charAt(0),h=b.lexical;if(!/^\s*else\b/.test(f))for(var i=b.cc.length-1;i>=0;--i){var j=b.cc[i];if(j==I)h=h.prev;else if(j!=jb)break}"stat"==h.type&&"}"==g&&(h=h.prev),e&&")"==h.type&&"stat"==h.prev.type&&(h=h.prev);var k=h.type,l=g==k;return"vardef"==k?h.indented+("operator"==b.lastType||","==b.lastType?h.info+1:0):"form"==k&&"{"==g?h.indented:"form"==k?h.indented+d:"stat"==k?h.indented+("operator"==b.lastType||","==b.lastType?e||d:0):"switch"!=h.info||l||0==c.doubleIndentSwitch?h.align?h.column+(l?0:1):h.indented+(l?0:d):h.indented+(/^(?:case|default)\b/.test(f)?d:2*d)},electricChars:":{}",blockCommentStart:g?null:"/*",blockCommentEnd:g?null:"*/",lineComment:g?null:"//",fold:"brace",helperType:g?"json":"javascript",jsonldMode:f,jsonMode:g}}),a.registerHelper("wordChars","javascript",/[\w$]/),a.defineMIME("text/javascript","javascript"),a.defineMIME("text/ecmascript","javascript"),a.defineMIME("application/javascript","javascript"),a.defineMIME("application/x-javascript","javascript"),a.defineMIME("application/ecmascript","javascript"),a.defineMIME("application/json",{name:"javascript",json:!0}),a.defineMIME("application/x-json",{name:"javascript",json:!0}),a.defineMIME("application/ld+json",{name:"javascript",jsonld:!0}),a.defineMIME("text/typescript",{name:"javascript",typescript:!0}),a.defineMIME("application/typescript",{name:"javascript",typescript:!0})}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";a.defineMode("livescript",function(){var a=function(a,b){var c=b.next||"start";if(c){b.next=b.next;var d=f[c];if(d.splice){for(var e=0;e<d.length;++e){var h,g=d[e];if(g.regex&&(h=a.match(g.regex)))return b.next=g.next||b.next,g.token}return a.next(),"error"}if(a.match(g=f[c]))return g.regex&&a.match(g.regex)?(b.next=g.next,g.token):(a.next(),"error")}return a.next(),"error"},b={startState:function(){return{next:"start",lastToken:null}},token:function(b,c){for(;b.pos==b.start;)var d=a(b,c);return c.lastToken={style:d,indent:b.indentation(),content:b.current()},d.replace(/\./g," ")},indent:function(a){var b=a.lastToken.indent;return a.lastToken.content.match(c)&&(b+=2),b}};return b});var b="(?![\\d\\s])[$\\w\\xAA-\\uFFDC](?:(?!\\s)[$\\w\\xAA-\\uFFDC]|-[A-Za-z])*",c=RegExp("(?:[({[=:]|[-~]>|\\b(?:e(?:lse|xport)|d(?:o|efault)|t(?:ry|hen)|finally|import(?:\\s*all)?|const|var|let|new|catch(?:\\s*"+b+")?))\\s*$"),d="(?![$\\w]|-[A-Za-z]|\\s*:(?![:=]))",e={token:"string",regex:".+"},f={start:[{token:"comment.doc",regex:"/\\*",next:"comment"},{token:"comment",regex:"#.*"},{token:"keyword",regex:"(?:t(?:h(?:is|row|en)|ry|ypeof!?)|c(?:on(?:tinue|st)|a(?:se|tch)|lass)|i(?:n(?:stanceof)?|mp(?:ort(?:\\s+all)?|lements)|[fs])|d(?:e(?:fault|lete|bugger)|o)|f(?:or(?:\\s+own)?|inally|unction)|s(?:uper|witch)|e(?:lse|x(?:tends|port)|val)|a(?:nd|rguments)|n(?:ew|ot)|un(?:less|til)|w(?:hile|ith)|o[fr]|return|break|let|var|loop)"+d},{token:"constant.language",regex:"(?:true|false|yes|no|on|off|null|void|undefined)"+d},{token:"invalid.illegal",regex:"(?:p(?:ackage|r(?:ivate|otected)|ublic)|i(?:mplements|nterface)|enum|static|yield)"+d},{token:"language.support.class",regex:"(?:R(?:e(?:gExp|ferenceError)|angeError)|S(?:tring|yntaxError)|E(?:rror|valError)|Array|Boolean|Date|Function|Number|Object|TypeError|URIError)"+d},{token:"language.support.function",regex:"(?:is(?:NaN|Finite)|parse(?:Int|Float)|Math|JSON|(?:en|de)codeURI(?:Component)?)"+d},{token:"variable.language",regex:"(?:t(?:hat|il|o)|f(?:rom|allthrough)|it|by|e)"+d},{token:"identifier",regex:b+"\\s*:(?![:=])"},{token:"variable",regex:b},{token:"keyword.operator",regex:"(?:\\.{3}|\\s+\\?)"},{token:"keyword.variable",regex:"(?:@+|::|\\.\\.)",next:"key"},{token:"keyword.operator",regex:"\\.\\s*",next:"key"},{token:"string",regex:"\\\\\\S[^\\s,;)}\\]]*"},{token:"string.doc",regex:"'''",next:"qdoc"},{token:"string.doc",regex:'"""',next:"qqdoc"},{token:"string",regex:"'",next:"qstring"},{token:"string",regex:'"',next:"qqstring"},{token:"string",regex:"`",next:"js"},{token:"string",regex:"<\\[",next:"words"},{token:"string.regex",regex:"//",next:"heregex"},{token:"string.regex",regex:"\\/(?:[^[\\/\\n\\\\]*(?:(?:\\\\.|\\[[^\\]\\n\\\\]*(?:\\\\.[^\\]\\n\\\\]*)*\\])[^[\\/\\n\\\\]*)*)\\/[gimy$]{0,4}",next:"key"},{token:"constant.numeric",regex:"(?:0x[\\da-fA-F][\\da-fA-F_]*|(?:[2-9]|[12]\\d|3[0-6])r[\\da-zA-Z][\\da-zA-Z_]*|(?:\\d[\\d_]*(?:\\.\\d[\\d_]*)?|\\.\\d[\\d_]*)(?:e[+-]?\\d[\\d_]*)?[\\w$]*)"},{token:"lparen",regex:"[({[]"},{token:"rparen",regex:"[)}\\]]",next:"key"},{token:"keyword.operator",regex:"\\S+"},{token:"text",regex:"\\s+"}],heregex:[{token:"string.regex",regex:".*?//[gimy$?]{0,4}",next:"start"},{token:"string.regex",regex:"\\s*#{"},{token:"comment.regex",regex:"\\s+(?:#.*)?"},{token:"string.regex",regex:"\\S+"}],key:[{token:"keyword.operator",regex:"[.?@!]+"},{token:"identifier",regex:b,next:"start"},{token:"text",regex:"",next:"start"}],comment:[{token:"comment.doc",regex:".*?\\*/",next:"start"},{token:"comment.doc",regex:".+"}],qdoc:[{token:"string",regex:".*?'''",next:"key"},e],qqdoc:[{token:"string",regex:'.*?"""',next:"key"},e],qstring:[{token:"string",regex:"[^\\\\']*(?:\\\\.[^\\\\']*)*'",next:"key"},e],qqstring:[{token:"string",regex:'[^\\\\"]*(?:\\\\.[^\\\\"]*)*"',next:"key"},e],js:[{token:"string",regex:"[^\\\\`]*(?:\\\\.[^\\\\`]*)*`",next:"key"},e],words:[{token:"string",regex:".*?\\]>",next:"key"},e]};for(var g in f){var h=f[g];if(h.splice)for(var i=0,j=h.length;j>i;++i){var k=h[i];"string"==typeof k.regex&&(f[g][i].regex=new RegExp("^"+k.regex))}else"string"==typeof k.regex&&(f[g].regex=new RegExp("^"+h.regex))}a.defineMIME("text/x-livescript","livescript")}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";a.defineMode("sass",function(a){function b(a){return new RegExp("^"+a.join("|"))}function h(a,b){var c=a.peek();return")"===c?(a.next(),b.tokenizer=n,"operator"):"("===c?(a.next(),a.eatSpace(),"operator"):"'"===c||'"'===c?(b.tokenizer=j(a.next()),"string"):(b.tokenizer=j(")",!1),"string")}function i(a,b){return function(c,d){return c.sol()&&c.indentation()<=a?(d.tokenizer=n,n(c,d)):(b&&c.skipTo("*/")?(c.next(),c.next(),d.tokenizer=n):c.next(),"comment")}}function j(a,b){function c(d,e){var f=d.next(),g=d.peek(),h=d.string.charAt(d.pos-2),i="\\"!==f&&g===a||f===a&&"\\"!==h;return i?(f!==a&&b&&d.next(),e.tokenizer=n,"string"):"#"===f&&"{"===g?(e.tokenizer=k(c),d.next(),"operator"):"string"}return null==b&&(b=!0),c}function k(a){return function(b,c){return"}"===b.peek()?(b.next(),c.tokenizer=a,"operator"):n(b,c)}}function l(b){if(0==b.indentCount){b.indentCount++;var c=b.scopes[0].offset,d=c+a.indentUnit;b.scopes.unshift({offset:d})}}function m(a){1!=a.scopes.length&&a.scopes.shift()}function n(a,b){var c=a.peek();if(a.match("/*"))return b.tokenizer=i(a.indentation(),!0),b.tokenizer(a,b);if(a.match("//"))return b.tokenizer=i(a.indentation(),!1),b.tokenizer(a,b);if(a.match("#{"))return b.tokenizer=k(n),"operator";if("."===c)return a.next(),a.match(/^[\w-]+/)?(l(b),"atom"):"#"===a.peek()?(l(b),"atom"):"operator";if("#"===c){if(a.next(),a.match(/[0-9a-fA-F]{6}|[0-9a-fA-F]{3}/))return"number";if(a.match(/^[\w-]+/))return l(b),"atom";if("#"===a.peek())return l(b),"atom"}return a.match(/^-?[0-9\.]+/)?"number":a.match(/^(px|em|in)\b/)?"unit":a.match(d)?"keyword":a.match(/^url/)&&"("===a.peek()?(b.tokenizer=h,"atom"):"$"===c?(a.next(),a.eatWhile(/[\w-]/),":"===a.peek()?(a.next(),"variable-2"):"variable-3"):"!"===c?(a.next(),a.match(/^[\w]+/)?"keyword":"operator"):"="===c?(a.next(),a.match(/^[\w-]+/)?(l(b),"meta"):"operator"):"+"===c?(a.next(),a.match(/^[\w-]+/)?"variable-3":"operator"):a.match(/^@(else if|if|media|else|for|each|while|mixin|function)/)?(l(b),"meta"):"@"===c?(a.next(),a.eatWhile(/[\w-]/),"meta"):'"'===c||"'"===c?(a.next(),b.tokenizer=j(c),"string"):":"==c&&a.match(g)?"keyword":a.eatWhile(/[\w-&]/)?":"!==a.peek()||a.match(g,!1)?"atom":"property":a.match(f)?"operator":(a.next(),null)}function o(b,c){b.sol()&&(c.indentCount=0);var d=c.tokenizer(b,c),e=b.current();if("@return"===e&&m(c),"atom"===d&&l(c),null!==d){for(var f=b.pos-e.length,g=f+a.indentUnit*c.indentCount,h=[],i=0;i<c.scopes.length;i++){var j=c.scopes[i];j.offset<=g&&h.push(j)}c.scopes=h}return d}var c=["true","false","null","auto"],d=new RegExp("^"+c.join("|")),e=["\\(","\\)","=",">","<","==",">=","<=","\\+","-","\\!=","/","\\*","%","and","or","not"],f=b(e),g=/^::?[\w\-]+/;return{startState:function(){return{tokenizer:n,scopes:[{offset:0,type:"sass"}],indentCount:0,definedVars:[],definedMixins:[]}},token:function(a,b){var c=o(a,b);return b.lastToken={style:c,content:a.current()},c},indent:function(a){return a.scopes[0].offset}}}),a.defineMIME("text/x-sass","sass")}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror"),require("../htmlmixed/htmlmixed"),require("../ruby/ruby")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","../htmlmixed/htmlmixed","../ruby/ruby"],a):a(CodeMirror)}(function(a){"use strict";a.defineMode("slim",function(b){function q(a,b,c){var d=function(d,e){return e.tokenize=b,d.pos<a?(d.pos=a,c):e.tokenize(d,e)};return function(a,c){return c.tokenize=d,b(a,c)}}function r(a,b,c,d,e){var f=a.current(),g=f.search(c);return g>-1&&(b.tokenize=q(a.pos,b.tokenize,e),a.backUp(f.length-g-d)),e}function s(a,b){a.stack={parent:a.stack,style:"continuation",indented:b,tokenize:a.line},a.line=a.tokenize
}function t(a){a.line==a.tokenize&&(a.line=a.stack.tokenize,a.stack=a.stack.parent)}function u(a,b){return function(c,d){if(t(d),c.match(/^\\$/))return s(d,a),"lineContinuation";var e=b(c,d);return c.eol()&&c.current().match(/(?:^|[^\\])(?:\\\\)*\\$/)&&c.backUp(1),e}}function v(a,b){return function(c,d){t(d);var e=b(c,d);return c.eol()&&c.current().match(/,$/)&&s(d,a),e}}function w(a,b){return function(c,d){var e=c.peek();return e==a&&1==d.rubyState.tokenize.length?(c.next(),d.tokenize=b,"closeAttributeTag"):y(c,d)}}function x(a){var b,c=function(c,d){if(1==d.rubyState.tokenize.length&&!d.rubyState.context.prev){if(c.backUp(1),c.eatSpace())return d.rubyState=b,d.tokenize=a,a(c,d);c.next()}return y(c,d)};return function(a,e){return b=e.rubyState,e.rubyState=d.startState(),e.tokenize=c,y(a,e)}}function y(a,b){return d.token(a,b.rubyState)}function z(a,b){return a.match(/^\\$/)?"lineContinuation":A(a,b)}function A(a,b){return a.match(/^#\{/)?(b.tokenize=w("}",b.tokenize),null):r(a,b,/[^\\]#\{/,1,c.token(a,b.htmlState))}function B(a){return function(b,c){var d=z(b,c);return b.eol()&&(c.tokenize=a),d}}function C(a,b,c){return b.stack={parent:b.stack,style:"html",indented:a.column()+c,tokenize:b.line},b.line=b.tokenize=A,null}function D(a,b){return a.skipToEnd(),b.stack.style}function E(a,b){return b.stack={parent:b.stack,style:"comment",indented:b.indented+1,tokenize:b.line},b.line=D,D(a,b)}function F(a,b){return a.eat(b.stack.endQuote)?(b.line=b.stack.line,b.tokenize=b.stack.tokenize,b.stack=b.stack.parent,null):a.match(n)?(b.tokenize=G,"slimAttribute"):(a.next(),null)}function G(a,b){return a.match(/^==?/)?(b.tokenize=H,null):F(a,b)}function H(a,b){var c=a.peek();return'"'==c||"'"==c?(b.tokenize=Y(c,"string",!0,!1,F),a.next(),b.tokenize(a,b)):"["==c?x(F)(a,b):a.match(/^(true|false|nil)\b/)?(b.tokenize=F,"keyword"):x(F)(a,b)}function I(a,b,c){return a.stack={parent:a.stack,style:"wrapper",indented:a.indented+1,tokenize:c,line:a.line,endQuote:b},a.line=a.tokenize=F,null}function J(b,c){if(b.match(/^#\{/))return c.tokenize=w("}",c.tokenize),null;var d=new a.StringStream(b.string.slice(c.stack.indented),b.tabSize);d.pos=b.pos-c.stack.indented,d.start=b.start-c.stack.indented,d.lastColumnPos=b.lastColumnPos-c.stack.indented,d.lastColumnValue=b.lastColumnValue-c.stack.indented;var e=c.subMode.token(d,c.subState);return b.pos=d.pos+c.stack.indented,e}function K(a,b){return b.stack.indented=a.column(),b.line=b.tokenize=J,b.tokenize(a,b)}function L(c){var d=f[c],e=a.mimeModes[d];if(e)return a.getMode(b,e);var g=a.modes[d];return g?g(b,{name:d}):a.getMode(b,"null")}function M(a){return e.hasOwnProperty(a)?e[a]:e[a]=L(a)}function N(a,b){var c=M(a),d=c.startState&&c.startState();return b.subMode=c,b.subState=d,b.stack={parent:b.stack,style:"sub",indented:b.indented+1,tokenize:b.line},b.line=b.tokenize=K,"slimSubmode"}function O(a){return a.skipToEnd(),"slimDoctype"}function P(a,b){var c=a.peek();if("<"==c)return(b.tokenize=B(b.tokenize))(a,b);if(a.match(/^[|']/))return C(a,b,1);if(a.match(/^\/(!|\[\w+])?/))return E(a,b);if(a.match(/^(-|==?[<>]?)/))return b.tokenize=u(a.column(),v(a.column(),y)),"slimSwitch";if(a.match(/^doctype\b/))return b.tokenize=O,"keyword";var d=a.match(g);return d?N(d[1],b):R(a,b)}function Q(a,b){return b.startOfLine?P(a,b):R(a,b)}function R(a,b){return a.eat("*")?(b.tokenize=x(S),null):a.match(l)?(b.tokenize=S,"slimTag"):T(a,b)}function S(a,b){return a.match(/^(<>?|><?)/)?(b.tokenize=T,null):T(a,b)}function T(a,b){return a.match(p)?(b.tokenize=T,"slimId"):a.match(o)?(b.tokenize=T,"slimClass"):U(a,b)}function U(a,b){return a.match(/^([\[\{\(])/)?I(b,i[RegExp.$1],U):a.match(m)?(b.tokenize=V,"slimAttribute"):"*"==a.peek()?(a.next(),b.tokenize=x(Z),null):Z(a,b)}function V(a,b){return a.match(/^==?/)?(b.tokenize=W,null):U(a,b)}function W(a,b){var c=a.peek();return'"'==c||"'"==c?(b.tokenize=Y(c,"string",!0,!1,U),a.next(),b.tokenize(a,b)):"["==c?x(U)(a,b):":"==c?x(X)(a,b):a.match(/^(true|false|nil)\b/)?(b.tokenize=U,"keyword"):x(U)(a,b)}function X(a,b){return a.backUp(1),a.match(/^[^\s],(?=:)/)?(b.tokenize=x(X),null):(a.next(),U(a,b))}function Y(a,b,c,d,e){return function(f,g){t(g);var h=0==f.current().length;if(f.match(/^\\$/,h))return h?(s(g,g.indented),"lineContinuation"):b;if(f.match(/^#\{/,h))return h?(g.tokenize=w("}",g.tokenize),null):b;for(var j,i=!1;null!=(j=f.next());){if(j==a&&(d||!i)){g.tokenize=e;break}if(c&&"#"==j&&!i&&f.eat("{")){f.backUp(2);break}i=!i&&"\\"==j}return f.eol()&&i&&f.backUp(1),b}}function Z(a,b){return a.match(/^==?/)?(b.tokenize=y,"slimSwitch"):a.match(/^\/$/)?(b.tokenize=Q,null):a.match(/^:/)?(b.tokenize=R,"slimSwitch"):(C(a,b,0),b.tokenize(a,b))}var c=a.getMode(b,{name:"htmlmixed"}),d=a.getMode(b,"ruby"),e={html:c,ruby:d},f={ruby:"ruby",javascript:"javascript",css:"text/css",sass:"text/x-sass",scss:"text/x-scss",less:"text/x-less",styl:"text/x-styl",coffee:"coffeescript",asciidoc:"text/x-asciidoc",markdown:"text/x-markdown",textile:"text/x-textile",creole:"text/x-creole",wiki:"text/x-wiki",mediawiki:"text/x-mediawiki",rdoc:"text/x-rdoc",builder:"text/x-builder",nokogiri:"text/x-nokogiri",erb:"application/x-erb"},g=function(a){var b=[];for(var c in a)b.push(c);return new RegExp("^("+b.join("|")+"):")}(f),h={commentLine:"comment",slimSwitch:"operator special",slimTag:"tag",slimId:"attribute def",slimClass:"attribute qualifier",slimAttribute:"attribute",slimSubmode:"keyword special",closeAttributeTag:null,slimDoctype:null,lineContinuation:null},i={"{":"}","[":"]","(":")"},j="_a-zA-Z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c-\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd",k=j+"\\-0-9\xb7\u0300-\u036f\u203f-\u2040",l=new RegExp("^[:"+j+"](?::["+k+"]|["+k+"]*)"),m=new RegExp("^[:"+j+"][:\\."+k+"]*(?=\\s*=)"),n=new RegExp("^[:"+j+"][:\\."+k+"]*"),o=/^\.-?[_a-zA-Z]+[\w\-]*/,p=/^#[_a-zA-Z]+[\w\-]*/,$={startState:function(){var a=c.startState(),b=d.startState();return{htmlState:a,rubyState:b,stack:null,last:null,tokenize:Q,line:Q,indented:0}},copyState:function(b){return{htmlState:a.copyState(c,b.htmlState),rubyState:a.copyState(d,b.rubyState),subMode:b.subMode,subState:b.subMode&&a.copyState(b.subMode,b.subState),stack:b.stack,last:b.last,tokenize:b.tokenize,line:b.line}},token:function(a,b){if(a.sol())for(b.indented=a.indentation(),b.startOfLine=!0,b.tokenize=b.line;b.stack&&b.stack.indented>b.indented&&"slimSubmode"!=b.last;)b.line=b.tokenize=b.stack.tokenize,b.stack=b.stack.parent,b.subMode=null,b.subState=null;if(a.eatSpace())return null;var c=b.tokenize(a,b);return b.startOfLine=!1,c&&(b.last=c),h.hasOwnProperty(c)?h[c]:c},blankLine:function(a){return a.subMode&&a.subMode.blankLine?a.subMode.blankLine(a.subState):void 0},innerMode:function(a){return a.subMode?{state:a.subState,mode:a.subMode}:{state:a,mode:$}}};return $},"htmlmixed","ruby"),a.defineMIME("text/x-slim","slim"),a.defineMIME("application/x-slim","slim")}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";a.defineMode("xml",function(b,c){function k(a,b){function c(c){return b.tokenize=c,c(a,b)}var d=a.next();if("<"==d)return a.eat("!")?a.eat("[")?a.match("CDATA[")?c(n("atom","]]>")):null:a.match("--")?c(n("comment","-->")):a.match("DOCTYPE",!0,!0)?(a.eatWhile(/[\w\._\-]/),c(o(1))):null:a.eat("?")?(a.eatWhile(/[\w\._\-]/),b.tokenize=n("meta","?>"),"meta"):(i=a.eat("/")?"closeTag":"openTag",b.tokenize=l,"tag bracket");if("&"==d){var e;return e=a.eat("#")?a.eat("x")?a.eatWhile(/[a-fA-F\d]/)&&a.eat(";"):a.eatWhile(/[\d]/)&&a.eat(";"):a.eatWhile(/[\w\.\-:]/)&&a.eat(";"),e?"atom":"error"}return a.eatWhile(/[^&<]/),null}function l(a,b){var c=a.next();if(">"==c||"/"==c&&a.eat(">"))return b.tokenize=k,i=">"==c?"endTag":"selfcloseTag","tag bracket";if("="==c)return i="equals",null;if("<"==c){b.tokenize=k,b.state=s,b.tagName=b.tagStart=null;var d=b.tokenize(a,b);return d?d+" tag error":"tag error"}return/[\'\"]/.test(c)?(b.tokenize=m(c),b.stringStartCol=a.column(),b.tokenize(a,b)):(a.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/),"word")}function m(a){var b=function(b,c){for(;!b.eol();)if(b.next()==a){c.tokenize=l;break}return"string"};return b.isInAttribute=!0,b}function n(a,b){return function(c,d){for(;!c.eol();){if(c.match(b)){d.tokenize=k;break}c.next()}return a}}function o(a){return function(b,c){for(var d;null!=(d=b.next());){if("<"==d)return c.tokenize=o(a+1),c.tokenize(b,c);if(">"==d){if(1==a){c.tokenize=k;break}return c.tokenize=o(a-1),c.tokenize(b,c)}}return"meta"}}function p(a,b,c){this.prev=a.context,this.tagName=b,this.indent=a.indented,this.startOfLine=c,(g.doNotIndent.hasOwnProperty(b)||a.context&&a.context.noIndent)&&(this.noIndent=!0)}function q(a){a.context&&(a.context=a.context.prev)}function r(a,b){for(var c;;){if(!a.context)return;if(c=a.context.tagName,!g.contextGrabbers.hasOwnProperty(c)||!g.contextGrabbers[c].hasOwnProperty(b))return;q(a)}}function s(a,b,c){return"openTag"==a?(c.tagStart=b.column(),t):"closeTag"==a?u:s}function t(a,b,c){return"word"==a?(c.tagName=b.current(),j="tag",x):(j="error",t)}function u(a,b,c){if("word"==a){var d=b.current();return c.context&&c.context.tagName!=d&&g.implicitlyClosed.hasOwnProperty(c.context.tagName)&&q(c),c.context&&c.context.tagName==d?(j="tag",v):(j="tag error",w)}return j="error",w}function v(a,b,c){return"endTag"!=a?(j="error",v):(q(c),s)}function w(a,b,c){return j="error",v(a,b,c)}function x(a,b,c){if("word"==a)return j="attribute",y;if("endTag"==a||"selfcloseTag"==a){var d=c.tagName,e=c.tagStart;return c.tagName=c.tagStart=null,"selfcloseTag"==a||g.autoSelfClosers.hasOwnProperty(d)?r(c,d):(r(c,d),c.context=new p(c,d,e==c.indented)),s}return j="error",x}function y(a,b,c){return"equals"==a?z:(g.allowMissing||(j="error"),x(a,b,c))}function z(a,b,c){return"string"==a?A:"word"==a&&g.allowUnquoted?(j="string",x):(j="error",x(a,b,c))}function A(a,b,c){return"string"==a?A:x(a,b,c)}var d=b.indentUnit,e=c.multilineTagIndentFactor||1,f=c.multilineTagIndentPastTag;null==f&&(f=!0);var i,j,g=c.htmlMode?{autoSelfClosers:{area:!0,base:!0,br:!0,col:!0,command:!0,embed:!0,frame:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0},implicitlyClosed:{dd:!0,li:!0,optgroup:!0,option:!0,p:!0,rp:!0,rt:!0,tbody:!0,td:!0,tfoot:!0,th:!0,tr:!0},contextGrabbers:{dd:{dd:!0,dt:!0},dt:{dd:!0,dt:!0},li:{li:!0},option:{option:!0,optgroup:!0},optgroup:{optgroup:!0},p:{address:!0,article:!0,aside:!0,blockquote:!0,dir:!0,div:!0,dl:!0,fieldset:!0,footer:!0,form:!0,h1:!0,h2:!0,h3:!0,h4:!0,h5:!0,h6:!0,header:!0,hgroup:!0,hr:!0,menu:!0,nav:!0,ol:!0,p:!0,pre:!0,section:!0,table:!0,ul:!0},rp:{rp:!0,rt:!0},rt:{rp:!0,rt:!0},tbody:{tbody:!0,tfoot:!0},td:{td:!0,th:!0},tfoot:{tbody:!0},th:{td:!0,th:!0},thead:{tbody:!0,tfoot:!0},tr:{tr:!0}},doNotIndent:{pre:!0},allowUnquoted:!0,allowMissing:!0,caseFold:!0}:{autoSelfClosers:{},implicitlyClosed:{},contextGrabbers:{},doNotIndent:{},allowUnquoted:!1,allowMissing:!1,caseFold:!1},h=c.alignCDATA;return{startState:function(){return{tokenize:k,state:s,indented:0,tagName:null,tagStart:null,context:null}},token:function(a,b){if(!b.tagName&&a.sol()&&(b.indented=a.indentation()),a.eatSpace())return null;i=null;var c=b.tokenize(a,b);return(c||i)&&"comment"!=c&&(j=null,b.state=b.state(i||c,a,b),j&&(c="error"==j?c+" error":j)),c},indent:function(b,c,i){var j=b.context;if(b.tokenize.isInAttribute)return b.tagStart==b.indented?b.stringStartCol+1:b.indented+d;if(j&&j.noIndent)return a.Pass;if(b.tokenize!=l&&b.tokenize!=k)return i?i.match(/^(\s*)/)[0].length:0;if(b.tagName)return f?b.tagStart+b.tagName.length+2:b.tagStart+d*e;if(h&&/<!\[CDATA\[/.test(c))return 0;var m=c&&/^<(\/)?([\w_:\.-]*)/.exec(c);if(m&&m[1])for(;j;){if(j.tagName==m[2]){j=j.prev;break}if(!g.implicitlyClosed.hasOwnProperty(j.tagName))break;j=j.prev}else if(m)for(;j;){var n=g.contextGrabbers[j.tagName];if(!n||!n.hasOwnProperty(m[2]))break;j=j.prev}for(;j&&!j.startOfLine;)j=j.prev;return j?j.indent+d:0},electricInput:/<\/[\s\w:]+>$/,blockCommentStart:"<!--",blockCommentEnd:"-->",configuration:c.htmlMode?"html":"xml",helperType:c.htmlMode?"html":"xml"}}),a.defineMIME("text/xml","xml"),a.defineMIME("application/xml","xml"),a.mimeModes.hasOwnProperty("text/html")||a.defineMIME("text/html",{name:"xml",htmlMode:!0})}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";function d(a){for(var d=0;d<a.state.activeLines.length;d++)a.removeLineClass(a.state.activeLines[d],"wrap",b),a.removeLineClass(a.state.activeLines[d],"background",c)}function e(a,b){if(a.length!=b.length)return!1;for(var c=0;c<a.length;c++)if(a[c]!=b[c])return!1;return!0}function f(a,f){for(var g=[],h=0;h<f.length;h++){var i=f[h];if(i.empty()){var j=a.getLineHandleVisualStart(i.head.line);g[g.length-1]!=j&&g.push(j)}}e(a.state.activeLines,g)||a.operation(function(){d(a);for(var e=0;e<g.length;e++)a.addLineClass(g[e],"wrap",b),a.addLineClass(g[e],"background",c);a.state.activeLines=g})}function g(a,b){f(a,b.ranges)}var b="CodeMirror-activeline",c="CodeMirror-activeline-background";a.defineOption("styleActiveLine",!1,function(b,c,e){var h=e&&e!=a.Init;c&&!h?(b.state.activeLines=[],f(b,b.listSelections()),b.on("beforeSelectionChange",g)):!c&&h&&(b.off("beforeSelectionChange",g),d(b),delete b.state.activeLines)})}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){function f(a,b){var c=a.getRange(e(b.line,b.ch-1),e(b.line,b.ch+1));return 2==c.length?c:null}function g(b,c,d){var e=b.getLine(c.line),f=b.getTokenAt(c);if(/\bstring2?\b/.test(f.type))return!1;var g=new a.StringStream(e.slice(0,c.ch)+d+e.slice(c.ch),4);for(g.pos=g.start=f.start;;){var h=b.getMode().token(g,f.state);if(g.pos>=c.ch+1)return/\bstring2?\b/.test(h);g.start=g.pos}}function h(b){for(var c={name:"autoCloseBrackets",Backspace:function(c){if(c.getOption("disableInput"))return a.Pass;for(var d=c.listSelections(),g=0;g<d.length;g++){if(!d[g].empty())return a.Pass;var h=f(c,d[g].head);if(!h||0!=b.indexOf(h)%2)return a.Pass}for(var g=d.length-1;g>=0;g--){var i=d[g].head;c.replaceRange("",e(i.line,i.ch-1),e(i.line,i.ch+1))}}},h="",i=0;i<b.length;i+=2)!function(b,f){b!=f&&(h+=f),c["'"+b+"'"]=function(c){if(c.getOption("disableInput"))return a.Pass;for(var j,k,i=c.listSelections(),l=0;l<i.length;l++){var o,m=i[l],n=m.head,k=c.getRange(n,e(n.line,n.ch+1));if(m.empty())if(b==f&&k==f)o=c.getRange(n,e(n.line,n.ch+3))==b+b+b?"skipThree":"skip";else if(b==f&&n.ch>1&&c.getRange(e(n.line,n.ch-2),n)==b+b&&(n.ch<=2||c.getRange(e(n.line,n.ch-3),e(n.line,n.ch-2))!=b))o="addFour";else if('"'==b||"'"==b){if(a.isWordChar(k)||!g(c,n,b))return a.Pass;o="both"}else{if(!(c.getLine(n.line).length==n.ch||h.indexOf(k)>=0||d.test(k)))return a.Pass;o="both"}else o="surround";if(j){if(j!=o)return a.Pass}else j=o}c.operation(function(){if("skip"==j)c.execCommand("goCharRight");else if("skipThree"==j)for(var a=0;3>a;a++)c.execCommand("goCharRight");else if("surround"==j){for(var d=c.getSelections(),a=0;a<d.length;a++)d[a]=b+d[a]+f;c.replaceSelections(d,"around")}else"both"==j?(c.replaceSelection(b+f,null),c.execCommand("goCharLeft")):"addFour"==j&&(c.replaceSelection(b+b+b+b,"before"),c.execCommand("goCharRight"))})},b!=f&&(c["'"+f+"'"]=function(b){for(var c=b.listSelections(),d=0;d<c.length;d++){var g=c[d];if(!g.empty()||b.getRange(g.head,e(g.head.line,g.head.ch+1))!=f)return a.Pass}b.execCommand("goCharRight")})}(b.charAt(i),b.charAt(i+1));return c}function i(b){return function(c){if(c.getOption("disableInput"))return a.Pass;for(var d=c.listSelections(),e=0;e<d.length;e++){if(!d[e].empty())return a.Pass;var g=f(c,d[e].head);if(!g||0!=b.indexOf(g)%2)return a.Pass}c.operation(function(){c.replaceSelection("\n\n",null),c.execCommand("goCharLeft"),d=c.listSelections();for(var a=0;a<d.length;a++){var b=d[a].head.line;c.indentLine(b,null,!0),c.indentLine(b+1,null,!0)}})}}var b="()[]{}''\"\"",c="[]{}",d=/\s/,e=a.Pos;a.defineOption("autoCloseBrackets",!1,function(d,e,f){if(f!=a.Init&&f&&d.removeKeyMap("autoCloseBrackets"),e){var g=b,j=c;"string"==typeof e?g=e:"object"==typeof e&&(null!=e.pairs&&(g=e.pairs),null!=e.explode&&(j=e.explode));var k=h(g);j&&(k.Enter=i(j)),d.addKeyMap(k)}})}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror"),require("../../mode/css/css")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","../../mode/css/css"],a):a(CodeMirror)}(function(a){"use strict";var b={link:1,visited:1,active:1,hover:1,focus:1,"first-letter":1,"first-line":1,"first-child":1,before:1,after:1,lang:1};a.registerHelper("hint","css",function(c){function l(a){for(var b in a)g&&0!=b.lastIndexOf(g,0)||k.push(b)}var d=c.getCursor(),e=c.getTokenAt(d),f=a.innerMode(c.getMode(),e.state);if("css"==f.mode.name){var g=e.string,h=e.start,i=e.end;/[^\w$_-]/.test(g)&&(g="",h=i=d.ch);var j=a.resolveMode("text/css"),k=[],m=f.state.state;return"pseudo"==m||"variable-3"==e.type?l(b):"block"==m||"maybeprop"==m?l(j.propertyKeywords):"prop"==m||"parens"==m||"at"==m||"params"==m?(l(j.valueKeywords),l(j.colorKeywords)):("media"==m||"media_parens"==m)&&(l(j.mediaTypes),l(j.mediaFeatures)),k.length?{list:k,from:a.Pos(d.line,h),to:a.Pos(d.line,i)}:void 0}})}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){function b(a,b,c){var e,d=a.getWrapperElement();return e=d.appendChild(document.createElement("div")),e.className=c?"CodeMirror-dialog CodeMirror-dialog-bottom":"CodeMirror-dialog CodeMirror-dialog-top","string"==typeof b?e.innerHTML=b:e.appendChild(b),e}function c(a,b){a.state.currentNotificationClose&&a.state.currentNotificationClose(),a.state.currentNotificationClose=b}a.defineExtension("openDialog",function(d,e,f){function j(a){if("string"==typeof a)k.value=a;else{if(h)return;h=!0,g.parentNode.removeChild(g),i.focus(),f.onClose&&f.onClose(g)}}f||(f={}),c(this,null);var l,g=b(this,d,f.bottom),h=!1,i=this,k=g.getElementsByTagName("input")[0];return k?(f.value&&(k.value=f.value),f.onInput&&a.on(k,"input",function(a){f.onInput(a,k.value,j)}),f.onKeyUp&&a.on(k,"keyup",function(a){f.onKeyUp(a,k.value,j)}),a.on(k,"keydown",function(b){f&&f.onKeyDown&&f.onKeyDown(b,k.value,j)||((27==b.keyCode||f.closeOnEnter!==!1&&13==b.keyCode)&&(k.blur(),a.e_stop(b),j()),13==b.keyCode&&e(k.value))}),f.closeOnBlur!==!1&&a.on(k,"blur",j),k.focus()):(l=g.getElementsByTagName("button")[0])&&(a.on(l,"click",function(){j(),i.focus()}),f.closeOnBlur!==!1&&a.on(l,"blur",j),l.focus()),j}),a.defineExtension("openConfirm",function(d,e,f){function l(){i||(i=!0,g.parentNode.removeChild(g),j.focus())}c(this,null);var g=b(this,d,f&&f.bottom),h=g.getElementsByTagName("button"),i=!1,j=this,k=1;h[0].focus();for(var m=0;m<h.length;++m){var n=h[m];!function(b){a.on(n,"click",function(c){a.e_preventDefault(c),l(),b&&b(j)})}(e[m]),a.on(n,"blur",function(){--k,setTimeout(function(){0>=k&&l()},200)}),a.on(n,"focus",function(){++k})}}),a.defineExtension("openNotification",function(d,e){function j(){g||(g=!0,clearTimeout(h),f.parentNode.removeChild(f))}c(this,j);var h,f=b(this,d,e&&e.bottom),g=!1,i=e&&"undefined"!=typeof e.duration?e.duration:5e3;return a.on(f,"click",function(b){a.e_preventDefault(b),j()}),i&&(h=setTimeout(j,i)),j})}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror","./xml-hint")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","./xml-hint"],a):a(CodeMirror)}(function(a){"use strict";function k(a){for(var b in j)j.hasOwnProperty(b)&&(a.attrs[b]=j[b])}function m(b,c){var d={schemaInfo:i};if(c)for(var e in c)d[e]=c[e];return a.hint.xml(b,d)}var b="ab aa af ak sq am ar an hy as av ae ay az bm ba eu be bn bh bi bs br bg my ca ch ce ny zh cv kw co cr hr cs da dv nl dz en eo et ee fo fj fi fr ff gl ka de el gn gu ht ha he hz hi ho hu ia id ie ga ig ik io is it iu ja jv kl kn kr ks kk km ki rw ky kv kg ko ku kj la lb lg li ln lo lt lu lv gv mk mg ms ml mt mi mr mh mn na nv nb nd ne ng nn no ii nr oc oj cu om or os pa pi fa pl ps pt qu rm rn ro ru sa sc sd se sm sg sr gd sn si sk sl so st es su sw ss sv ta te tg th ti bo tk tl tn to tr ts tt tw ty ug uk ur uz ve vi vo wa cy wo fy xh yi yo za zu".split(" "),c=["_blank","_self","_top","_parent"],d=["ascii","utf-8","utf-16","latin1","latin1"],e=["get","post","put","delete"],f=["application/x-www-form-urlencoded","multipart/form-data","text/plain"],g=["all","screen","print","embossed","braille","handheld","print","projection","screen","tty","tv","speech","3d-glasses","resolution [>][<][=] [X]","device-aspect-ratio: X/Y","orientation:portrait","orientation:landscape","device-height: [X]","device-width: [X]"],h={attrs:{}},i={a:{attrs:{href:null,ping:null,type:null,media:g,target:c,hreflang:b}},abbr:h,acronym:h,address:h,applet:h,area:{attrs:{alt:null,coords:null,href:null,target:null,ping:null,media:g,hreflang:b,type:null,shape:["default","rect","circle","poly"]}},article:h,aside:h,audio:{attrs:{src:null,mediagroup:null,crossorigin:["anonymous","use-credentials"],preload:["none","metadata","auto"],autoplay:["","autoplay"],loop:["","loop"],controls:["","controls"]}},b:h,base:{attrs:{href:null,target:c}},basefont:h,bdi:h,bdo:h,big:h,blockquote:{attrs:{cite:null}},body:h,br:h,button:{attrs:{form:null,formaction:null,name:null,value:null,autofocus:["","autofocus"],disabled:["","autofocus"],formenctype:f,formmethod:e,formnovalidate:["","novalidate"],formtarget:c,type:["submit","reset","button"]}},canvas:{attrs:{width:null,height:null}},caption:h,center:h,cite:h,code:h,col:{attrs:{span:null}},colgroup:{attrs:{span:null}},command:{attrs:{type:["command","checkbox","radio"],label:null,icon:null,radiogroup:null,command:null,title:null,disabled:["","disabled"],checked:["","checked"]}},data:{attrs:{value:null}},datagrid:{attrs:{disabled:["","disabled"],multiple:["","multiple"]}},datalist:{attrs:{data:null}},dd:h,del:{attrs:{cite:null,datetime:null}},details:{attrs:{open:["","open"]}},dfn:h,dir:h,div:h,dl:h,dt:h,em:h,embed:{attrs:{src:null,type:null,width:null,height:null}},eventsource:{attrs:{src:null}},fieldset:{attrs:{disabled:["","disabled"],form:null,name:null}},figcaption:h,figure:h,font:h,footer:h,form:{attrs:{action:null,name:null,"accept-charset":d,autocomplete:["on","off"],enctype:f,method:e,novalidate:["","novalidate"],target:c}},frame:h,frameset:h,h1:h,h2:h,h3:h,h4:h,h5:h,h6:h,head:{attrs:{},children:["title","base","link","style","meta","script","noscript","command"]},header:h,hgroup:h,hr:h,html:{attrs:{manifest:null},children:["head","body"]},i:h,iframe:{attrs:{src:null,srcdoc:null,name:null,width:null,height:null,sandbox:["allow-top-navigation","allow-same-origin","allow-forms","allow-scripts"],seamless:["","seamless"]}},img:{attrs:{alt:null,src:null,ismap:null,usemap:null,width:null,height:null,crossorigin:["anonymous","use-credentials"]}},input:{attrs:{alt:null,dirname:null,form:null,formaction:null,height:null,list:null,max:null,maxlength:null,min:null,name:null,pattern:null,placeholder:null,size:null,src:null,step:null,value:null,width:null,accept:["audio/*","video/*","image/*"],autocomplete:["on","off"],autofocus:["","autofocus"],checked:["","checked"],disabled:["","disabled"],formenctype:f,formmethod:e,formnovalidate:["","novalidate"],formtarget:c,multiple:["","multiple"],readonly:["","readonly"],required:["","required"],type:["hidden","text","search","tel","url","email","password","datetime","date","month","week","time","datetime-local","number","range","color","checkbox","radio","file","submit","image","reset","button"]}},ins:{attrs:{cite:null,datetime:null}},kbd:h,keygen:{attrs:{challenge:null,form:null,name:null,autofocus:["","autofocus"],disabled:["","disabled"],keytype:["RSA"]}},label:{attrs:{"for":null,form:null}},legend:h,li:{attrs:{value:null}},link:{attrs:{href:null,type:null,hreflang:b,media:g,sizes:["all","16x16","16x16 32x32","16x16 32x32 64x64"]}},map:{attrs:{name:null}},mark:h,menu:{attrs:{label:null,type:["list","context","toolbar"]}},meta:{attrs:{content:null,charset:d,name:["viewport","application-name","author","description","generator","keywords"],"http-equiv":["content-language","content-type","default-style","refresh"]}},meter:{attrs:{value:null,min:null,low:null,high:null,max:null,optimum:null}},nav:h,noframes:h,noscript:h,object:{attrs:{data:null,type:null,name:null,usemap:null,form:null,width:null,height:null,typemustmatch:["","typemustmatch"]}},ol:{attrs:{reversed:["","reversed"],start:null,type:["1","a","A","i","I"]}},optgroup:{attrs:{disabled:["","disabled"],label:null}},option:{attrs:{disabled:["","disabled"],label:null,selected:["","selected"],value:null}},output:{attrs:{"for":null,form:null,name:null}},p:h,param:{attrs:{name:null,value:null}},pre:h,progress:{attrs:{value:null,max:null}},q:{attrs:{cite:null}},rp:h,rt:h,ruby:h,s:h,samp:h,script:{attrs:{type:["text/javascript"],src:null,async:["","async"],defer:["","defer"],charset:d}},section:h,select:{attrs:{form:null,name:null,size:null,autofocus:["","autofocus"],disabled:["","disabled"],multiple:["","multiple"]}},small:h,source:{attrs:{src:null,type:null,media:null}},span:h,strike:h,strong:h,style:{attrs:{type:["text/css"],media:g,scoped:null}},sub:h,summary:h,sup:h,table:h,tbody:h,td:{attrs:{colspan:null,rowspan:null,headers:null}},textarea:{attrs:{dirname:null,form:null,maxlength:null,name:null,placeholder:null,rows:null,cols:null,autofocus:["","autofocus"],disabled:["","disabled"],readonly:["","readonly"],required:["","required"],wrap:["soft","hard"]}},tfoot:h,th:{attrs:{colspan:null,rowspan:null,headers:null,scope:["row","col","rowgroup","colgroup"]}},thead:h,time:{attrs:{datetime:null}},title:h,tr:h,track:{attrs:{src:null,label:null,"default":null,kind:["subtitles","captions","descriptions","chapters","metadata"],srclang:b}},tt:h,u:h,ul:h,"var":h,video:{attrs:{src:null,poster:null,width:null,height:null,crossorigin:["anonymous","use-credentials"],preload:["auto","metadata","none"],autoplay:["","autoplay"],mediagroup:["movie"],muted:["","muted"],controls:["","controls"]}},wbr:h},j={accesskey:["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9"],"class":null,contenteditable:["true","false"],contextmenu:null,dir:["ltr","rtl","auto"],draggable:["true","false","auto"],dropzone:["copy","move","link","string:","file:"],hidden:["hidden"],id:null,inert:["inert"],itemid:null,itemprop:null,itemref:null,itemscope:["itemscope"],itemtype:null,lang:["en","es"],spellcheck:["true","false"],style:null,tabindex:["1","2","3","4","5","6","7","8","9"],title:null,translate:["yes","no"],onclick:null,rel:["stylesheet","alternate","author","bookmark","help","license","next","nofollow","noreferrer","prefetch","prev","search","tag"]};k(h);for(var l in i)i.hasOwnProperty(l)&&i[l]!=h&&k(i[l]);a.htmlSchema=i,a.registerHelper("hint","html",m)}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){function c(a,b){for(var c=0,d=a.length;d>c;++c)b(a[c])}function d(a,b){if(!Array.prototype.indexOf){for(var c=a.length;c--;)if(a[c]===b)return!0;return!1}return-1!=a.indexOf(b)}function e(c,d,e,f){var g=c.getCursor(),h=e(c,g),i=h;if(!/\b(?:string|comment)\b/.test(h.type)){for(h.state=a.innerMode(c.getMode(),h.state).state,/^[\w$_]*$/.test(h.string)||(h=i={start:g.ch,end:g.ch,string:"",state:h.state,type:"."==h.string?"property":null});"property"==i.type;){if(i=e(c,b(g.line,i.start)),"."!=i.string)return;if(i=e(c,b(g.line,i.start)),!j)var j=[];j.push(i)}return{list:n(h,j,d,f),from:b(g.line,h.start),to:b(g.line,h.end)}}}function f(a,b){return e(a,l,function(a,b){return a.getTokenAt(b)},b)}function g(a,b){var c=a.getTokenAt(b);return b.ch==c.start+1&&"."==c.string.charAt(0)?(c.end=c.start,c.string=".",c.type="property"):/^\.[\w$_]*$/.test(c.string)&&(c.type="property",c.start++,c.string=c.string.replace(/\./,"")),c}function h(a,b){return e(a,m,g,b)}function n(a,b,e,f){function l(a){0!=a.lastIndexOf(h,0)||d(g,a)||g.push(a)}function m(a){"string"==typeof a?c(i,l):a instanceof Array?c(j,l):a instanceof Function&&c(k,l);for(var b in a)l(b)}var g=[],h=a.string;if(b&&b.length){var o,n=b.pop();for(n.type&&0===n.type.indexOf("variable")?(f&&f.additionalContext&&(o=f.additionalContext[n.string]),f&&f.useGlobalScope===!1||(o=o||window[n.string])):"string"==n.type?o="":"atom"==n.type?o=1:"function"==n.type&&(null==window.jQuery||"$"!=n.string&&"jQuery"!=n.string||"function"!=typeof window.jQuery?null!=window._&&"_"==n.string&&"function"==typeof window._&&(o=window._()):o=window.jQuery());null!=o&&b.length;)o=o[b.pop().string];null!=o&&m(o)}else{for(var p=a.state.localVars;p;p=p.next)l(p.name);for(var p=a.state.globalVars;p;p=p.next)l(p.name);f&&f.useGlobalScope===!1||m(window),c(e,l)}return g}var b=a.Pos;a.registerHelper("hint","javascript",f),a.registerHelper("hint","coffeescript",h);var i="charAt charCodeAt indexOf lastIndexOf substring substr slice trim trimLeft trimRight toUpperCase toLowerCase split concat match replace search".split(" "),j="length concat join splice push pop shift unshift slice reverse sort indexOf lastIndexOf every some filter forEach map reduce reduceRight ".split(" "),k="prototype apply call bind".split(" "),l="break case catch continue debugger default delete do else false finally for function if in instanceof new null return switch throw true try typeof var void while with".split(" "),m="and break catch class continue delete do else extends false finally for if in instanceof isnt new no not null of off on or return switch then throw true try typeof until void while with yes".split(" ")}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";function e(a,b){if(!window.JSHINT)return[];JSHINT(a,b);var c=JSHINT.data().errors,d=[];return c&&i(c,d),d}function f(a){return g(a,c,"warning",!0),g(a,d,"error"),h(a)?null:a}function g(a,b,c,d){var e,f,g,h,i;e=a.description;for(var j=0;j<b.length;j++)f=b[j],g="string"==typeof f?f:f[0],h="string"==typeof f?null:f[1],i=-1!==e.indexOf(g),(d||i)&&(a.severity=c),i&&h&&(a.description=h)}function h(a){for(var c=a.description,d=0;d<b.length;d++)if(-1!==c.indexOf(b[d]))return!0;return!1}function i(b,c){for(var d=0;d<b.length;d++){var e=b[d];if(e){var g,h;if(g=[],e.evidence){var i=g[e.line];if(!i){var j=e.evidence;i=[],Array.prototype.forEach.call(j,function(a,b){" "===a&&i.push(b+1)}),g[e.line]=i}if(i.length>0){var k=e.character;i.forEach(function(a){k>a&&(k-=1)}),e.character=k}}var l=e.character-1,m=l+1;e.evidence&&(h=e.evidence.substring(l).search(/.\b/),h>-1&&(m+=h)),e.description=e.reason,e.start=e.character,e.end=m,e=f(e),e&&c.push({message:e.description,severity:e.severity,from:a.Pos(e.line-1,l),to:a.Pos(e.line-1,m)})}}}var b=["Dangerous comment"],c=[["Expected '{'","Statement body should be inside '{ }' braces."]],d=["Missing semicolon","Extra comma","Missing property name","Unmatched "," and instead saw"," is not defined","Unclosed string","Stopping, unable to continue"];a.registerHelper("lint","javascript",e)}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";function c(b,c){function e(b){return d.parentNode?(d.style.top=Math.max(0,b.clientY-d.offsetHeight-5)+"px",d.style.left=b.clientX+5+"px",void 0):a.off(document,"mousemove",e)
}var d=document.createElement("div");return d.className="CodeMirror-lint-tooltip",d.appendChild(c.cloneNode(!0)),document.body.appendChild(d),a.on(document,"mousemove",e),e(b),null!=d.style.opacity&&(d.style.opacity=1),d}function d(a){a.parentNode&&a.parentNode.removeChild(a)}function e(a){a.parentNode&&(null==a.style.opacity&&d(a),a.style.opacity=0,setTimeout(function(){d(a)},600))}function f(b,d,f){function h(){a.off(f,"mouseout",h),g&&(e(g),g=null)}var g=c(b,d),i=setInterval(function(){if(g)for(var a=f;;a=a.parentNode){if(a==document.body)return;if(!a){h();break}}return g?void 0:clearInterval(i)},400);a.on(f,"mouseout",h)}function g(a,b,c){this.marked=[],this.options=b,this.timeout=null,this.hasGutter=c,this.onMouseOver=function(b){s(a,b)}}function h(b,c){if(c instanceof Function)return{getAnnotations:c};if(c&&c!==!0||(c={}),c.getAnnotations||(c.getAnnotations=b.getHelper(a.Pos(0,0),"lint")),!c.getAnnotations)throw new Error("Required option 'getAnnotations' missing (lint addon)");return c}function i(a){var c=a.state.lint;c.hasGutter&&a.clearGutter(b);for(var d=0;d<c.marked.length;++d)c.marked[d].clear();c.marked.length=0}function j(b,c,d,e){var g=document.createElement("div"),h=g;return g.className="CodeMirror-lint-marker-"+c,d&&(h=g.appendChild(document.createElement("div")),h.className="CodeMirror-lint-marker-multiple"),0!=e&&a.on(h,"mouseover",function(a){f(a,b,h)}),g}function k(a,b){return"error"==a?a:b}function l(a){for(var b=[],c=0;c<a.length;++c){var d=a[c],e=d.from.line;(b[e]||(b[e]=[])).push(d)}return b}function m(a){var b=a.severity;b||(b="error");var c=document.createElement("div");return c.className="CodeMirror-lint-message-"+b,c.appendChild(document.createTextNode(a.message)),c}function n(a){var b=a.state.lint,c=b.options;c.async?c.getAnnotations(a,o,c):o(a,c.getAnnotations(a.getValue(),c.options))}function o(a,c){i(a);for(var d=a.state.lint,e=d.options,f=l(c),g=0;g<f.length;++g){var h=f[g];if(h){for(var n=null,o=d.hasGutter&&document.createDocumentFragment(),p=0;p<h.length;++p){var q=h[p],r=q.severity;r||(r="error"),n=k(n,r),e.formatAnnotation&&(q=e.formatAnnotation(q)),d.hasGutter&&o.appendChild(m(q)),q.to&&d.marked.push(a.markText(q.from,q.to,{className:"CodeMirror-lint-mark-"+r,__annotation:q}))}d.hasGutter&&a.setGutterMarker(g,b,j(o,n,h.length>1,d.options.tooltips))}}e.onUpdateLinting&&e.onUpdateLinting(c,f,a)}function p(a){var b=a.state.lint;clearTimeout(b.timeout),b.timeout=setTimeout(function(){n(a)},b.options.delay||500)}function q(a,b){var c=b.target||b.srcElement;f(b,m(a),c)}function s(a,b){if(/\bCodeMirror-lint-mark-/.test((b.target||b.srcElement).className))for(var c=0;c<r.length;c+=2)for(var d=a.findMarksAt(a.coordsChar({left:b.clientX+r[c],top:b.clientY+r[c+1]},"client")),e=0;e<d.length;++e){var f=d[e],g=f.__annotation;if(g)return q(g,b)}}var b="CodeMirror-lint-markers",r=[0,0,0,5,0,-5,5,0,-5,0];a.defineOption("lint",!1,function(c,d,e){if(e&&e!=a.Init&&(i(c),c.off("change",p),a.off(c.getWrapperElement(),"mouseover",c.state.lint.onMouseOver),delete c.state.lint),d){for(var f=c.getOption("gutters"),j=!1,k=0;k<f.length;++k)f[k]==b&&(j=!0);var l=c.state.lint=new g(c,h(c,d),j);c.on("change",p),0!=l.options.tooltips&&a.on(c.getWrapperElement(),"mouseover",l.onMouseOver),n(c)}})}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";function b(a){a.operation(function(){j(a)})}function c(a){a.state.markedSelection.length&&a.operation(function(){h(a)})}function g(a,b,c,g){if(0!=f(b,c))for(var h=a.state.markedSelection,i=a.state.markedSelectionStyle,j=b.line;;){var k=j==b.line?b:e(j,0),l=j+d,m=l>=c.line,n=m?c:e(l,0),o=a.markText(k,n,{className:i});if(null==g?h.push(o):h.splice(g++,0,o),m)break;j=l}}function h(a){for(var b=a.state.markedSelection,c=0;c<b.length;++c)b[c].clear();b.length=0}function i(a){h(a);for(var b=a.listSelections(),c=0;c<b.length;c++)g(a,b[c].from(),b[c].to())}function j(a){if(!a.somethingSelected())return h(a);if(a.listSelections().length>1)return i(a);var b=a.getCursor("start"),c=a.getCursor("end"),e=a.state.markedSelection;if(!e.length)return g(a,b,c);var j=e[0].find(),k=e[e.length-1].find();if(!j||!k||c.line-b.line<d||f(b,k.to)>=0||f(c,j.from)<=0)return i(a);for(;f(b,j.from)>0;)e.shift().clear(),j=e[0].find();for(f(b,j.from)<0&&(j.to.line-b.line<d?(e.shift().clear(),g(a,b,j.to,0)):g(a,b,j.from,0));f(c,k.to)<0;)e.pop().clear(),k=e[e.length-1].find();f(c,k.to)>0&&(c.line-k.from.line<d?(e.pop().clear(),g(a,k.from,c)):g(a,k.to,c))}a.defineOption("styleSelectedText",!1,function(d,e,f){var g=f&&f!=a.Init;e&&!g?(d.state.markedSelection=[],d.state.markedSelectionStyle="string"==typeof e?e:"CodeMirror-selectedtext",i(d),d.on("cursorActivity",b),d.on("change",c)):!e&&g&&(d.off("cursorActivity",b),d.off("change",c),h(d),d.state.markedSelection=d.state.markedSelectionStyle=null)});var d=8,e=a.Pos,f=a.cmpPos}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";function e(a){"object"==typeof a&&(this.minChars=a.minChars,this.style=a.style,this.showToken=a.showToken,this.delay=a.delay),null==this.style&&(this.style=c),null==this.minChars&&(this.minChars=b),null==this.delay&&(this.delay=d),this.overlay=this.timeout=null}function f(a){var b=a.state.matchHighlighter;clearTimeout(b.timeout),b.timeout=setTimeout(function(){g(a)},b.delay)}function g(a){a.operation(function(){var b=a.state.matchHighlighter;if(b.overlay&&(a.removeOverlay(b.overlay),b.overlay=null),!a.somethingSelected()&&b.showToken){for(var c=b.showToken===!0?/[\w$]/:b.showToken,d=a.getCursor(),e=a.getLine(d.line),f=d.ch,g=f;f&&c.test(e.charAt(f-1));)--f;for(;g<e.length&&c.test(e.charAt(g));)++g;return g>f&&a.addOverlay(b.overlay=i(e.slice(f,g),c,b.style)),void 0}var h=a.getCursor("from"),j=a.getCursor("to");if(h.line==j.line){var k=a.getRange(h,j).replace(/^\s+|\s+$/g,"");k.length>=b.minChars&&a.addOverlay(b.overlay=i(k,!1,b.style))}})}function h(a,b){return!(a.start&&b.test(a.string.charAt(a.start-1))||a.pos!=a.string.length&&b.test(a.string.charAt(a.pos)))}function i(a,b,c){return{token:function(d){return!d.match(a)||b&&!h(d,b)?(d.next(),d.skipTo(a.charAt(0))||d.skipToEnd(),void 0):c}}}var b=2,c="matchhighlight",d=100;a.defineOption("highlightSelectionMatches",!1,function(b,c,d){if(d&&d!=a.Init){var h=b.state.matchHighlighter.overlay;h&&b.removeOverlay(h),clearTimeout(b.state.matchHighlighter.timeout),b.state.matchHighlighter=null,b.off("cursorActivity",f)}c&&(b.state.matchHighlighter=new e(c),g(b),b.on("cursorActivity",f))})}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){function e(a,b,e,g){var h=a.getLineHandle(b.line),i=b.ch-1,j=i>=0&&d[h.text.charAt(i)]||d[h.text.charAt(++i)];if(!j)return null;var k=">"==j.charAt(1)?1:-1;if(e&&k>0!=(i==b.ch))return null;var l=a.getTokenTypeAt(c(b.line,i+1)),m=f(a,c(b.line,i+(k>0?1:0)),k,l||null,g);return null==m?null:{from:c(b.line,i),to:m&&m.pos,match:m&&m.ch==j.charAt(0),forward:k>0}}function f(a,b,e,f,g){for(var h=g&&g.maxScanLineLength||1e4,i=g&&g.maxScanLines||1e3,j=[],k=g&&g.bracketRegex?g.bracketRegex:/[(){}[\]]/,l=e>0?Math.min(b.line+i,a.lastLine()+1):Math.max(a.firstLine()-1,b.line-i),m=b.line;m!=l;m+=e){var n=a.getLine(m);if(n){var o=e>0?0:n.length-1,p=e>0?n.length:-1;if(!(n.length>h))for(m==b.line&&(o=b.ch-(0>e?1:0));o!=p;o+=e){var q=n.charAt(o);if(k.test(q)&&(void 0===f||a.getTokenTypeAt(c(m,o+1))==f)){var r=d[q];if(">"==r.charAt(1)==e>0)j.push(q);else{if(!j.length)return{pos:c(m,o),ch:q};j.pop()}}}}}return m-e==(e>0?a.lastLine():a.firstLine())?!1:null}function g(a,d,f){for(var g=a.state.matchBrackets.maxHighlightLineLength||1e3,h=[],i=a.listSelections(),j=0;j<i.length;j++){var k=i[j].empty()&&e(a,i[j].head,!1,f);if(k&&a.getLine(k.from.line).length<=g){var l=k.match?"CodeMirror-matchingbracket":"CodeMirror-nonmatchingbracket";h.push(a.markText(k.from,c(k.from.line,k.from.ch+1),{className:l})),k.to&&a.getLine(k.to.line).length<=g&&h.push(a.markText(k.to,c(k.to.line,k.to.ch+1),{className:l}))}}if(h.length){b&&a.state.focused&&a.display.input.focus();var m=function(){a.operation(function(){for(var a=0;a<h.length;a++)h[a].clear()})};if(!d)return m;setTimeout(m,800)}}function i(a){a.operation(function(){h&&(h(),h=null),h=g(a,!1,a.state.matchBrackets)})}var b=/MSIE \d/.test(navigator.userAgent)&&(null==document.documentMode||document.documentMode<8),c=a.Pos,d={"(":")>",")":"(<","[":"]>","]":"[<","{":"}>","}":"{<"},h=null;a.defineOption("matchBrackets",!1,function(b,c,d){d&&d!=a.Init&&b.off("cursorActivity",i),c&&(b.state.matchBrackets="object"==typeof c?c:{},b.on("cursorActivity",i))}),a.defineExtension("matchBrackets",function(){g(this,!0)}),a.defineExtension("findMatchingBracket",function(a,b,c){return e(this,a,b,c)}),a.defineExtension("scanForBracket",function(a,b,c,d){return f(this,a,b,c,d)})}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror"),require("../fold/xml-fold")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","../fold/xml-fold"],a):a(CodeMirror)}(function(a){"use strict";function b(a){a.state.tagHit&&a.state.tagHit.clear(),a.state.tagOther&&a.state.tagOther.clear(),a.state.tagHit=a.state.tagOther=null}function c(c){c.state.failedTagMatch=!1,c.operation(function(){if(b(c),!c.somethingSelected()){var d=c.getCursor(),e=c.getViewport();e.from=Math.min(e.from,d.line),e.to=Math.max(d.line+1,e.to);var f=a.findMatchingTag(c,d,e);if(f){if(c.state.matchBothTags){var g="open"==f.at?f.open:f.close;g&&(c.state.tagHit=c.markText(g.from,g.to,{className:"CodeMirror-matchingtag"}))}var h="close"==f.at?f.open:f.close;h?c.state.tagOther=c.markText(h.from,h.to,{className:"CodeMirror-matchingtag"}):c.state.failedTagMatch=!0}}})}function d(a){a.state.failedTagMatch&&c(a)}a.defineOption("matchTags",!1,function(e,f,g){g&&g!=a.Init&&(e.off("cursorActivity",c),e.off("viewportChange",d),b(e)),f&&(e.state.matchBothTags="object"==typeof f&&f.bothTags,e.on("cursorActivity",c),e.on("viewportChange",d),c(e))}),a.commands.toMatchingTag=function(b){var c=a.findMatchingTag(b,b.getCursor());if(c){var d="close"==c.at?c.open:c.close;d&&b.extendSelection(d.to,d.from)}}}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";a.overlayMode=function(b,c,d){return{startState:function(){return{base:a.startState(b),overlay:a.startState(c),basePos:0,baseCur:null,overlayPos:0,overlayCur:null,lineSeen:null}},copyState:function(d){return{base:a.copyState(b,d.base),overlay:a.copyState(c,d.overlay),basePos:d.basePos,baseCur:null,overlayPos:d.overlayPos,overlayCur:null}},token:function(a,e){return(a.sol()||a.string!=e.lineSeen||Math.min(e.basePos,e.overlayPos)<a.start)&&(e.lineSeen=a.string,e.basePos=e.overlayPos=a.start),a.start==e.basePos&&(e.baseCur=b.token(a,e.base),e.basePos=a.pos),a.start==e.overlayPos&&(a.pos=a.start,e.overlayCur=c.token(a,e.overlay),e.overlayPos=a.pos),a.pos=Math.min(e.basePos,e.overlayPos),null==e.overlayCur?e.baseCur:null!=e.baseCur&&e.overlay.combineTokens||d&&null==e.overlay.combineTokens?e.baseCur+" "+e.overlayCur:e.overlayCur},indent:b.indent&&function(a,c){return b.indent(a.base,c)},electricChars:b.electricChars,innerMode:function(a){return{state:a.base,mode:b}},blankLine:function(a){b.blankLine&&b.blankLine(a.base),c.blankLine&&c.blankLine(a.overlay)}}}}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";function b(a){for(var b=a.display.lineSpace.childNodes.length-1;b>=0;b--){var c=a.display.lineSpace.childNodes[b];/(^|\s)CodeMirror-ruler($|\s)/.test(c.className)&&c.parentNode.removeChild(c)}}function c(b){for(var c=b.getOption("rulers"),d=b.defaultCharWidth(),e=b.charCoords(a.Pos(b.firstLine(),0),"div").left,f=b.display.scroller.offsetHeight+30,g=0;g<c.length;g++){var h=document.createElement("div");h.className="CodeMirror-ruler";var i,j=null,k=c[g];"number"==typeof k?i=k:(i=k.column,k.className&&(h.className+=" "+k.className),k.color&&(h.style.borderColor=k.color),k.lineStyle&&(h.style.borderLeftStyle=k.lineStyle),k.width&&(h.style.borderLeftWidth=k.width),j=c[g].className),h.style.left=e+i*d+"px",h.style.top="-50px",h.style.bottom="-20px",h.style.minHeight=f+"px",b.display.lineSpace.insertBefore(h,b.display.cursorDiv)}}function d(a){b(a),c(a)}a.defineOption("rulers",!1,function(e,f,g){g&&g!=a.Init&&(b(e),e.off("refresh",d)),f&&f.length&&(c(e),e.on("refresh",d))})}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror"),require("./searchcursor"),require("../dialog/dialog")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","./searchcursor","../dialog/dialog"],a):a(CodeMirror)}(function(a){"use strict";function b(a,b){return"string"==typeof a?a=new RegExp(a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&"),b?"gi":"g"):a.global||(a=new RegExp(a.source,a.ignoreCase?"gi":"g")),{token:function(b){a.lastIndex=b.pos;var c=a.exec(b.string);return c&&c.index==b.pos?(b.pos+=c[0].length,"searching"):(c?b.pos=c.index:b.skipToEnd(),void 0)}}}function c(){this.posFrom=this.posTo=this.query=null,this.overlay=null}function d(a){return a.state.search||(a.state.search=new c)}function e(a){return"string"==typeof a&&a==a.toLowerCase()}function f(a,b,c){return a.getSearchCursor(b,c,e(b))}function g(a,b,c,d,e){a.openDialog?a.openDialog(b,e,{value:d}):e(prompt(c,d))}function h(a,b,c,d){a.openConfirm?a.openConfirm(b,d):confirm(c)&&d[0]()}function i(a){var b=a.match(/^\/(.*)\/([a-z]*)$/);return b?(a=new RegExp(b[1],-1==b[2].indexOf("i")?"":"i"),a.test("")&&(a=/x^/)):""==a&&(a=/x^/),a}function k(a,c){var f=d(a);return f.query?l(a,c):(g(a,j,"Search for:",a.getSelection(),function(d){a.operation(function(){d&&!f.query&&(f.query=i(d),a.removeOverlay(f.overlay,e(f.query)),f.overlay=b(f.query,e(f.query)),a.addOverlay(f.overlay),f.posFrom=f.posTo=a.getCursor(),l(a,c))})}),void 0)}function l(b,c){b.operation(function(){var e=d(b),g=f(b,e.query,c?e.posFrom:e.posTo);(g.find(c)||(g=f(b,e.query,c?a.Pos(b.lastLine()):a.Pos(b.firstLine(),0)),g.find(c)))&&(b.setSelection(g.from(),g.to()),b.scrollIntoView({from:g.from(),to:g.to()}),e.posFrom=g.from(),e.posTo=g.to())})}function m(a){a.operation(function(){var b=d(a);b.query&&(b.query=null,a.removeOverlay(b.overlay))})}function q(a,b){a.getOption("readOnly")||g(a,n,"Replace:",a.getSelection(),function(c){c&&(c=i(c),g(a,o,"Replace with:","",function(d){if(b)a.operation(function(){for(var b=f(a,c);b.findNext();)if("string"!=typeof c){var e=a.getRange(b.from(),b.to()).match(c);b.replace(d.replace(/\$(\d)/g,function(a,b){return e[b]}))}else b.replace(d)});else{m(a);var e=f(a,c,a.getCursor()),g=function(){var d,b=e.from();!(d=e.findNext())&&(e=f(a,c),!(d=e.findNext())||b&&e.from().line==b.line&&e.from().ch==b.ch)||(a.setSelection(e.from(),e.to()),a.scrollIntoView({from:e.from(),to:e.to()}),h(a,p,"Replace?",[function(){i(d)},g]))},i=function(a){e.replace("string"==typeof c?d:d.replace(/\$(\d)/g,function(b,c){return a[c]})),g()};g()}}))})}var j='Search: <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">(Use /re/ syntax for regexp search)</span>',n='Replace: <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">(Use /re/ syntax for regexp search)</span>',o='With: <input type="text" style="width: 10em" class="CodeMirror-search-field"/>',p="Replace? <button>Yes</button> <button>No</button> <button>Stop</button>";a.commands.find=function(a){m(a),k(a)},a.commands.findNext=k,a.commands.findPrev=function(a){k(a,!0)},a.commands.clearSearch=m,a.commands.replace=q,a.commands.replaceAll=function(a){q(a,!0)}}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";function c(a,c,e,f){if(this.atOccurrence=!1,this.doc=a,null==f&&"string"==typeof c&&(f=!1),e=e?a.clipPos(e):b(0,0),this.pos={from:e,to:e},"string"!=typeof c)c.global||(c=new RegExp(c.source,c.ignoreCase?"ig":"g")),this.matches=function(d,e){if(d){c.lastIndex=0;for(var h,i,f=a.getLine(e.line).slice(0,e.ch),g=0;;){c.lastIndex=g;var j=c.exec(f);if(!j)break;if(h=j,i=h.index,g=h.index+(h[0].length||1),g==f.length)break}var k=h&&h[0].length||0;k||(0==i&&0==f.length?h=void 0:i!=a.getLine(e.line).length&&k++)}else{c.lastIndex=e.ch;var f=a.getLine(e.line),h=c.exec(f),k=h&&h[0].length||0,i=h&&h.index;i+k==f.length||k||(k=1)}return h&&k?{from:b(e.line,i),to:b(e.line,i+k),match:h}:void 0};else{var g=c;f&&(c=c.toLowerCase());var h=f?function(a){return a.toLowerCase()}:function(a){return a},i=c.split("\n");if(1==i.length)this.matches=c.length?function(e,f){if(e){var i=a.getLine(f.line).slice(0,f.ch),j=h(i),k=j.lastIndexOf(c);if(k>-1)return k=d(i,j,k),{from:b(f.line,k),to:b(f.line,k+g.length)}}else{var i=a.getLine(f.line).slice(f.ch),j=h(i),k=j.indexOf(c);if(k>-1)return k=d(i,j,k)+f.ch,{from:b(f.line,k),to:b(f.line,k+g.length)}}}:function(){};else{var j=g.split("\n");this.matches=function(c,d){var e=i.length-1;if(c){if(d.line-(i.length-1)<a.firstLine())return;if(h(a.getLine(d.line).slice(0,j[e].length))!=i[i.length-1])return;for(var f=b(d.line,j[e].length),g=d.line-1,k=e-1;k>=1;--k,--g)if(i[k]!=h(a.getLine(g)))return;var l=a.getLine(g),m=l.length-j[0].length;if(h(l.slice(m))!=i[0])return;return{from:b(g,m),to:f}}if(!(d.line+(i.length-1)>a.lastLine())){var l=a.getLine(d.line),m=l.length-j[0].length;if(h(l.slice(m))==i[0]){for(var n=b(d.line,m),g=d.line+1,k=1;e>k;++k,++g)if(i[k]!=h(a.getLine(g)))return;if(h(a.getLine(g).slice(0,j[e].length))==i[e])return{from:n,to:b(g,j[e].length)}}}}}}}function d(a,b,c){if(a.length==b.length)return c;for(var d=Math.min(c,a.length);;){var e=a.slice(0,d).toLowerCase().length;if(c>e)++d;else{if(!(e>c))return d;--d}}}var b=a.Pos;c.prototype={findNext:function(){return this.find(!1)},findPrevious:function(){return this.find(!0)},find:function(a){function e(a){var d=b(a,0);return c.pos={from:d,to:d},c.atOccurrence=!1,!1}for(var c=this,d=this.doc.clipPos(a?this.pos.from:this.pos.to);;){if(this.pos=this.matches(a,d))return this.atOccurrence=!0,this.pos.match||!0;if(a){if(!d.line)return e(0);d=b(d.line-1,this.doc.getLine(d.line-1).length)}else{var f=this.doc.lineCount();if(d.line==f-1)return e(f);d=b(d.line+1,0)}}},from:function(){return this.atOccurrence?this.pos.from:void 0},to:function(){return this.atOccurrence?this.pos.to:void 0},replace:function(c){if(this.atOccurrence){var d=a.splitLines(c);this.doc.replaceRange(d,this.pos.from,this.pos.to),this.pos.to=b(this.pos.from.line+d.length-1,d[d.length-1].length+(1==d.length?this.pos.from.ch:0))}}},a.defineExtension("getSearchCursor",function(a,b,d){return new c(this.doc,a,b,d)}),a.defineDocExtension("getSearchCursor",function(a,b,d){return new c(this,a,b,d)}),a.defineExtension("selectMatches",function(b,c){for(var e,d=[],f=this.getSearchCursor(b,this.getCursor("from"),c);(e=f.findNext())&&!(a.cmpPos(f.to(),this.getCursor("to"))>0);)d.push({anchor:f.from(),head:f.to()});d.length&&this.setSelections(d,0)})}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";function d(a,b){this.cm=a,this.options=this.buildOptions(b),this.widget=this.onClose=null}function e(a){return"string"==typeof a?a:a.text}function f(a,b){function f(a,d){var f;f="string"!=typeof d?function(a){return d(a,b)}:c.hasOwnProperty(d)?c[d]:d,e[a]=f}var c={Up:function(){b.moveFocus(-1)},Down:function(){b.moveFocus(1)},PageUp:function(){b.moveFocus(-b.menuSize()+1,!0)},PageDown:function(){b.moveFocus(b.menuSize()-1,!0)},Home:function(){b.setFocus(0)},End:function(){b.setFocus(b.length-1)},Enter:b.pick,Tab:b.pick,Esc:b.close},d=a.options.customKeys,e=d?{}:c;if(d)for(var g in d)d.hasOwnProperty(g)&&f(g,d[g]);var h=a.options.extraKeys;if(h)for(var g in h)h.hasOwnProperty(g)&&f(g,h[g]);return e}function g(a,b){for(;b&&b!=a;){if("LI"===b.nodeName.toUpperCase()&&b.parentNode==a)return b;b=b.parentNode}}function h(d,h){this.completion=d,this.data=h;var i=this,j=d.cm,k=this.hints=document.createElement("ul");k.className="CodeMirror-hints",this.selectedHint=h.selectedHint||0;for(var l=h.list,m=0;m<l.length;++m){var n=k.appendChild(document.createElement("li")),o=l[m],p=b+(m!=this.selectedHint?"":" "+c);null!=o.className&&(p=o.className+" "+p),n.className=p,o.render?o.render(n,h,o):n.appendChild(document.createTextNode(o.displayText||e(o))),n.hintId=m}var q=j.cursorCoords(d.options.alignWithWord?h.from:null),r=q.left,s=q.bottom,t=!0;k.style.left=r+"px",k.style.top=s+"px";var u=window.innerWidth||Math.max(document.body.offsetWidth,document.documentElement.offsetWidth),v=window.innerHeight||Math.max(document.body.offsetHeight,document.documentElement.offsetHeight);(d.options.container||document.body).appendChild(k);var w=k.getBoundingClientRect(),x=w.bottom-v;if(x>0){var y=w.bottom-w.top,z=q.top-(q.bottom-w.top);if(z-y>0)k.style.top=(s=q.top-y)+"px",t=!1;else if(y>v){k.style.height=v-5+"px",k.style.top=(s=q.bottom-w.top)+"px";var A=j.getCursor();h.from.ch!=A.ch&&(q=j.cursorCoords(A),k.style.left=(r=q.left)+"px",w=k.getBoundingClientRect())}}var B=w.left-u;if(B>0&&(w.right-w.left>u&&(k.style.width=u-5+"px",B-=w.right-w.left-u),k.style.left=(r=q.left-B)+"px"),j.addKeyMap(this.keyMap=f(d,{moveFocus:function(a,b){i.changeActive(i.selectedHint+a,b)},setFocus:function(a){i.changeActive(a)},menuSize:function(){return i.screenAmount()},length:l.length,close:function(){d.close()},pick:function(){i.pick()},data:h})),d.options.closeOnUnfocus){var C;j.on("blur",this.onBlur=function(){C=setTimeout(function(){d.close()},100)}),j.on("focus",this.onFocus=function(){clearTimeout(C)})}var D=j.getScrollInfo();return j.on("scroll",this.onScroll=function(){var a=j.getScrollInfo(),b=j.getWrapperElement().getBoundingClientRect(),c=s+D.top-a.top,e=c-(window.pageYOffset||(document.documentElement||document.body).scrollTop);return t||(e+=k.offsetHeight),e<=b.top||e>=b.bottom?d.close():(k.style.top=c+"px",k.style.left=r+D.left-a.left+"px",void 0)}),a.on(k,"dblclick",function(a){var b=g(k,a.target||a.srcElement);b&&null!=b.hintId&&(i.changeActive(b.hintId),i.pick())}),a.on(k,"click",function(a){var b=g(k,a.target||a.srcElement);b&&null!=b.hintId&&(i.changeActive(b.hintId),d.options.completeOnSingleClick&&i.pick())}),a.on(k,"mousedown",function(){setTimeout(function(){j.focus()},20)}),a.signal(h,"select",l[0],k.firstChild),!0}var b="CodeMirror-hint",c="CodeMirror-hint-active";a.showHint=function(a,b,c){if(!b)return a.showHint(c);c&&c.async&&(b.async=!0);var d={hint:b};if(c)for(var e in c)d[e]=c[e];return a.showHint(d)},a.defineExtension("showHint",function(b){if(!(this.listSelections().length>1||this.somethingSelected())){this.state.completionActive&&this.state.completionActive.close();var c=this.state.completionActive=new d(this,b),e=c.options.hint;if(e)return a.signal(this,"startCompletion",this),e.async?(e(this,function(a){c.showHints(a)},c.options),void 0):c.showHints(e(this,c.options))}}),d.prototype={close:function(){this.active()&&(this.cm.state.completionActive=null,this.widget&&this.widget.close(),this.onClose&&this.onClose(),a.signal(this.cm,"endCompletion",this.cm))},active:function(){return this.cm.state.completionActive==this},pick:function(b,c){var d=b.list[c];d.hint?d.hint(this.cm,b,d):this.cm.replaceRange(e(d),d.from||b.from,d.to||b.to,"complete"),a.signal(b,"pick",d),this.close()},showHints:function(a){return a&&a.list.length&&this.active()?(this.options.completeSingle&&1==a.list.length?this.pick(a,0):this.showWidget(a),void 0):this.close()},showWidget:function(b){function l(){e||(e=!0,d.close(),d.cm.off("cursorActivity",p),b&&a.signal(b,"close"))}function m(){if(!e){a.signal(b,"update");var c=d.options.hint;c.async?c(d.cm,n,d.options):n(c(d.cm,d.options))}}function n(a){if(b=a,!e){if(!b||!b.list.length)return l();d.widget&&d.widget.close(),d.widget=new h(d,b)}}function o(){c&&(k(c),c=0)}function p(){o();var a=d.cm.getCursor(),b=d.cm.getLine(a.line);a.line!=g.line||b.length-a.ch!=i-g.ch||a.ch<g.ch||d.cm.somethingSelected()||a.ch&&f.test(b.charAt(a.ch-1))?d.close():(c=j(m),d.widget&&d.widget.close())}this.widget=new h(this,b),a.signal(b,"shown");var e,c=0,d=this,f=this.options.closeCharacters,g=this.cm.getCursor(),i=this.cm.getLine(g.line).length,j=window.requestAnimationFrame||function(a){return setTimeout(a,1e3/60)},k=window.cancelAnimationFrame||clearTimeout;this.cm.on("cursorActivity",p),this.onClose=l},buildOptions:function(a){var b=this.cm.options.hintOptions,c={};for(var d in i)c[d]=i[d];if(b)for(var d in b)void 0!==b[d]&&(c[d]=b[d]);if(a)for(var d in a)void 0!==a[d]&&(c[d]=a[d]);return c}},h.prototype={close:function(){if(this.completion.widget==this){this.completion.widget=null,this.hints.parentNode.removeChild(this.hints),this.completion.cm.removeKeyMap(this.keyMap);var a=this.completion.cm;this.completion.options.closeOnUnfocus&&(a.off("blur",this.onBlur),a.off("focus",this.onFocus)),a.off("scroll",this.onScroll)}},pick:function(){this.completion.pick(this.data,this.selectedHint)},changeActive:function(b,d){if(b>=this.data.list.length?b=d?this.data.list.length-1:0:0>b&&(b=d?0:this.data.list.length-1),this.selectedHint!=b){var e=this.hints.childNodes[this.selectedHint];e.className=e.className.replace(" "+c,""),e=this.hints.childNodes[this.selectedHint=b],e.className+=" "+c,e.offsetTop<this.hints.scrollTop?this.hints.scrollTop=e.offsetTop-3:e.offsetTop+e.offsetHeight>this.hints.scrollTop+this.hints.clientHeight&&(this.hints.scrollTop=e.offsetTop+e.offsetHeight-this.hints.clientHeight+3),a.signal(this.data,"select",this.data.list[this.selectedHint],e)}},screenAmount:function(){return Math.floor(this.hints.clientHeight/this.hints.firstChild.offsetHeight)||1}},a.registerHelper("hint","auto",function(b,c){var e,d=b.getHelpers(b.getCursor(),"hint");if(d.length)for(var f=0;f<d.length;f++){var g=d[f](b,c);if(g&&g.list.length)return g}else if(e=b.getHelper(b.getCursor(),"hintWords")){if(e)return a.hint.fromList(b,{words:e})}else if(a.hint.anyword)return a.hint.anyword(b,c)}),a.registerHelper("hint","fromList",function(b,c){for(var d=b.getCursor(),e=b.getTokenAt(d),f=[],g=0;g<c.words.length;g++){var h=c.words[g];h.slice(0,e.string.length)==e.string&&f.push(h)}return f.length?{list:f,from:a.Pos(d.line,e.start),to:a.Pos(d.line,e.end)}:void 0}),a.commands.autocomplete=a.showHint;var i={hint:a.hint.auto,completeSingle:!0,alignWithWord:!0,closeCharacters:/[\s()\[\]{};:>,]/,closeOnUnfocus:!0,completeOnSingleClick:!1,container:null,customKeys:null,extraKeys:null};a.defineOption("hintOptions",null)}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){a.defineOption("showTrailingSpace",!1,function(b,c,d){d==a.Init&&(d=!1),d&&!c?b.removeOverlay("trailingspace"):!d&&c&&b.addOverlay({token:function(a){for(var b=a.string.length,c=b;c&&/\s/.test(a.string.charAt(c-1));--c);return c>a.pos?(a.pos=c,null):(a.pos=b,"trailingspace")},name:"trailingspace"})})}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";function c(c,d){var e=d&&d.schemaInfo,f=d&&d.quoteChar||'"';if(e){var g=c.getCursor(),h=c.getTokenAt(g),i=a.innerMode(c.getMode(),h.state);if("xml"==i.mode.name){var l,o,j=[],k=!1,m=/\btag\b/.test(h.type),n=m&&/^\w/.test(h.string);if(n){var p=c.getLine(g.line).slice(Math.max(0,h.start-2),h.start),q=/<\/$/.test(p)?"close":/<$/.test(p)?"open":null;q&&(o=h.start-("close"==q?2:1))}else m&&"<"==h.string?q="open":m&&"</"==h.string&&(q="close");if(!m&&!i.state.tagName||q){n&&(l=h.string),k=q;var r=i.state.context,s=r&&e[r.tagName],t=r?s&&s.children:e["!top"];if(t&&"close"!=q)for(var u=0;u<t.length;++u)l&&0!=t[u].lastIndexOf(l,0)||j.push("<"+t[u]);else if("close"!=q)for(var v in e)!e.hasOwnProperty(v)||"!top"==v||"!attrs"==v||l&&0!=v.lastIndexOf(l,0)||j.push("<"+v);r&&(!l||"close"==q&&0==r.tagName.lastIndexOf(l,0))&&j.push("</"+r.tagName+">")}else{var s=e[i.state.tagName],w=s&&s.attrs,x=e["!attrs"];if(!w&&!x)return;if(w){if(x){var y={};for(var z in x)x.hasOwnProperty(z)&&(y[z]=x[z]);for(var z in w)w.hasOwnProperty(z)&&(y[z]=w[z]);w=y}}else w=x;if("string"==h.type||"="==h.string){var B,p=c.getRange(b(g.line,Math.max(0,g.ch-60)),b(g.line,"string"==h.type?h.start:h.end)),A=p.match(/([^\s\u00a0=<>\"\']+)=$/);if(!A||!w.hasOwnProperty(A[1])||!(B=w[A[1]]))return;if("function"==typeof B&&(B=B.call(this,c)),"string"==h.type){l=h.string;var C=0;/['"]/.test(h.string.charAt(0))&&(f=h.string.charAt(0),l=h.string.slice(1),C++);var D=h.string.length;/['"]/.test(h.string.charAt(D-1))&&(f=h.string.charAt(D-1),l=h.string.substr(C,D-2)),k=!0}for(var u=0;u<B.length;++u)l&&0!=B[u].lastIndexOf(l,0)||j.push(f+B[u]+f)}else{"attribute"==h.type&&(l=h.string,k=!0);for(var E in w)!w.hasOwnProperty(E)||l&&0!=E.lastIndexOf(l,0)||j.push(E)}}return{list:j,from:k?b(g.line,null==o?h.start:o):g,to:k?b(g.line,h.end):g}}}}var b=a.Pos;a.registerHelper("hint","xml",c)}),function(a){"object"==typeof exports&&"object"==typeof module?a(require("../lib/codemirror"),require("../addon/search/searchcursor"),require("../addon/edit/matchbrackets")):"function"==typeof define&&define.amd?define(["../lib/codemirror","../addon/search/searchcursor","../addon/edit/matchbrackets"],a):a(CodeMirror)}(function(a){"use strict";function g(b,c,e){if(0>e&&0==c.ch)return b.clipPos(d(c.line-1));var f=b.getLine(c.line);if(e>0&&c.ch>=f.length)return b.clipPos(d(c.line+1,0));for(var h,g="start",i=c.ch,j=0>e?0:f.length,k=0;i!=j;i+=e,k++){var l=f.charAt(0>e?i-1:i),m="_"!=l&&a.isWordChar(l)?"w":"o";if("w"==m&&l.toUpperCase()==l&&(m="W"),"start"==g)"o"!=m&&(g="in",h=m);else if("in"==g&&h!=m){if("w"==h&&"W"==m&&0>e&&i--,"W"==h&&"w"==m&&e>0){h="w";continue}break}}return d(c.line,i)}function h(a,b){a.extendSelectionsBy(function(c){return a.display.shift||a.doc.extend||c.empty()?g(a.doc,c.head,b):0>b?c.from():c.to()})}function i(a,b){a.operation(function(){for(var c=a.listSelections().length,e=[],f=-1,g=0;c>g;g++){var h=a.listSelections()[g].head;if(!(h.line<=f)){var i=d(h.line+(b?0:1),0);a.replaceRange("\n",i,null,"+insertLine"),a.indentLine(i.line,null,!0),e.push({head:i,anchor:i}),f=h.line+1}}a.setSelections(e)})}function j(b,c){for(var e=c.ch,f=e,g=b.getLine(c.line);e&&a.isWordChar(g.charAt(e-1));)--e;for(;f<g.length&&a.isWordChar(g.charAt(f));)++f;return{from:d(c.line,e),to:d(c.line,f),word:g.slice(e,f)}}function l(a){var b=a.getCursor(),c=a.scanForBracket(b,-1);if(c)for(;;){var e=a.scanForBracket(b,1);if(!e)return;if(e.ch==k.charAt(k.indexOf(c.ch)+1))return a.setSelection(d(c.pos.line,c.pos.ch+1),e.pos,!1),!0;b=d(e.pos.line,e.pos.ch+1)}}function n(a,b){for(var f,c=a.listSelections(),e=[],g=0;g<c.length;g++){var h=c[g];if(!h.empty()){for(var i=h.from().line,j=h.to().line;g<c.length-1&&c[g+1].from().line==j;)j=h[++g].to().line;e.push(i,j)}}e.length?f=!0:e.push(a.firstLine(),a.lastLine()),a.operation(function(){for(var c=[],g=0;g<e.length;g+=2){var h=e[g],i=e[g+1],j=d(h,0),k=d(i),l=a.getRange(j,k,!1);b?l.sort():l.sort(function(a,b){var c=a.toUpperCase(),d=b.toUpperCase();
return c!=d&&(a=c,b=d),b>a?-1:a==b?0:1}),a.replaceRange(l,j,k),f&&c.push({anchor:j,head:k})}f&&a.setSelections(c,0)})}function p(b,c){b.operation(function(){for(var d=b.listSelections(),e=[],f=[],g=0;g<d.length;g++){var h=d[g];h.empty()?(e.push(g),f.push("")):f.push(c(b.getRange(h.from(),h.to())))}b.replaceSelections(f,"around","case");for(var i,g=e.length-1;g>=0;g--){var h=d[e[g]];if(!(i&&a.cmpPos(h.head,i)>0)){var k=j(b,h.head);i=k.from,b.replaceRange(c(k.word),k.from,k.to)}}})}function q(b){var c=b.getCursor("from"),d=b.getCursor("to");if(0==a.cmpPos(c,d)){var e=j(b,c);if(!e.word)return;c=e.from,d=e.to}return{from:c,to:d,query:b.getRange(c,d),word:e}}function r(a,b){var c=q(a);if(c){var e=c.query,f=a.getSearchCursor(e,b?c.to:c.from);(b?f.findNext():f.findPrevious())?a.setSelection(f.from(),f.to()):(f=a.getSearchCursor(e,b?d(a.firstLine(),0):a.clipPos(d(a.lastLine()))),(b?f.findNext():f.findPrevious())?a.setSelection(f.from(),f.to()):c.word&&a.setSelection(c.from,c.to))}}var b=a.keyMap.sublime={fallthrough:"default"},c=a.commands,d=a.Pos,e=a.keyMap["default"]==a.keyMap.macDefault,f=e?"Cmd-":"Ctrl-";c[b["Alt-Left"]="goSubwordLeft"]=function(a){h(a,-1)},c[b["Alt-Right"]="goSubwordRight"]=function(a){h(a,1)},c[b[f+"Up"]="scrollLineUp"]=function(a){var b=a.getScrollInfo();if(!a.somethingSelected()){var c=a.lineAtHeight(b.top+b.clientHeight,"local");a.getCursor().line>=c&&a.execCommand("goLineUp")}a.scrollTo(null,b.top-a.defaultTextHeight())},c[b[f+"Down"]="scrollLineDown"]=function(a){var b=a.getScrollInfo();if(!a.somethingSelected()){var c=a.lineAtHeight(b.top,"local")+1;a.getCursor().line<=c&&a.execCommand("goLineDown")}a.scrollTo(null,b.top+a.defaultTextHeight())},c[b["Shift-"+f+"L"]="splitSelectionByLine"]=function(a){for(var b=a.listSelections(),c=[],e=0;e<b.length;e++)for(var f=b[e].from(),g=b[e].to(),h=f.line;h<=g.line;++h)g.line>f.line&&h==g.line&&0==g.ch||c.push({anchor:h==f.line?f:d(h,0),head:h==g.line?g:d(h)});a.setSelections(c,0)},b["Shift-Tab"]="indentLess",c[b.Esc="singleSelectionTop"]=function(a){var b=a.listSelections()[0];a.setSelection(b.anchor,b.head,{scroll:!1})},c[b[f+"L"]="selectLine"]=function(a){for(var b=a.listSelections(),c=[],e=0;e<b.length;e++){var f=b[e];c.push({anchor:d(f.from().line,0),head:d(f.to().line+1,0)})}a.setSelections(c)},b["Shift-"+f+"K"]="deleteLine",c[b[f+"Enter"]="insertLineAfter"]=function(a){i(a,!1)},c[b["Shift-"+f+"Enter"]="insertLineBefore"]=function(a){i(a,!0)},c[b[f+"D"]="selectNextOccurrence"]=function(b){var c=b.getCursor("from"),e=b.getCursor("to"),f=b.state.sublimeFindFullWord==b.doc.sel;if(0==a.cmpPos(c,e)){var g=j(b,c);if(!g.word)return;b.setSelection(g.from,g.to),f=!0}else{var h=b.getRange(c,e),i=f?new RegExp("\\b"+h+"\\b"):h,k=b.getSearchCursor(i,e);k.findNext()?b.addSelection(k.from(),k.to()):(k=b.getSearchCursor(i,d(b.firstLine(),0)),k.findNext()&&b.addSelection(k.from(),k.to()))}f&&(b.state.sublimeFindFullWord=b.doc.sel)};var k="(){}[]";c[b["Shift-"+f+"Space"]="selectScope"]=function(a){l(a)||a.execCommand("selectAll")},c[b["Shift-"+f+"M"]="selectBetweenBrackets"]=function(b){return l(b)?void 0:a.Pass},c[b[f+"M"]="goToBracket"]=function(b){b.extendSelectionsBy(function(c){var e=b.scanForBracket(c.head,1);if(e&&0!=a.cmpPos(e.pos,c.head))return e.pos;var f=b.scanForBracket(c.head,-1);return f&&d(f.pos.line,f.pos.ch+1)||c.head})};var m=e?"Cmd-Ctrl-":"Shift-Ctrl-";c[b[m+"Up"]="swapLineUp"]=function(a){for(var b=a.listSelections(),c=[],e=a.firstLine()-1,f=[],g=0;g<b.length;g++){var h=b[g],i=h.from().line-1,j=h.to().line;f.push({anchor:d(h.anchor.line-1,h.anchor.ch),head:d(h.head.line-1,h.head.ch)}),0!=h.to().ch||h.empty()||--j,i>e?c.push(i,j):c.length&&(c[c.length-1]=j),e=j}a.operation(function(){for(var b=0;b<c.length;b+=2){var e=c[b],g=c[b+1],h=a.getLine(e);a.replaceRange("",d(e,0),d(e+1,0),"+swapLine"),g>a.lastLine()?a.replaceRange("\n"+h,d(a.lastLine()),null,"+swapLine"):a.replaceRange(h+"\n",d(g,0),null,"+swapLine")}a.setSelections(f),a.scrollIntoView()})},c[b[m+"Down"]="swapLineDown"]=function(a){for(var b=a.listSelections(),c=[],e=a.lastLine()+1,f=b.length-1;f>=0;f--){var g=b[f],h=g.to().line+1,i=g.from().line;0!=g.to().ch||g.empty()||h--,e>h?c.push(h,i):c.length&&(c[c.length-1]=i),e=i}a.operation(function(){for(var b=c.length-2;b>=0;b-=2){var e=c[b],f=c[b+1],g=a.getLine(e);e==a.lastLine()?a.replaceRange("",d(e-1),d(e),"+swapLine"):a.replaceRange("",d(e,0),d(e+1,0),"+swapLine"),a.replaceRange(g+"\n",d(f,0),null,"+swapLine")}a.scrollIntoView()})},b[f+"/"]="toggleComment",c[b[f+"J"]="joinLines"]=function(a){for(var b=a.listSelections(),c=[],e=0;e<b.length;e++){for(var f=b[e],g=f.from(),h=g.line,i=f.to().line;e<b.length-1&&b[e+1].from().line==i;)i=b[++e].to().line;c.push({start:h,end:i,anchor:!f.empty()&&g})}a.operation(function(){for(var b=0,e=[],f=0;f<c.length;f++){for(var i,g=c[f],h=g.anchor&&d(g.anchor.line-b,g.anchor.ch),j=g.start;j<=g.end;j++){var k=j-b;j==g.end&&(i=d(k,a.getLine(k).length+1)),k<a.lastLine()&&(a.replaceRange(" ",d(k),d(k+1,/^\s*/.exec(a.getLine(k+1))[0].length)),++b)}e.push({anchor:h||i,head:i})}a.setSelections(e,0)})},c[b["Shift-"+f+"D"]="duplicateLine"]=function(a){a.operation(function(){for(var b=a.listSelections().length,c=0;b>c;c++){var e=a.listSelections()[c];e.empty()?a.replaceRange(a.getLine(e.head.line)+"\n",d(e.head.line,0)):a.replaceRange(a.getRange(e.from(),e.to()),e.from())}a.scrollIntoView()})},b[f+"T"]="transposeChars",c[b.F9="sortLines"]=function(a){n(a,!0)},c[b[f+"F9"]="sortLinesInsensitive"]=function(a){n(a,!1)},c[b.F2="nextBookmark"]=function(a){var b=a.state.sublimeBookmarks;if(b)for(;b.length;){var c=b.shift(),d=c.find();if(d)return b.push(c),a.setSelection(d.from,d.to)}},c[b["Shift-F2"]="prevBookmark"]=function(a){var b=a.state.sublimeBookmarks;if(b)for(;b.length;){b.unshift(b.pop());var c=b[b.length-1].find();if(c)return a.setSelection(c.from,c.to);b.pop()}},c[b[f+"F2"]="toggleBookmark"]=function(a){for(var b=a.listSelections(),c=a.state.sublimeBookmarks||(a.state.sublimeBookmarks=[]),d=0;d<b.length;d++){for(var e=b[d].from(),f=b[d].to(),g=a.findMarks(e,f),h=0;h<g.length;h++)if(g[h].sublimeBookmark){g[h].clear();for(var i=0;i<c.length;i++)c[i]==g[h]&&c.splice(i--,1);break}h==g.length&&c.push(a.markText(e,f,{sublimeBookmark:!0,clearWhenEmpty:!1}))}},c[b["Shift-"+f+"F2"]="clearBookmarks"]=function(a){var b=a.state.sublimeBookmarks;if(b)for(var c=0;c<b.length;c++)b[c].clear();b.length=0},c[b["Alt-F2"]="selectBookmarks"]=function(a){var b=a.state.sublimeBookmarks,c=[];if(b)for(var d=0;d<b.length;d++){var e=b[d].find();e?c.push({anchor:e.from,head:e.to}):b.splice(d--,0)}c.length&&a.setSelections(c,0)},b["Alt-Q"]="wrapLines";var o=a.keyMap["sublime-Ctrl-K"]={auto:"sublime",nofallthrough:!0};b[f+"K"]=function(a){a.setOption("keyMap","sublime-Ctrl-K")},o[f+"Backspace"]="delLineLeft",c[o[f+"K"]="delLineRight"]=function(a){a.operation(function(){for(var b=a.listSelections(),c=b.length-1;c>=0;c--)a.replaceRange("",b[c].anchor,d(b[c].to().line),"+delete");a.scrollIntoView()})},c[o[f+"U"]="upcaseAtCursor"]=function(a){p(a,function(a){return a.toUpperCase()})},c[o[f+"L"]="downcaseAtCursor"]=function(a){p(a,function(a){return a.toLowerCase()})},c[o[f+"Space"]="setSublimeMark"]=function(a){a.state.sublimeMark&&a.state.sublimeMark.clear(),a.state.sublimeMark=a.setBookmark(a.getCursor())},c[o[f+"A"]="selectToSublimeMark"]=function(a){var b=a.state.sublimeMark&&a.state.sublimeMark.find();b&&a.setSelection(a.getCursor(),b)},c[o[f+"W"]="deleteToSublimeMark"]=function(b){var c=b.state.sublimeMark&&b.state.sublimeMark.find();if(c){var d=b.getCursor(),e=c;if(a.cmpPos(d,e)>0){var f=e;e=d,d=f}b.state.sublimeKilled=b.getRange(d,e),b.replaceRange("",d,e)}},c[o[f+"X"]="swapWithSublimeMark"]=function(a){var b=a.state.sublimeMark&&a.state.sublimeMark.find();b&&(a.state.sublimeMark.clear(),a.state.sublimeMark=a.setBookmark(a.getCursor()),a.setCursor(b))},c[o[f+"Y"]="sublimeYank"]=function(a){null!=a.state.sublimeKilled&&a.replaceSelection(a.state.sublimeKilled,null,"paste")},o[f+"G"]="clearBookmarks",c[o[f+"C"]="showInCenter"]=function(a){var b=a.cursorCoords(null,"local");a.scrollTo(null,(b.top+b.bottom)/2-a.getScrollInfo().clientHeight/2)},c[b["Shift-Alt-Up"]="selectLinesUpward"]=function(a){a.operation(function(){for(var b=a.listSelections(),c=0;c<b.length;c++){var e=b[c];e.head.line>a.firstLine()&&a.addSelection(d(e.head.line-1,e.head.ch))}})},c[b["Shift-Alt-Down"]="selectLinesDownward"]=function(a){a.operation(function(){for(var b=a.listSelections(),c=0;c<b.length;c++){var e=b[c];e.head.line<a.lastLine()&&a.addSelection(d(e.head.line+1,e.head.ch))}})},c[b[f+"F3"]="findUnder"]=function(a){r(a,!0)},c[b["Shift-"+f+"F3"]="findUnderPrevious"]=function(a){r(a,!1)},c[b["Alt-F3"]="findAllUnder"]=function(a){var b=q(a);if(b){for(var c=a.getSearchCursor(b.query),d=[],e=-1;c.findNext();)d.push({anchor:c.from(),head:c.to()}),c.from().line<=b.from.line&&c.from().ch<=b.from.ch&&e++;a.setSelections(d,e)}},b["Shift-"+f+"["]="fold",b["Shift-"+f+"]"]="unfold",o[f+"0"]=o[f+"j"]="unfoldAll",b[f+"I"]="findIncremental",b["Shift-"+f+"I"]="findIncrementalReverse",b[f+"H"]="replace",b.F3="findNext",b["Shift-F3"]="findPrev"});
/*
Copyright 2013 Michael Costello.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Author: Michael Costello (michael.a.costello@gmail.com)
*/

(function(exports) {
  /**
   * Creates an instance of the client
   *
   * @param {String} host The remote host to connect to
   * @param {Number} port The port to connect to at the remote host
   * @param {String} user The user account to connect with
   * @param {String} password The password to connect with
  */
  function FtpClient(host, port, user, password) {
    this.host = host;
    this.port = port;
    this.username = user;
    this.password = password;
    this.isConnected = false;
    this.features = {};

    log('initialized ftp client');
  }

  /**
   * Makes initial connection to ftp server.
   * The control socket is used to send ftp commands.
   */
  FtpClient.prototype.connect = function() {
    var deferred = Q.defer();

    this.controlSocket = new TcpClient(this.host, this.port);
    this.controlSocket.connect(function() {
      this._user(this.username)
        .then(this._pass.bind(this, this.password))
        .then(this._feat.bind(this))
        .then(this._type.bind(this, "I"))
        .then(function() {
          this.isConnected = true;
          this.keepAlive = setInterval(this._noop.bind(this), 500000); // 500s

          deferred.resolve(this);
        }.bind(this));
    }.bind(this));

    return deferred.promise;
  };

  /**
   * Terminates connection to ftp server
   */
  FtpClient.prototype.disconnect = function() {
    var deferred = Q.defer();

    this._quit()
      .then(function() {
        clearInterval(this.keepAlive);

        this.controlSocket.disconnect();
        this.controlSocket = null;
        this.isConnected = false;

        deferred.resolve(this);
      }.bind(this));

    return deferred.promise;
  };

  /**
   * Returns an array of directory contents
   *
   * @param {String} optional path of directory to list. If omitted the current directory is used.
   */
  FtpClient.prototype.list = function(pathname) {
    var deferred = Q.defer();
    var listCmd, listParse;

    if (this.features.mlst) {
      listCmd = "_mlsd";
      listParse = "_parseMlsd";
    } else {
      listCmd = "_list";
      listParse = "_parseList";
    }

    if (typeof pathname !== "string") {
      pathname = ".";
    }

    function onSuccess(list) {
      deferred.resolve(this[listParse](list));
    }

    this._pasv()
      .then(this._createDataSocket.bind(this, onSuccess.bind(this)))
      .then(this[listCmd].bind(this, pathname));

    return deferred.promise;
  };

  /**
   * Returns an ArrayBuffer of the downloaded file
   *
   * @param {String} pathname of the file to download
   */
  FtpClient.prototype.download = function(pathname) {
    var deferred = Q.defer();

    function onSuccess(buffer) {
      deferred.resolve(buffer);
    }

    this._pasv()
      .then(this._createDataSocket.bind(this, onSuccess, false))
      .then(this._retr.bind(this, pathname));

    return deferred.promise;
  };

  /**
   * Uploads an ArrayBuffer to the ftp server
   *
   * @param {String} path on the server to write the file to
   * @param {ArrayBuffer} data to send the server
   */
  FtpClient.prototype.upload = function(pathname, buffer) {
    var deferred = Q.defer();
    var isText = typeof buffer === "string";
    var sockets = {};
    
    this._pasv()
      .then(this._createDataSocket.bind(this, null, isText))
      .then(function(dataSocket) {
        this.dataSocket = dataSocket;
      }.bind(sockets))
      .then(this._stor.bind(this, pathname))
      .then(function(sockets) {
        var dataSocket = sockets.dataSocket;

        this.controlSocket.addResponseListener(function(data) {
          log(data);
          deferred.resolve();
        });

        dataSocket.sendMessage(buffer, function(resp) {
          log("onDataWrite: " + resp.bytesWritten);
          clearInterval(dataSocket.readTimer);
          dataSocket.disconnect();
          dataSocket = null;
        });
      }.bind(this, sockets));

    return deferred.promise;
  };

  /**
   * Renames a file on the server
   *
   * @param {String} old pathname on the server
   * @param {String} new pathname on the server
   */
  FtpClient.prototype.rename = function(from, to) {
    var deferred = Q.defer();

    this._rnfr(from)
      .then(this._rnto.bind(this, to))
      .then(deferred.resolve);

    return deferred.promise;
  };

  /**
   * Creates a separate socket for data, in parallel with the control socket.
   *
   * @private
   * @param {Function} called after the socket has completed transfering
   * @param {Boolean} optionally sets if data should be sent/recv as a String
   * @param {Number} port The port to connect to at the remote host
   */
  FtpClient.prototype._createDataSocket = function(callback, isText, port) {
    port = Array.prototype.pop.call(arguments);

    var deferred = Q.defer();
    var dataSocket = new TcpClient(this.host, port);
    var resp = "";
    var noDataTimer, readTimer;

    isText = isText !== false;

    // Overlaod TcpClient to keep data as ArrayBuffer
    if (!isText) {
      dataSocket._onDataRead = function(readInfo) {
        if (readInfo.resultCode > 0 && this.callbacks.recv) {
          log('onDataRead: ' + readInfo.data.byteLength);
          this.callbacks.recv(readInfo.data);
        }
      };

      // Overlaod TcpClient to keep data as ArrayBuffer
      dataSocket.sendMessage = function(arrayBuffer, callback) {
        chrome.socket.write(this.socketId, arrayBuffer, this._onWriteComplete.bind(this));

        this.callbacks.sent = callback;
      };
    }

    // Set a shorter interval to check for data
    dataSocket.readTimer = setInterval(dataSocket._periodicallyRead.bind(dataSocket), 10);

    dataSocket.connect(function() {
      dataSocket.addResponseListener(function(data) {
        if (!isText) {
          if (resp !== "") {
            resp = this._arrayBufferConcat(resp, data);
          } else {
            resp = data;
          }
        } else {
          resp += data;
        }
      }.bind(this));

      // Resolve 500ms after no data is received
      clearTimeout(noDataTimer);
      noDataTimer = setTimeout(function() {
        clearInterval(dataSocket.readTimer);
        dataSocket.disconnect();
        dataSocket = null;

        if (typeof callback === "function") {
          callback(resp);
        }
      }, 500);

      deferred.resolve(dataSocket);
    }.bind(this));

    return deferred.promise;
  };

  /**
   * Returns a concatinated ArrayBuffer from two buffers.
   *
   * @private
   * @param {ArrayBuffer} first buffer
   * @param {ArrayBuffer} second buffer
   */
  FtpClient.prototype._arrayBufferConcat = function(buf1, buf2) {
    var bufView = new Uint8Array(buf1.byteLength + buf2.byteLength);

    bufView.set(new Uint8Array(buf1), 0);
    bufView.set(new Uint8Array(buf2), buf1.byteLength);

    return bufView.buffer;
  };

  /**
   * Sends ftp commands over the control socket
   *
   * @private
   * @param {String} ftp command to send
   * @param {Number} status code that when matches the server responce code, the callback is called
   * @param {Function} called if the success code matches the server responce code
   */
  FtpClient.prototype._controlCommand = function(cmd, successCode, callback) {
    if (this.controlSocket) {
      var controlSocket = this.controlSocket;

      controlSocket.addResponseListener(function(data) {
        var code = this._responseToCode(data);

        if(code.toString().substr(0,1) === '5'){
          mockbox.notify({type:'error', message:'FTP Error: ' + data, persist:true});
        }
        

        log(data);

        if (code === successCode) {
          callback.call(this, data);
        }
      }.bind(this));

      controlSocket.sendMessage(cmd+"\n");
    }
  };

  /**
   *
   * FTP Control Socket Commands
   ******************************
   */

  FtpClient.prototype._quit = function() {
    var deferred = Q.defer();
    var cmd = "QUIT";

    function parse(data) {
      deferred.resolve();
    }

    this._controlCommand(cmd, 221, parse);

    return deferred.promise;
  };

  FtpClient.prototype._user = function(username) {
    var deferred = Q.defer();
    var cmd = "USER";

    function parse(data) {
      deferred.resolve();
    }

    if (username !== undefined) {
      cmd += " " + username;
    }

    this._controlCommand(cmd, 331, parse);

    return deferred.promise;
  };

  FtpClient.prototype._pass = function(password) {
    var deferred = Q.defer();
    var cmd = "PASS";

    function parse(data) {
      deferred.resolve();
    }

    if (password !== undefined) {
      cmd += " " + password;
    }

    this._controlCommand(cmd, 230, parse);

    return deferred.promise;
  };

  FtpClient.prototype._feat = function() {
    var deferred = Q.defer();
    var cmd = "FEAT";

    function parse(data) {
      var features = this._parseFeat(data);

      this.features = features;
      deferred.resolve(features);
    }

    this._controlCommand(cmd, 211, parse);

    return deferred.promise;
  };

  FtpClient.prototype._type = function(type) {
    var deferred = Q.defer();
    var cmd = "TYPE";

    function parse(data) {
      deferred.resolve();
    }

    if (type !== undefined) {
      cmd += " " + type;
    }

    this._controlCommand(cmd, 200, parse);

    return deferred.promise;
  };

  FtpClient.prototype._pasv = function() {
    var deferred = Q.defer();
    var cmd = "PASV";

    function parse(data) {
      deferred.resolve(this._pasvToPort(data));
    }

    this._controlCommand(cmd, 227, parse);

    return deferred.promise;
  };

  FtpClient.prototype._list = function(pathname) {
    var deferred = Q.defer();
    var cmd = "LIST";

    function parse(data) {
      deferred.resolve(data);
    }

    if (pathname !== undefined) {
      cmd += " " + pathname;
    }

    this._controlCommand(cmd, 226, parse);

    return deferred.promise;
  };

  FtpClient.prototype._mlsd = function(pathname) {
    var deferred = Q.defer();
    var cmd = "MLSD";

    function parse(data) {
      deferred.resolve(data);
    }

    if (pathname !== undefined) {
      cmd += " " + pathname;
    }

    // 150 code for start of transfer; 226 for end
    this._controlCommand(cmd, 226, parse);

    return deferred.promise;
  };

  FtpClient.prototype._stat = function(pathname) {
    var deferred = Q.defer();
    var cmd = "STAT";

    function parse(data) {
      deferred.resolve(data);
    }

    if (pathname !== undefined) {
      cmd += " " + pathname;
    }

    this._controlCommand(cmd, 211, parse);

    return deferred.promise;
  };

  FtpClient.prototype._retr = function(pathname) {
    var deferred = Q.defer();
    var cmd = "RETR";

    function parse(data) {
      deferred.resolve(data);
    }

    if (pathname !== undefined) {
      cmd += " " + pathname;
    }

    this._controlCommand(cmd, 226, parse);

    return deferred.promise;
  };

  FtpClient.prototype._stor = function(pathname) {
    var deferred = Q.defer();
    var cmd = "STOR";

    function parse(data) {
      deferred.resolve(data);
    }

    if (pathname !== undefined) {
      cmd += " " + pathname;
    }

    this._controlCommand(cmd, 150, parse);

    return deferred.promise;
  };

  FtpClient.prototype._pwd =  function() {
    var deferred = Q.defer();
    var cmd = "PWD";

    function parse(data) {
      deferred.resolve(/"(.*?)"/.exec(data)[1]);
    }

    this._controlCommand(cmd, 257, parse);

    return deferred.promise;
  };

  FtpClient.prototype._cwd =  function(pathname) {
    var deferred = Q.defer();
    var cmd = "CWD";

    function parse(data) {
      deferred.resolve();
    }

    if (pathname !== undefined) {
      cmd += " " + pathname;
    }

    this._controlCommand(cmd, 250, parse);

    return deferred.promise;
  };

  FtpClient.prototype._mkd =  function(pathname) {
    var deferred = Q.defer();
    var cmd = "MKD";

    function parse(data) {
      deferred.resolve();
    }

    if (pathname !== undefined) {
      cmd += " " + pathname;
    }

    this._controlCommand(cmd, 257, parse);

    return deferred.promise;
  };

  FtpClient.prototype._rmd =  function(pathname) {
    var deferred = Q.defer();
    var cmd = "RMD";

    function parse(data) {
      deferred.resolve();
    }

    if (pathname !== undefined) {
      cmd += " " + pathname;
    }

    this._controlCommand(cmd, 250, parse);

    return deferred.promise;
  };

  FtpClient.prototype._dele =  function(pathname) {
    var deferred = Q.defer();
    var cmd = "DELE";

    function parse(data) {
      deferred.resolve();
    }

    if (pathname !== undefined) {
      cmd += " " + pathname;
    }

    this._controlCommand(cmd, 250, parse);

    return deferred.promise;
  };

  FtpClient.prototype._rnfr =  function(pathname) {
    var deferred = Q.defer();
    var cmd = "RNFR";

    function parse(data) {
      deferred.resolve();
    }

    if (pathname !== undefined) {
      cmd += " " + pathname;
    }

    this._controlCommand(cmd, 350, parse);

    return deferred.promise;
  };

  FtpClient.prototype._rnto =  function(pathname) {
    var deferred = Q.defer();
    var cmd = "RNTO";

    function parse(data) {
      deferred.resolve();
    }

    if (pathname !== undefined) {
      cmd += " " + pathname;
    }

    this._controlCommand(cmd, 250, parse);

    return deferred.promise;
  };

  FtpClient.prototype._chmod =  function(mode, pathname) {
    var deferred = Q.defer();
    var cmd = "SITE CHMOD";

    function parse(data) {
      deferred.resolve();
    }

    if (pathname !== undefined) {
      cmd += " " + mode + " " + pathname;
    }

    this._controlCommand(cmd, 200, parse);

    return deferred.promise;
  };

  FtpClient.prototype._noop =  function() {
    var deferred = Q.defer();
    var cmd = "NOOP";

    function parse(data) {
      deferred.resolve();
    }

    this._controlCommand(cmd, 200, parse);

    return deferred.promise;
  };

  /**
   *
   * Parse FTP Commands Responces
   *******************************
   */
  FtpClient.prototype._responseToCode = function(resp) {
    return +resp.trim().split("\n").slice(-1)[0].substring(0,3);
  };

  FtpClient.prototype._pasvToPort = function(pasv) {
    var pasvs = pasv.match(/\d+/g);
    var port = +pasvs[6] + 256 * +pasvs[5];

    return port;
  };

  FtpClient.prototype._parseFeat = function(feat) {
    var lines = feat.split("\n");
    var features = {};

    lines.forEach(function(line) {
      if (line.indexOf("MLST") !== -1) {
        features.mlst = true;
      } else if (line.indexOf("UTF8") !== -1) {
        features.utf8 = true;
      }
    });

    return  features;
  };

  FtpClient.prototype._parseList = function(list) {
    var lines = list.split("\n");
    
    function chmod_num(perm){
      var owner = group = other = 0;

      if(perm[1]==='r') owner+=4;
      if(perm[2]==='w') owner+=2;
      if(perm[3]==='x') owner+=1;
      if(perm[4]==='r') group+=4;
      if(perm[5]==='w') group+=2;
      if(perm[6]==='x') group+=1;
      if(perm[7]==='r') other+=4;
      if(perm[8]==='w') other+=2;
      if(perm[9]==='x') other+=1;

      return ''+owner+group+other;
    }

    var files = lines.map(function(line) {
      var props = line.match(/\S+/g);

      if (props === null || props.length < 7) {
        return;
      }

      // Convert string to date
      var m = props[5];
      var d = props[6];
      var yh = props[7];
      var y, t;

      if (yh.indexOf(":") !== -1) {
        y = new Date().getFullYear();
        h = yh;
      } else {
        y = yh;
        h = "00:00";
      }

      modifiedDate = new Date([y,m,d,h].join(" "));

      var file = {
        perm: props[0],
        permn: chmod_num(props[0]),
        contentsLength: +props[1],
        owner: props[2],
        group: props[3],
        size: +props[4],
        modify: modifiedDate,
        name: props.splice(8, props.length - 8).join(" "),
        isDirectory: /^d/.test(props[0])
      };

      return file;
    }.bind(this));

    return files;
  };

  FtpClient.prototype._parseMlsd = function(mlsd) {
    var lines = mlsd.split("\n");

    var files = lines.map(function(line) {
      var file = {};
      var facts = line.split(";");

      file.name = facts.pop().trim();

      facts.forEach(function(fact) {
        var segs    = fact.match(/[^\.=]+/g);
        var value   = segs.pop();
        var keyword = segs.pop().toLowerCase();

        file[keyword] = value;
      });

      if (file.modify) {
        // YYYYMMDDHHmm
        var dt = file.modify.match(/(\d{4})(\d{2})(\d{2})(\d{2})/);
        var modify = new Date();

        modify.setFullYear(dt[1]);
        modify.setMonth(+dt[2] -1);
        modify.setHours(dt[3], dt[4]);
        file.modify = modify;
      }

      file.isDirectory = /dir/.test(file.type);

      return file;
    });

    return files;
  };

  /**
   * Wrapper function for logging
   */
  function log(msg) {
    console.log(msg);
  }

  /**
   * Wrapper function for error logging
   */
  function error(msg) {
    console.error(msg);
  }

  exports.FtpClient = FtpClient;

})(window);
// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    // Turn off strict mode for this function so we can assign to global.Q
    /*jshint strict: false, -W117*/

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else {
        Q = definition();
    }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick;
if (typeof setImmediate === "function") {
    // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
    if (typeof window !== "undefined") {
        nextTick = setImmediate.bind(window);
    } else {
        nextTick = setImmediate;
    }
} else if (typeof process !== "undefined" && process.nextTick) {
    // Node.js before 0.9. Note that some fake-Node environments, like the
    // Mocha test runner, introduce a `process` global without a `nextTick`.

    nextTick = process.nextTick;
} else {
    (function () {
        // linked list of tasks (single, with head node)
        var head = {task: void 0, next: null};
        var tail = head;
        var maxPendingTicks = 2;
        var pendingTicks = 0;
        var queuedTasks = 0;
        var usedTicks = 0;
        var requestTick = void 0;

        function onTick() {
            // In case of multiple tasks ensure at least one subsequent tick
            // to handle remaining tasks in case one throws.
            --pendingTicks;

            if (++usedTicks >= maxPendingTicks) {
                // Amortize latency after thrown exceptions.
                usedTicks = 0;
                maxPendingTicks *= 4; // fast grow!
                var expectedTicks = queuedTasks && Math.min(
                    queuedTasks - 1,
                    maxPendingTicks
                );
                while (pendingTicks < expectedTicks) {
                    ++pendingTicks;
                    requestTick();
                }
            }

            while (queuedTasks) {
                --queuedTasks; // decrement here to ensure it's never negative
                head = head.next;
                var task = head.task;
                head.task = void 0;
                task();
            }

            usedTicks = 0;
        }

        nextTick = function (task) {
            tail = tail.next = {task: task, next: null};
            if (
                pendingTicks < ++queuedTasks &&
                pendingTicks < maxPendingTicks
            ) {
                ++pendingTicks;
                requestTick();
            }
        };

        if (typeof MessageChannel !== "undefined") {
            // modern browsers
            // http://www.nonblocking.io/2011/06/windownexttick.html
            var channel = new MessageChannel();
            channel.port1.onmessage = onTick;
            requestTick = function () {
                channel.port2.postMessage(0);
            };

        } else {
            // old browsers
            requestTick = function () {
                setTimeout(onTick, 0);
            };
        }
    })();
}

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this does have the nice side-effect of reducing the size
// of the code by reducing x.call() to merely x(), eliminating many
// hard-to-minify characters.
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
function uncurryThis(f) {
    var call = Function.call;
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
// engine that has a deployed base of browsers that support generators.
// However, SM's generators use the Python-inspired semantics of
// outdated ES6 drafts.  We would like to support ES6, but we'd also
// like to make it possible to use generators in deployed browsers, so
// we also support Python-style generators.  At some point we can remove
// this block.
var hasES6Generators;
// try {
//     new Function("(function* (){ yield 1; })");
//     hasES6Generators = true;
// } catch (e) {
    hasES6Generators = false;
// }

// long stack traces

Q.longStackJumpLimit = 1;

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        error.stack = filterStackString(error.stack) +
            "\n" + STACK_JUMP_SEPARATOR + "\n" +
            filterStackString(promise.stack);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

// end of shims
// beginning of real work

/**
 * Creates fulfilled promises from non-promises,
 * Passes Q promises through,
 * Coerces thenables to Q promises.
 */
function Q(value) {
    return resolve(value);
}

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Constructs a {promise, resolve} object.
 *
 * The resolver is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke the resolver with any value that is
 * not a function. To reject the promise, invoke the resolver with a rejection
 * object. To put the promise in the same state as another promise, invoke the
 * resolver with that other promise.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // resolved values and other promises gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(makePromise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearer = valueOf(resolvedPromise);
        if (isPromise(nearer)) {
            resolvedPromise = nearer; // shorten chain
        }
        return nearer;
    };

    if (Q.longStackJumpLimit > 0 && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(promise) {
        resolvedPromise = promise;

        array_reduce(messages, function (undefined, message) {
            nextTick(function () {
                promise.promiseDispatch.apply(promise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(resolve(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }

    var deferred = defer();
    fcall(
        resolver,
        deferred.resolve,
        deferred.reject,
        deferred.notify
    ).fail(deferred.reject);
    return deferred.promise;
}

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = makePromise;
function makePromise(descriptor, fallback, valueOf, exception, isException) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }

    var promise = object_create(makePromise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    if (valueOf) {
        promise.valueOf = valueOf;
    }

    if (isException) {
        promise.exception = exception;
    }

    return promise;
}

// provide thenables, CommonJS/Promises/A
makePromise.prototype.then = function (fulfilled, rejected, progressed) {
    return when(this, fulfilled, rejected, progressed);
};

makePromise.prototype.thenResolve = function (value) {
    return when(this, function () { return value; });
};

makePromise.prototype.thenReject = function (reason) {
    return when(this, function () { throw reason; });
};

// Chainable methods
array_reduce(
    [
        "isFulfilled", "isRejected", "isPending",
        "dispatch",
        "when", "spread",
        "get", "set", "del", "delete",
        "post", "send", "invoke",
        "keys",
        "fapply", "fcall", "fbind",
        "all", "allResolved",
        "timeout", "delay",
        "catch", "finally", "fail", "fin", "progress", "done",
        "nfcall", "nfapply", "nfbind", "denodeify", "nbind",
        "npost", "nsend", "ninvoke",
        "nodeify"
    ],
    function (undefined, name) {
        makePromise.prototype[name] = function () {
            return Q[name].apply(
                Q,
                [this].concat(array_slice(arguments))
            );
        };
    },
    void 0
);

makePromise.prototype.toSource = function () {
    return this.toString();
};

makePromise.prototype.toString = function () {
    return "[object Promise]";
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */
Q.nearer = valueOf;
function valueOf(value) {
    if (isPromise(value)) {
        return value.valueOf();
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return isObject(object) && typeof object.promiseDispatch === "function";
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return !isFulfilled(object) && !isRejected(object);
}

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromiseAlike(valueOf(object));
}

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    object = valueOf(object);
    return isPromise(object) && "exception" in object;
}

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var unhandledReasonsDisplayed = false;
var trackUnhandledRejections = true;
function displayUnhandledReasons() {
    if (
        !unhandledReasonsDisplayed &&
        typeof window !== "undefined" &&
        !window.Touch &&
        window.console
    ) {
        console.warn("[Q] Unhandled rejection reasons (should be empty):",
                     unhandledReasons);
    }

    unhandledReasonsDisplayed = true;
}

function logUnhandledReasons() {
    for (var i = 0; i < unhandledReasons.length; i++) {
        var reason = unhandledReasons[i];
        if (reason && typeof reason.stack !== "undefined") {
            console.warn("Unhandled rejection reason:", reason.stack);
        } else {
            console.warn("Unhandled rejection reason (no stack):", reason);
        }
    }
}

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;
    unhandledReasonsDisplayed = false;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;

        // Show unhandled rejection reasons if Node exits without handling an
        // outstanding rejection.  (Note that Browserify presently produces a
        // `process` global without the `EventEmitter` `on` method.)
        if (typeof process !== "undefined" && process.on) {
            process.on("exit", logUnhandledReasons);
        }
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }

    unhandledRejections.push(promise);
    unhandledReasons.push(reason);
    displayUnhandledReasons();
}

function untrackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    if (typeof process !== "undefined" && process.on) {
        process.removeListener("exit", logUnhandledReasons);
    }
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = makePromise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function valueOf() {
        return this;
    }, reason, true);

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(object) {
    return makePromise({
        "when": function () {
            return object;
        },
        "get": function (name) {
            return object[name];
        },
        "set": function (name, value) {
            object[name] = value;
        },
        "delete": function (name) {
            delete object[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return object.apply(void 0, args);
            } else {
                return object[name].apply(object, args);
            }
        },
        "apply": function (thisP, args) {
            return object.apply(thisP, args);
        },
        "keys": function () {
            return object_keys(object);
        }
    }, void 0, function valueOf() {
        return object;
    });
}

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
Q.resolve = resolve;
function resolve(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (isPromise(value)) {
        return value;
    }
    // In order to break infinite recursion or loops between `then` and
    // `resolve`, it is necessary to attempt to extract fulfilled values
    // out of foreign promise implementations before attempting to wrap
    // them as unresolved promises.  It is my hope that other
    // implementations will implement `valueOf` to synchronously extract
    // the fulfillment value from their fulfilled promises.  If the
    // other promise library does not implement `valueOf`, the
    // implementations on primordial prototypes are harmless.
    value = valueOf(value);
    // assimilate thenables, CommonJS/Promises/A+
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return makePromise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return valueOf(object);
    });
}

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, resolvedValue);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    var resolvedValue = resolve(value);
    nextTick(function () {
        resolvedValue.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    resolvedValue.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(promise, fulfilled, rejected) {
    return when(promise, function (valuesOrPromises) {
        return all(valuesOrPromises).then(function (values) {
            return fulfilled.apply(void 0, values);
        }, rejected);
    }, rejected);
}

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;
            if (hasES6Generators) {
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return result.value;
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return exception.value;
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "send");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are resolved and passed as values (`this` is also resolved and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q.resolve(a), Q.resolve(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    var deferred = defer();
    nextTick(function () {
        resolve(object).promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
}

/**
 * Constructs a promise method that can be used to safely observe resolution of
 * a promise for an arbitrarily named method like "propfind" in a future turn.
 *
 * "dispatcher" constructs methods like "get(promise, name)" and "set(promise)".
 */
Q.dispatcher = dispatcher;
function dispatcher(op) {
    return function (object) {
        var args = array_slice(arguments, 1);
        return dispatch(object, op, args);
    };
}

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = dispatcher("get");

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = dispatcher("set");

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q["delete"] = // XXX experimental
Q.del = dispatcher("delete");

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
var post = Q.post = dispatcher("post");

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = send;
Q.invoke = send; // synonyms
function send(value, name) {
    var args = array_slice(arguments, 2);
    return post(value, name, args);
}

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = fapply;
function fapply(value, args) {
    return dispatch(value, "apply", [void 0, args]);
}

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] = fcall; // XXX experimental
Q.fcall = fcall;
function fcall(value) {
    var args = array_slice(arguments, 1);
    return fapply(value, args);
}

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = fbind;
function fbind(value) {
    var args = array_slice(arguments, 1);
    return function fbound() {
        var allArgs = args.concat(array_slice(arguments));
        return dispatch(value, "apply", [this, allArgs]);
    };
}

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually resolved object
 */
Q.keys = dispatcher("keys");

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var countDown = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            if (isFulfilled(promise)) {
                promises[index] = valueOf(promise);
            } else {
                ++countDown;
                when(promise, function (value) {
                    promises[index] = value;
                    if (--countDown === 0) {
                        deferred.resolve(promises);
                    }
                }, deferred.reject);
            }
        }, void 0);
        if (countDown === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

/**
 * Waits for all promises to be resolved, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = allResolved;
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, resolve);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q["catch"] = // XXX experimental
Q.fail = fail;
function fail(promise, rejected) {
    return when(promise, void 0, rejected);
}

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(promise, progressed) {
    return when(promise, void 0, void 0, progressed);
}

/**
 * Provides an opportunity to observe the rejection of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q["finally"] = // XXX experimental
Q.fin = fin;
function fin(promise, callback) {
    return when(promise, function (value) {
        return when(callback(), function () {
            return value;
        });
    }, function (exception) {
        return when(callback(), function () {
            return reject(exception);
        });
    });
}

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = done;
function done(promise, fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        nextTick(function () {
            makeStackTraceLong(error, promise);

            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promiseToHandle = fulfilled || rejected || progress ?
        when(promise, fulfilled, rejected, progress) :
        promise;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }
    fail(promiseToHandle, onUnhandledError);
}

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {String} custom error message (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = timeout;
function timeout(promise, ms, msg) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        deferred.reject(new Error(msg || "Timed out after " + ms + " ms"));
    }, ms);

    when(promise, function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
}

/**
 * Returns a promise for the given value (or promised value) after some
 * milliseconds.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after some
 * time has elapsed.
 */
Q.delay = delay;
function delay(promise, timeout) {
    if (timeout === void 0) {
        timeout = promise;
        promise = void 0;
    }

    var deferred = defer();

    when(promise, undefined, undefined, deferred.notify);
    setTimeout(function () {
        deferred.resolve(promise);
    }, timeout);

    return deferred.promise;
}

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = nfapply;
function nfapply(callback, args) {
    var nodeArgs = array_slice(args);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());

    fapply(callback, nodeArgs).fail(deferred.reject);
    return deferred.promise;
}

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 *
 *      Q.nfcall(FS.readFile, __filename)
 *      .then(function (content) {
 *      })
 *
 */
Q.nfcall = nfcall;
function nfcall(callback/*, ...args */) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());

    fapply(callback, nodeArgs).fail(deferred.reject);
    return deferred.promise;
}

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 *
 *      Q.nfbind(FS.readFile, __filename)("utf-8")
 *      .then(console.log)
 *      .done()
 *
 */
Q.nfbind = nfbind;
Q.denodeify = Q.nfbind; // synonyms
function nfbind(callback/*, ...args */) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());

        fapply(callback, nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
}

Q.nbind = nbind;
function nbind(callback, thisArg /*, ... args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());

        function bound() {
            return callback.apply(thisArg, arguments);
        }

        fapply(bound, nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
}

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.npost = npost;
function npost(object, name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());

    post(object, name, nodeArgs).fail(deferred.reject);
    return deferred.promise;
}

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = nsend;
Q.ninvoke = Q.nsend; // synonyms
function nsend(object, name /*, ...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    post(object, name, nodeArgs).fail(deferred.reject);
    return deferred.promise;
}

Q.nodeify = nodeify;
function nodeify(promise, nodeback) {
    if (nodeback) {
        promise.then(function (value) {
            nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return promise;
    }
}

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});
/*
Copyright 2012 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Author: Boris Smus (smus@chromium.org)
*/

(function(exports) {

  // Define some local variables here.
  var socket = chrome.socket || chrome.experimental.socket;

  /**
   * Creates an instance of the client
   *
   * @param {String} host The remote host to connect to
   * @param {Number} port The port to connect to at the remote host
   */
  function TcpClient(host, port) {
    this.host = host;
    this.port = port;

    // Callback functions.
    this.callbacks = {
      connect: null,    // Called when socket is connected.
      disconnect: null, // Called when socket is disconnected.
      recv: null,       // Called when client receives data from server.
      sent: null        // Called when client sends data to server.
    };

    // Socket.
    this.socketId = null;
    this.isConnected = false;

    log('initialized tcp client');
  }

  /**
   * Connects to the TCP socket, and creates an open socket.
   *
   * @see http://developer.chrome.com/trunk/apps/socket.html#method-create
   * @param {Function} callback The function to call on connection
   */
  TcpClient.prototype.connect = function(callback) {
    // First resolve the hostname to an IP.
    this.addr = this.host;
    socket.create('tcp', {}, this._onCreate.bind(this));
     
    // Register connect callback.
    this.callbacks.connect = callback;
  };

  /**
   * Sends a message down the wire to the remote side
   *
   * @see http://developer.chrome.com/trunk/apps/socket.html#method-write
   * @param {String} msg The message to send
   * @param {Function} callback The function to call when the message has sent
   */
  TcpClient.prototype.sendMessage = function(msg, callback) {
    this._stringToArrayBuffer(msg, function(arrayBuffer) {
      socket.write(this.socketId, arrayBuffer, this._onWriteComplete.bind(this));
    }.bind(this));

    // Register sent callback.
    this.callbacks.sent = callback;
  };

  /**
   * Sets the callback for when a message is received
   *
   * @param {Function} callback The function to call when a message has arrived
   */
  TcpClient.prototype.addResponseListener = function(callback) {
    // Register received callback.
    this.callbacks.recv = callback;
  };

  /**
   * Disconnects from the remote side
   *
   * @see http://developer.chrome.com/trunk/apps/socket.html#method-disconnect
   */
  TcpClient.prototype.disconnect = function() {
    socket.disconnect(this.socketId);
    this.isConnected = false;
  };

  /**
   * The callback function used for when we attempt to have Chrome
   * create a socket. If the socket is successfully created
   * we go ahead and connect to the remote side.
   *
   * @private
   * @see http://developer.chrome.com/trunk/apps/socket.html#method-connect
   * @param {Object} createInfo The socket details
   */
  TcpClient.prototype._onCreate = function(createInfo) {
    this.socketId = createInfo.socketId;
    if (this.socketId > 0) {
      socket.connect(this.socketId, this.addr, this.port, this._onConnectComplete.bind(this));
      this.isConnected = true;
    } else {
      error('Unable to create socket');
    }
  };

  /**
   * The callback function used for when we attempt to have Chrome
   * connect to the remote side. If a successful connection is
   * made then polling starts to check for data to read
   *
   * @private
   * @param {Number} resultCode Indicates whether the connection was successful
   */
  TcpClient.prototype._onConnectComplete = function(resultCode) {
    // Start polling for reads.
    setInterval(this._periodicallyRead.bind(this), 100);

    if (this.callbacks.connect) {
      log('connect complete');
      this.callbacks.connect();
    }
    log('onConnectComplete');
  };

  /**
   * Checks for new data to read from the socket
   *
   * @see http://developer.chrome.com/trunk/apps/socket.html#method-read
   */
  TcpClient.prototype._periodicallyRead = function() {
    socket.read(this.socketId, null, this._onDataRead.bind(this));
  };

  /**
   * Callback function for when data has been read from the socket.
   * Converts the array buffer that is read in to a string
   * and sends it on for further processing by passing it to
   * the previously assigned callback function.
   *
   * @private
   * @see TcpClient.prototype.addResponseListener
   * @param {Object} readInfo The incoming message
   */
  TcpClient.prototype._onDataRead = function(readInfo) {
    // Call received callback if there's data in the response.
    if (readInfo.resultCode > 0 && this.callbacks.recv) {
      log('onDataRead');
      // Convert ArrayBuffer to string.
      this._arrayBufferToString(readInfo.data, function(str) {
        this.callbacks.recv(str);
      }.bind(this));
    }
  };

  /**
   * Callback for when data has been successfully
   * written to the socket.
   *
   * @private
   * @param {Object} writeInfo The outgoing message
   */
  TcpClient.prototype._onWriteComplete = function(writeInfo) {
    log('onWriteComplete');
    // Call sent callback.
    if (this.callbacks.sent) {
      this.callbacks.sent(writeInfo);
    }
  };

  /**
   * Converts an array buffer to a string
   *
   * @private
   * @param {ArrayBuffer} buf The buffer to convert
   * @param {Function} callback The function to call when conversion is complete
   */
  TcpClient.prototype._arrayBufferToString = function(buf, callback) {
    var bb = new Blob([new Uint8Array(buf)]);
    var f = new FileReader();
    f.onload = function(e) {
      callback(e.target.result);
    };
    f.readAsText(bb);
  };

  /**
   * Converts a string to an array buffer
   *
   * @private
   * @param {String} str The string to convert
   * @param {Function} callback The function to call when conversion is complete
   */
  TcpClient.prototype._stringToArrayBuffer = function(str, callback) {
    var bb = new Blob([str]);
    var f = new FileReader();
    f.onload = function(e) {
        callback(e.target.result);
    };
    f.readAsArrayBuffer(bb);
  };

  /**
   * Wrapper function for logging
   */
  function log(msg) {
    //console.log(msg);
  }

  /**
   * Wrapper function for error logging
   */
  function error(msg) {
    console.error(msg);
  }

  exports.TcpClient = TcpClient;

})(window);
/*!

JSZip - A Javascript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2014 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
*/
!function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;"undefined"!=typeof window?b=window:"undefined"!=typeof global?b=global:"undefined"!=typeof self&&(b=self),b.JSZip=a()}}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){"use strict";var d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";c.encode=function(a){for(var b,c,e,f,g,h,i,j="",k=0;k<a.length;)b=a.charCodeAt(k++),c=a.charCodeAt(k++),e=a.charCodeAt(k++),f=b>>2,g=(3&b)<<4|c>>4,h=(15&c)<<2|e>>6,i=63&e,isNaN(c)?h=i=64:isNaN(e)&&(i=64),j=j+d.charAt(f)+d.charAt(g)+d.charAt(h)+d.charAt(i);return j},c.decode=function(a){var b,c,e,f,g,h,i,j="",k=0;for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");k<a.length;)f=d.indexOf(a.charAt(k++)),g=d.indexOf(a.charAt(k++)),h=d.indexOf(a.charAt(k++)),i=d.indexOf(a.charAt(k++)),b=f<<2|g>>4,c=(15&g)<<4|h>>2,e=(3&h)<<6|i,j+=String.fromCharCode(b),64!=h&&(j+=String.fromCharCode(c)),64!=i&&(j+=String.fromCharCode(e));return j}},{}],2:[function(a,b){"use strict";function c(){this.compressedSize=0,this.uncompressedSize=0,this.crc32=0,this.compressionMethod=null,this.compressedContent=null}c.prototype={getContent:function(){return null},getCompressedContent:function(){return null}},b.exports=c},{}],3:[function(a,b,c){"use strict";c.STORE={magic:"\x00\x00",compress:function(a){return a},uncompress:function(a){return a},compressInputType:null,uncompressInputType:null},c.DEFLATE=a("./flate")},{"./flate":8}],4:[function(a,b){"use strict";var c=a("./utils"),d=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117];b.exports=function(a,b){if("undefined"==typeof a||!a.length)return 0;var e="string"!==c.getTypeOf(a);"undefined"==typeof b&&(b=0);var f=0,g=0,h=0;b=-1^b;for(var i=0,j=a.length;j>i;i++)h=e?a[i]:a.charCodeAt(i),g=255&(b^h),f=d[g],b=b>>>8^f;return-1^b}},{"./utils":21}],5:[function(a,b){"use strict";function c(){this.data=null,this.length=0,this.index=0}var d=a("./utils");c.prototype={checkOffset:function(a){this.checkIndex(this.index+a)},checkIndex:function(a){if(this.length<a||0>a)throw new Error("End of data reached (data length = "+this.length+", asked index = "+a+"). Corrupted zip ?")},setIndex:function(a){this.checkIndex(a),this.index=a},skip:function(a){this.setIndex(this.index+a)},byteAt:function(){},readInt:function(a){var b,c=0;for(this.checkOffset(a),b=this.index+a-1;b>=this.index;b--)c=(c<<8)+this.byteAt(b);return this.index+=a,c},readString:function(a){return d.transformTo("string",this.readData(a))},readData:function(){},lastIndexOfSignature:function(){},readDate:function(){var a=this.readInt(4);return new Date((a>>25&127)+1980,(a>>21&15)-1,a>>16&31,a>>11&31,a>>5&63,(31&a)<<1)}},b.exports=c},{"./utils":21}],6:[function(a,b,c){"use strict";c.base64=!1,c.binary=!1,c.dir=!1,c.createFolders=!1,c.date=null,c.compression=null,c.comment=null},{}],7:[function(a,b,c){"use strict";var d=a("./utils");c.string2binary=function(a){return d.string2binary(a)},c.string2Uint8Array=function(a){return d.transformTo("uint8array",a)},c.uint8Array2String=function(a){return d.transformTo("string",a)},c.string2Blob=function(a){var b=d.transformTo("arraybuffer",a);return d.arrayBuffer2Blob(b)},c.arrayBuffer2Blob=function(a){return d.arrayBuffer2Blob(a)},c.transformTo=function(a,b){return d.transformTo(a,b)},c.getTypeOf=function(a){return d.getTypeOf(a)},c.checkSupport=function(a){return d.checkSupport(a)},c.MAX_VALUE_16BITS=d.MAX_VALUE_16BITS,c.MAX_VALUE_32BITS=d.MAX_VALUE_32BITS,c.pretty=function(a){return d.pretty(a)},c.findCompression=function(a){return d.findCompression(a)},c.isRegExp=function(a){return d.isRegExp(a)}},{"./utils":21}],8:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,e=a("pako");c.uncompressInputType=d?"uint8array":"array",c.compressInputType=d?"uint8array":"array",c.magic="\b\x00",c.compress=function(a){return e.deflateRaw(a)},c.uncompress=function(a){return e.inflateRaw(a)}},{pako:24}],9:[function(a,b){"use strict";function c(a,b){return this instanceof c?(this.files={},this.comment=null,this.root="",a&&this.load(a,b),void(this.clone=function(){var a=new c;for(var b in this)"function"!=typeof this[b]&&(a[b]=this[b]);return a})):new c(a,b)}var d=a("./base64");c.prototype=a("./object"),c.prototype.load=a("./load"),c.support=a("./support"),c.defaults=a("./defaults"),c.utils=a("./deprecatedPublicUtils"),c.base64={encode:function(a){return d.encode(a)},decode:function(a){return d.decode(a)}},c.compressions=a("./compressions"),b.exports=c},{"./base64":1,"./compressions":3,"./defaults":6,"./deprecatedPublicUtils":7,"./load":10,"./object":13,"./support":17}],10:[function(a,b){"use strict";var c=a("./base64"),d=a("./zipEntries");b.exports=function(a,b){var e,f,g,h;for(b=b||{},b.base64&&(a=c.decode(a)),f=new d(a,b),e=f.files,g=0;g<e.length;g++)h=e[g],this.file(h.fileName,h.decompressed,{binary:!0,optimizedBinaryString:!0,date:h.date,dir:h.dir,comment:h.fileComment.length?h.fileComment:null,createFolders:b.createFolders});return f.zipComment.length&&(this.comment=f.zipComment),this}},{"./base64":1,"./zipEntries":22}],11:[function(a,b){(function(a){"use strict";b.exports=function(b,c){return new a(b,c)},b.exports.test=function(b){return a.isBuffer(b)}}).call(this,"undefined"!=typeof Buffer?Buffer:void 0)},{}],12:[function(a,b){"use strict";function c(a){this.data=a,this.length=this.data.length,this.index=0}var d=a("./uint8ArrayReader");c.prototype=new d,c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./uint8ArrayReader":18}],13:[function(a,b){"use strict";var c=a("./support"),d=a("./utils"),e=a("./crc32"),f=a("./signature"),g=a("./defaults"),h=a("./base64"),i=a("./compressions"),j=a("./compressedObject"),k=a("./nodeBuffer"),l=a("./utf8"),m=a("./stringWriter"),n=a("./uint8ArrayWriter"),o=function(a){if(a._data instanceof j&&(a._data=a._data.getContent(),a.options.binary=!0,a.options.base64=!1,"uint8array"===d.getTypeOf(a._data))){var b=a._data;a._data=new Uint8Array(b.length),0!==b.length&&a._data.set(b,0)}return a._data},p=function(a){var b=o(a),e=d.getTypeOf(b);return"string"===e?!a.options.binary&&c.nodebuffer?k(b,"utf-8"):a.asBinary():b},q=function(a){var b=o(this);return null===b||"undefined"==typeof b?"":(this.options.base64&&(b=h.decode(b)),b=a&&this.options.binary?A.utf8decode(b):d.transformTo("string",b),a||this.options.binary||(b=d.transformTo("string",A.utf8encode(b))),b)},r=function(a,b,c){this.name=a,this.dir=c.dir,this.date=c.date,this.comment=c.comment,this._data=b,this.options=c,this._initialMetadata={dir:c.dir,date:c.date}};r.prototype={asText:function(){return q.call(this,!0)},asBinary:function(){return q.call(this,!1)},asNodeBuffer:function(){var a=p(this);return d.transformTo("nodebuffer",a)},asUint8Array:function(){var a=p(this);return d.transformTo("uint8array",a)},asArrayBuffer:function(){return this.asUint8Array().buffer}};var s=function(a,b){var c,d="";for(c=0;b>c;c++)d+=String.fromCharCode(255&a),a>>>=8;return d},t=function(){var a,b,c={};for(a=0;a<arguments.length;a++)for(b in arguments[a])arguments[a].hasOwnProperty(b)&&"undefined"==typeof c[b]&&(c[b]=arguments[a][b]);return c},u=function(a){return a=a||{},a.base64!==!0||null!==a.binary&&void 0!==a.binary||(a.binary=!0),a=t(a,g),a.date=a.date||new Date,null!==a.compression&&(a.compression=a.compression.toUpperCase()),a},v=function(a,b,c){var e,f=d.getTypeOf(b);if(c=u(c),c.createFolders&&(e=w(a))&&x.call(this,e,!0),c.dir||null===b||"undefined"==typeof b)c.base64=!1,c.binary=!1,b=null;else if("string"===f)c.binary&&!c.base64&&c.optimizedBinaryString!==!0&&(b=d.string2binary(b));else{if(c.base64=!1,c.binary=!0,!(f||b instanceof j))throw new Error("The data of '"+a+"' is in an unsupported format !");"arraybuffer"===f&&(b=d.transformTo("uint8array",b))}var g=new r(a,b,c);return this.files[a]=g,g},w=function(a){"/"==a.slice(-1)&&(a=a.substring(0,a.length-1));var b=a.lastIndexOf("/");return b>0?a.substring(0,b):""},x=function(a,b){return"/"!=a.slice(-1)&&(a+="/"),b="undefined"!=typeof b?b:!1,this.files[a]||v.call(this,a,null,{dir:!0,createFolders:b}),this.files[a]},y=function(a,b){var c,f=new j;return a._data instanceof j?(f.uncompressedSize=a._data.uncompressedSize,f.crc32=a._data.crc32,0===f.uncompressedSize||a.dir?(b=i.STORE,f.compressedContent="",f.crc32=0):a._data.compressionMethod===b.magic?f.compressedContent=a._data.getCompressedContent():(c=a._data.getContent(),f.compressedContent=b.compress(d.transformTo(b.compressInputType,c)))):(c=p(a),(!c||0===c.length||a.dir)&&(b=i.STORE,c=""),f.uncompressedSize=c.length,f.crc32=e(c),f.compressedContent=b.compress(d.transformTo(b.compressInputType,c))),f.compressedSize=f.compressedContent.length,f.compressionMethod=b.magic,f},z=function(a,b,c,g){var h,i,j,k,m=(c.compressedContent,d.transformTo("string",l.utf8encode(b.name))),n=b.comment||"",o=d.transformTo("string",l.utf8encode(n)),p=m.length!==b.name.length,q=o.length!==n.length,r=b.options,t="",u="",v="";j=b._initialMetadata.dir!==b.dir?b.dir:r.dir,k=b._initialMetadata.date!==b.date?b.date:r.date,h=k.getHours(),h<<=6,h|=k.getMinutes(),h<<=5,h|=k.getSeconds()/2,i=k.getFullYear()-1980,i<<=4,i|=k.getMonth()+1,i<<=5,i|=k.getDate(),p&&(u=s(1,1)+s(e(m),4)+m,t+="up"+s(u.length,2)+u),q&&(v=s(1,1)+s(this.crc32(o),4)+o,t+="uc"+s(v.length,2)+v);var w="";w+="\n\x00",w+=p||q?"\x00\b":"\x00\x00",w+=c.compressionMethod,w+=s(h,2),w+=s(i,2),w+=s(c.crc32,4),w+=s(c.compressedSize,4),w+=s(c.uncompressedSize,4),w+=s(m.length,2),w+=s(t.length,2);var x=f.LOCAL_FILE_HEADER+w+m+t,y=f.CENTRAL_FILE_HEADER+"\x00"+w+s(o.length,2)+"\x00\x00\x00\x00"+(j===!0?"\x00\x00\x00":"\x00\x00\x00\x00")+s(g,4)+m+t+o;return{fileRecord:x,dirRecord:y,compressedObject:c}},A={load:function(){throw new Error("Load method is not defined. Is the file jszip-load.js included ?")},filter:function(a){var b,c,d,e,f=[];for(b in this.files)this.files.hasOwnProperty(b)&&(d=this.files[b],e=new r(d.name,d._data,t(d.options)),c=b.slice(this.root.length,b.length),b.slice(0,this.root.length)===this.root&&a(c,e)&&f.push(e));return f},file:function(a,b,c){if(1===arguments.length){if(d.isRegExp(a)){var e=a;return this.filter(function(a,b){return!b.dir&&e.test(a)})}return this.filter(function(b,c){return!c.dir&&b===a})[0]||null}return a=this.root+a,v.call(this,a,b,c),this},folder:function(a){if(!a)return this;if(d.isRegExp(a))return this.filter(function(b,c){return c.dir&&a.test(b)});var b=this.root+a,c=x.call(this,b),e=this.clone();return e.root=c.name,e},remove:function(a){a=this.root+a;var b=this.files[a];if(b||("/"!=a.slice(-1)&&(a+="/"),b=this.files[a]),b&&!b.dir)delete this.files[a];else for(var c=this.filter(function(b,c){return c.name.slice(0,a.length)===a}),d=0;d<c.length;d++)delete this.files[c[d].name];return this},generate:function(a){a=t(a||{},{base64:!0,compression:"STORE",type:"base64",comment:null}),d.checkSupport(a.type);var b,c,e=[],g=0,j=0,k=d.transformTo("string",this.utf8encode(a.comment||this.comment||""));for(var l in this.files)if(this.files.hasOwnProperty(l)){var o=this.files[l],p=o.options.compression||a.compression.toUpperCase(),q=i[p];if(!q)throw new Error(p+" is not a valid compression method !");var r=y.call(this,o,q),u=z.call(this,l,o,r,g);g+=u.fileRecord.length+r.compressedSize,j+=u.dirRecord.length,e.push(u)}var v="";v=f.CENTRAL_DIRECTORY_END+"\x00\x00\x00\x00"+s(e.length,2)+s(e.length,2)+s(j,4)+s(g,4)+s(k.length,2)+k;var w=a.type.toLowerCase();for(b="uint8array"===w||"arraybuffer"===w||"blob"===w||"nodebuffer"===w?new n(g+j+v.length):new m(g+j+v.length),c=0;c<e.length;c++)b.append(e[c].fileRecord),b.append(e[c].compressedObject.compressedContent);for(c=0;c<e.length;c++)b.append(e[c].dirRecord);b.append(v);var x=b.finalize();switch(a.type.toLowerCase()){case"uint8array":case"arraybuffer":case"nodebuffer":return d.transformTo(a.type.toLowerCase(),x);case"blob":return d.arrayBuffer2Blob(d.transformTo("arraybuffer",x));case"base64":return a.base64?h.encode(x):x;default:return x}},crc32:function(a,b){return e(a,b)},utf8encode:function(a){return d.transformTo("string",l.utf8encode(a))},utf8decode:function(a){return l.utf8decode(a)}};b.exports=A},{"./base64":1,"./compressedObject":2,"./compressions":3,"./crc32":4,"./defaults":6,"./nodeBuffer":11,"./signature":14,"./stringWriter":16,"./support":17,"./uint8ArrayWriter":19,"./utf8":20,"./utils":21}],14:[function(a,b,c){"use strict";c.LOCAL_FILE_HEADER="PK",c.CENTRAL_FILE_HEADER="PK",c.CENTRAL_DIRECTORY_END="PK",c.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",c.ZIP64_CENTRAL_DIRECTORY_END="PK",c.DATA_DESCRIPTOR="PK\b"},{}],15:[function(a,b){"use strict";function c(a,b){this.data=a,b||(this.data=e.string2binary(this.data)),this.length=this.data.length,this.index=0}var d=a("./dataReader"),e=a("./utils");c.prototype=new d,c.prototype.byteAt=function(a){return this.data.charCodeAt(a)},c.prototype.lastIndexOfSignature=function(a){return this.data.lastIndexOf(a)},c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":5,"./utils":21}],16:[function(a,b){"use strict";var c=a("./utils"),d=function(){this.data=[]};d.prototype={append:function(a){a=c.transformTo("string",a),this.data.push(a)},finalize:function(){return this.data.join("")}},b.exports=d},{"./utils":21}],17:[function(a,b,c){(function(a){"use strict";if(c.base64=!0,c.array=!0,c.string=!0,c.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,c.nodebuffer="undefined"!=typeof a,c.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)c.blob=!1;else{var b=new ArrayBuffer(0);try{c.blob=0===new Blob([b],{type:"application/zip"}).size}catch(d){try{var e=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,f=new e;f.append(b),c.blob=0===f.getBlob("application/zip").size}catch(d){c.blob=!1}}}}).call(this,"undefined"!=typeof Buffer?Buffer:void 0)},{}],18:[function(a,b){"use strict";function c(a){a&&(this.data=a,this.length=this.data.length,this.index=0)}var d=a("./dataReader");c.prototype=new d,c.prototype.byteAt=function(a){return this.data[a]},c.prototype.lastIndexOfSignature=function(a){for(var b=a.charCodeAt(0),c=a.charCodeAt(1),d=a.charCodeAt(2),e=a.charCodeAt(3),f=this.length-4;f>=0;--f)if(this.data[f]===b&&this.data[f+1]===c&&this.data[f+2]===d&&this.data[f+3]===e)return f;return-1},c.prototype.readData=function(a){if(this.checkOffset(a),0===a)return new Uint8Array(0);var b=this.data.subarray(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":5}],19:[function(a,b){"use strict";var c=a("./utils"),d=function(a){this.data=new Uint8Array(a),this.index=0};d.prototype={append:function(a){0!==a.length&&(a=c.transformTo("uint8array",a),this.data.set(a,this.index),this.index+=a.length)},finalize:function(){return this.data}},b.exports=d},{"./utils":21}],20:[function(a,b,c){"use strict";for(var d=a("./utils"),e=a("./support"),f=a("./nodeBuffer"),g=new Array(256),h=0;256>h;h++)g[h]=h>=252?6:h>=248?5:h>=240?4:h>=224?3:h>=192?2:1;g[254]=g[254]=1;var i=function(a){var b,c,d,f,g,h=a.length,i=0;for(f=0;h>f;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),i+=128>c?1:2048>c?2:65536>c?3:4;for(b=e.uint8array?new Uint8Array(i):new Array(i),g=0,f=0;i>g;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),128>c?b[g++]=c:2048>c?(b[g++]=192|c>>>6,b[g++]=128|63&c):65536>c?(b[g++]=224|c>>>12,b[g++]=128|c>>>6&63,b[g++]=128|63&c):(b[g++]=240|c>>>18,b[g++]=128|c>>>12&63,b[g++]=128|c>>>6&63,b[g++]=128|63&c);return b},j=function(a,b){var c;for(b=b||a.length,b>a.length&&(b=a.length),c=b-1;c>=0&&128===(192&a[c]);)c--;return 0>c?b:0===c?b:c+g[a[c]]>b?c:b},k=function(a){var b,c,e,f,h=a.length,i=new Array(2*h);for(c=0,b=0;h>b;)if(e=a[b++],128>e)i[c++]=e;else if(f=g[e],f>4)i[c++]=65533,b+=f-1;else{for(e&=2===f?31:3===f?15:7;f>1&&h>b;)e=e<<6|63&a[b++],f--;f>1?i[c++]=65533:65536>e?i[c++]=e:(e-=65536,i[c++]=55296|e>>10&1023,i[c++]=56320|1023&e)}return i.length!==c&&(i.subarray?i=i.subarray(0,c):i.length=c),d.applyFromCharCode(i)};c.utf8encode=function(a){return e.nodebuffer?f(a,"utf-8"):i(a)},c.utf8decode=function(a){if(e.nodebuffer)return d.transformTo("nodebuffer",a).toString("utf-8");a=d.transformTo(e.uint8array?"uint8array":"array",a);for(var b=[],c=0,f=a.length,g=65536;f>c;){var h=j(a,Math.min(c+g,f));b.push(e.uint8array?k(a.subarray(c,h)):k(a.slice(c,h))),c=h}return b.join("")}},{"./nodeBuffer":11,"./support":17,"./utils":21}],21:[function(a,b,c){"use strict";function d(a){return a}function e(a,b){for(var c=0;c<a.length;++c)b[c]=255&a.charCodeAt(c);return b}function f(a){var b=65536,d=[],e=a.length,f=c.getTypeOf(a),g=0,h=!0;try{switch(f){case"uint8array":String.fromCharCode.apply(null,new Uint8Array(0));break;case"nodebuffer":String.fromCharCode.apply(null,j(0))}}catch(i){h=!1}if(!h){for(var k="",l=0;l<a.length;l++)k+=String.fromCharCode(a[l]);return k}for(;e>g&&b>1;)try{d.push("array"===f||"nodebuffer"===f?String.fromCharCode.apply(null,a.slice(g,Math.min(g+b,e))):String.fromCharCode.apply(null,a.subarray(g,Math.min(g+b,e)))),g+=b}catch(i){b=Math.floor(b/2)}return d.join("")}function g(a,b){for(var c=0;c<a.length;c++)b[c]=a[c];return b}var h=a("./support"),i=a("./compressions"),j=a("./nodeBuffer");c.string2binary=function(a){for(var b="",c=0;c<a.length;c++)b+=String.fromCharCode(255&a.charCodeAt(c));return b},c.arrayBuffer2Blob=function(a){c.checkSupport("blob");try{return new Blob([a],{type:"application/zip"})}catch(b){try{var d=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,e=new d;return e.append(a),e.getBlob("application/zip")}catch(b){throw new Error("Bug : can't construct the Blob.")}}},c.applyFromCharCode=f;var k={};k.string={string:d,array:function(a){return e(a,new Array(a.length))},arraybuffer:function(a){return k.string.uint8array(a).buffer},uint8array:function(a){return e(a,new Uint8Array(a.length))},nodebuffer:function(a){return e(a,j(a.length))}},k.array={string:f,array:d,arraybuffer:function(a){return new Uint8Array(a).buffer},uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(a)}},k.arraybuffer={string:function(a){return f(new Uint8Array(a))},array:function(a){return g(new Uint8Array(a),new Array(a.byteLength))},arraybuffer:d,uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(new Uint8Array(a))}},k.uint8array={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return a.buffer},uint8array:d,nodebuffer:function(a){return j(a)}},k.nodebuffer={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return k.nodebuffer.uint8array(a).buffer},uint8array:function(a){return g(a,new Uint8Array(a.length))},nodebuffer:d},c.transformTo=function(a,b){if(b||(b=""),!a)return b;c.checkSupport(a);var d=c.getTypeOf(b),e=k[d][a](b);return e},c.getTypeOf=function(a){return"string"==typeof a?"string":"[object Array]"===Object.prototype.toString.call(a)?"array":h.nodebuffer&&j.test(a)?"nodebuffer":h.uint8array&&a instanceof Uint8Array?"uint8array":h.arraybuffer&&a instanceof ArrayBuffer?"arraybuffer":void 0},c.checkSupport=function(a){var b=h[a.toLowerCase()];if(!b)throw new Error(a+" is not supported by this browser")},c.MAX_VALUE_16BITS=65535,c.MAX_VALUE_32BITS=-1,c.pretty=function(a){var b,c,d="";for(c=0;c<(a||"").length;c++)b=a.charCodeAt(c),d+="\\x"+(16>b?"0":"")+b.toString(16).toUpperCase();return d},c.findCompression=function(a){for(var b in i)if(i.hasOwnProperty(b)&&i[b].magic===a)return i[b];return null},c.isRegExp=function(a){return"[object RegExp]"===Object.prototype.toString.call(a)}},{"./compressions":3,"./nodeBuffer":11,"./support":17}],22:[function(a,b){"use strict";function c(a,b){this.files=[],this.loadOptions=b,a&&this.load(a)}var d=a("./stringReader"),e=a("./nodeBufferReader"),f=a("./uint8ArrayReader"),g=a("./utils"),h=a("./signature"),i=a("./zipEntry"),j=a("./support"),k=a("./object");c.prototype={checkSignature:function(a){var b=this.reader.readString(4);if(b!==a)throw new Error("Corrupted zip or bug : unexpected signature ("+g.pretty(b)+", expected "+g.pretty(a)+")")},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2),this.zipComment=this.reader.readString(this.zipCommentLength),this.zipComment=k.utf8decode(this.zipComment)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.versionMadeBy=this.reader.readString(2),this.versionNeeded=this.reader.readInt(2),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var a,b,c,d=this.zip64EndOfCentralSize-44,e=0;d>e;)a=this.reader.readInt(2),b=this.reader.readInt(4),c=this.reader.readString(b),this.zip64ExtensibleData[a]={id:a,length:b,value:c}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),this.disksCount>1)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var a,b;for(a=0;a<this.files.length;a++)b=this.files[a],this.reader.setIndex(b.localHeaderOffset),this.checkSignature(h.LOCAL_FILE_HEADER),b.readLocalPart(this.reader),b.handleUTF8()},readCentralDir:function(){var a;for(this.reader.setIndex(this.centralDirOffset);this.reader.readString(4)===h.CENTRAL_FILE_HEADER;)a=new i({zip64:this.zip64},this.loadOptions),a.readCentralPart(this.reader),this.files.push(a)},readEndOfCentral:function(){var a=this.reader.lastIndexOfSignature(h.CENTRAL_DIRECTORY_END);if(-1===a)throw new Error("Corrupted zip : can't find end of central directory");if(this.reader.setIndex(a),this.checkSignature(h.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===g.MAX_VALUE_16BITS||this.diskWithCentralDirStart===g.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===g.MAX_VALUE_16BITS||this.centralDirRecords===g.MAX_VALUE_16BITS||this.centralDirSize===g.MAX_VALUE_32BITS||this.centralDirOffset===g.MAX_VALUE_32BITS){if(this.zip64=!0,a=this.reader.lastIndexOfSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),-1===a)throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");this.reader.setIndex(a),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}},prepareReader:function(a){var b=g.getTypeOf(a);this.reader="string"!==b||j.uint8array?"nodebuffer"===b?new e(a):new f(g.transformTo("uint8array",a)):new d(a,this.loadOptions.optimizedBinaryString)},load:function(a){this.prepareReader(a),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},b.exports=c},{"./nodeBufferReader":12,"./object":13,"./signature":14,"./stringReader":15,"./support":17,"./uint8ArrayReader":18,"./utils":21,"./zipEntry":23}],23:[function(a,b){"use strict";function c(a,b){this.options=a,this.loadOptions=b}var d=a("./stringReader"),e=a("./utils"),f=a("./compressedObject"),g=a("./object");c.prototype={isEncrypted:function(){return 1===(1&this.bitFlag)},useUTF8:function(){return 2048===(2048&this.bitFlag)},prepareCompressedContent:function(a,b,c){return function(){var d=a.index;a.setIndex(b);var e=a.readData(c);return a.setIndex(d),e}},prepareContent:function(a,b,c,d,f){return function(){var a=e.transformTo(d.uncompressInputType,this.getCompressedContent()),b=d.uncompress(a);if(b.length!==f)throw new Error("Bug : uncompressed data size mismatch");return b}},readLocalPart:function(a){var b,c;if(a.skip(22),this.fileNameLength=a.readInt(2),c=a.readInt(2),this.fileName=a.readString(this.fileNameLength),a.skip(c),-1==this.compressedSize||-1==this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize == -1 || uncompressedSize == -1)");if(b=e.findCompression(this.compressionMethod),null===b)throw new Error("Corrupted zip : compression "+e.pretty(this.compressionMethod)+" unknown (inner file : "+this.fileName+")");if(this.decompressed=new f,this.decompressed.compressedSize=this.compressedSize,this.decompressed.uncompressedSize=this.uncompressedSize,this.decompressed.crc32=this.crc32,this.decompressed.compressionMethod=this.compressionMethod,this.decompressed.getCompressedContent=this.prepareCompressedContent(a,a.index,this.compressedSize,b),this.decompressed.getContent=this.prepareContent(a,a.index,this.compressedSize,b,this.uncompressedSize),this.loadOptions.checkCRC32&&(this.decompressed=e.transformTo("string",this.decompressed.getContent()),g.crc32(this.decompressed)!==this.crc32))throw new Error("Corrupted zip : CRC32 mismatch")},readCentralPart:function(a){if(this.versionMadeBy=a.readString(2),this.versionNeeded=a.readInt(2),this.bitFlag=a.readInt(2),this.compressionMethod=a.readString(2),this.date=a.readDate(),this.crc32=a.readInt(4),this.compressedSize=a.readInt(4),this.uncompressedSize=a.readInt(4),this.fileNameLength=a.readInt(2),this.extraFieldsLength=a.readInt(2),this.fileCommentLength=a.readInt(2),this.diskNumberStart=a.readInt(2),this.internalFileAttributes=a.readInt(2),this.externalFileAttributes=a.readInt(4),this.localHeaderOffset=a.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");this.fileName=a.readString(this.fileNameLength),this.readExtraFields(a),this.parseZIP64ExtraField(a),this.fileComment=a.readString(this.fileCommentLength),this.dir=16&this.externalFileAttributes?!0:!1},parseZIP64ExtraField:function(){if(this.extraFields[1]){var a=new d(this.extraFields[1].value);this.uncompressedSize===e.MAX_VALUE_32BITS&&(this.uncompressedSize=a.readInt(8)),this.compressedSize===e.MAX_VALUE_32BITS&&(this.compressedSize=a.readInt(8)),this.localHeaderOffset===e.MAX_VALUE_32BITS&&(this.localHeaderOffset=a.readInt(8)),this.diskNumberStart===e.MAX_VALUE_32BITS&&(this.diskNumberStart=a.readInt(4))}},readExtraFields:function(a){var b,c,d,e=a.index;for(this.extraFields=this.extraFields||{};a.index<e+this.extraFieldsLength;)b=a.readInt(2),c=a.readInt(2),d=a.readString(c),this.extraFields[b]={id:b,length:c,value:d}},handleUTF8:function(){if(this.useUTF8())this.fileName=g.utf8decode(this.fileName),this.fileComment=g.utf8decode(this.fileComment);else{var a=this.findExtraFieldUnicodePath();null!==a&&(this.fileName=a);var b=this.findExtraFieldUnicodeComment();null!==b&&(this.fileComment=b)}},findExtraFieldUnicodePath:function(){var a=this.extraFields[28789];if(a){var b=new d(a.value);return 1!==b.readInt(1)?null:g.crc32(this.fileName)!==b.readInt(4)?null:g.utf8decode(b.readString(a.length-5))}return null},findExtraFieldUnicodeComment:function(){var a=this.extraFields[25461];if(a){var b=new d(a.value);return 1!==b.readInt(1)?null:g.crc32(this.fileComment)!==b.readInt(4)?null:g.utf8decode(b.readString(a.length-5))}return null}},b.exports=c},{"./compressedObject":2,"./object":13,"./stringReader":15,"./utils":21}],24:[function(a,b){"use strict";var c=a("./lib/utils/common").assign,d=a("./lib/deflate"),e=a("./lib/inflate"),f=a("./lib/zlib/constants"),g={};c(g,d,e,f),b.exports=g},{"./lib/deflate":25,"./lib/inflate":26,"./lib/utils/common":27,"./lib/zlib/constants":30}],25:[function(a,b,c){"use strict";function d(a,b){var c=new s(b);if(c.push(a,!0),c.err)throw c.msg;return c.result}function e(a,b){return b=b||{},b.raw=!0,d(a,b)}function f(a,b){return b=b||{},b.gzip=!0,d(a,b)}var g=a("./zlib/deflate.js"),h=a("./utils/common"),i=a("./utils/strings"),j=a("./zlib/messages"),k=a("./zlib/zstream"),l=0,m=4,n=0,o=1,p=-1,q=0,r=8,s=function(a){this.options=h.assign({level:p,method:r,chunkSize:16384,windowBits:15,memLevel:8,strategy:q,to:""},a||{});var b=this.options;b.raw&&b.windowBits>0?b.windowBits=-b.windowBits:b.gzip&&b.windowBits>0&&b.windowBits<16&&(b.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new k,this.strm.avail_out=0;var c=g.deflateInit2(this.strm,b.level,b.method,b.windowBits,b.memLevel,b.strategy);if(c!==n)throw new Error(j[c]);b.header&&g.deflateSetHeader(this.strm,b.header)
};s.prototype.push=function(a,b){var c,d,e=this.strm,f=this.options.chunkSize;if(this.ended)return!1;d=b===~~b?b:b===!0?m:l,e.input="string"==typeof a?i.string2buf(a):a,e.next_in=0,e.avail_in=e.input.length;do{if(0===e.avail_out&&(e.output=new h.Buf8(f),e.next_out=0,e.avail_out=f),c=g.deflate(e,d),c!==o&&c!==n)return this.onEnd(c),this.ended=!0,!1;(0===e.avail_out||0===e.avail_in&&d===m)&&this.onData("string"===this.options.to?i.buf2binstring(h.shrinkBuf(e.output,e.next_out)):h.shrinkBuf(e.output,e.next_out))}while((e.avail_in>0||0===e.avail_out)&&c!==o);return d===m?(c=g.deflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===n):!0},s.prototype.onData=function(a){this.chunks.push(a)},s.prototype.onEnd=function(a){a===n&&(this.result="string"===this.options.to?this.chunks.join(""):h.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},c.Deflate=s,c.deflate=d,c.deflateRaw=e,c.gzip=f},{"./utils/common":27,"./utils/strings":28,"./zlib/deflate.js":32,"./zlib/messages":37,"./zlib/zstream":39}],26:[function(a,b,c){"use strict";function d(a,b){var c=new m(b);if(c.push(a,!0),c.err)throw c.msg;return c.result}function e(a,b){return b=b||{},b.raw=!0,d(a,b)}var f=a("./zlib/inflate.js"),g=a("./utils/common"),h=a("./utils/strings"),i=a("./zlib/constants"),j=a("./zlib/messages"),k=a("./zlib/zstream"),l=a("./zlib/gzheader"),m=function(a){this.options=g.assign({chunkSize:16384,windowBits:0,to:""},a||{});var b=this.options;b.raw&&b.windowBits>=0&&b.windowBits<16&&(b.windowBits=-b.windowBits,0===b.windowBits&&(b.windowBits=-15)),!(b.windowBits>=0&&b.windowBits<16)||a&&a.windowBits||(b.windowBits+=32),b.windowBits>15&&b.windowBits<48&&0===(15&b.windowBits)&&(b.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new k,this.strm.avail_out=0;var c=f.inflateInit2(this.strm,b.windowBits);if(c!==i.Z_OK)throw new Error(j[c]);this.header=new l,f.inflateGetHeader(this.strm,this.header)};m.prototype.push=function(a,b){var c,d,e,j,k,l=this.strm,m=this.options.chunkSize;if(this.ended)return!1;d=b===~~b?b:b===!0?i.Z_FINISH:i.Z_NO_FLUSH,l.input="string"==typeof a?h.binstring2buf(a):a,l.next_in=0,l.avail_in=l.input.length;do{if(0===l.avail_out&&(l.output=new g.Buf8(m),l.next_out=0,l.avail_out=m),c=f.inflate(l,i.Z_NO_FLUSH),c!==i.Z_STREAM_END&&c!==i.Z_OK)return this.onEnd(c),this.ended=!0,!1;l.next_out&&(0===l.avail_out||c===i.Z_STREAM_END||0===l.avail_in&&d===i.Z_FINISH)&&("string"===this.options.to?(e=h.utf8border(l.output,l.next_out),j=l.next_out-e,k=h.buf2string(l.output,e),l.next_out=j,l.avail_out=m-j,j&&g.arraySet(l.output,l.output,e,j,0),this.onData(k)):this.onData(g.shrinkBuf(l.output,l.next_out)))}while(l.avail_in>0&&c!==i.Z_STREAM_END);return c===i.Z_STREAM_END&&(d=i.Z_FINISH),d===i.Z_FINISH?(c=f.inflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===i.Z_OK):!0},m.prototype.onData=function(a){this.chunks.push(a)},m.prototype.onEnd=function(a){a===i.Z_OK&&(this.result="string"===this.options.to?this.chunks.join(""):g.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},c.Inflate=m,c.inflate=d,c.inflateRaw=e,c.ungzip=d},{"./utils/common":27,"./utils/strings":28,"./zlib/constants":30,"./zlib/gzheader":33,"./zlib/inflate.js":35,"./zlib/messages":37,"./zlib/zstream":39}],27:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;c.assign=function(a){for(var b=Array.prototype.slice.call(arguments,1);b.length;){var c=b.shift();if(c){if("object"!=typeof c)throw new TypeError(c+"must be non-object");for(var d in c)c.hasOwnProperty(d)&&(a[d]=c[d])}}return a},c.shrinkBuf=function(a,b){return a.length===b?a:a.subarray?a.subarray(0,b):(a.length=b,a)};var e={arraySet:function(a,b,c,d,e){if(b.subarray&&a.subarray)return void a.set(b.subarray(c,c+d),e);for(var f=0;d>f;f++)a[e+f]=b[c+f]},flattenChunks:function(a){var b,c,d,e,f,g;for(d=0,b=0,c=a.length;c>b;b++)d+=a[b].length;for(g=new Uint8Array(d),e=0,b=0,c=a.length;c>b;b++)f=a[b],g.set(f,e),e+=f.length;return g}},f={arraySet:function(a,b,c,d,e){for(var f=0;d>f;f++)a[e+f]=b[c+f]},flattenChunks:function(a){return[].concat.apply([],a)}};c.setTyped=function(a){a?(c.Buf8=Uint8Array,c.Buf16=Uint16Array,c.Buf32=Int32Array,c.assign(c,e)):(c.Buf8=Array,c.Buf16=Array,c.Buf32=Array,c.assign(c,f))},c.setTyped(d)},{}],28:[function(a,b,c){"use strict";function d(a,b){if(65537>b&&(a.subarray&&g||!a.subarray&&f))return String.fromCharCode.apply(null,e.shrinkBuf(a,b));for(var c="",d=0;b>d;d++)c+=String.fromCharCode(a[d]);return c}var e=a("./common"),f=!0,g=!0;try{String.fromCharCode.apply(null,[0])}catch(h){f=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(h){g=!1}for(var i=new e.Buf8(256),j=0;256>j;j++)i[j]=j>=252?6:j>=248?5:j>=240?4:j>=224?3:j>=192?2:1;i[254]=i[254]=1,c.string2buf=function(a){var b,c,d,f,g,h=a.length,i=0;for(f=0;h>f;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),i+=128>c?1:2048>c?2:65536>c?3:4;for(b=new e.Buf8(i),g=0,f=0;i>g;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),128>c?b[g++]=c:2048>c?(b[g++]=192|c>>>6,b[g++]=128|63&c):65536>c?(b[g++]=224|c>>>12,b[g++]=128|c>>>6&63,b[g++]=128|63&c):(b[g++]=240|c>>>18,b[g++]=128|c>>>12&63,b[g++]=128|c>>>6&63,b[g++]=128|63&c);return b},c.buf2binstring=function(a){return d(a,a.length)},c.binstring2buf=function(a){for(var b=new e.Buf8(a.length),c=0,d=b.length;d>c;c++)b[c]=a.charCodeAt(c);return b},c.buf2string=function(a,b){var c,e,f,g,h=b||a.length,j=new Array(2*h);for(e=0,c=0;h>c;)if(f=a[c++],128>f)j[e++]=f;else if(g=i[f],g>4)j[e++]=65533,c+=g-1;else{for(f&=2===g?31:3===g?15:7;g>1&&h>c;)f=f<<6|63&a[c++],g--;g>1?j[e++]=65533:65536>f?j[e++]=f:(f-=65536,j[e++]=55296|f>>10&1023,j[e++]=56320|1023&f)}return d(j,e)},c.utf8border=function(a,b){var c;for(b=b||a.length,b>a.length&&(b=a.length),c=b-1;c>=0&&128===(192&a[c]);)c--;return 0>c?b:0===c?b:c+i[a[c]]>b?c:b}},{"./common":27}],29:[function(a,b){"use strict";function c(a,b,c,d){for(var e=65535&a|0,f=a>>>16&65535|0,g=0;0!==c;){g=c>2e3?2e3:c,c-=g;do e=e+b[d++]|0,f=f+e|0;while(--g);e%=65521,f%=65521}return e|f<<16|0}b.exports=c},{}],30:[function(a,b){b.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],31:[function(a,b){"use strict";function c(){for(var a,b=[],c=0;256>c;c++){a=c;for(var d=0;8>d;d++)a=1&a?3988292384^a>>>1:a>>>1;b[c]=a}return b}function d(a,b,c,d){var f=e,g=d+c;a=-1^a;for(var h=d;g>h;h++)a=a>>>8^f[255&(a^b[h])];return-1^a}var e=c();b.exports=d},{}],32:[function(a,b,c){"use strict";function d(a,b){return a.msg=G[b],b}function e(a){return(a<<1)-(a>4?9:0)}function f(a){for(var b=a.length;--b>=0;)a[b]=0}function g(a){var b=a.state,c=b.pending;c>a.avail_out&&(c=a.avail_out),0!==c&&(C.arraySet(a.output,b.pending_buf,b.pending_out,c,a.next_out),a.next_out+=c,b.pending_out+=c,a.total_out+=c,a.avail_out-=c,b.pending-=c,0===b.pending&&(b.pending_out=0))}function h(a,b){D._tr_flush_block(a,a.block_start>=0?a.block_start:-1,a.strstart-a.block_start,b),a.block_start=a.strstart,g(a.strm)}function i(a,b){a.pending_buf[a.pending++]=b}function j(a,b){a.pending_buf[a.pending++]=b>>>8&255,a.pending_buf[a.pending++]=255&b}function k(a,b,c,d){var e=a.avail_in;return e>d&&(e=d),0===e?0:(a.avail_in-=e,C.arraySet(b,a.input,a.next_in,e,c),1===a.state.wrap?a.adler=E(a.adler,b,e,c):2===a.state.wrap&&(a.adler=F(a.adler,b,e,c)),a.next_in+=e,a.total_in+=e,e)}function l(a,b){var c,d,e=a.max_chain_length,f=a.strstart,g=a.prev_length,h=a.nice_match,i=a.strstart>a.w_size-jb?a.strstart-(a.w_size-jb):0,j=a.window,k=a.w_mask,l=a.prev,m=a.strstart+ib,n=j[f+g-1],o=j[f+g];a.prev_length>=a.good_match&&(e>>=2),h>a.lookahead&&(h=a.lookahead);do if(c=b,j[c+g]===o&&j[c+g-1]===n&&j[c]===j[f]&&j[++c]===j[f+1]){f+=2,c++;do;while(j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&m>f);if(d=ib-(m-f),f=m-ib,d>g){if(a.match_start=b,g=d,d>=h)break;n=j[f+g-1],o=j[f+g]}}while((b=l[b&k])>i&&0!==--e);return g<=a.lookahead?g:a.lookahead}function m(a){var b,c,d,e,f,g=a.w_size;do{if(e=a.window_size-a.lookahead-a.strstart,a.strstart>=g+(g-jb)){C.arraySet(a.window,a.window,g,g,0),a.match_start-=g,a.strstart-=g,a.block_start-=g,c=a.hash_size,b=c;do d=a.head[--b],a.head[b]=d>=g?d-g:0;while(--c);c=g,b=c;do d=a.prev[--b],a.prev[b]=d>=g?d-g:0;while(--c);e+=g}if(0===a.strm.avail_in)break;if(c=k(a.strm,a.window,a.strstart+a.lookahead,e),a.lookahead+=c,a.lookahead+a.insert>=hb)for(f=a.strstart-a.insert,a.ins_h=a.window[f],a.ins_h=(a.ins_h<<a.hash_shift^a.window[f+1])&a.hash_mask;a.insert&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[f+hb-1])&a.hash_mask,a.prev[f&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=f,f++,a.insert--,!(a.lookahead+a.insert<hb)););}while(a.lookahead<jb&&0!==a.strm.avail_in)}function n(a,b){var c=65535;for(c>a.pending_buf_size-5&&(c=a.pending_buf_size-5);;){if(a.lookahead<=1){if(m(a),0===a.lookahead&&b===H)return sb;if(0===a.lookahead)break}a.strstart+=a.lookahead,a.lookahead=0;var d=a.block_start+c;if((0===a.strstart||a.strstart>=d)&&(a.lookahead=a.strstart-d,a.strstart=d,h(a,!1),0===a.strm.avail_out))return sb;if(a.strstart-a.block_start>=a.w_size-jb&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=0,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.strstart>a.block_start&&(h(a,!1),0===a.strm.avail_out)?sb:sb}function o(a,b){for(var c,d;;){if(a.lookahead<jb){if(m(a),a.lookahead<jb&&b===H)return sb;if(0===a.lookahead)break}if(c=0,a.lookahead>=hb&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart),0!==c&&a.strstart-c<=a.w_size-jb&&(a.match_length=l(a,c)),a.match_length>=hb)if(d=D._tr_tally(a,a.strstart-a.match_start,a.match_length-hb),a.lookahead-=a.match_length,a.match_length<=a.max_lazy_match&&a.lookahead>=hb){a.match_length--;do a.strstart++,a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart;while(0!==--a.match_length);a.strstart++}else a.strstart+=a.match_length,a.match_length=0,a.ins_h=a.window[a.strstart],a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+1])&a.hash_mask;else d=D._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++;if(d&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=a.strstart<hb-1?a.strstart:hb-1,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function p(a,b){for(var c,d,e;;){if(a.lookahead<jb){if(m(a),a.lookahead<jb&&b===H)return sb;if(0===a.lookahead)break}if(c=0,a.lookahead>=hb&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart),a.prev_length=a.match_length,a.prev_match=a.match_start,a.match_length=hb-1,0!==c&&a.prev_length<a.max_lazy_match&&a.strstart-c<=a.w_size-jb&&(a.match_length=l(a,c),a.match_length<=5&&(a.strategy===S||a.match_length===hb&&a.strstart-a.match_start>4096)&&(a.match_length=hb-1)),a.prev_length>=hb&&a.match_length<=a.prev_length){e=a.strstart+a.lookahead-hb,d=D._tr_tally(a,a.strstart-1-a.prev_match,a.prev_length-hb),a.lookahead-=a.prev_length-1,a.prev_length-=2;do++a.strstart<=e&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart);while(0!==--a.prev_length);if(a.match_available=0,a.match_length=hb-1,a.strstart++,d&&(h(a,!1),0===a.strm.avail_out))return sb}else if(a.match_available){if(d=D._tr_tally(a,0,a.window[a.strstart-1]),d&&h(a,!1),a.strstart++,a.lookahead--,0===a.strm.avail_out)return sb}else a.match_available=1,a.strstart++,a.lookahead--}return a.match_available&&(d=D._tr_tally(a,0,a.window[a.strstart-1]),a.match_available=0),a.insert=a.strstart<hb-1?a.strstart:hb-1,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function q(a,b){for(var c,d,e,f,g=a.window;;){if(a.lookahead<=ib){if(m(a),a.lookahead<=ib&&b===H)return sb;if(0===a.lookahead)break}if(a.match_length=0,a.lookahead>=hb&&a.strstart>0&&(e=a.strstart-1,d=g[e],d===g[++e]&&d===g[++e]&&d===g[++e])){f=a.strstart+ib;do;while(d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&f>e);a.match_length=ib-(f-e),a.match_length>a.lookahead&&(a.match_length=a.lookahead)}if(a.match_length>=hb?(c=D._tr_tally(a,1,a.match_length-hb),a.lookahead-=a.match_length,a.strstart+=a.match_length,a.match_length=0):(c=D._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++),c&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=0,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function r(a,b){for(var c;;){if(0===a.lookahead&&(m(a),0===a.lookahead)){if(b===H)return sb;break}if(a.match_length=0,c=D._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++,c&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=0,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function s(a){a.window_size=2*a.w_size,f(a.head),a.max_lazy_match=B[a.level].max_lazy,a.good_match=B[a.level].good_length,a.nice_match=B[a.level].nice_length,a.max_chain_length=B[a.level].max_chain,a.strstart=0,a.block_start=0,a.lookahead=0,a.insert=0,a.match_length=a.prev_length=hb-1,a.match_available=0,a.ins_h=0}function t(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=Y,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new C.Buf16(2*fb),this.dyn_dtree=new C.Buf16(2*(2*db+1)),this.bl_tree=new C.Buf16(2*(2*eb+1)),f(this.dyn_ltree),f(this.dyn_dtree),f(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new C.Buf16(gb+1),this.heap=new C.Buf16(2*cb+1),f(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new C.Buf16(2*cb+1),f(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function u(a){var b;return a&&a.state?(a.total_in=a.total_out=0,a.data_type=X,b=a.state,b.pending=0,b.pending_out=0,b.wrap<0&&(b.wrap=-b.wrap),b.status=b.wrap?lb:qb,a.adler=2===b.wrap?0:1,b.last_flush=H,D._tr_init(b),M):d(a,O)}function v(a){var b=u(a);return b===M&&s(a.state),b}function w(a,b){return a&&a.state?2!==a.state.wrap?O:(a.state.gzhead=b,M):O}function x(a,b,c,e,f,g){if(!a)return O;var h=1;if(b===R&&(b=6),0>e?(h=0,e=-e):e>15&&(h=2,e-=16),1>f||f>Z||c!==Y||8>e||e>15||0>b||b>9||0>g||g>V)return d(a,O);8===e&&(e=9);var i=new t;return a.state=i,i.strm=a,i.wrap=h,i.gzhead=null,i.w_bits=e,i.w_size=1<<i.w_bits,i.w_mask=i.w_size-1,i.hash_bits=f+7,i.hash_size=1<<i.hash_bits,i.hash_mask=i.hash_size-1,i.hash_shift=~~((i.hash_bits+hb-1)/hb),i.window=new C.Buf8(2*i.w_size),i.head=new C.Buf16(i.hash_size),i.prev=new C.Buf16(i.w_size),i.lit_bufsize=1<<f+6,i.pending_buf_size=4*i.lit_bufsize,i.pending_buf=new C.Buf8(i.pending_buf_size),i.d_buf=i.lit_bufsize>>1,i.l_buf=3*i.lit_bufsize,i.level=b,i.strategy=g,i.method=c,v(a)}function y(a,b){return x(a,b,Y,$,_,W)}function z(a,b){var c,h,k,l;if(!a||!a.state||b>L||0>b)return a?d(a,O):O;if(h=a.state,!a.output||!a.input&&0!==a.avail_in||h.status===rb&&b!==K)return d(a,0===a.avail_out?Q:O);if(h.strm=a,c=h.last_flush,h.last_flush=b,h.status===lb)if(2===h.wrap)a.adler=0,i(h,31),i(h,139),i(h,8),h.gzhead?(i(h,(h.gzhead.text?1:0)+(h.gzhead.hcrc?2:0)+(h.gzhead.extra?4:0)+(h.gzhead.name?8:0)+(h.gzhead.comment?16:0)),i(h,255&h.gzhead.time),i(h,h.gzhead.time>>8&255),i(h,h.gzhead.time>>16&255),i(h,h.gzhead.time>>24&255),i(h,9===h.level?2:h.strategy>=T||h.level<2?4:0),i(h,255&h.gzhead.os),h.gzhead.extra&&h.gzhead.extra.length&&(i(h,255&h.gzhead.extra.length),i(h,h.gzhead.extra.length>>8&255)),h.gzhead.hcrc&&(a.adler=F(a.adler,h.pending_buf,h.pending,0)),h.gzindex=0,h.status=mb):(i(h,0),i(h,0),i(h,0),i(h,0),i(h,0),i(h,9===h.level?2:h.strategy>=T||h.level<2?4:0),i(h,wb),h.status=qb);else{var m=Y+(h.w_bits-8<<4)<<8,n=-1;n=h.strategy>=T||h.level<2?0:h.level<6?1:6===h.level?2:3,m|=n<<6,0!==h.strstart&&(m|=kb),m+=31-m%31,h.status=qb,j(h,m),0!==h.strstart&&(j(h,a.adler>>>16),j(h,65535&a.adler)),a.adler=1}if(h.status===mb)if(h.gzhead.extra){for(k=h.pending;h.gzindex<(65535&h.gzhead.extra.length)&&(h.pending!==h.pending_buf_size||(h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending!==h.pending_buf_size));)i(h,255&h.gzhead.extra[h.gzindex]),h.gzindex++;h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),h.gzindex===h.gzhead.extra.length&&(h.gzindex=0,h.status=nb)}else h.status=nb;if(h.status===nb)if(h.gzhead.name){k=h.pending;do{if(h.pending===h.pending_buf_size&&(h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending===h.pending_buf_size)){l=1;break}l=h.gzindex<h.gzhead.name.length?255&h.gzhead.name.charCodeAt(h.gzindex++):0,i(h,l)}while(0!==l);h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),0===l&&(h.gzindex=0,h.status=ob)}else h.status=ob;if(h.status===ob)if(h.gzhead.comment){k=h.pending;do{if(h.pending===h.pending_buf_size&&(h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending===h.pending_buf_size)){l=1;break}l=h.gzindex<h.gzhead.comment.length?255&h.gzhead.comment.charCodeAt(h.gzindex++):0,i(h,l)}while(0!==l);h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),0===l&&(h.status=pb)}else h.status=pb;if(h.status===pb&&(h.gzhead.hcrc?(h.pending+2>h.pending_buf_size&&g(a),h.pending+2<=h.pending_buf_size&&(i(h,255&a.adler),i(h,a.adler>>8&255),a.adler=0,h.status=qb)):h.status=qb),0!==h.pending){if(g(a),0===a.avail_out)return h.last_flush=-1,M}else if(0===a.avail_in&&e(b)<=e(c)&&b!==K)return d(a,Q);if(h.status===rb&&0!==a.avail_in)return d(a,Q);if(0!==a.avail_in||0!==h.lookahead||b!==H&&h.status!==rb){var o=h.strategy===T?r(h,b):h.strategy===U?q(h,b):B[h.level].func(h,b);if((o===ub||o===vb)&&(h.status=rb),o===sb||o===ub)return 0===a.avail_out&&(h.last_flush=-1),M;if(o===tb&&(b===I?D._tr_align(h):b!==L&&(D._tr_stored_block(h,0,0,!1),b===J&&(f(h.head),0===h.lookahead&&(h.strstart=0,h.block_start=0,h.insert=0))),g(a),0===a.avail_out))return h.last_flush=-1,M}return b!==K?M:h.wrap<=0?N:(2===h.wrap?(i(h,255&a.adler),i(h,a.adler>>8&255),i(h,a.adler>>16&255),i(h,a.adler>>24&255),i(h,255&a.total_in),i(h,a.total_in>>8&255),i(h,a.total_in>>16&255),i(h,a.total_in>>24&255)):(j(h,a.adler>>>16),j(h,65535&a.adler)),g(a),h.wrap>0&&(h.wrap=-h.wrap),0!==h.pending?M:N)}function A(a){var b;return a&&a.state?(b=a.state.status,b!==lb&&b!==mb&&b!==nb&&b!==ob&&b!==pb&&b!==qb&&b!==rb?d(a,O):(a.state=null,b===qb?d(a,P):M)):O}var B,C=a("../utils/common"),D=a("./trees"),E=a("./adler32"),F=a("./crc32"),G=a("./messages"),H=0,I=1,J=3,K=4,L=5,M=0,N=1,O=-2,P=-3,Q=-5,R=-1,S=1,T=2,U=3,V=4,W=0,X=2,Y=8,Z=9,$=15,_=8,ab=29,bb=256,cb=bb+1+ab,db=30,eb=19,fb=2*cb+1,gb=15,hb=3,ib=258,jb=ib+hb+1,kb=32,lb=42,mb=69,nb=73,ob=91,pb=103,qb=113,rb=666,sb=1,tb=2,ub=3,vb=4,wb=3,xb=function(a,b,c,d,e){this.good_length=a,this.max_lazy=b,this.nice_length=c,this.max_chain=d,this.func=e};B=[new xb(0,0,0,0,n),new xb(4,4,8,4,o),new xb(4,5,16,8,o),new xb(4,6,32,32,o),new xb(4,4,16,16,p),new xb(8,16,32,32,p),new xb(8,16,128,128,p),new xb(8,32,128,256,p),new xb(32,128,258,1024,p),new xb(32,258,258,4096,p)],c.deflateInit=y,c.deflateInit2=x,c.deflateReset=v,c.deflateResetKeep=u,c.deflateSetHeader=w,c.deflate=z,c.deflateEnd=A,c.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":27,"./adler32":29,"./crc32":31,"./messages":37,"./trees":38}],33:[function(a,b){"use strict";function c(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}b.exports=c},{}],34:[function(a,b){"use strict";var c=30,d=12;b.exports=function(a,b){var e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C;e=a.state,f=a.next_in,B=a.input,g=f+(a.avail_in-5),h=a.next_out,C=a.output,i=h-(b-a.avail_out),j=h+(a.avail_out-257),k=e.dmax,l=e.wsize,m=e.whave,n=e.wnext,o=e.window,p=e.hold,q=e.bits,r=e.lencode,s=e.distcode,t=(1<<e.lenbits)-1,u=(1<<e.distbits)-1;a:do{15>q&&(p+=B[f++]<<q,q+=8,p+=B[f++]<<q,q+=8),v=r[p&t];b:for(;;){if(w=v>>>24,p>>>=w,q-=w,w=v>>>16&255,0===w)C[h++]=65535&v;else{if(!(16&w)){if(0===(64&w)){v=r[(65535&v)+(p&(1<<w)-1)];continue b}if(32&w){e.mode=d;break a}a.msg="invalid literal/length code",e.mode=c;break a}x=65535&v,w&=15,w&&(w>q&&(p+=B[f++]<<q,q+=8),x+=p&(1<<w)-1,p>>>=w,q-=w),15>q&&(p+=B[f++]<<q,q+=8,p+=B[f++]<<q,q+=8),v=s[p&u];c:for(;;){if(w=v>>>24,p>>>=w,q-=w,w=v>>>16&255,!(16&w)){if(0===(64&w)){v=s[(65535&v)+(p&(1<<w)-1)];continue c}a.msg="invalid distance code",e.mode=c;break a}if(y=65535&v,w&=15,w>q&&(p+=B[f++]<<q,q+=8,w>q&&(p+=B[f++]<<q,q+=8)),y+=p&(1<<w)-1,y>k){a.msg="invalid distance too far back",e.mode=c;break a}if(p>>>=w,q-=w,w=h-i,y>w){if(w=y-w,w>m&&e.sane){a.msg="invalid distance too far back",e.mode=c;break a}if(z=0,A=o,0===n){if(z+=l-w,x>w){x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}}else if(w>n){if(z+=l+n-w,w-=n,x>w){x-=w;do C[h++]=o[z++];while(--w);if(z=0,x>n){w=n,x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}}}else if(z+=n-w,x>w){x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}for(;x>2;)C[h++]=A[z++],C[h++]=A[z++],C[h++]=A[z++],x-=3;x&&(C[h++]=A[z++],x>1&&(C[h++]=A[z++]))}else{z=h-y;do C[h++]=C[z++],C[h++]=C[z++],C[h++]=C[z++],x-=3;while(x>2);x&&(C[h++]=C[z++],x>1&&(C[h++]=C[z++]))}break}}break}}while(g>f&&j>h);x=q>>3,f-=x,q-=x<<3,p&=(1<<q)-1,a.next_in=f,a.next_out=h,a.avail_in=g>f?5+(g-f):5-(f-g),a.avail_out=j>h?257+(j-h):257-(h-j),e.hold=p,e.bits=q}},{}],35:[function(a,b,c){"use strict";function d(a){return(a>>>24&255)+(a>>>8&65280)+((65280&a)<<8)+((255&a)<<24)}function e(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new r.Buf16(320),this.work=new r.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function f(a){var b;return a&&a.state?(b=a.state,a.total_in=a.total_out=b.total=0,a.msg="",b.wrap&&(a.adler=1&b.wrap),b.mode=K,b.last=0,b.havedict=0,b.dmax=32768,b.head=null,b.hold=0,b.bits=0,b.lencode=b.lendyn=new r.Buf32(ob),b.distcode=b.distdyn=new r.Buf32(pb),b.sane=1,b.back=-1,C):F}function g(a){var b;return a&&a.state?(b=a.state,b.wsize=0,b.whave=0,b.wnext=0,f(a)):F}function h(a,b){var c,d;return a&&a.state?(d=a.state,0>b?(c=0,b=-b):(c=(b>>4)+1,48>b&&(b&=15)),b&&(8>b||b>15)?F:(null!==d.window&&d.wbits!==b&&(d.window=null),d.wrap=c,d.wbits=b,g(a))):F}function i(a,b){var c,d;return a?(d=new e,a.state=d,d.window=null,c=h(a,b),c!==C&&(a.state=null),c):F}function j(a){return i(a,rb)}function k(a){if(sb){var b;for(p=new r.Buf32(512),q=new r.Buf32(32),b=0;144>b;)a.lens[b++]=8;for(;256>b;)a.lens[b++]=9;for(;280>b;)a.lens[b++]=7;for(;288>b;)a.lens[b++]=8;for(v(x,a.lens,0,288,p,0,a.work,{bits:9}),b=0;32>b;)a.lens[b++]=5;v(y,a.lens,0,32,q,0,a.work,{bits:5}),sb=!1}a.lencode=p,a.lenbits=9,a.distcode=q,a.distbits=5}function l(a,b,c,d){var e,f=a.state;return null===f.window&&(f.wsize=1<<f.wbits,f.wnext=0,f.whave=0,f.window=new r.Buf8(f.wsize)),d>=f.wsize?(r.arraySet(f.window,b,c-f.wsize,f.wsize,0),f.wnext=0,f.whave=f.wsize):(e=f.wsize-f.wnext,e>d&&(e=d),r.arraySet(f.window,b,c-d,e,f.wnext),d-=e,d?(r.arraySet(f.window,b,c-d,d,0),f.wnext=d,f.whave=f.wsize):(f.wnext+=e,f.wnext===f.wsize&&(f.wnext=0),f.whave<f.wsize&&(f.whave+=e))),0}function m(a,b){var c,e,f,g,h,i,j,m,n,o,p,q,ob,pb,qb,rb,sb,tb,ub,vb,wb,xb,yb,zb,Ab=0,Bb=new r.Buf8(4),Cb=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!a||!a.state||!a.output||!a.input&&0!==a.avail_in)return F;c=a.state,c.mode===V&&(c.mode=W),h=a.next_out,f=a.output,j=a.avail_out,g=a.next_in,e=a.input,i=a.avail_in,m=c.hold,n=c.bits,o=i,p=j,xb=C;a:for(;;)switch(c.mode){case K:if(0===c.wrap){c.mode=W;break}for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(2&c.wrap&&35615===m){c.check=0,Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0),m=0,n=0,c.mode=L;break}if(c.flags=0,c.head&&(c.head.done=!1),!(1&c.wrap)||(((255&m)<<8)+(m>>8))%31){a.msg="incorrect header check",c.mode=lb;break}if((15&m)!==J){a.msg="unknown compression method",c.mode=lb;break}if(m>>>=4,n-=4,wb=(15&m)+8,0===c.wbits)c.wbits=wb;else if(wb>c.wbits){a.msg="invalid window size",c.mode=lb;break}c.dmax=1<<wb,a.adler=c.check=1,c.mode=512&m?T:V,m=0,n=0;break;case L:for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(c.flags=m,(255&c.flags)!==J){a.msg="unknown compression method",c.mode=lb;break}if(57344&c.flags){a.msg="unknown header flags set",c.mode=lb;break}c.head&&(c.head.text=m>>8&1),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0)),m=0,n=0,c.mode=M;case M:for(;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.head&&(c.head.time=m),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,Bb[2]=m>>>16&255,Bb[3]=m>>>24&255,c.check=t(c.check,Bb,4,0)),m=0,n=0,c.mode=N;case N:for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.head&&(c.head.xflags=255&m,c.head.os=m>>8),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0)),m=0,n=0,c.mode=O;case O:if(1024&c.flags){for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.length=m,c.head&&(c.head.extra_len=m),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0)),m=0,n=0}else c.head&&(c.head.extra=null);c.mode=P;case P:if(1024&c.flags&&(q=c.length,q>i&&(q=i),q&&(c.head&&(wb=c.head.extra_len-c.length,c.head.extra||(c.head.extra=new Array(c.head.extra_len)),r.arraySet(c.head.extra,e,g,q,wb)),512&c.flags&&(c.check=t(c.check,e,q,g)),i-=q,g+=q,c.length-=q),c.length))break a;c.length=0,c.mode=Q;case Q:if(2048&c.flags){if(0===i)break a;q=0;do wb=e[g+q++],c.head&&wb&&c.length<65536&&(c.head.name+=String.fromCharCode(wb));while(wb&&i>q);if(512&c.flags&&(c.check=t(c.check,e,q,g)),i-=q,g+=q,wb)break a}else c.head&&(c.head.name=null);c.length=0,c.mode=R;case R:if(4096&c.flags){if(0===i)break a;q=0;do wb=e[g+q++],c.head&&wb&&c.length<65536&&(c.head.comment+=String.fromCharCode(wb));while(wb&&i>q);if(512&c.flags&&(c.check=t(c.check,e,q,g)),i-=q,g+=q,wb)break a}else c.head&&(c.head.comment=null);c.mode=S;case S:if(512&c.flags){for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m!==(65535&c.check)){a.msg="header crc mismatch",c.mode=lb;break}m=0,n=0}c.head&&(c.head.hcrc=c.flags>>9&1,c.head.done=!0),a.adler=c.check=0,c.mode=V;break;case T:for(;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}a.adler=c.check=d(m),m=0,n=0,c.mode=U;case U:if(0===c.havedict)return a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,E;a.adler=c.check=1,c.mode=V;case V:if(b===A||b===B)break a;case W:if(c.last){m>>>=7&n,n-=7&n,c.mode=ib;break}for(;3>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}switch(c.last=1&m,m>>>=1,n-=1,3&m){case 0:c.mode=X;break;case 1:if(k(c),c.mode=bb,b===B){m>>>=2,n-=2;break a}break;case 2:c.mode=$;break;case 3:a.msg="invalid block type",c.mode=lb}m>>>=2,n-=2;break;case X:for(m>>>=7&n,n-=7&n;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if((65535&m)!==(m>>>16^65535)){a.msg="invalid stored block lengths",c.mode=lb;break}if(c.length=65535&m,m=0,n=0,c.mode=Y,b===B)break a;case Y:c.mode=Z;case Z:if(q=c.length){if(q>i&&(q=i),q>j&&(q=j),0===q)break a;r.arraySet(f,e,g,q,h),i-=q,g+=q,j-=q,h+=q,c.length-=q;break}c.mode=V;break;case $:for(;14>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(c.nlen=(31&m)+257,m>>>=5,n-=5,c.ndist=(31&m)+1,m>>>=5,n-=5,c.ncode=(15&m)+4,m>>>=4,n-=4,c.nlen>286||c.ndist>30){a.msg="too many length or distance symbols",c.mode=lb;break}c.have=0,c.mode=_;case _:for(;c.have<c.ncode;){for(;3>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.lens[Cb[c.have++]]=7&m,m>>>=3,n-=3}for(;c.have<19;)c.lens[Cb[c.have++]]=0;if(c.lencode=c.lendyn,c.lenbits=7,yb={bits:c.lenbits},xb=v(w,c.lens,0,19,c.lencode,0,c.work,yb),c.lenbits=yb.bits,xb){a.msg="invalid code lengths set",c.mode=lb;break}c.have=0,c.mode=ab;case ab:for(;c.have<c.nlen+c.ndist;){for(;Ab=c.lencode[m&(1<<c.lenbits)-1],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(16>sb)m>>>=qb,n-=qb,c.lens[c.have++]=sb;else{if(16===sb){for(zb=qb+2;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m>>>=qb,n-=qb,0===c.have){a.msg="invalid bit length repeat",c.mode=lb;break}wb=c.lens[c.have-1],q=3+(3&m),m>>>=2,n-=2}else if(17===sb){for(zb=qb+3;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=qb,n-=qb,wb=0,q=3+(7&m),m>>>=3,n-=3}else{for(zb=qb+7;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=qb,n-=qb,wb=0,q=11+(127&m),m>>>=7,n-=7}if(c.have+q>c.nlen+c.ndist){a.msg="invalid bit length repeat",c.mode=lb;break}for(;q--;)c.lens[c.have++]=wb}}if(c.mode===lb)break;if(0===c.lens[256]){a.msg="invalid code -- missing end-of-block",c.mode=lb;break}if(c.lenbits=9,yb={bits:c.lenbits},xb=v(x,c.lens,0,c.nlen,c.lencode,0,c.work,yb),c.lenbits=yb.bits,xb){a.msg="invalid literal/lengths set",c.mode=lb;break}if(c.distbits=6,c.distcode=c.distdyn,yb={bits:c.distbits},xb=v(y,c.lens,c.nlen,c.ndist,c.distcode,0,c.work,yb),c.distbits=yb.bits,xb){a.msg="invalid distances set",c.mode=lb;break}if(c.mode=bb,b===B)break a;case bb:c.mode=cb;case cb:if(i>=6&&j>=258){a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,u(a,p),h=a.next_out,f=a.output,j=a.avail_out,g=a.next_in,e=a.input,i=a.avail_in,m=c.hold,n=c.bits,c.mode===V&&(c.back=-1);break}for(c.back=0;Ab=c.lencode[m&(1<<c.lenbits)-1],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(rb&&0===(240&rb)){for(tb=qb,ub=rb,vb=sb;Ab=c.lencode[vb+((m&(1<<tb+ub)-1)>>tb)],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=tb+qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=tb,n-=tb,c.back+=tb}if(m>>>=qb,n-=qb,c.back+=qb,c.length=sb,0===rb){c.mode=hb;break}if(32&rb){c.back=-1,c.mode=V;break}if(64&rb){a.msg="invalid literal/length code",c.mode=lb;break}c.extra=15&rb,c.mode=db;case db:if(c.extra){for(zb=c.extra;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.length+=m&(1<<c.extra)-1,m>>>=c.extra,n-=c.extra,c.back+=c.extra}c.was=c.length,c.mode=eb;case eb:for(;Ab=c.distcode[m&(1<<c.distbits)-1],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(0===(240&rb)){for(tb=qb,ub=rb,vb=sb;Ab=c.distcode[vb+((m&(1<<tb+ub)-1)>>tb)],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=tb+qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=tb,n-=tb,c.back+=tb}if(m>>>=qb,n-=qb,c.back+=qb,64&rb){a.msg="invalid distance code",c.mode=lb;break}c.offset=sb,c.extra=15&rb,c.mode=fb;case fb:if(c.extra){for(zb=c.extra;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.offset+=m&(1<<c.extra)-1,m>>>=c.extra,n-=c.extra,c.back+=c.extra}if(c.offset>c.dmax){a.msg="invalid distance too far back",c.mode=lb;break}c.mode=gb;case gb:if(0===j)break a;
if(q=p-j,c.offset>q){if(q=c.offset-q,q>c.whave&&c.sane){a.msg="invalid distance too far back",c.mode=lb;break}q>c.wnext?(q-=c.wnext,ob=c.wsize-q):ob=c.wnext-q,q>c.length&&(q=c.length),pb=c.window}else pb=f,ob=h-c.offset,q=c.length;q>j&&(q=j),j-=q,c.length-=q;do f[h++]=pb[ob++];while(--q);0===c.length&&(c.mode=cb);break;case hb:if(0===j)break a;f[h++]=c.length,j--,c.mode=cb;break;case ib:if(c.wrap){for(;32>n;){if(0===i)break a;i--,m|=e[g++]<<n,n+=8}if(p-=j,a.total_out+=p,c.total+=p,p&&(a.adler=c.check=c.flags?t(c.check,f,p,h-p):s(c.check,f,p,h-p)),p=j,(c.flags?m:d(m))!==c.check){a.msg="incorrect data check",c.mode=lb;break}m=0,n=0}c.mode=jb;case jb:if(c.wrap&&c.flags){for(;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m!==(4294967295&c.total)){a.msg="incorrect length check",c.mode=lb;break}m=0,n=0}c.mode=kb;case kb:xb=D;break a;case lb:xb=G;break a;case mb:return H;case nb:default:return F}return a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,(c.wsize||p!==a.avail_out&&c.mode<lb&&(c.mode<ib||b!==z))&&l(a,a.output,a.next_out,p-a.avail_out)?(c.mode=mb,H):(o-=a.avail_in,p-=a.avail_out,a.total_in+=o,a.total_out+=p,c.total+=p,c.wrap&&p&&(a.adler=c.check=c.flags?t(c.check,f,p,a.next_out-p):s(c.check,f,p,a.next_out-p)),a.data_type=c.bits+(c.last?64:0)+(c.mode===V?128:0)+(c.mode===bb||c.mode===Y?256:0),(0===o&&0===p||b===z)&&xb===C&&(xb=I),xb)}function n(a){if(!a||!a.state)return F;var b=a.state;return b.window&&(b.window=null),a.state=null,C}function o(a,b){var c;return a&&a.state?(c=a.state,0===(2&c.wrap)?F:(c.head=b,b.done=!1,C)):F}var p,q,r=a("../utils/common"),s=a("./adler32"),t=a("./crc32"),u=a("./inffast"),v=a("./inftrees"),w=0,x=1,y=2,z=4,A=5,B=6,C=0,D=1,E=2,F=-2,G=-3,H=-4,I=-5,J=8,K=1,L=2,M=3,N=4,O=5,P=6,Q=7,R=8,S=9,T=10,U=11,V=12,W=13,X=14,Y=15,Z=16,$=17,_=18,ab=19,bb=20,cb=21,db=22,eb=23,fb=24,gb=25,hb=26,ib=27,jb=28,kb=29,lb=30,mb=31,nb=32,ob=852,pb=592,qb=15,rb=qb,sb=!0;c.inflateReset=g,c.inflateReset2=h,c.inflateResetKeep=f,c.inflateInit=j,c.inflateInit2=i,c.inflate=m,c.inflateEnd=n,c.inflateGetHeader=o,c.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":27,"./adler32":29,"./crc32":31,"./inffast":34,"./inftrees":36}],36:[function(a,b){"use strict";var c=a("../utils/common"),d=15,e=852,f=592,g=0,h=1,i=2,j=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],k=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],l=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],m=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];b.exports=function(a,b,n,o,p,q,r,s){var t,u,v,w,x,y,z,A,B,C=s.bits,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=null,O=0,P=new c.Buf16(d+1),Q=new c.Buf16(d+1),R=null,S=0;for(D=0;d>=D;D++)P[D]=0;for(E=0;o>E;E++)P[b[n+E]]++;for(H=C,G=d;G>=1&&0===P[G];G--);if(H>G&&(H=G),0===G)return p[q++]=20971520,p[q++]=20971520,s.bits=1,0;for(F=1;G>F&&0===P[F];F++);for(F>H&&(H=F),K=1,D=1;d>=D;D++)if(K<<=1,K-=P[D],0>K)return-1;if(K>0&&(a===g||1!==G))return-1;for(Q[1]=0,D=1;d>D;D++)Q[D+1]=Q[D]+P[D];for(E=0;o>E;E++)0!==b[n+E]&&(r[Q[b[n+E]]++]=E);if(a===g?(N=R=r,y=19):a===h?(N=j,O-=257,R=k,S-=257,y=256):(N=l,R=m,y=-1),M=0,E=0,D=F,x=q,I=H,J=0,v=-1,L=1<<H,w=L-1,a===h&&L>e||a===i&&L>f)return 1;for(var T=0;;){T++,z=D-J,r[E]<y?(A=0,B=r[E]):r[E]>y?(A=R[S+r[E]],B=N[O+r[E]]):(A=96,B=0),t=1<<D-J,u=1<<I,F=u;do u-=t,p[x+(M>>J)+u]=z<<24|A<<16|B|0;while(0!==u);for(t=1<<D-1;M&t;)t>>=1;if(0!==t?(M&=t-1,M+=t):M=0,E++,0===--P[D]){if(D===G)break;D=b[n+r[E]]}if(D>H&&(M&w)!==v){for(0===J&&(J=H),x+=F,I=D-J,K=1<<I;G>I+J&&(K-=P[I+J],!(0>=K));)I++,K<<=1;if(L+=1<<I,a===h&&L>e||a===i&&L>f)return 1;v=M&w,p[v]=H<<24|I<<16|x-q|0}}return 0!==M&&(p[x+M]=D-J<<24|64<<16|0),s.bits=H,0}},{"../utils/common":27}],37:[function(a,b){"use strict";b.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],38:[function(a,b,c){"use strict";function d(a){for(var b=a.length;--b>=0;)a[b]=0}function e(a){return 256>a?gb[a]:gb[256+(a>>>7)]}function f(a,b){a.pending_buf[a.pending++]=255&b,a.pending_buf[a.pending++]=b>>>8&255}function g(a,b,c){a.bi_valid>V-c?(a.bi_buf|=b<<a.bi_valid&65535,f(a,a.bi_buf),a.bi_buf=b>>V-a.bi_valid,a.bi_valid+=c-V):(a.bi_buf|=b<<a.bi_valid&65535,a.bi_valid+=c)}function h(a,b,c){g(a,c[2*b],c[2*b+1])}function i(a,b){var c=0;do c|=1&a,a>>>=1,c<<=1;while(--b>0);return c>>>1}function j(a){16===a.bi_valid?(f(a,a.bi_buf),a.bi_buf=0,a.bi_valid=0):a.bi_valid>=8&&(a.pending_buf[a.pending++]=255&a.bi_buf,a.bi_buf>>=8,a.bi_valid-=8)}function k(a,b){var c,d,e,f,g,h,i=b.dyn_tree,j=b.max_code,k=b.stat_desc.static_tree,l=b.stat_desc.has_stree,m=b.stat_desc.extra_bits,n=b.stat_desc.extra_base,o=b.stat_desc.max_length,p=0;for(f=0;U>=f;f++)a.bl_count[f]=0;for(i[2*a.heap[a.heap_max]+1]=0,c=a.heap_max+1;T>c;c++)d=a.heap[c],f=i[2*i[2*d+1]+1]+1,f>o&&(f=o,p++),i[2*d+1]=f,d>j||(a.bl_count[f]++,g=0,d>=n&&(g=m[d-n]),h=i[2*d],a.opt_len+=h*(f+g),l&&(a.static_len+=h*(k[2*d+1]+g)));if(0!==p){do{for(f=o-1;0===a.bl_count[f];)f--;a.bl_count[f]--,a.bl_count[f+1]+=2,a.bl_count[o]--,p-=2}while(p>0);for(f=o;0!==f;f--)for(d=a.bl_count[f];0!==d;)e=a.heap[--c],e>j||(i[2*e+1]!==f&&(a.opt_len+=(f-i[2*e+1])*i[2*e],i[2*e+1]=f),d--)}}function l(a,b,c){var d,e,f=new Array(U+1),g=0;for(d=1;U>=d;d++)f[d]=g=g+c[d-1]<<1;for(e=0;b>=e;e++){var h=a[2*e+1];0!==h&&(a[2*e]=i(f[h]++,h))}}function m(){var a,b,c,d,e,f=new Array(U+1);for(c=0,d=0;O-1>d;d++)for(ib[d]=c,a=0;a<1<<_[d];a++)hb[c++]=d;for(hb[c-1]=d,e=0,d=0;16>d;d++)for(jb[d]=e,a=0;a<1<<ab[d];a++)gb[e++]=d;for(e>>=7;R>d;d++)for(jb[d]=e<<7,a=0;a<1<<ab[d]-7;a++)gb[256+e++]=d;for(b=0;U>=b;b++)f[b]=0;for(a=0;143>=a;)eb[2*a+1]=8,a++,f[8]++;for(;255>=a;)eb[2*a+1]=9,a++,f[9]++;for(;279>=a;)eb[2*a+1]=7,a++,f[7]++;for(;287>=a;)eb[2*a+1]=8,a++,f[8]++;for(l(eb,Q+1,f),a=0;R>a;a++)fb[2*a+1]=5,fb[2*a]=i(a,5);kb=new nb(eb,_,P+1,Q,U),lb=new nb(fb,ab,0,R,U),mb=new nb(new Array(0),bb,0,S,W)}function n(a){var b;for(b=0;Q>b;b++)a.dyn_ltree[2*b]=0;for(b=0;R>b;b++)a.dyn_dtree[2*b]=0;for(b=0;S>b;b++)a.bl_tree[2*b]=0;a.dyn_ltree[2*X]=1,a.opt_len=a.static_len=0,a.last_lit=a.matches=0}function o(a){a.bi_valid>8?f(a,a.bi_buf):a.bi_valid>0&&(a.pending_buf[a.pending++]=a.bi_buf),a.bi_buf=0,a.bi_valid=0}function p(a,b,c,d){o(a),d&&(f(a,c),f(a,~c)),E.arraySet(a.pending_buf,a.window,b,c,a.pending),a.pending+=c}function q(a,b,c,d){var e=2*b,f=2*c;return a[e]<a[f]||a[e]===a[f]&&d[b]<=d[c]}function r(a,b,c){for(var d=a.heap[c],e=c<<1;e<=a.heap_len&&(e<a.heap_len&&q(b,a.heap[e+1],a.heap[e],a.depth)&&e++,!q(b,d,a.heap[e],a.depth));)a.heap[c]=a.heap[e],c=e,e<<=1;a.heap[c]=d}function s(a,b,c){var d,f,i,j,k=0;if(0!==a.last_lit)do d=a.pending_buf[a.d_buf+2*k]<<8|a.pending_buf[a.d_buf+2*k+1],f=a.pending_buf[a.l_buf+k],k++,0===d?h(a,f,b):(i=hb[f],h(a,i+P+1,b),j=_[i],0!==j&&(f-=ib[i],g(a,f,j)),d--,i=e(d),h(a,i,c),j=ab[i],0!==j&&(d-=jb[i],g(a,d,j)));while(k<a.last_lit);h(a,X,b)}function t(a,b){var c,d,e,f=b.dyn_tree,g=b.stat_desc.static_tree,h=b.stat_desc.has_stree,i=b.stat_desc.elems,j=-1;for(a.heap_len=0,a.heap_max=T,c=0;i>c;c++)0!==f[2*c]?(a.heap[++a.heap_len]=j=c,a.depth[c]=0):f[2*c+1]=0;for(;a.heap_len<2;)e=a.heap[++a.heap_len]=2>j?++j:0,f[2*e]=1,a.depth[e]=0,a.opt_len--,h&&(a.static_len-=g[2*e+1]);for(b.max_code=j,c=a.heap_len>>1;c>=1;c--)r(a,f,c);e=i;do c=a.heap[1],a.heap[1]=a.heap[a.heap_len--],r(a,f,1),d=a.heap[1],a.heap[--a.heap_max]=c,a.heap[--a.heap_max]=d,f[2*e]=f[2*c]+f[2*d],a.depth[e]=(a.depth[c]>=a.depth[d]?a.depth[c]:a.depth[d])+1,f[2*c+1]=f[2*d+1]=e,a.heap[1]=e++,r(a,f,1);while(a.heap_len>=2);a.heap[--a.heap_max]=a.heap[1],k(a,b),l(f,j,a.bl_count)}function u(a,b,c){var d,e,f=-1,g=b[1],h=0,i=7,j=4;for(0===g&&(i=138,j=3),b[2*(c+1)+1]=65535,d=0;c>=d;d++)e=g,g=b[2*(d+1)+1],++h<i&&e===g||(j>h?a.bl_tree[2*e]+=h:0!==e?(e!==f&&a.bl_tree[2*e]++,a.bl_tree[2*Y]++):10>=h?a.bl_tree[2*Z]++:a.bl_tree[2*$]++,h=0,f=e,0===g?(i=138,j=3):e===g?(i=6,j=3):(i=7,j=4))}function v(a,b,c){var d,e,f=-1,i=b[1],j=0,k=7,l=4;for(0===i&&(k=138,l=3),d=0;c>=d;d++)if(e=i,i=b[2*(d+1)+1],!(++j<k&&e===i)){if(l>j){do h(a,e,a.bl_tree);while(0!==--j)}else 0!==e?(e!==f&&(h(a,e,a.bl_tree),j--),h(a,Y,a.bl_tree),g(a,j-3,2)):10>=j?(h(a,Z,a.bl_tree),g(a,j-3,3)):(h(a,$,a.bl_tree),g(a,j-11,7));j=0,f=e,0===i?(k=138,l=3):e===i?(k=6,l=3):(k=7,l=4)}}function w(a){var b;for(u(a,a.dyn_ltree,a.l_desc.max_code),u(a,a.dyn_dtree,a.d_desc.max_code),t(a,a.bl_desc),b=S-1;b>=3&&0===a.bl_tree[2*cb[b]+1];b--);return a.opt_len+=3*(b+1)+5+5+4,b}function x(a,b,c,d){var e;for(g(a,b-257,5),g(a,c-1,5),g(a,d-4,4),e=0;d>e;e++)g(a,a.bl_tree[2*cb[e]+1],3);v(a,a.dyn_ltree,b-1),v(a,a.dyn_dtree,c-1)}function y(a){var b,c=4093624447;for(b=0;31>=b;b++,c>>>=1)if(1&c&&0!==a.dyn_ltree[2*b])return G;if(0!==a.dyn_ltree[18]||0!==a.dyn_ltree[20]||0!==a.dyn_ltree[26])return H;for(b=32;P>b;b++)if(0!==a.dyn_ltree[2*b])return H;return G}function z(a){pb||(m(),pb=!0),a.l_desc=new ob(a.dyn_ltree,kb),a.d_desc=new ob(a.dyn_dtree,lb),a.bl_desc=new ob(a.bl_tree,mb),a.bi_buf=0,a.bi_valid=0,n(a)}function A(a,b,c,d){g(a,(J<<1)+(d?1:0),3),p(a,b,c,!0)}function B(a){g(a,K<<1,3),h(a,X,eb),j(a)}function C(a,b,c,d){var e,f,h=0;a.level>0?(a.strm.data_type===I&&(a.strm.data_type=y(a)),t(a,a.l_desc),t(a,a.d_desc),h=w(a),e=a.opt_len+3+7>>>3,f=a.static_len+3+7>>>3,e>=f&&(e=f)):e=f=c+5,e>=c+4&&-1!==b?A(a,b,c,d):a.strategy===F||f===e?(g(a,(K<<1)+(d?1:0),3),s(a,eb,fb)):(g(a,(L<<1)+(d?1:0),3),x(a,a.l_desc.max_code+1,a.d_desc.max_code+1,h+1),s(a,a.dyn_ltree,a.dyn_dtree)),n(a),d&&o(a)}function D(a,b,c){return a.pending_buf[a.d_buf+2*a.last_lit]=b>>>8&255,a.pending_buf[a.d_buf+2*a.last_lit+1]=255&b,a.pending_buf[a.l_buf+a.last_lit]=255&c,a.last_lit++,0===b?a.dyn_ltree[2*c]++:(a.matches++,b--,a.dyn_ltree[2*(hb[c]+P+1)]++,a.dyn_dtree[2*e(b)]++),a.last_lit===a.lit_bufsize-1}var E=a("../utils/common"),F=4,G=0,H=1,I=2,J=0,K=1,L=2,M=3,N=258,O=29,P=256,Q=P+1+O,R=30,S=19,T=2*Q+1,U=15,V=16,W=7,X=256,Y=16,Z=17,$=18,_=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],ab=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],bb=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],cb=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],db=512,eb=new Array(2*(Q+2));d(eb);var fb=new Array(2*R);d(fb);var gb=new Array(db);d(gb);var hb=new Array(N-M+1);d(hb);var ib=new Array(O);d(ib);var jb=new Array(R);d(jb);var kb,lb,mb,nb=function(a,b,c,d,e){this.static_tree=a,this.extra_bits=b,this.extra_base=c,this.elems=d,this.max_length=e,this.has_stree=a&&a.length},ob=function(a,b){this.dyn_tree=a,this.max_code=0,this.stat_desc=b},pb=!1;c._tr_init=z,c._tr_stored_block=A,c._tr_flush_block=C,c._tr_tally=D,c._tr_align=B},{"../utils/common":27}],39:[function(a,b){"use strict";function c(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}b.exports=c},{}]},{},[9])(9)});
/*! splitview.js v0.3 <https://github.com/luisreyes/splitview.js> Luis Reyes <luis@luisreyes.com> ©2014 MIT License !*/
var splitview=function(){"use strict";function e(e){var t=e||{};u=document.getElementById(t.main),u.className+=" sv-split-space",v=document.createElement("div"),w=v.cloneNode(),E=v.cloneNode(),L=v.cloneNode(),w.id="vg",E.id="hgl",L.id="hgr",w.className="sv-v sv-grip",E.className="sv-hl sv-grip",L.className="sv-hr sv-grip",u.appendChild(w),u.appendChild(E),u.appendChild(L),x[0]=document.getElementById(t.containers.tl),x[1]=document.getElementById(t.containers.tr),x[2]=document.getElementById(t.containers.bl),x[3]=document.getElementById(t.containers.br),x[0].className+=" sv-container sv-tl",x[1].className+=" sv-container sv-tr",x[2].className+=" sv-container sv-bl",x[3].className+=" sv-container sv-br",document.addEventListener("mousemove",n),document.addEventListener("mouseup",i),document.addEventListener("touchmove",n,!1),document.addEventListener("touchend",i,!1),s(w),s(L),s(E);var l;l=t.layout?t.layout.split(","):d("layout").split(","),a(l),splitview.dispatchEvent("ready")}function t(e){return e.pageX||e.pageY?{x:e.pageX,y:e.pageY}:{x:e.clientX+document.body.scrollLeft-document.body.clientLeft,y:e.clientY+document.body.scrollTop-document.body.clientTop}}function n(e){if(e=e||window.event,e.preventDefault(),r(),m=t(e),h){var n=(m.y-y.y)/g*100,i=(m.x-y.x)/f*100;return l(p,n,i)&&("h"===p?h.style.top=n+"%":h.style.left=i+"%",c(p,m)),!1}}function l(e,t,n){return"h"===e?t<100-b.tb&&t>b.tb:n<100-b.lr&&n>b.lr}function i(){h=null,splitview.dispatchEvent("resizestop")}function s(e){e&&(e.addEventListener("mousedown",o),e.addEventListener("touchstart",o))}function o(e){return h=e.target,p=h.classList[0].substr(3,1),y={x:u.offsetLeft,y:u.offsetTop},splitview.dispatchEvent("resizestart"),!1}function r(){f=u.clientWidth,g=u.clientHeight}function c(e,t){if(r(),"h"===e){var n=(t.y-y.y)/g*100+"%",l=100-(t.y-y.y)/g*100+"%";"hgl"===h.id?(x[0].style.height=n,x[2].style.top=n,x[2].style.height=l):"hgr"===h.id&&(x[1].style.height=n,x[3].style.top=n,x[3].style.height=l),splitview.dispatchEvent("resizehorizontal")}else{var i=(t.x-y.x)/f*100+"%",s=100-(t.x-y.x)/f*100+"%";x[0].style.width=i,x[2].style.width=i,E.style.width=i,L.style.width=s,x[1].style.width=s,x[3].style.width=s,splitview.dispatchEvent("resizevertical")}splitview.dispatchEvent("resize")}function a(e){var t=e[0]||50,n=e[1]||50,l=e[2]||50,i=n+"%",s=100-n+"%";x[0].style.width=i,x[2].style.width=i,w.style.left=i,E.style.width=i,L.style.width=s,x[1].style.width=s,x[3].style.width=s;var o=t+"%",r=100-t+"%",c=l+"%",a=100-l+"%";x[0].style.height=o,x[2].style.top=o,x[2].style.height=r,x[1].style.height=c,x[3].style.top=c,x[3].style.height=a,E.style.top=o,L.style.top=c,splitview.dispatchEvent("resize")}function d(e){e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var t=new RegExp("[\\?&]"+e+"=([^&#]*)"),n=t.exec(location.search);return null===n?"":decodeURIComponent(n[1].replace(/\+/g," "))}var u=null,v=null,h=null,p=null,y=null,m=null,f=null,g=null,w=null,E=null,L=null,b={tb:2.5,lr:5},x=[],N=[];return{init:function(t){e(t)},setLayout:function(){a(arguments)},addEventListener:function(e,t){N[e]=N[e]||[],N[e]&&N[e].push(t)},removeEventListener:function(e,t){if(N[e])for(var n=N[e],l=n.length-1;l>=0;--l)if(n[l]===t)return n.splice(l,1),!0;return!1},dispatchEvent:function(e){if(N[e])for(var t=N[e],n=t.length;n--;)t[n]({event:e,caller:this})}}}();