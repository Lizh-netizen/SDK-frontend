(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["web-see"] = factory());
})(this, (function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    var uaParserExports = {};
    var uaParser = {
      get exports(){ return uaParserExports; },
      set exports(v){ uaParserExports = v; },
    };

    (function (module, exports) {
    	/////////////////////////////////////////////////////////////////////////////////
    	/* UAParser.js v1.0.32
    	   Copyright © 2012-2021 Faisal Salman <f@faisalman.com>
    	   MIT License *//*
    	   Detect Browser, Engine, OS, CPU, and Device type/model from User-Agent data.
    	   Supports browser & node.js environment. 
    	   Demo   : https://faisalman.github.io/ua-parser-js
    	   Source : https://github.com/faisalman/ua-parser-js */
    	/////////////////////////////////////////////////////////////////////////////////

    	(function (window, undefined$1) {

    	    //////////////
    	    // Constants
    	    /////////////


    	    var LIBVERSION  = '1.0.32',
    	        EMPTY       = '',
    	        UNKNOWN     = '?',
    	        FUNC_TYPE   = 'function',
    	        UNDEF_TYPE  = 'undefined',
    	        OBJ_TYPE    = 'object',
    	        STR_TYPE    = 'string',
    	        MAJOR       = 'major',
    	        MODEL       = 'model',
    	        NAME        = 'name',
    	        TYPE        = 'type',
    	        VENDOR      = 'vendor',
    	        VERSION     = 'version',
    	        ARCHITECTURE= 'architecture',
    	        CONSOLE     = 'console',
    	        MOBILE      = 'mobile',
    	        TABLET      = 'tablet',
    	        SMARTTV     = 'smarttv',
    	        WEARABLE    = 'wearable',
    	        EMBEDDED    = 'embedded',
    	        UA_MAX_LENGTH = 350;

    	    var AMAZON  = 'Amazon',
    	        APPLE   = 'Apple',
    	        ASUS    = 'ASUS',
    	        BLACKBERRY = 'BlackBerry',
    	        BROWSER = 'Browser',
    	        CHROME  = 'Chrome',
    	        EDGE    = 'Edge',
    	        FIREFOX = 'Firefox',
    	        GOOGLE  = 'Google',
    	        HUAWEI  = 'Huawei',
    	        LG      = 'LG',
    	        MICROSOFT = 'Microsoft',
    	        MOTOROLA  = 'Motorola',
    	        OPERA   = 'Opera',
    	        SAMSUNG = 'Samsung',
    	        SHARP   = 'Sharp',
    	        SONY    = 'Sony',
    	        XIAOMI  = 'Xiaomi',
    	        ZEBRA   = 'Zebra',
    	        FACEBOOK   = 'Facebook';

    	    ///////////
    	    // Helper
    	    //////////

    	    var extend = function (regexes, extensions) {
    	            var mergedRegexes = {};
    	            for (var i in regexes) {
    	                if (extensions[i] && extensions[i].length % 2 === 0) {
    	                    mergedRegexes[i] = extensions[i].concat(regexes[i]);
    	                } else {
    	                    mergedRegexes[i] = regexes[i];
    	                }
    	            }
    	            return mergedRegexes;
    	        },
    	        enumerize = function (arr) {
    	            var enums = {};
    	            for (var i=0; i<arr.length; i++) {
    	                enums[arr[i].toUpperCase()] = arr[i];
    	            }
    	            return enums;
    	        },
    	        has = function (str1, str2) {
    	            return typeof str1 === STR_TYPE ? lowerize(str2).indexOf(lowerize(str1)) !== -1 : false;
    	        },
    	        lowerize = function (str) {
    	            return str.toLowerCase();
    	        },
    	        majorize = function (version) {
    	            return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g, EMPTY).split('.')[0] : undefined$1;
    	        },
    	        trim = function (str, len) {
    	            if (typeof(str) === STR_TYPE) {
    	                str = str.replace(/^\s\s*/, EMPTY).replace(/\s\s*$/, EMPTY);
    	                return typeof(len) === UNDEF_TYPE ? str : str.substring(0, UA_MAX_LENGTH);
    	            }
    	    };

    	    ///////////////
    	    // Map helper
    	    //////////////

    	    var rgxMapper = function (ua, arrays) {

    	            var i = 0, j, k, p, q, matches, match;

    	            // loop through all regexes maps
    	            while (i < arrays.length && !matches) {

    	                var regex = arrays[i],       // even sequence (0,2,4,..)
    	                    props = arrays[i + 1];   // odd sequence (1,3,5,..)
    	                j = k = 0;

    	                // try matching uastring with regexes
    	                while (j < regex.length && !matches) {

    	                    matches = regex[j++].exec(ua);

    	                    if (!!matches) {
    	                        for (p = 0; p < props.length; p++) {
    	                            match = matches[++k];
    	                            q = props[p];
    	                            // check if given property is actually array
    	                            if (typeof q === OBJ_TYPE && q.length > 0) {
    	                                if (q.length === 2) {
    	                                    if (typeof q[1] == FUNC_TYPE) {
    	                                        // assign modified match
    	                                        this[q[0]] = q[1].call(this, match);
    	                                    } else {
    	                                        // assign given value, ignore regex match
    	                                        this[q[0]] = q[1];
    	                                    }
    	                                } else if (q.length === 3) {
    	                                    // check whether function or regex
    	                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
    	                                        // call function (usually string mapper)
    	                                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined$1;
    	                                    } else {
    	                                        // sanitize match using given regex
    	                                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined$1;
    	                                    }
    	                                } else if (q.length === 4) {
    	                                        this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined$1;
    	                                }
    	                            } else {
    	                                this[q] = match ? match : undefined$1;
    	                            }
    	                        }
    	                    }
    	                }
    	                i += 2;
    	            }
    	        },

    	        strMapper = function (str, map) {

    	            for (var i in map) {
    	                // check if current value is array
    	                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
    	                    for (var j = 0; j < map[i].length; j++) {
    	                        if (has(map[i][j], str)) {
    	                            return (i === UNKNOWN) ? undefined$1 : i;
    	                        }
    	                    }
    	                } else if (has(map[i], str)) {
    	                    return (i === UNKNOWN) ? undefined$1 : i;
    	                }
    	            }
    	            return str;
    	    };

    	    ///////////////
    	    // String map
    	    //////////////

    	    // Safari < 3.0
    	    var oldSafariMap = {
    	            '1.0'   : '/8',
    	            '1.2'   : '/1',
    	            '1.3'   : '/3',
    	            '2.0'   : '/412',
    	            '2.0.2' : '/416',
    	            '2.0.3' : '/417',
    	            '2.0.4' : '/419',
    	            '?'     : '/'
    	        },
    	        windowsVersionMap = {
    	            'ME'        : '4.90',
    	            'NT 3.11'   : 'NT3.51',
    	            'NT 4.0'    : 'NT4.0',
    	            '2000'      : 'NT 5.0',
    	            'XP'        : ['NT 5.1', 'NT 5.2'],
    	            'Vista'     : 'NT 6.0',
    	            '7'         : 'NT 6.1',
    	            '8'         : 'NT 6.2',
    	            '8.1'       : 'NT 6.3',
    	            '10'        : ['NT 6.4', 'NT 10.0'],
    	            'RT'        : 'ARM'
    	    };

    	    //////////////
    	    // Regex map
    	    /////////////

    	    var regexes = {

    	        browser : [[

    	            /\b(?:crmo|crios)\/([\w\.]+)/i                                      // Chrome for Android/iOS
    	            ], [VERSION, [NAME, 'Chrome']], [
    	            /edg(?:e|ios|a)?\/([\w\.]+)/i                                       // Microsoft Edge
    	            ], [VERSION, [NAME, 'Edge']], [

    	            // Presto based
    	            /(opera mini)\/([-\w\.]+)/i,                                        // Opera Mini
    	            /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,                 // Opera Mobi/Tablet
    	            /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i                           // Opera
    	            ], [NAME, VERSION], [
    	            /opios[\/ ]+([\w\.]+)/i                                             // Opera mini on iphone >= 8.0
    	            ], [VERSION, [NAME, OPERA+' Mini']], [
    	            /\bopr\/([\w\.]+)/i                                                 // Opera Webkit
    	            ], [VERSION, [NAME, OPERA]], [

    	            // Mixed
    	            /(kindle)\/([\w\.]+)/i,                                             // Kindle
    	            /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,      // Lunascape/Maxthon/Netfront/Jasmine/Blazer
    	            // Trident based
    	            /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,               // Avant/IEMobile/SlimBrowser
    	            /(ba?idubrowser)[\/ ]?([\w\.]+)/i,                                  // Baidu Browser
    	            /(?:ms|\()(ie) ([\w\.]+)/i,                                         // Internet Explorer

    	            // Webkit/KHTML based                                               // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
    	            /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,
    	                                                                                // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ, aka ShouQ
    	            /(weibo)__([\d\.]+)/i                                               // Weibo
    	            ], [NAME, VERSION], [
    	            /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i                 // UCBrowser
    	            ], [VERSION, [NAME, 'UC'+BROWSER]], [
    	            /microm.+\bqbcore\/([\w\.]+)/i,                                     // WeChat Desktop for Windows Built-in Browser
    	            /\bqbcore\/([\w\.]+).+microm/i
    	            ], [VERSION, [NAME, 'WeChat(Win) Desktop']], [
    	            /micromessenger\/([\w\.]+)/i                                        // WeChat
    	            ], [VERSION, [NAME, 'WeChat']], [
    	            /konqueror\/([\w\.]+)/i                                             // Konqueror
    	            ], [VERSION, [NAME, 'Konqueror']], [
    	            /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i                       // IE11
    	            ], [VERSION, [NAME, 'IE']], [
    	            /yabrowser\/([\w\.]+)/i                                             // Yandex
    	            ], [VERSION, [NAME, 'Yandex']], [
    	            /(avast|avg)\/([\w\.]+)/i                                           // Avast/AVG Secure Browser
    	            ], [[NAME, /(.+)/, '$1 Secure '+BROWSER], VERSION], [
    	            /\bfocus\/([\w\.]+)/i                                               // Firefox Focus
    	            ], [VERSION, [NAME, FIREFOX+' Focus']], [
    	            /\bopt\/([\w\.]+)/i                                                 // Opera Touch
    	            ], [VERSION, [NAME, OPERA+' Touch']], [
    	            /coc_coc\w+\/([\w\.]+)/i                                            // Coc Coc Browser
    	            ], [VERSION, [NAME, 'Coc Coc']], [
    	            /dolfin\/([\w\.]+)/i                                                // Dolphin
    	            ], [VERSION, [NAME, 'Dolphin']], [
    	            /coast\/([\w\.]+)/i                                                 // Opera Coast
    	            ], [VERSION, [NAME, OPERA+' Coast']], [
    	            /miuibrowser\/([\w\.]+)/i                                           // MIUI Browser
    	            ], [VERSION, [NAME, 'MIUI '+BROWSER]], [
    	            /fxios\/([-\w\.]+)/i                                                // Firefox for iOS
    	            ], [VERSION, [NAME, FIREFOX]], [
    	            /\bqihu|(qi?ho?o?|360)browser/i                                     // 360
    	            ], [[NAME, '360 '+BROWSER]], [
    	            /(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i
    	            ], [[NAME, /(.+)/, '$1 '+BROWSER], VERSION], [                      // Oculus/Samsung/Sailfish/Huawei Browser
    	            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
    	            ], [[NAME, /_/g, ' '], VERSION], [
    	            /(electron)\/([\w\.]+) safari/i,                                    // Electron-based App
    	            /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,                   // Tesla
    	            /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i            // QQBrowser/Baidu App/2345 Browser
    	            ], [NAME, VERSION], [
    	            /(metasr)[\/ ]?([\w\.]+)/i,                                         // SouGouBrowser
    	            /(lbbrowser)/i,                                                     // LieBao Browser
    	            /\[(linkedin)app\]/i                                                // LinkedIn App for iOS & Android
    	            ], [NAME], [

    	            // WebView
    	            /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i       // Facebook App for iOS & Android
    	            ], [[NAME, FACEBOOK], VERSION], [
    	            /safari (line)\/([\w\.]+)/i,                                        // Line App for iOS
    	            /\b(line)\/([\w\.]+)\/iab/i,                                        // Line App for Android
    	            /(chromium|instagram)[\/ ]([-\w\.]+)/i                              // Chromium/Instagram
    	            ], [NAME, VERSION], [
    	            /\bgsa\/([\w\.]+) .*safari\//i                                      // Google Search Appliance on iOS
    	            ], [VERSION, [NAME, 'GSA']], [

    	            /headlesschrome(?:\/([\w\.]+)| )/i                                  // Chrome Headless
    	            ], [VERSION, [NAME, CHROME+' Headless']], [

    	            / wv\).+(chrome)\/([\w\.]+)/i                                       // Chrome WebView
    	            ], [[NAME, CHROME+' WebView'], VERSION], [

    	            /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i           // Android Browser
    	            ], [VERSION, [NAME, 'Android '+BROWSER]], [

    	            /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i       // Chrome/OmniWeb/Arora/Tizen/Nokia
    	            ], [NAME, VERSION], [

    	            /version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i                      // Mobile Safari
    	            ], [VERSION, [NAME, 'Mobile Safari']], [
    	            /version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i                // Safari & Safari Mobile
    	            ], [VERSION, NAME], [
    	            /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i                      // Safari < 3.0
    	            ], [NAME, [VERSION, strMapper, oldSafariMap]], [

    	            /(webkit|khtml)\/([\w\.]+)/i
    	            ], [NAME, VERSION], [

    	            // Gecko based
    	            /(navigator|netscape\d?)\/([-\w\.]+)/i                              // Netscape
    	            ], [[NAME, 'Netscape'], VERSION], [
    	            /mobile vr; rv:([\w\.]+)\).+firefox/i                               // Firefox Reality
    	            ], [VERSION, [NAME, FIREFOX+' Reality']], [
    	            /ekiohf.+(flow)\/([\w\.]+)/i,                                       // Flow
    	            /(swiftfox)/i,                                                      // Swiftfox
    	            /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
    	                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror/Klar
    	            /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
    	                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
    	            /(firefox)\/([\w\.]+)/i,                                            // Other Firefox-based
    	            /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,                         // Mozilla

    	            // Other
    	            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
    	                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir/Obigo/Mosaic/Go/ICE/UP.Browser
    	            /(links) \(([\w\.]+)/i                                              // Links
    	            ], [NAME, VERSION]
    	        ],

    	        cpu : [[

    	            /(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i                     // AMD64 (x64)
    	            ], [[ARCHITECTURE, 'amd64']], [

    	            /(ia32(?=;))/i                                                      // IA32 (quicktime)
    	            ], [[ARCHITECTURE, lowerize]], [

    	            /((?:i[346]|x)86)[;\)]/i                                            // IA32 (x86)
    	            ], [[ARCHITECTURE, 'ia32']], [

    	            /\b(aarch64|arm(v?8e?l?|_?64))\b/i                                 // ARM64
    	            ], [[ARCHITECTURE, 'arm64']], [

    	            /\b(arm(?:v[67])?ht?n?[fl]p?)\b/i                                   // ARMHF
    	            ], [[ARCHITECTURE, 'armhf']], [

    	            // PocketPC mistakenly identified as PowerPC
    	            /windows (ce|mobile); ppc;/i
    	            ], [[ARCHITECTURE, 'arm']], [

    	            /((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i                            // PowerPC
    	            ], [[ARCHITECTURE, /ower/, EMPTY, lowerize]], [

    	            /(sun4\w)[;\)]/i                                                    // SPARC
    	            ], [[ARCHITECTURE, 'sparc']], [

    	            /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i
    	                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
    	            ], [[ARCHITECTURE, lowerize]]
    	        ],

    	        device : [[

    	            //////////////////////////
    	            // MOBILES & TABLETS
    	            // Ordered by popularity
    	            /////////////////////////

    	            // Samsung
    	            /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
    	            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, TABLET]], [
    	            /\b((?:s[cgp]h|gt|sm)-\w+|galaxy nexus)/i,
    	            /samsung[- ]([-\w]+)/i,
    	            /sec-(sgh\w+)/i
    	            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, MOBILE]], [

    	            // Apple
    	            /\((ip(?:hone|od)[\w ]*);/i                                         // iPod/iPhone
    	            ], [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]], [
    	            /\((ipad);[-\w\),; ]+apple/i,                                       // iPad
    	            /applecoremedia\/[\w\.]+ \((ipad)/i,
    	            /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
    	            ], [MODEL, [VENDOR, APPLE], [TYPE, TABLET]], [

    	            // Huawei
    	            /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
    	            ], [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]], [
    	            /(?:huawei|honor)([-\w ]+)[;\)]/i,
    	            /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
    	            ], [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]], [

    	            // Xiaomi
    	            /\b(poco[\w ]+)(?: bui|\))/i,                                       // Xiaomi POCO
    	            /\b; (\w+) build\/hm\1/i,                                           // Xiaomi Hongmi 'numeric' models
    	            /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,                             // Xiaomi Hongmi
    	            /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,                   // Xiaomi Redmi
    	            /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i // Xiaomi Mi
    	            ], [[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, MOBILE]], [
    	            /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i                        // Mi Pad tablets
    	            ],[[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, TABLET]], [

    	            // OPPO
    	            /; (\w+) bui.+ oppo/i,
    	            /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
    	            ], [MODEL, [VENDOR, 'OPPO'], [TYPE, MOBILE]], [

    	            // Vivo
    	            /vivo (\w+)(?: bui|\))/i,
    	            /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
    	            ], [MODEL, [VENDOR, 'Vivo'], [TYPE, MOBILE]], [

    	            // Realme
    	            /\b(rmx[12]\d{3})(?: bui|;|\))/i
    	            ], [MODEL, [VENDOR, 'Realme'], [TYPE, MOBILE]], [

    	            // Motorola
    	            /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
    	            /\bmot(?:orola)?[- ](\w*)/i,
    	            /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
    	            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, MOBILE]], [
    	            /\b(mz60\d|xoom[2 ]{0,2}) build\//i
    	            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, TABLET]], [

    	            // LG
    	            /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
    	            ], [MODEL, [VENDOR, LG], [TYPE, TABLET]], [
    	            /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
    	            /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
    	            /\blg-?([\d\w]+) bui/i
    	            ], [MODEL, [VENDOR, LG], [TYPE, MOBILE]], [

    	            // Lenovo
    	            /(ideatab[-\w ]+)/i,
    	            /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
    	            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [

    	            // Nokia
    	            /(?:maemo|nokia).*(n900|lumia \d+)/i,
    	            /nokia[-_ ]?([-\w\.]*)/i
    	            ], [[MODEL, /_/g, ' '], [VENDOR, 'Nokia'], [TYPE, MOBILE]], [

    	            // Google
    	            /(pixel c)\b/i                                                      // Google Pixel C
    	            ], [MODEL, [VENDOR, GOOGLE], [TYPE, TABLET]], [
    	            /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i                         // Google Pixel
    	            ], [MODEL, [VENDOR, GOOGLE], [TYPE, MOBILE]], [

    	            // Sony
    	            /droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
    	            ], [MODEL, [VENDOR, SONY], [TYPE, MOBILE]], [
    	            /sony tablet [ps]/i,
    	            /\b(?:sony)?sgp\w+(?: bui|\))/i
    	            ], [[MODEL, 'Xperia Tablet'], [VENDOR, SONY], [TYPE, TABLET]], [

    	            // OnePlus
    	            / (kb2005|in20[12]5|be20[12][59])\b/i,
    	            /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
    	            ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [

    	            // Amazon
    	            /(alexa)webm/i,
    	            /(kf[a-z]{2}wi)( bui|\))/i,                                         // Kindle Fire without Silk
    	            /(kf[a-z]+)( bui|\)).+silk\//i                                      // Kindle Fire HD
    	            ], [MODEL, [VENDOR, AMAZON], [TYPE, TABLET]], [
    	            /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i                     // Fire Phone
    	            ], [[MODEL, /(.+)/g, 'Fire Phone $1'], [VENDOR, AMAZON], [TYPE, MOBILE]], [

    	            // BlackBerry
    	            /(playbook);[-\w\),; ]+(rim)/i                                      // BlackBerry PlayBook
    	            ], [MODEL, VENDOR, [TYPE, TABLET]], [
    	            /\b((?:bb[a-f]|st[hv])100-\d)/i,
    	            /\(bb10; (\w+)/i                                                    // BlackBerry 10
    	            ], [MODEL, [VENDOR, BLACKBERRY], [TYPE, MOBILE]], [

    	            // Asus
    	            /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
    	            ], [MODEL, [VENDOR, ASUS], [TYPE, TABLET]], [
    	            / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
    	            ], [MODEL, [VENDOR, ASUS], [TYPE, MOBILE]], [

    	            // HTC
    	            /(nexus 9)/i                                                        // HTC Nexus 9
    	            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [
    	            /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,                         // HTC

    	            // ZTE
    	            /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
    	            /(alcatel|geeksphone|nexian|panasonic|sony(?!-bra))[-_ ]?([-\w]*)/i         // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
    	            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

    	            // Acer
    	            /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
    	            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

    	            // Meizu
    	            /droid.+; (m[1-5] note) bui/i,
    	            /\bmz-([-\w]{2,})/i
    	            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, MOBILE]], [

    	            // Sharp
    	            /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
    	            ], [MODEL, [VENDOR, SHARP], [TYPE, MOBILE]], [

    	            // MIXED
    	            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i,
    	                                                                                // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
    	            /(hp) ([\w ]+\w)/i,                                                 // HP iPAQ
    	            /(asus)-?(\w+)/i,                                                   // Asus
    	            /(microsoft); (lumia[\w ]+)/i,                                      // Microsoft Lumia
    	            /(lenovo)[-_ ]?([-\w]+)/i,                                          // Lenovo
    	            /(jolla)/i,                                                         // Jolla
    	            /(oppo) ?([\w ]+) bui/i                                             // OPPO
    	            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

    	            /(archos) (gamepad2?)/i,                                            // Archos
    	            /(hp).+(touchpad(?!.+tablet)|tablet)/i,                             // HP TouchPad
    	            /(kindle)\/([\w\.]+)/i,                                             // Kindle
    	            /(nook)[\w ]+build\/(\w+)/i,                                        // Nook
    	            /(dell) (strea[kpr\d ]*[\dko])/i,                                   // Dell Streak
    	            /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,                                  // Le Pan Tablets
    	            /(trinity)[- ]*(t\d{3}) bui/i,                                      // Trinity Tablets
    	            /(gigaset)[- ]+(q\w{1,9}) bui/i,                                    // Gigaset Tablets
    	            /(vodafone) ([\w ]+)(?:\)| bui)/i                                   // Vodafone
    	            ], [VENDOR, MODEL, [TYPE, TABLET]], [

    	            /(surface duo)/i                                                    // Surface Duo
    	            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, TABLET]], [
    	            /droid [\d\.]+; (fp\du?)(?: b|\))/i                                 // Fairphone
    	            ], [MODEL, [VENDOR, 'Fairphone'], [TYPE, MOBILE]], [
    	            /(u304aa)/i                                                         // AT&T
    	            ], [MODEL, [VENDOR, 'AT&T'], [TYPE, MOBILE]], [
    	            /\bsie-(\w*)/i                                                      // Siemens
    	            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [
    	            /\b(rct\w+) b/i                                                     // RCA Tablets
    	            ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [
    	            /\b(venue[\d ]{2,7}) b/i                                            // Dell Venue Tablets
    	            ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [
    	            /\b(q(?:mv|ta)\w+) b/i                                              // Verizon Tablet
    	            ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [
    	            /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i                       // Barnes & Noble Tablet
    	            ], [MODEL, [VENDOR, 'Barnes & Noble'], [TYPE, TABLET]], [
    	            /\b(tm\d{3}\w+) b/i
    	            ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [
    	            /\b(k88) b/i                                                        // ZTE K Series Tablet
    	            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, TABLET]], [
    	            /\b(nx\d{3}j) b/i                                                   // ZTE Nubia
    	            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [
    	            /\b(gen\d{3}) b.+49h/i                                              // Swiss GEN Mobile
    	            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [
    	            /\b(zur\d{3}) b/i                                                   // Swiss ZUR Tablet
    	            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [
    	            /\b((zeki)?tb.*\b) b/i                                              // Zeki Tablets
    	            ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [
    	            /\b([yr]\d{2}) b/i,
    	            /\b(dragon[- ]+touch |dt)(\w{5}) b/i                                // Dragon Touch Tablet
    	            ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [
    	            /\b(ns-?\w{0,9}) b/i                                                // Insignia Tablets
    	            ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [
    	            /\b((nxa|next)-?\w{0,9}) b/i                                        // NextBook Tablets
    	            ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [
    	            /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i                  // Voice Xtreme Phones
    	            ], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [
    	            /\b(lvtel\-)?(v1[12]) b/i                                           // LvTel Phones
    	            ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [
    	            /\b(ph-1) /i                                                        // Essential PH-1
    	            ], [MODEL, [VENDOR, 'Essential'], [TYPE, MOBILE]], [
    	            /\b(v(100md|700na|7011|917g).*\b) b/i                               // Envizen Tablets
    	            ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [
    	            /\b(trio[-\w\. ]+) b/i                                              // MachSpeed Tablets
    	            ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [
    	            /\btu_(1491) b/i                                                    // Rotor Tablets
    	            ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [
    	            /(shield[\w ]+) b/i                                                 // Nvidia Shield Tablets
    	            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, TABLET]], [
    	            /(sprint) (\w+)/i                                                   // Sprint Phones
    	            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
    	            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
    	            ], [[MODEL, /\./g, ' '], [VENDOR, MICROSOFT], [TYPE, MOBILE]], [
    	            /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i             // Zebra
    	            ], [MODEL, [VENDOR, ZEBRA], [TYPE, TABLET]], [
    	            /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
    	            ], [MODEL, [VENDOR, ZEBRA], [TYPE, MOBILE]], [

    	            ///////////////////
    	            // CONSOLES
    	            ///////////////////

    	            /(ouya)/i,                                                          // Ouya
    	            /(nintendo) ([wids3utch]+)/i                                        // Nintendo
    	            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [
    	            /droid.+; (shield) bui/i                                            // Nvidia
    	            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [
    	            /(playstation [345portablevi]+)/i                                   // Playstation
    	            ], [MODEL, [VENDOR, SONY], [TYPE, CONSOLE]], [
    	            /\b(xbox(?: one)?(?!; xbox))[\); ]/i                                // Microsoft Xbox
    	            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, CONSOLE]], [

    	            ///////////////////
    	            // SMARTTVS
    	            ///////////////////

    	            /smart-tv.+(samsung)/i                                              // Samsung
    	            ], [VENDOR, [TYPE, SMARTTV]], [
    	            /hbbtv.+maple;(\d+)/i
    	            ], [[MODEL, /^/, 'SmartTV'], [VENDOR, SAMSUNG], [TYPE, SMARTTV]], [
    	            /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i        // LG SmartTV
    	            ], [[VENDOR, LG], [TYPE, SMARTTV]], [
    	            /(apple) ?tv/i                                                      // Apple TV
    	            ], [VENDOR, [MODEL, APPLE+' TV'], [TYPE, SMARTTV]], [
    	            /crkey/i                                                            // Google Chromecast
    	            ], [[MODEL, CHROME+'cast'], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [
    	            /droid.+aft(\w)( bui|\))/i                                          // Fire TV
    	            ], [MODEL, [VENDOR, AMAZON], [TYPE, SMARTTV]], [
    	            /\(dtv[\);].+(aquos)/i,
    	            /(aquos-tv[\w ]+)\)/i                                               // Sharp
    	            ], [MODEL, [VENDOR, SHARP], [TYPE, SMARTTV]],[
    	            /(bravia[\w ]+)( bui|\))/i                                              // Sony
    	            ], [MODEL, [VENDOR, SONY], [TYPE, SMARTTV]], [
    	            /(mitv-\w{5}) bui/i                                                 // Xiaomi
    	            ], [MODEL, [VENDOR, XIAOMI], [TYPE, SMARTTV]], [
    	            /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,                          // Roku
    	            /hbbtv\/\d+\.\d+\.\d+ +\([\w ]*; *(\w[^;]*);([^;]*)/i               // HbbTV devices
    	            ], [[VENDOR, trim], [MODEL, trim], [TYPE, SMARTTV]], [
    	            /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i                   // SmartTV from Unidentified Vendors
    	            ], [[TYPE, SMARTTV]], [

    	            ///////////////////
    	            // WEARABLES
    	            ///////////////////

    	            /((pebble))app/i                                                    // Pebble
    	            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [
    	            /droid.+; (glass) \d/i                                              // Google Glass
    	            ], [MODEL, [VENDOR, GOOGLE], [TYPE, WEARABLE]], [
    	            /droid.+; (wt63?0{2,3})\)/i
    	            ], [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]], [
    	            /(quest( 2)?)/i                                                     // Oculus Quest
    	            ], [MODEL, [VENDOR, FACEBOOK], [TYPE, WEARABLE]], [

    	            ///////////////////
    	            // EMBEDDED
    	            ///////////////////

    	            /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i                              // Tesla
    	            ], [VENDOR, [TYPE, EMBEDDED]], [

    	            ////////////////////
    	            // MIXED (GENERIC)
    	            ///////////////////

    	            /droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i           // Android Phones from Unidentified Vendors
    	            ], [MODEL, [TYPE, MOBILE]], [
    	            /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i       // Android Tablets from Unidentified Vendors
    	            ], [MODEL, [TYPE, TABLET]], [
    	            /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i                      // Unidentifiable Tablet
    	            ], [[TYPE, TABLET]], [
    	            /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i    // Unidentifiable Mobile
    	            ], [[TYPE, MOBILE]], [
    	            /(android[-\w\. ]{0,9});.+buil/i                                    // Generic Android Device
    	            ], [MODEL, [VENDOR, 'Generic']]
    	        ],

    	        engine : [[

    	            /windows.+ edge\/([\w\.]+)/i                                       // EdgeHTML
    	            ], [VERSION, [NAME, EDGE+'HTML']], [

    	            /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i                         // Blink
    	            ], [VERSION, [NAME, 'Blink']], [

    	            /(presto)\/([\w\.]+)/i,                                             // Presto
    	            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
    	            /ekioh(flow)\/([\w\.]+)/i,                                          // Flow
    	            /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,                           // KHTML/Tasman/Links
    	            /(icab)[\/ ]([23]\.[\d\.]+)/i                                       // iCab
    	            ], [NAME, VERSION], [

    	            /rv\:([\w\.]{1,9})\b.+(gecko)/i                                     // Gecko
    	            ], [VERSION, NAME]
    	        ],

    	        os : [[

    	            // Windows
    	            /microsoft (windows) (vista|xp)/i                                   // Windows (iTunes)
    	            ], [NAME, VERSION], [
    	            /(windows) nt 6\.2; (arm)/i,                                        // Windows RT
    	            /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,            // Windows Phone
    	            /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i
    	            ], [NAME, [VERSION, strMapper, windowsVersionMap]], [
    	            /(win(?=3|9|n)|win 9x )([nt\d\.]+)/i
    	            ], [[NAME, 'Windows'], [VERSION, strMapper, windowsVersionMap]], [

    	            // iOS/macOS
    	            /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,              // iOS
    	            /cfnetwork\/.+darwin/i
    	            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [
    	            /(mac os x) ?([\w\. ]*)/i,
    	            /(macintosh|mac_powerpc\b)(?!.+haiku)/i                             // Mac OS
    	            ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [

    	            // Mobile OSes
    	            /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i                    // Android-x86/HarmonyOS
    	            ], [VERSION, NAME], [                                               // Android/WebOS/QNX/Bada/RIM/Maemo/MeeGo/Sailfish OS
    	            /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
    	            /(blackberry)\w*\/([\w\.]*)/i,                                      // Blackberry
    	            /(tizen|kaios)[\/ ]([\w\.]+)/i,                                     // Tizen/KaiOS
    	            /\((series40);/i                                                    // Series 40
    	            ], [NAME, VERSION], [
    	            /\(bb(10);/i                                                        // BlackBerry 10
    	            ], [VERSION, [NAME, BLACKBERRY]], [
    	            /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i         // Symbian
    	            ], [VERSION, [NAME, 'Symbian']], [
    	            /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i // Firefox OS
    	            ], [VERSION, [NAME, FIREFOX+' OS']], [
    	            /web0s;.+rt(tv)/i,
    	            /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i                              // WebOS
    	            ], [VERSION, [NAME, 'webOS']], [

    	            // Google Chromecast
    	            /crkey\/([\d\.]+)/i                                                 // Google Chromecast
    	            ], [VERSION, [NAME, CHROME+'cast']], [
    	            /(cros) [\w]+ ([\w\.]+\w)/i                                         // Chromium OS
    	            ], [[NAME, 'Chromium OS'], VERSION],[

    	            // Console
    	            /(nintendo|playstation) ([wids345portablevuch]+)/i,                 // Nintendo/Playstation
    	            /(xbox); +xbox ([^\);]+)/i,                                         // Microsoft Xbox (360, One, X, S, Series X, Series S)

    	            // Other
    	            /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,                            // Joli/Palm
    	            /(mint)[\/\(\) ]?(\w*)/i,                                           // Mint
    	            /(mageia|vectorlinux)[; ]/i,                                        // Mageia/VectorLinux
    	            /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
    	                                                                                // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
    	            /(hurd|linux) ?([\w\.]*)/i,                                         // Hurd/Linux
    	            /(gnu) ?([\w\.]*)/i,                                                // GNU
    	            /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
    	            /(haiku) (\w+)/i                                                    // Haiku
    	            ], [NAME, VERSION], [
    	            /(sunos) ?([\w\.\d]*)/i                                             // Solaris
    	            ], [[NAME, 'Solaris'], VERSION], [
    	            /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,                              // Solaris
    	            /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,                                  // AIX
    	            /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux)/i,            // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX
    	            /(unix) ?([\w\.]*)/i                                                // UNIX
    	            ], [NAME, VERSION]
    	        ]
    	    };

    	    /////////////////
    	    // Constructor
    	    ////////////////

    	    var UAParser = function (ua, extensions) {

    	        if (typeof ua === OBJ_TYPE) {
    	            extensions = ua;
    	            ua = undefined$1;
    	        }

    	        if (!(this instanceof UAParser)) {
    	            return new UAParser(ua, extensions).getResult();
    	        }

    	        var _ua = ua || ((typeof window !== UNDEF_TYPE && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : EMPTY);
    	        var _rgxmap = extensions ? extend(regexes, extensions) : regexes;

    	        this.getBrowser = function () {
    	            var _browser = {};
    	            _browser[NAME] = undefined$1;
    	            _browser[VERSION] = undefined$1;
    	            rgxMapper.call(_browser, _ua, _rgxmap.browser);
    	            _browser.major = majorize(_browser.version);
    	            return _browser;
    	        };
    	        this.getCPU = function () {
    	            var _cpu = {};
    	            _cpu[ARCHITECTURE] = undefined$1;
    	            rgxMapper.call(_cpu, _ua, _rgxmap.cpu);
    	            return _cpu;
    	        };
    	        this.getDevice = function () {
    	            var _device = {};
    	            _device[VENDOR] = undefined$1;
    	            _device[MODEL] = undefined$1;
    	            _device[TYPE] = undefined$1;
    	            rgxMapper.call(_device, _ua, _rgxmap.device);
    	            return _device;
    	        };
    	        this.getEngine = function () {
    	            var _engine = {};
    	            _engine[NAME] = undefined$1;
    	            _engine[VERSION] = undefined$1;
    	            rgxMapper.call(_engine, _ua, _rgxmap.engine);
    	            return _engine;
    	        };
    	        this.getOS = function () {
    	            var _os = {};
    	            _os[NAME] = undefined$1;
    	            _os[VERSION] = undefined$1;
    	            rgxMapper.call(_os, _ua, _rgxmap.os);
    	            return _os;
    	        };
    	        this.getResult = function () {
    	            return {
    	                ua      : this.getUA(),
    	                browser : this.getBrowser(),
    	                engine  : this.getEngine(),
    	                os      : this.getOS(),
    	                device  : this.getDevice(),
    	                cpu     : this.getCPU()
    	            };
    	        };
    	        this.getUA = function () {
    	            return _ua;
    	        };
    	        this.setUA = function (ua) {
    	            _ua = (typeof ua === STR_TYPE && ua.length > UA_MAX_LENGTH) ? trim(ua, UA_MAX_LENGTH) : ua;
    	            return this;
    	        };
    	        this.setUA(_ua);
    	        return this;
    	    };

    	    UAParser.VERSION = LIBVERSION;
    	    UAParser.BROWSER =  enumerize([NAME, VERSION, MAJOR]);
    	    UAParser.CPU = enumerize([ARCHITECTURE]);
    	    UAParser.DEVICE = enumerize([MODEL, VENDOR, TYPE, CONSOLE, MOBILE, SMARTTV, TABLET, WEARABLE, EMBEDDED]);
    	    UAParser.ENGINE = UAParser.OS = enumerize([NAME, VERSION]);

    	    ///////////
    	    // Export
    	    //////////

    	    // check js environment
    	    {
    	        // nodejs env
    	        if (module.exports) {
    	            exports = module.exports = UAParser;
    	        }
    	        exports.UAParser = UAParser;
    	    }

    	    // jQuery/Zepto specific (optional)
    	    // Note:
    	    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
    	    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
    	    //   and we should catch that.
    	    var $ = typeof window !== UNDEF_TYPE && (window.jQuery || window.Zepto);
    	    if ($ && !$.ua) {
    	        var parser = new UAParser();
    	        $.ua = parser.getResult();
    	        $.ua.get = function () {
    	            return parser.getUA();
    	        };
    	        $.ua.set = function (ua) {
    	            parser.setUA(ua);
    	            var result = parser.getResult();
    	            for (var prop in result) {
    	                $.ua[prop] = result[prop];
    	            }
    	        };
    	    }

    	})(typeof window === 'object' ? window : commonjsGlobal);
    } (uaParser, uaParserExports));

    function isType(type) {
        return function (value) {
            return Object.prototype.toString.call(value) === "[object ".concat(type, "]");
        };
    }
    /**
     * 检测变量类型
     * @param type
     */
    var variableTypeDetection = {
        isNumber: isType('Number'),
        isString: isType('String'),
        isBoolean: isType('Boolean'),
        isNull: isType('Null'),
        isUndefined: isType('Undefined'),
        isSymbol: isType('Symbol'),
        isFunction: isType('Function'),
        isObject: isType('Object'),
        isArray: isType('Array'),
        isProcess: isType('process'),
        isWindow: isType('Window'),
    };

    variableTypeDetection.isWindow(typeof window !== 'undefined' ? window : 0);
    // 获取全局变量
    function getGlobal() {
        return window;
    }
    var _global = getGlobal();
    var _support = getGlobalSupport();
    var uaResult = new uaParserExports.UAParser().getResult();
    // 获取设备信息
    _support.deviceInfo = {
        browserVersion: uaResult.browser.version,
        browser: uaResult.browser.name,
        osVersion: uaResult.os.version,
        os: uaResult.os.name,
        ua: uaResult.ua,
        device: uaResult.device.model ? uaResult.device.model : 'Unknow',
        device_type: uaResult.device.type ? uaResult.device.type : 'Pc',
    };
    _support.hasError = false;
    // errorMap 存储代码错误的集合
    _support.errorMap = new Map();
    _support.replaceFlag = _support.replaceFlag || {};
    _support.replaceFlag;
    // 获取全部变量__webSee__的引用地址
    function getGlobalSupport() {
        _global.__webSee__ = _global.__webSee__ || {};
        return _global.__webSee__;
    }

    /**
     * 接口错误状态
     */
    var SpanStatus;
    (function (SpanStatus) {
        SpanStatus["Ok"] = "ok";
        SpanStatus["DeadlineExceeded"] = "deadline_exceeded";
        SpanStatus["Unauthenticated"] = "unauthenticated";
        SpanStatus["PermissionDenied"] = "permission_denied";
        SpanStatus["NotFound"] = "not_found";
        SpanStatus["ResourceExhausted"] = "resource_exhausted";
        SpanStatus["InvalidArgument"] = "invalid_argument";
        SpanStatus["Unimplemented"] = "unimplemented";
        SpanStatus["Unavailable"] = "unavailable";
        SpanStatus["InternalError"] = "internal_error";
        SpanStatus["UnknownError"] = "unknown_error";
        SpanStatus["Cancelled"] = "cancelled";
        SpanStatus["AlreadyExists"] = "already_exists";
        SpanStatus["FailedPrecondition"] = "failed_precondition";
        SpanStatus["Aborted"] = "aborted";
        SpanStatus["OutOfRange"] = "out_of_range";
        SpanStatus["DataLoss"] = "data_loss";
    })(SpanStatus || (SpanStatus = {}));
    /**
     * 用户行为
     */
    var BREADCRUMBTYPES;
    (function (BREADCRUMBTYPES) {
        BREADCRUMBTYPES["HTTP"] = "Http";
        BREADCRUMBTYPES["CLICK"] = "Click";
        BREADCRUMBTYPES["RESOURCE"] = "Resource_Error";
        BREADCRUMBTYPES["CODEERROR"] = "Code_Error";
        BREADCRUMBTYPES["ROUTE"] = "Route";
        BREADCRUMBTYPES["CUSTOM"] = "Custom";
    })(BREADCRUMBTYPES || (BREADCRUMBTYPES = {}));
    /**
     * 状态
     */
    var STATUS_CODE;
    (function (STATUS_CODE) {
        STATUS_CODE["ERROR"] = "error";
        STATUS_CODE["OK"] = "ok";
    })(STATUS_CODE || (STATUS_CODE = {}));
    /**
     * 事件类型
     */
    var EVENTTYPES;
    (function (EVENTTYPES) {
        EVENTTYPES["XHR"] = "xhr";
        EVENTTYPES["FETCH"] = "fetch";
        EVENTTYPES["CLICK"] = "click";
        EVENTTYPES["HISTORY"] = "history";
        EVENTTYPES["ERROR"] = "error";
        EVENTTYPES["HASHCHANGE"] = "hashchange";
        EVENTTYPES["UNHANDLEDREJECTION"] = "unhandledrejection";
        EVENTTYPES["RESOURCE"] = "resource";
        EVENTTYPES["DOM"] = "dom";
        EVENTTYPES["VUE"] = "vue";
        EVENTTYPES["REACT"] = "react";
        EVENTTYPES["CUSTOM"] = "custom";
        EVENTTYPES["PERFORMANCE"] = "performance";
        EVENTTYPES["RECORDSCREEN"] = "recordScreen";
        EVENTTYPES["WHITESCREEN"] = "whiteScreen";
    })(EVENTTYPES || (EVENTTYPES = {}));
    var HTTPTYPE;
    (function (HTTPTYPE) {
        HTTPTYPE["XHR"] = "xhr";
        HTTPTYPE["FETCH"] = "fetch";
    })(HTTPTYPE || (HTTPTYPE = {}));
    var HTTP_CODE;
    (function (HTTP_CODE) {
        HTTP_CODE[HTTP_CODE["BAD_REQUEST"] = 400] = "BAD_REQUEST";
        HTTP_CODE[HTTP_CODE["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    })(HTTP_CODE || (HTTP_CODE = {}));
    var EMethods;
    (function (EMethods) {
        EMethods["Get"] = "GET";
        EMethods["Post"] = "POST";
        EMethods["Put"] = "PUT";
        EMethods["Delete"] = "DELETE";
    })(EMethods || (EMethods = {}));

    /**
     * 添加事件监听器
     * ../export
     * ../param {{ addEventListener: Function }} target
     * ../param {keyof TotalEventName} eventName
     * ../param {Function} handler
     * ../param {(boolean | Object)} opitons
     * ../returns
     */
    function on(target, eventName, handler, opitons) {
        if (opitons === void 0) { opitons = false; }
        target.addEventListener(eventName, handler, opitons);
    }
    // 获取当前的时间戳
    function getTimestamp() {
        return Date.now();
    }

    var e,n,t,r,a=-1,o=function(e){addEventListener("pageshow",(function(n){n.persisted&&(a=n.timeStamp,e(n));}),!0);},c=function(){return window.performance&&performance.getEntriesByType&&performance.getEntriesByType("navigation")[0]},u=function(){var e=c();return e&&e.activationStart||0},f=function(e,n){var t=c(),r="navigate";return a>=0?r="back-forward-cache":t&&(r=document.prerendering||u()>0?"prerender":document.wasDiscarded?"restore":t.type.replace(/_/g,"-")),{name:e,value:void 0===n?-1:n,rating:"good",delta:0,entries:[],id:"v3-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12),navigationType:r}},s=function(e,n,t){try{if(PerformanceObserver.supportedEntryTypes.includes(e)){var r=new PerformanceObserver((function(e){Promise.resolve().then((function(){n(e.getEntries());}));}));return r.observe(Object.assign({type:e,buffered:!0},t||{})),r}}catch(e){}},d=function(e,n,t,r){var i,a;return function(o){n.value>=0&&(o||r)&&((a=n.value-(i||0))||void 0===i)&&(i=n.value,n.delta=a,n.rating=function(e,n){return e>n[1]?"poor":e>n[0]?"needs-improvement":"good"}(n.value,t),e(n));}},l=function(e){requestAnimationFrame((function(){return requestAnimationFrame((function(){return e()}))}));},v=function(e){var n=function(n){"pagehide"!==n.type&&"hidden"!==document.visibilityState||e(n);};addEventListener("visibilitychange",n,!0),addEventListener("pagehide",n,!0);},p=function(e){var n=!1;return function(t){n||(e(t),n=!0);}},m=-1,h=function(){return "hidden"!==document.visibilityState||document.prerendering?1/0:0},g=function(e){"hidden"===document.visibilityState&&m>-1&&(m="visibilitychange"===e.type?e.timeStamp:0,T());},y=function(){addEventListener("visibilitychange",g,!0),addEventListener("prerenderingchange",g,!0);},T=function(){removeEventListener("visibilitychange",g,!0),removeEventListener("prerenderingchange",g,!0);},E=function(){return m<0&&(m=h(),y(),o((function(){setTimeout((function(){m=h(),y();}),0);}))),{get firstHiddenTime(){return m}}},C=function(e){document.prerendering?addEventListener("prerenderingchange",(function(){return e()}),!0):e();},L=function(e,n){n=n||{},C((function(){var t,r=[1800,3e3],i=E(),a=f("FCP"),c=s("paint",(function(e){e.forEach((function(e){"first-contentful-paint"===e.name&&(c.disconnect(),e.startTime<i.firstHiddenTime&&(a.value=Math.max(e.startTime-u(),0),a.entries.push(e),t(!0)));}));}));c&&(t=d(e,a,r,n.reportAllChanges),o((function(i){a=f("FCP"),t=d(e,a,r,n.reportAllChanges),l((function(){a.value=performance.now()-i.timeStamp,t(!0);}));})));}));},b=function(e,n){n=n||{},L(p((function(){var t,r=[.1,.25],i=f("CLS",0),a=0,c=[],u=function(e){e.forEach((function(e){if(!e.hadRecentInput){var n=c[0],t=c[c.length-1];a&&e.startTime-t.startTime<1e3&&e.startTime-n.startTime<5e3?(a+=e.value,c.push(e)):(a=e.value,c=[e]);}})),a>i.value&&(i.value=a,i.entries=c,t());},p=s("layout-shift",u);p&&(t=d(e,i,r,n.reportAllChanges),v((function(){u(p.takeRecords()),t(!0);})),o((function(){a=0,i=f("CLS",0),t=d(e,i,r,n.reportAllChanges),l((function(){return t()}));})),setTimeout(t,0));})));},w={passive:!0,capture:!0},S=new Date,A=function(r,i){e||(e=i,n=r,t=new Date,F(removeEventListener),I());},I=function(){if(n>=0&&n<t-S){var i={entryType:"first-input",name:e.type,target:e.target,cancelable:e.cancelable,startTime:e.timeStamp,processingStart:e.timeStamp+n};r.forEach((function(e){e(i);})),r=[];}},P=function(e){if(e.cancelable){var n=(e.timeStamp>1e12?new Date:performance.now())-e.timeStamp;"pointerdown"==e.type?function(e,n){var t=function(){A(e,n),i();},r=function(){i();},i=function(){removeEventListener("pointerup",t,w),removeEventListener("pointercancel",r,w);};addEventListener("pointerup",t,w),addEventListener("pointercancel",r,w);}(n,e):A(n,e);}},F=function(e){["mousedown","keydown","touchstart","pointerdown"].forEach((function(n){return e(n,P,w)}));},M=function(t,i){i=i||{},C((function(){var a,c=[100,300],u=E(),l=f("FID"),m=function(e){e.startTime<u.firstHiddenTime&&(l.value=e.processingStart-e.startTime,l.entries.push(e),a(!0));},h=function(e){e.forEach(m);},g=s("first-input",h);a=d(t,l,c,i.reportAllChanges),g&&v(p((function(){h(g.takeRecords()),g.disconnect();}))),g&&o((function(){var o;l=f("FID"),a=d(t,l,c,i.reportAllChanges),r=[],n=-1,e=null,F(addEventListener),o=m,r.push(o),I();}));}));},G={},J=function(e,n){n=n||{},C((function(){var t,r=[2500,4e3],i=E(),a=f("LCP"),c=function(e){var n=e[e.length-1];if(n){var r=Math.max(n.startTime-u(),0);r<i.firstHiddenTime&&(a.value=r,a.entries=[n],t());}},m=s("largest-contentful-paint",c);if(m){t=d(e,a,r,n.reportAllChanges);var h=p((function(){G[a.id]||(c(m.takeRecords()),m.disconnect(),G[a.id]=!0,t(!0));}));["keydown","click"].forEach((function(e){addEventListener(e,h,!0);})),v(h),o((function(i){a=f("LCP"),t=d(e,a,r,n.reportAllChanges),l((function(){a.value=performance.now()-i.timeStamp,G[a.id]=!0,t(!0);}));}));}}));},K=function e(n){document.prerendering?C((function(){return e(n)})):"complete"!==document.readyState?addEventListener("load",(function(){return e(n)}),!0):setTimeout(n,0);},Q=function(e,n){n=n||{};var t=[800,1800],r=f("TTFB"),i=d(e,r,t,n.reportAllChanges);K((function(){var a=c();if(a){var s=a.responseStart;if(s<=0||s>performance.now())return;r.value=Math.max(s-u(),0),r.entries=[a],i(!0),o((function(){r=f("TTFB",0),(i=d(e,r,t,n.reportAllChanges))(!0);}));}}));};

    // firstScreenPaint为首屏加载时间
    var firstScreenPaint = 0;
    // 页面是否渲染完成
    var isOnLoaded = false;
    var timer;
    var observer;
    var entries = [];
    // 定时器循环监听dom的变化，当document.readyState === 'complete'时，停止监听
    function checkDOMChange(callback) {
        cancelAnimationFrame(timer);
        timer = requestAnimationFrame(function () {
            if (document.readyState === 'complete') {
                isOnLoaded = true;
            }
            if (isOnLoaded) {
                // 取消监听
                observer && observer.disconnect();
                // document.readyState === 'complete'时，计算首屏渲染时间
                firstScreenPaint = getRenderTime();
                entries = [];
                callback && callback(firstScreenPaint);
            }
            else {
                checkDOMChange(callback);
            }
        });
    }
    function getRenderTime() {
        var startTime = 0;
        entries.forEach(function (entry) {
            if (entry.startTime > startTime) {
                startTime = entry.startTime;
            }
        });
        // performance.timing.navigationStart 页面的起始时间
        return startTime - performance.timing.navigationStart;
    }
    var viewportWidth = _global.innerWidth;
    var viewportHeight = _global.innerHeight;
    // dom 对象是否在屏幕内
    function isInScreen(dom) {
        var rectInfo = dom.getBoundingClientRect();
        if (rectInfo.left < viewportWidth && rectInfo.top < viewportHeight) {
            return true;
        }
        return false;
    }
    function getFirstScreenPaint(callback) {
        if ('requestIdleCallback' in _global) {
            requestIdleCallback(function (deadline) {
                // timeRemaining：表示当前空闲时间的剩余时间
                if (deadline.timeRemaining() > 0) {
                    observeFirstScreenPaint(callback);
                }
            });
        }
        else {
            observeFirstScreenPaint(callback);
        }
    }
    // 外部通过callback 拿到首屏加载时间
    function observeFirstScreenPaint(callback) {
        var ignoreDOMList = ['STYLE', 'SCRIPT', 'LINK'];
        observer = new MutationObserver(function (mutationList) {
            checkDOMChange(callback);
            var entry = { children: [], startTime: 0 };
            for (var _i = 0, mutationList_1 = mutationList; _i < mutationList_1.length; _i++) {
                var mutation = mutationList_1[_i];
                if (mutation.addedNodes.length && isInScreen(mutation.target)) {
                    for (var _a = 0, _b = mutation.addedNodes; _a < _b.length; _a++) {
                        var node = _b[_a];
                        // 忽略掉以上标签的变化
                        if (node.nodeType === 1 && !ignoreDOMList.includes(node.tagName) && isInScreen(node)) {
                            entry.children.push(node);
                        }
                    }
                }
            }
            if (entry.children.length) {
                entries.push(entry);
                entry.startTime = new Date().getTime();
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true, // 监听元素的属性是否变化
        });
    }
    function isSafari() {
        return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    }
    function getResource() {
        var entries = performance.getEntriesByType('resource');
        // 过滤掉非静态资源的 fetch、 xmlhttprequest、beacon
        var list = entries.filter(function (entry) {
            return ['fetch', 'xmlhttprequest', 'beacon'].indexOf(entry.initiatorType) === -1;
        });
        if (list.length) {
            list = JSON.parse(JSON.stringify(list));
            list.forEach(function (entry) {
                entry.isCache = isCache(entry);
            });
        }
        return list;
    }
    // 判断资料是否来自缓存
    function isCache(entry) {
        return entry.transferSize === 0 || (entry.transferSize !== 0 && entry.encodedBodySize === 0);
    }
    function getFCP(callback) {
        var entryHandler = function (list) {
            for (var _i = 0, _a = list.getEntries(); _i < _a.length; _i++) {
                var entry = _a[_i];
                if (entry.name === 'first-contentful-paint') {
                    observer.disconnect();
                    callback({
                        name: 'FCP',
                        value: entry.startTime,
                        rating: entry.startTime > 2500 ? 'poor' : 'good',
                    });
                }
            }
        };
        var observer = new PerformanceObserver(entryHandler);
        observer.observe({ type: 'paint', buffered: true });
    }
    function getLCP(callback) {
        var entryHandler = function (list) {
            for (var _i = 0, _a = list.getEntries(); _i < _a.length; _i++) {
                var entry = _a[_i];
                observer.disconnect();
                callback({
                    name: 'LCP',
                    value: entry.startTime,
                    rating: entry.startTime > 2500 ? 'poor' : 'good',
                });
            }
        };
        var observer = new PerformanceObserver(entryHandler);
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
    }
    function getFID(callback) {
        var entryHandler = function (entryList) {
            for (var _i = 0, _a = entryList.getEntries(); _i < _a.length; _i++) {
                var entry = _a[_i];
                observer.disconnect();
                var value = entry.processingStart - entry.startTime;
                callback({
                    name: 'FID',
                    value: value,
                    rating: value > 100 ? 'poor' : 'good',
                });
            }
        };
        var observer = new PerformanceObserver(entryHandler);
        observer.observe({ type: 'first-input', buffered: true });
    }
    function getCLS(callback) {
        var clsValue = 0;
        // let clsEntries = [];
        var sessionValue = 0;
        var sessionEntries = [];
        var entryHandler = function (entryList) {
            for (var _i = 0, _a = entryList.getEntries(); _i < _a.length; _i++) {
                var entry = _a[_i];
                // 只将不带有最近用户输入标志的布局偏移计算在内。
                if (!entry.hadRecentInput) {
                    var firstSessionEntry = sessionEntries[0];
                    var lastSessionEntry = sessionEntries[sessionEntries.length - 1];
                    // 如果条目与上一条目的相隔时间小于 1 秒且
                    // 与会话中第一个条目的相隔时间小于 5 秒，那么将条目
                    // 包含在当前会话中。否则，开始一个新会话。
                    if (sessionValue &&
                        entry.startTime - lastSessionEntry.startTime < 1000 &&
                        entry.startTime - firstSessionEntry.startTime < 5000) {
                        sessionValue += entry.value;
                        sessionEntries.push(entry);
                    }
                    else {
                        sessionValue = entry.value;
                        sessionEntries = [entry];
                    }
                    // 如果当前会话值大于当前 CLS 值，
                    // 那么更新 CLS 及其相关条目。
                    if (sessionValue > clsValue) {
                        clsValue = sessionValue;
                        // clsEntries = sessionEntries;
                        observer.disconnect();
                        callback({
                            name: 'CLS',
                            value: clsValue,
                            rating: clsValue > 2500 ? 'poor' : 'good',
                        });
                    }
                }
            }
        };
        var observer = new PerformanceObserver(entryHandler);
        observer.observe({ type: 'layout-shift', buffered: true });
    }
    function getTTFB(callback) {
        on(_global, 'load', function () {
            var _a = _global.performance.timing, responseStart = _a.responseStart, navigationStart = _a.navigationStart;
            var value = responseStart - navigationStart;
            callback({
                name: 'TTFB',
                value: value,
                rating: value > 100 ? 'poor' : 'good',
            });
        });
    }
    function getWebVitals(callback) {
        // web-vitals 不兼容safari浏览器
        if (isSafari()) {
            getFID(function (res) {
                callback(res);
            });
            getFCP(function (res) {
                callback(res);
            });
            getLCP(function (res) {
                callback(res);
            });
            getCLS(function (res) {
                callback(res);
            });
            getTTFB(function (res) {
                callback(res);
            });
        }
        else {
            J(function (res) {
                callback(res);
            });
            M(function (res) {
                callback(res);
            });
            b(function (res) {
                callback(res);
            });
            L(function (res) {
                callback(res);
            });
            Q(function (res) {
                callback(res);
            });
        }
        // 首屏加载时间
        getFirstScreenPaint(function (res) {
            var data = {
                name: 'FSP',
                value: res,
                rating: res > 2500 ? 'poor' : 'good',
            };
            callback(data);
        });
    }

    var BasePlugin = /** @class */ (function () {
        function BasePlugin(type) {
            this.type = type;
        }
        return BasePlugin;
    }());

    var WebPerformance = /** @class */ (function (_super) {
        __extends(WebPerformance, _super);
        function WebPerformance() {
            var _this = _super.call(this, EVENTTYPES.PERFORMANCE) || this;
            _this.type = EVENTTYPES.PERFORMANCE;
            return _this;
        }
        WebPerformance.prototype.bindOptions = function () { };
        WebPerformance.prototype.core = function (_a) {
            var transportData = _a.transportData;
            // 获取FCP、LCP、TTFB、FID等指标
            getWebVitals(function (res) {
                // name指标名称、rating 评级、value数值
                var name = res.name, rating = res.rating, value = res.value;
                transportData.send({
                    type: EVENTTYPES.PERFORMANCE,
                    status: STATUS_CODE.OK,
                    time: getTimestamp(),
                    name: name,
                    rating: rating,
                    value: value,
                });
            });
            var observer = new PerformanceObserver(function (list) {
                for (var _i = 0, _a = list.getEntries(); _i < _a.length; _i++) {
                    var long = _a[_i];
                    // 上报长任务详情
                    transportData.send({
                        type: EVENTTYPES.PERFORMANCE,
                        name: 'longTask',
                        longTask: long,
                        time: getTimestamp(),
                        status: STATUS_CODE.OK,
                    });
                }
            });
            observer.observe({ entryTypes: ['longtask'] });
            on(_global, 'load', function () {
                // 上报资源列表
                transportData.send({
                    type: EVENTTYPES.PERFORMANCE,
                    name: 'resourceList',
                    time: getTimestamp(),
                    status: STATUS_CODE.OK,
                    resourceList: getResource(),
                });
                // 上报内存情况, safari、firefox不支持该属性
                if (performance.memory) {
                    transportData.send({
                        type: EVENTTYPES.PERFORMANCE,
                        name: 'memory',
                        time: getTimestamp(),
                        status: STATUS_CODE.OK,
                        memory: {
                            jsHeapSizeLimit: performance.memory && performance.memory.jsHeapSizeLimit,
                            totalJSHeapSize: performance.memory && performance.memory.totalJSHeapSize,
                            usedJSHeapSize: performance.memory && performance.memory.usedJSHeapSize,
                        },
                    });
                }
            });
        };
        WebPerformance.prototype.transform = function () { };
        return WebPerformance;
    }(BasePlugin));

    return WebPerformance;

}));
//# sourceMappingURL=index.js.map
