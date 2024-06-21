(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["web-see"] = factory());
})(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var uaParserExports = {};
	var uaParser = {
	  get exports(){ return uaParserExports; },
	  set exports(v){ uaParserExports = v; },
	};

	(function (module, exports) {
		/////////////////////////////////////////////////////////////////////////////////
		/* UAParser.js v1.0.38
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


		    var LIBVERSION  = '1.0.38',
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
		        UA_MAX_LENGTH = 500;

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
		        FACEBOOK    = 'Facebook',
		        CHROMIUM_OS = 'Chromium OS',
		        MAC_OS  = 'Mac OS';

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
		                str = str.replace(/^\s\s*/, EMPTY);
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

		                    if (!regex[j]) { break; }
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
		            /\bop(?:rg)?x\/([\w\.]+)/i                                          // Opera GX
		            ], [VERSION, [NAME, OPERA+' GX']], [
		            /\bopr\/([\w\.]+)/i                                                 // Opera Webkit
		            ], [VERSION, [NAME, OPERA]], [

		            // Mixed
		            /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i            // Baidu
		            ], [VERSION, [NAME, 'Baidu']], [
		            /(kindle)\/([\w\.]+)/i,                                             // Kindle
		            /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,      // Lunascape/Maxthon/Netfront/Jasmine/Blazer
		            // Trident based
		            /(avant|iemobile|slim)\s?(?:browser)?[\/ ]?([\w\.]*)/i,             // Avant/IEMobile/SlimBrowser
		            /(?:ms|\()(ie) ([\w\.]+)/i,                                         // Internet Explorer

		            // Webkit/KHTML based                                               // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
		            /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,
		                                                                                // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ, aka ShouQ
		            /(heytap|ovi)browser\/([\d\.]+)/i,                                  // Heytap/Ovi
		            /(weibo)__([\d\.]+)/i                                               // Weibo
		            ], [NAME, VERSION], [
		            /\bddg\/([\w\.]+)/i                                                 // DuckDuckGo
		            ], [VERSION, [NAME, 'DuckDuckGo']], [
		            /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i                 // UCBrowser
		            ], [VERSION, [NAME, 'UC'+BROWSER]], [
		            /microm.+\bqbcore\/([\w\.]+)/i,                                     // WeChat Desktop for Windows Built-in Browser
		            /\bqbcore\/([\w\.]+).+microm/i,
		            /micromessenger\/([\w\.]+)/i                                        // WeChat
		            ], [VERSION, [NAME, 'WeChat']], [
		            /konqueror\/([\w\.]+)/i                                             // Konqueror
		            ], [VERSION, [NAME, 'Konqueror']], [
		            /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i                       // IE11
		            ], [VERSION, [NAME, 'IE']], [
		            /ya(?:search)?browser\/([\w\.]+)/i                                  // Yandex
		            ], [VERSION, [NAME, 'Yandex']], [
		            /slbrowser\/([\w\.]+)/i                                             // Smart Lenovo Browser
		            ], [VERSION, [NAME, 'Smart Lenovo '+BROWSER]], [
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
		            ], [[NAME, '360 ' + BROWSER]], [
		            /(oculus|sailfish|huawei|vivo)browser\/([\w\.]+)/i
		            ], [[NAME, /(.+)/, '$1 ' + BROWSER], VERSION], [                    // Oculus/Sailfish/HuaweiBrowser/VivoBrowser
		            /samsungbrowser\/([\w\.]+)/i                                        // Samsung Internet
		            ], [VERSION, [NAME, SAMSUNG + ' Internet']], [
		            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
		            ], [[NAME, /_/g, ' '], VERSION], [
		            /metasr[\/ ]?([\d\.]+)/i                                            // Sogou Explorer
		            ], [VERSION, [NAME, 'Sogou Explorer']], [
		            /(sogou)mo\w+\/([\d\.]+)/i                                          // Sogou Mobile
		            ], [[NAME, 'Sogou Mobile'], VERSION], [
		            /(electron)\/([\w\.]+) safari/i,                                    // Electron-based App
		            /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,                   // Tesla
		            /m?(qqbrowser|2345Explorer)[\/ ]?([\w\.]+)/i                        // QQBrowser/2345 Browser
		            ], [NAME, VERSION], [
		            /(lbbrowser)/i,                                                     // LieBao Browser
		            /\[(linkedin)app\]/i                                                // LinkedIn App for iOS & Android
		            ], [NAME], [

		            // WebView
		            /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i       // Facebook App for iOS & Android
		            ], [[NAME, FACEBOOK], VERSION], [
		            /(Klarna)\/([\w\.]+)/i,                                             // Klarna Shopping Browser for iOS & Android
		            /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,                             // Kakao App
		            /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,                                  // Naver InApp
		            /safari (line)\/([\w\.]+)/i,                                        // Line App for iOS
		            /\b(line)\/([\w\.]+)\/iab/i,                                        // Line App for Android
		            /(alipay)client\/([\w\.]+)/i,                                       // Alipay
		            /(twitter)(?:and| f.+e\/([\w\.]+))/i,                               // Twitter
		            /(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i                     // Chromium/Instagram/Snapchat
		            ], [NAME, VERSION], [
		            /\bgsa\/([\w\.]+) .*safari\//i                                      // Google Search Appliance on iOS
		            ], [VERSION, [NAME, 'GSA']], [
		            /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i                        // TikTok
		            ], [VERSION, [NAME, 'TikTok']], [

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
		            /(links) \(([\w\.]+)/i,                                             // Links
		            /panasonic;(viera)/i                                                // Panasonic Viera
		            ], [NAME, VERSION], [
		            
		            /(cobalt)\/([\w\.]+)/i                                              // Cobalt
		            ], [NAME, [VERSION, /master.|lts./, ""]]
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
		            /////////////////////////

		            // Samsung
		            /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
		            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, TABLET]], [
		            /\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
		            /samsung[- ]([-\w]+)/i,
		            /sec-(sgh\w+)/i
		            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, MOBILE]], [

		            // Apple
		            /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i                          // iPod/iPhone
		            ], [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]], [
		            /\((ipad);[-\w\),; ]+apple/i,                                       // iPad
		            /applecoremedia\/[\w\.]+ \((ipad)/i,
		            /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
		            ], [MODEL, [VENDOR, APPLE], [TYPE, TABLET]], [
		            /(macintosh);/i
		            ], [MODEL, [VENDOR, APPLE]], [

		            // Sharp
		            /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
		            ], [MODEL, [VENDOR, SHARP], [TYPE, MOBILE]], [

		            // Huawei
		            /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
		            ], [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]], [
		            /(?:huawei|honor)([-\w ]+)[;\)]/i,
		            /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
		            ], [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]], [

		            // Xiaomi
		            /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,                  // Xiaomi POCO
		            /\b; (\w+) build\/hm\1/i,                                           // Xiaomi Hongmi 'numeric' models
		            /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,                             // Xiaomi Hongmi
		            /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,                   // Xiaomi Redmi
		            /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,        // Xiaomi Redmi 'numeric' models
		            /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i // Xiaomi Mi
		            ], [[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, MOBILE]], [
		            /oid[^\)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i,                     // Redmi Pad
		            /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i                        // Mi Pad tablets
		            ],[[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, TABLET]], [

		            // OPPO
		            /; (\w+) bui.+ oppo/i,
		            /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
		            ], [MODEL, [VENDOR, 'OPPO'], [TYPE, MOBILE]], [
		            /\b(opd2\d{3}a?) bui/i
		            ], [MODEL, [VENDOR, 'OPPO'], [TYPE, TABLET]], [

		            // Vivo
		            /vivo (\w+)(?: bui|\))/i,
		            /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
		            ], [MODEL, [VENDOR, 'Vivo'], [TYPE, MOBILE]], [

		            // Realme
		            /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
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
		            /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i,                             // Kindle Fire without Silk / Echo Show
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
		            /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i         // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
		            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

		            // Acer
		            /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
		            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

		            // Meizu
		            /droid.+; (m[1-5] note) bui/i,
		            /\bmz-([-\w]{2,})/i
		            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, MOBILE]], [
		                
		            // Ulefone
		            /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
		            ], [MODEL, [VENDOR, 'Ulefone'], [TYPE, MOBILE]], [

		            // MIXED
		            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno)[-_ ]?([-\w]*)/i,
		                                                                                // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
		            /(hp) ([\w ]+\w)/i,                                                 // HP iPAQ
		            /(asus)-?(\w+)/i,                                                   // Asus
		            /(microsoft); (lumia[\w ]+)/i,                                      // Microsoft Lumia
		            /(lenovo)[-_ ]?([-\w]+)/i,                                          // Lenovo
		            /(jolla)/i,                                                         // Jolla
		            /(oppo) ?([\w ]+) bui/i                                             // OPPO
		            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

		            /(kobo)\s(ereader|touch)/i,                                         // Kobo
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
		            /droid.+aft(\w+)( bui|\))/i                                         // Fire TV
		            ], [MODEL, [VENDOR, AMAZON], [TYPE, SMARTTV]], [
		            /\(dtv[\);].+(aquos)/i,
		            /(aquos-tv[\w ]+)\)/i                                               // Sharp
		            ], [MODEL, [VENDOR, SHARP], [TYPE, SMARTTV]],[
		            /(bravia[\w ]+)( bui|\))/i                                              // Sony
		            ], [MODEL, [VENDOR, SONY], [TYPE, SMARTTV]], [
		            /(mitv-\w{5}) bui/i                                                 // Xiaomi
		            ], [MODEL, [VENDOR, XIAOMI], [TYPE, SMARTTV]], [
		            /Hbbtv.*(technisat) (.*);/i                                         // TechniSAT
		            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
		            /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,                          // Roku
		            /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i         // HbbTV devices
		            ], [[VENDOR, trim], [MODEL, trim], [TYPE, SMARTTV]], [
		            /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i                   // SmartTV from Unidentified Vendors
		            ], [[TYPE, SMARTTV]], [

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
		            // WEARABLES
		            ///////////////////

		            /((pebble))app/i                                                    // Pebble
		            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [
		            /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i                              // Apple Watch
		            ], [MODEL, [VENDOR, APPLE], [TYPE, WEARABLE]], [
		            /droid.+; (glass) \d/i                                              // Google Glass
		            ], [MODEL, [VENDOR, GOOGLE], [TYPE, WEARABLE]], [
		            /droid.+; (wt63?0{2,3})\)/i
		            ], [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]], [
		            /(quest( \d| pro)?)/i                                               // Oculus Quest
		            ], [MODEL, [VENDOR, FACEBOOK], [TYPE, WEARABLE]], [

		            ///////////////////
		            // EMBEDDED
		            ///////////////////

		            /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i                              // Tesla
		            ], [VENDOR, [TYPE, EMBEDDED]], [
		            /(aeobc)\b/i                                                        // Echo Dot
		            ], [MODEL, [VENDOR, AMAZON], [TYPE, EMBEDDED]], [

		            ////////////////////
		            // MIXED (GENERIC)
		            ///////////////////

		            /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i    // Android Phones from Unidentified Vendors
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
		            /(icab)[\/ ]([23]\.[\d\.]+)/i,                                      // iCab
		            /\b(libweb)/i
		            ], [NAME, VERSION], [

		            /rv\:([\w\.]{1,9})\b.+(gecko)/i                                     // Gecko
		            ], [VERSION, NAME]
		        ],

		        os : [[

		            // Windows
		            /microsoft (windows) (vista|xp)/i                                   // Windows (iTunes)
		            ], [NAME, VERSION], [
		            /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i             // Windows Phone
		            ], [NAME, [VERSION, strMapper, windowsVersionMap]], [
		            /windows nt 6\.2; (arm)/i,                                        // Windows RT
		            /windows[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,
		            /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i
		            ], [[VERSION, strMapper, windowsVersionMap], [NAME, 'Windows']], [

		            // iOS/macOS
		            /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,              // iOS
		            /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
		            /cfnetwork\/.+darwin/i
		            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [
		            /(mac os x) ?([\w\. ]*)/i,
		            /(macintosh|mac_powerpc\b)(?!.+haiku)/i                             // Mac OS
		            ], [[NAME, MAC_OS], [VERSION, /_/g, '.']], [

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
		            /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i                              // watchOS
		            ], [VERSION, [NAME, 'watchOS']], [

		            // Google Chromecast
		            /crkey\/([\d\.]+)/i                                                 // Google Chromecast
		            ], [VERSION, [NAME, CHROME+'cast']], [
		            /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i                                  // Chromium OS
		            ], [[NAME, CHROMIUM_OS], VERSION],[

		            // Smart TVs
		            /panasonic;(viera)/i,                                               // Panasonic Viera
		            /(netrange)mmh/i,                                                   // Netrange
		            /(nettv)\/(\d+\.[\w\.]+)/i,                                         // NetTV

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
		            /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX/SerenityOS
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

		        var _navigator = (typeof window !== UNDEF_TYPE && window.navigator) ? window.navigator : undefined$1;
		        var _ua = ua || ((_navigator && _navigator.userAgent) ? _navigator.userAgent : EMPTY);
		        var _uach = (_navigator && _navigator.userAgentData) ? _navigator.userAgentData : undefined$1;
		        var _rgxmap = extensions ? extend(regexes, extensions) : regexes;
		        var _isSelfNav = _navigator && _navigator.userAgent == _ua;

		        this.getBrowser = function () {
		            var _browser = {};
		            _browser[NAME] = undefined$1;
		            _browser[VERSION] = undefined$1;
		            rgxMapper.call(_browser, _ua, _rgxmap.browser);
		            _browser[MAJOR] = majorize(_browser[VERSION]);
		            // Brave-specific detection
		            if (_isSelfNav && _navigator && _navigator.brave && typeof _navigator.brave.isBrave == FUNC_TYPE) {
		                _browser[NAME] = 'Brave';
		            }
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
		            if (_isSelfNav && !_device[TYPE] && _uach && _uach.mobile) {
		                _device[TYPE] = MOBILE;
		            }
		            // iPadOS-specific detection: identified as Mac, but has some iOS-only properties
		            if (_isSelfNav && _device[MODEL] == 'Macintosh' && _navigator && typeof _navigator.standalone !== UNDEF_TYPE && _navigator.maxTouchPoints && _navigator.maxTouchPoints > 2) {
		                _device[MODEL] = 'iPad';
		                _device[TYPE] = TABLET;
		            }
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
		            if (_isSelfNav && !_os[NAME] && _uach && _uach.platform && _uach.platform != 'Unknown') {
		                _os[NAME] = _uach.platform  
		                                    .replace(/chrome os/i, CHROMIUM_OS)
		                                    .replace(/macos/i, MAC_OS);           // backward compatibility
		            }
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
	function isType(type) {
	    return function (value) {
	        return Object.prototype.toString.call(value) === "[object ".concat(type, "]");
	    };
	}

	// 获取全局变量
	function getGlobal() {
	    return window;
	}
	var _global = getGlobal();
	var _support = getGlobalSupport();
	var isBrowserEnv = variableTypeDetection.isWindow(typeof window !== 'undefined' ? window : 0);
	function setFlag(replaceType, isSet) {
	    if (replaceFlag[replaceType])
	        return;
	    replaceFlag[replaceType] = isSet;
	}
	function getFlag(replaceType) {
	    return replaceFlag[replaceType] ? true : false;
	}
	function getGlobalSupport() {
	    _global.__webSee__ = _global.__webSee__ || {};
	    return _global.__webSee__;
	}
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
	_support.replaceFlag = _support.replaceFlag || {};
	var replaceFlag = _support.replaceFlag;
	// errorMap 存储代码错误的集合
	_support.errorMap = new Map();

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
	var HTTP_CODE;
	(function (HTTP_CODE) {
	    HTTP_CODE[HTTP_CODE["BAD_REQUEST"] = 400] = "BAD_REQUEST";
	    HTTP_CODE[HTTP_CODE["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
	})(HTTP_CODE || (HTTP_CODE = {}));
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

	// 验证选项的类型
	function validateOption(target, targetName, expectType) {
	    if (!target)
	        return false;
	    if (typeofAny(target) === expectType)
	        return true;
	    console.error("web-see: ".concat(targetName, "\u671F\u671B\u4F20\u5165").concat(expectType, "\u7C7B\u578B\uFF0C\u76EE\u524D\u662F").concat(typeofAny(target), "\u7C7B\u578B"));
	}
	// 获取当前的时间戳
	function getTimestamp() {
	    return Date.now();
	}
	function typeofAny(target) {
	    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
	}
	function generateUUID() {
	    var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	        var r = (d + Math.random() * 16) % 16 | 0;
	        d = Math.floor(d / 16);
	        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
	    });
	    return uuid;
	}
	// 对每一个错误详情，生成唯一的编码
	function getErrorUid(input) {
	    return window.btoa(encodeURIComponent(input));
	}
	function getLocationHref() {
	    if (typeof document === 'undefined' || document.location == null)
	        return '';
	    return document.location.href;
	}
	function hashMapExist(hash) {
	    var exist = _support.errorMap.has(hash);
	    if (!exist) {
	        _support.errorMap.set(hash, true);
	    }
	    return exist;
	}
	function interceptStr(str, interceptLength) {
	    if (variableTypeDetection.isString(str)) {
	        return str.slice(0, interceptLength) + (str.length > interceptLength ? ":\u622A\u53D6\u524D".concat(interceptLength, "\u4E2A\u5B57\u7B26") : '');
	    }
	    return '';
	}
	/**
	 * 原生try函数
	 * ../param fn try中执行的函数体
	 * ../param errorFn 报错时执行的函数体，将err传入
	 */
	function nativeTryCatch(fn, errorFn) {
	    try {
	        fn();
	    }
	    catch (err) {
	        if (errorFn) {
	            errorFn(err);
	        }
	    }
	}
	// window上添加监听事件
	function on(target, eventName, handler, opitons) {
	    if (opitons === void 0) { opitons = false; }
	    target.addEventListener(eventName, handler, opitons);
	}
	/**
	 *
	 * 重写对象上面的某个属性
	 * ../param source 需要被重写的对象
	 * ../param name 需要被重写对象的key
	 * ../param replacement 以原有的函数作为参数，执行并重写原有函数
	 * ../param isForced 是否强制重写（可能原先没有该属性）
	 * ../returns void
	 */
	function replaceAop(source, name, replacement, isForced) {
	    if (isForced === void 0) { isForced = false; }
	    if (source === undefined)
	        return;
	    if (name in source || isForced) {
	        // 保留原始函数
	        var original = source[name];
	        // 将原始函数作为参数传递给回调函数
	        var wrapped = replacement(original);
	        if (typeof wrapped === 'function') {
	            source[name] = wrapped;
	        }
	    }
	}
	function unknownToString(target) {
	    if (variableTypeDetection.isString(target)) {
	        return target;
	    }
	    if (variableTypeDetection.isUndefined(target)) {
	        return 'undefined';
	    }
	    return JSON.stringify(target);
	}
	function fromHttpStatus(httpStatus) {
	    if (httpStatus < 400) {
	        return SpanStatus.Ok;
	    }
	    if (httpStatus >= 400 && httpStatus < 500) {
	        switch (httpStatus) {
	            case 401:
	                return SpanStatus.Unauthenticated;
	            case 403:
	                return SpanStatus.PermissionDenied;
	            case 404:
	                return SpanStatus.NotFound;
	            case 409:
	                return SpanStatus.AlreadyExists;
	            case 413:
	                return SpanStatus.FailedPrecondition;
	            case 429:
	                return SpanStatus.ResourceExhausted;
	            default:
	                return SpanStatus.InvalidArgument;
	        }
	    }
	    if (httpStatus >= 500 && httpStatus < 600) {
	        switch (httpStatus) {
	            case 501:
	                return SpanStatus.Unimplemented;
	            case 503:
	                return SpanStatus.Unavailable;
	            case 504:
	                return SpanStatus.DeadlineExceeded;
	            default:
	                return SpanStatus.InternalError;
	        }
	    }
	    return SpanStatus.UnknownError;
	}

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

	var __assign = function() {
	    __assign = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};

	function __awaiter(thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	}

	function __generator(thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (g && (g = 0, op[0] && (_ = 0)), _) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	}

	typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
	    var e = new Error(message);
	    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
	};

	// 浏览器支持的情况下，优先使用requestIdleCallback在空闲的时候执行，如果不支持就用promise来异步执行，是大量事件执行的优化手段
	var Queue = /** @class */ (function () {
	    function Queue() {
	        this.stack = [];
	        this.isFlushing = false;
	    }
	    Queue.prototype.addFn = function (fn) {
	        var _this = this;
	        if (typeof fn !== 'function')
	            return;
	        if (!('requestIdleCallback' in _global || 'Promise' in _global)) {
	            fn();
	            return;
	        }
	        this.stack.push(fn);
	        if (!this.isFlushing) {
	            this.isFlushing = true;
	            // 优先使用requestIdleCallback
	            if ('requestIdleCallback' in _global) {
	                requestIdleCallback(function () { return _this.flushStack(); });
	            }
	            else {
	                // 其次使用微任务上报
	                Promise.resolve().then(function () { return _this.flushStack(); });
	            }
	        }
	    };
	    Queue.prototype.clear = function () {
	        this.stack = [];
	    };
	    Queue.prototype.getStack = function () {
	        return this.stack;
	    };
	    Queue.prototype.flushStack = function () {
	        var temp = this.stack.slice(0);
	        this.stack = [];
	        this.isFlushing = false;
	        for (var i = 0; i < temp.length; i++) {
	            temp[i]();
	        }
	    };
	    return Queue;
	}());

	var TransportData = /** @class */ (function () {
	    function TransportData() {
	        this.queue = new Queue(); // 消息队列
	        this.apikey = ''; // 每个项目对应的唯一标识
	        this.errorDsn = ''; // 监控上报接口的地址
	        this.userId = ''; // 用户id
	        this.useImgUpload = false; // 是否使用图片打点上报
	        this.uuid = generateUUID(); // 每次页面加载的唯一标识
	    }
	    // 判断请求是否为SDK配置的接口
	    TransportData.prototype.isSdkTransportUrl = function (targetUrl) {
	        var isSdkDsn = false;
	        if (this.errorDsn && targetUrl.indexOf(this.errorDsn) !== -1) {
	            isSdkDsn = true;
	        }
	        return isSdkDsn;
	    };
	    TransportData.prototype.bindOptions = function (options) {
	        var dsn = options.dsn, apikey = options.apikey, userId = options.userId, useImgUpload = options.useImgUpload;
	        validateOption(apikey, 'apikey', 'string') && (this.apikey = apikey);
	        validateOption(dsn, 'dsn', 'string') && (this.errorDsn = dsn);
	        validateOption(userId, 'userId', 'string') && (this.userId = userId || '');
	        validateOption(useImgUpload, 'useImgUpload', 'boolean') && (this.useImgUpload = useImgUpload || false);
	    };
	    TransportData.prototype.imgRequest = function (data, url) {
	        var requestFun = function () {
	            var img = new Image();
	            var spliceStr = url.indexOf('?') === -1 ? '?' : '&';
	            img.src = "".concat(url).concat(spliceStr, "data=").concat(encodeURIComponent(JSON.stringify(data)));
	        };
	        this.queue.addFn(requestFun);
	    };
	    TransportData.prototype.xhrPost = function (data, url) {
	        return __awaiter(this, void 0, void 0, function () {
	            var requestFun;
	            return __generator(this, function (_a) {
	                requestFun = function () {
	                    fetch("".concat(url), {
	                        method: 'POST',
	                        body: JSON.stringify(data),
	                        headers: {
	                            'Content-Type': 'application/json',
	                        },
	                    });
	                };
	                this.queue.addFn(requestFun);
	                return [2 /*return*/];
	            });
	        });
	    };
	    TransportData.prototype.beacon = function (url, data) {
	        return navigator.sendBeacon(url, JSON.stringify(data));
	    };
	    // 添加用户信息以及别的信息，当前页面的id
	    // 这里不要添加时间戳，比如接口报错，发生的时间和上报时间不一致
	    TransportData.prototype.getTransportData = function (data) {
	        var info = __assign(__assign({}, data), { apikey: this.apikey, uuid: this.uuid, pageUrl: getLocationHref(), deviceInfo: _support.deviceInfo });
	        // 性能数据、录屏、白屏检测等不需要附带用户行为
	        // const excludeRreadcrumb = [EVENTTYPES.PERFORMANCE, EVENTTYPES.RECORDSCREEN, EVENTTYPES.WHITESCREEN];
	        return info;
	    };
	    // 上报数据前对数据进行处理，添加公共信息，比如dsn, apikey等等
	    TransportData.prototype.beforePost = function (data) {
	        return __awaiter(this, void 0, void 0, function () {
	            var transportData;
	            return __generator(this, function (_a) {
	                transportData = this.getTransportData(data);
	                // 配置了beforeDataReport
	                return [2 /*return*/, transportData];
	            });
	        });
	    };
	    // 上报数据
	    TransportData.prototype.send = function (data) {
	        return __awaiter(this, void 0, void 0, function () {
	            var dsn, result, value;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        dsn = this.errorDsn;
	                        // 开启录屏，由@websee/recordScreen 插件控制
	                        if (_support.options.silentRecordScreen) {
	                            // ['error', 'unhandledrejection', 'resource', 'fetch', 'xhr']
	                            if (options.recordScreenTypeList.includes(data.type)) {
	                                // 修改hasError
	                                _support.hasError = true;
	                                data.recordScreenId = _support.recordScreenId;
	                            }
	                        }
	                        return [4 /*yield*/, this.beforePost(data)];
	                    case 1:
	                        result = (_a.sent());
	                        if (isBrowserEnv && result) {
	                            value = this.beacon(dsn, result);
	                            if (!value) {
	                                // useImgUpload是配置中设置的
	                                return [2 /*return*/, this.useImgUpload ? this.imgRequest(result, dsn) : this.xhrPost(result, dsn)];
	                            }
	                        }
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    return TransportData;
	}());
	var transportData = _support.transportData || (_support.transportData = new TransportData());

	// 绑定配置项，关联到全局变量_support中
	var Options = /** @class */ (function () {
	    function Options() {
	        this.dsn = ''; // 监控上报接口的地址
	        this.throttleDelayTime = 0; // click事件的节流时长
	        this.overTime = 10; // 接口超时时长
	        this.whiteBoxElements = ['html', 'body', '#app', '#root']; // // 白屏检测的容器列表
	        this.silentWhiteScreen = false; // 是否开启白屏检测
	        this.skeletonProject = false; // 项目是否有骨架屏
	        this.repeatCodeError = false; // 是否去除重复的代码错误，重复的错误只上报一次
	    }
	    Options.prototype.bindOptions = function (options) {
	        var dsn = options.dsn, filterXhrUrlRegExp = options.filterXhrUrlRegExp, _a = options.throttleDelayTime, throttleDelayTime = _a === void 0 ? 0 : _a, _b = options.overTime, overTime = _b === void 0 ? 10 : _b, _c = options.silentWhiteScreen, silentWhiteScreen = _c === void 0 ? false : _c, _d = options.whiteBoxElements, whiteBoxElements = _d === void 0 ? ['html', 'body', '#app', '#root'] : _d, _e = options.skeletonProject, skeletonProject = _e === void 0 ? false : _e, handleHttpStatus = options.handleHttpStatus, _f = options.repeatCodeError, repeatCodeError = _f === void 0 ? false : _f;
	        validateOption(dsn, 'dsn', 'string') && (this.dsn = dsn);
	        validateOption(throttleDelayTime, 'throttleDelayTime', 'number') && (this.throttleDelayTime = throttleDelayTime);
	        validateOption(overTime, 'overTime', 'number') && (this.overTime = overTime);
	        validateOption(filterXhrUrlRegExp, 'filterXhrUrlRegExp', 'regexp') && (this.filterXhrUrlRegExp = filterXhrUrlRegExp);
	        validateOption(silentWhiteScreen, 'silentWhiteScreen', 'boolean') && (this.silentWhiteScreen = silentWhiteScreen);
	        validateOption(skeletonProject, 'skeletonProject', 'boolean') && (this.skeletonProject = skeletonProject);
	        validateOption(whiteBoxElements, 'whiteBoxElements', 'array') && (this.whiteBoxElements = whiteBoxElements);
	        validateOption(handleHttpStatus, 'handleHttpStatus', 'function') && (this.handleHttpStatus = handleHttpStatus);
	        validateOption(repeatCodeError, 'repeatCodeError', 'boolean') && (this.repeatCodeError = repeatCodeError);
	    };
	    return Options;
	}());
	var options = _support.options || (_support.options = new Options());
	function handleOptions(paramOptions) {
	    // transportData 配置上报的信息
	    transportData.bindOptions(paramOptions);
	    // 绑定其他配置项
	    options.bindOptions(paramOptions);
	}

	var errorStackParserExports = {};
	var errorStackParser = {
	  get exports(){ return errorStackParserExports; },
	  set exports(v){ errorStackParserExports = v; },
	};

	var stackframeExports = {};
	var stackframe = {
	  get exports(){ return stackframeExports; },
	  set exports(v){ stackframeExports = v; },
	};

	var hasRequiredStackframe;

	function requireStackframe () {
		if (hasRequiredStackframe) return stackframeExports;
		hasRequiredStackframe = 1;
		(function (module, exports) {
			(function(root, factory) {
			    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

			    /* istanbul ignore next */
			    {
			        module.exports = factory();
			    }
			}(commonjsGlobal, function() {
			    function _isNumber(n) {
			        return !isNaN(parseFloat(n)) && isFinite(n);
			    }

			    function _capitalize(str) {
			        return str.charAt(0).toUpperCase() + str.substring(1);
			    }

			    function _getter(p) {
			        return function() {
			            return this[p];
			        };
			    }

			    var booleanProps = ['isConstructor', 'isEval', 'isNative', 'isToplevel'];
			    var numericProps = ['columnNumber', 'lineNumber'];
			    var stringProps = ['fileName', 'functionName', 'source'];
			    var arrayProps = ['args'];
			    var objectProps = ['evalOrigin'];

			    var props = booleanProps.concat(numericProps, stringProps, arrayProps, objectProps);

			    function StackFrame(obj) {
			        if (!obj) return;
			        for (var i = 0; i < props.length; i++) {
			            if (obj[props[i]] !== undefined) {
			                this['set' + _capitalize(props[i])](obj[props[i]]);
			            }
			        }
			    }

			    StackFrame.prototype = {
			        getArgs: function() {
			            return this.args;
			        },
			        setArgs: function(v) {
			            if (Object.prototype.toString.call(v) !== '[object Array]') {
			                throw new TypeError('Args must be an Array');
			            }
			            this.args = v;
			        },

			        getEvalOrigin: function() {
			            return this.evalOrigin;
			        },
			        setEvalOrigin: function(v) {
			            if (v instanceof StackFrame) {
			                this.evalOrigin = v;
			            } else if (v instanceof Object) {
			                this.evalOrigin = new StackFrame(v);
			            } else {
			                throw new TypeError('Eval Origin must be an Object or StackFrame');
			            }
			        },

			        toString: function() {
			            var fileName = this.getFileName() || '';
			            var lineNumber = this.getLineNumber() || '';
			            var columnNumber = this.getColumnNumber() || '';
			            var functionName = this.getFunctionName() || '';
			            if (this.getIsEval()) {
			                if (fileName) {
			                    return '[eval] (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
			                }
			                return '[eval]:' + lineNumber + ':' + columnNumber;
			            }
			            if (functionName) {
			                return functionName + ' (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
			            }
			            return fileName + ':' + lineNumber + ':' + columnNumber;
			        }
			    };

			    StackFrame.fromString = function StackFrame$$fromString(str) {
			        var argsStartIndex = str.indexOf('(');
			        var argsEndIndex = str.lastIndexOf(')');

			        var functionName = str.substring(0, argsStartIndex);
			        var args = str.substring(argsStartIndex + 1, argsEndIndex).split(',');
			        var locationString = str.substring(argsEndIndex + 1);

			        if (locationString.indexOf('@') === 0) {
			            var parts = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(locationString, '');
			            var fileName = parts[1];
			            var lineNumber = parts[2];
			            var columnNumber = parts[3];
			        }

			        return new StackFrame({
			            functionName: functionName,
			            args: args || undefined,
			            fileName: fileName,
			            lineNumber: lineNumber || undefined,
			            columnNumber: columnNumber || undefined
			        });
			    };

			    for (var i = 0; i < booleanProps.length; i++) {
			        StackFrame.prototype['get' + _capitalize(booleanProps[i])] = _getter(booleanProps[i]);
			        StackFrame.prototype['set' + _capitalize(booleanProps[i])] = (function(p) {
			            return function(v) {
			                this[p] = Boolean(v);
			            };
			        })(booleanProps[i]);
			    }

			    for (var j = 0; j < numericProps.length; j++) {
			        StackFrame.prototype['get' + _capitalize(numericProps[j])] = _getter(numericProps[j]);
			        StackFrame.prototype['set' + _capitalize(numericProps[j])] = (function(p) {
			            return function(v) {
			                if (!_isNumber(v)) {
			                    throw new TypeError(p + ' must be a Number');
			                }
			                this[p] = Number(v);
			            };
			        })(numericProps[j]);
			    }

			    for (var k = 0; k < stringProps.length; k++) {
			        StackFrame.prototype['get' + _capitalize(stringProps[k])] = _getter(stringProps[k]);
			        StackFrame.prototype['set' + _capitalize(stringProps[k])] = (function(p) {
			            return function(v) {
			                this[p] = String(v);
			            };
			        })(stringProps[k]);
			    }

			    return StackFrame;
			}));
	} (stackframe));
		return stackframeExports;
	}

	(function (module, exports) {
		(function(root, factory) {
		    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

		    /* istanbul ignore next */
		    {
		        module.exports = factory(requireStackframe());
		    }
		}(commonjsGlobal, function ErrorStackParser(StackFrame) {

		    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
		    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
		    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;

		    return {
		        /**
		         * Given an Error object, extract the most information from it.
		         *
		         * @param {Error} error object
		         * @return {Array} of StackFrames
		         */
		        parse: function ErrorStackParser$$parse(error) {
		            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
		                return this.parseOpera(error);
		            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
		                return this.parseV8OrIE(error);
		            } else if (error.stack) {
		                return this.parseFFOrSafari(error);
		            } else {
		                throw new Error('Cannot parse given Error object');
		            }
		        },

		        // Separate line and column numbers from a string of the form: (URI:Line:Column)
		        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
		            // Fail-fast but return locations like "(native)"
		            if (urlLike.indexOf(':') === -1) {
		                return [urlLike];
		            }

		            var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
		            var parts = regExp.exec(urlLike.replace(/[()]/g, ''));
		            return [parts[1], parts[2] || undefined, parts[3] || undefined];
		        },

		        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
		            var filtered = error.stack.split('\n').filter(function(line) {
		                return !!line.match(CHROME_IE_STACK_REGEXP);
		            }, this);

		            return filtered.map(function(line) {
		                if (line.indexOf('(eval ') > -1) {
		                    // Throw away eval information until we implement stacktrace.js/stackframe#8
		                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^()]*)|(,.*$)/g, '');
		                }
		                var sanitizedLine = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').replace(/^.*?\s+/, '');

		                // capture and preseve the parenthesized location "(/foo/my bar.js:12:87)" in
		                // case it has spaces in it, as the string is split on \s+ later on
		                var location = sanitizedLine.match(/ (\(.+\)$)/);

		                // remove the parenthesized location from the line, if it was matched
		                sanitizedLine = location ? sanitizedLine.replace(location[0], '') : sanitizedLine;

		                // if a location was matched, pass it to extractLocation() otherwise pass all sanitizedLine
		                // because this line doesn't have function name
		                var locationParts = this.extractLocation(location ? location[1] : sanitizedLine);
		                var functionName = location && sanitizedLine || undefined;
		                var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];

		                return new StackFrame({
		                    functionName: functionName,
		                    fileName: fileName,
		                    lineNumber: locationParts[1],
		                    columnNumber: locationParts[2],
		                    source: line
		                });
		            }, this);
		        },

		        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
		            var filtered = error.stack.split('\n').filter(function(line) {
		                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
		            }, this);

		            return filtered.map(function(line) {
		                // Throw away eval information until we implement stacktrace.js/stackframe#8
		                if (line.indexOf(' > eval') > -1) {
		                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ':$1');
		                }

		                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
		                    // Safari eval frames only have function names and nothing else
		                    return new StackFrame({
		                        functionName: line
		                    });
		                } else {
		                    var functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
		                    var matches = line.match(functionNameRegex);
		                    var functionName = matches && matches[1] ? matches[1] : undefined;
		                    var locationParts = this.extractLocation(line.replace(functionNameRegex, ''));

		                    return new StackFrame({
		                        functionName: functionName,
		                        fileName: locationParts[0],
		                        lineNumber: locationParts[1],
		                        columnNumber: locationParts[2],
		                        source: line
		                    });
		                }
		            }, this);
		        },

		        parseOpera: function ErrorStackParser$$parseOpera(e) {
		            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
		                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
		                return this.parseOpera9(e);
		            } else if (!e.stack) {
		                return this.parseOpera10(e);
		            } else {
		                return this.parseOpera11(e);
		            }
		        },

		        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
		            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
		            var lines = e.message.split('\n');
		            var result = [];

		            for (var i = 2, len = lines.length; i < len; i += 2) {
		                var match = lineRE.exec(lines[i]);
		                if (match) {
		                    result.push(new StackFrame({
		                        fileName: match[2],
		                        lineNumber: match[1],
		                        source: lines[i]
		                    }));
		                }
		            }

		            return result;
		        },

		        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
		            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
		            var lines = e.stacktrace.split('\n');
		            var result = [];

		            for (var i = 0, len = lines.length; i < len; i += 2) {
		                var match = lineRE.exec(lines[i]);
		                if (match) {
		                    result.push(
		                        new StackFrame({
		                            functionName: match[3] || undefined,
		                            fileName: match[2],
		                            lineNumber: match[1],
		                            source: lines[i]
		                        })
		                    );
		                }
		            }

		            return result;
		        },

		        // Opera 10.65+ Error.stack very similar to FF/Safari
		        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
		            var filtered = error.stack.split('\n').filter(function(line) {
		                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
		            }, this);

		            return filtered.map(function(line) {
		                var tokens = line.split('@');
		                var locationParts = this.extractLocation(tokens.pop());
		                var functionCall = (tokens.shift() || '');
		                var functionName = functionCall
		                    .replace(/<anonymous function(: (\w+))?>/, '$2')
		                    .replace(/\([^)]*\)/g, '') || undefined;
		                var argsRaw;
		                if (functionCall.match(/\(([^)]*)\)/)) {
		                    argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, '$1');
		                }
		                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ?
		                    undefined : argsRaw.split(',');

		                return new StackFrame({
		                    functionName: functionName,
		                    args: args,
		                    fileName: locationParts[0],
		                    lineNumber: locationParts[1],
		                    columnNumber: locationParts[2],
		                    source: line
		                });
		            }, this);
		        }
		    };
		}));
	} (errorStackParser));

	var ErrorStackParser = errorStackParserExports;

	function resourceTransform(target) {
	    return {
	        time: getTimestamp(),
	        message: (interceptStr(target.src, 120) || interceptStr(target.href, 120)) + '; 资源加载失败',
	        name: target.localName,
	    };
	}
	// 处理接口的状态，生成格式统一的对象
	function httpTransform(data) {
	    var message = '';
	    var elapsedTime = data.elapsedTime, time = data.time, _a = data.method, method = _a === void 0 ? '' : _a, type = data.type, _b = data.Status, Status = _b === void 0 ? 200 : _b, response = data.response, requestData = data.requestData;
	    var status;
	    if (Status === 0) {
	        status = STATUS_CODE.ERROR;
	        message = elapsedTime <= options.overTime * 1000 ? "\u8BF7\u6C42\u5931\u8D25\uFF0CStatus\u503C\u4E3A:".concat(Status) : '请求失败，接口超时';
	    }
	    else if (Status < HTTP_CODE.BAD_REQUEST) {
	        status = STATUS_CODE.OK;
	        if (options.handleHttpStatus && typeof options.handleHttpStatus == 'function') {
	            if (options.handleHttpStatus(data)) {
	                status = STATUS_CODE.OK;
	            }
	            else {
	                status = STATUS_CODE.ERROR;
	                message = "\u63A5\u53E3\u62A5\u9519\uFF0C\u62A5\u9519\u4FE1\u606F\u4E3A\uFF1A".concat(typeof response == 'object' ? JSON.stringify(response) : response);
	            }
	        }
	    }
	    else {
	        status = STATUS_CODE.ERROR;
	        message = "\u8BF7\u6C42\u5931\u8D25\uFF0CStatus\u503C\u4E3A:".concat(Status, "\uFF0C").concat(fromHttpStatus(Status));
	    }
	    message = "".concat(data.url, "; ").concat(message);
	    return {
	        url: data.url,
	        time: time,
	        status: status,
	        elapsedTime: elapsedTime,
	        message: message,
	        requestData: {
	            httpType: type,
	            method: method,
	            data: requestData || '',
	        },
	        response: {
	            Status: Status,
	            data: status == STATUS_CODE.ERROR ? response : null,
	        },
	    };
	}

	var Breadcrumb = /** @class */ (function () {
	    function Breadcrumb() {
	        this.maxBreadcrumbs = 20; // 用户行为存放的最大长度
	        this.beforePushBreadcrumb = null;
	        this.stack = [];
	    }
	    /**
	     * 添加用户行为栈
	     */
	    Breadcrumb.prototype.push = function (data) {
	        if (typeof this.beforePushBreadcrumb === 'function') {
	            // 执行用户自定义的hook
	            var result = this.beforePushBreadcrumb(data);
	            if (!result)
	                return;
	            this.immediatePush(result);
	            return;
	        }
	        this.immediatePush(data);
	    };
	    Breadcrumb.prototype.immediatePush = function (data) {
	        data.time || (data.time = getTimestamp());
	        if (this.stack.length >= this.maxBreadcrumbs) {
	            this.shift();
	        }
	        this.stack.push(data);
	        this.stack.sort(function (a, b) { return a.time - b.time; });
	    };
	    Breadcrumb.prototype.shift = function () {
	        return this.stack.shift() !== undefined;
	    };
	    Breadcrumb.prototype.clear = function () {
	        this.stack = [];
	    };
	    Breadcrumb.prototype.getStack = function () {
	        return this.stack;
	    };
	    Breadcrumb.prototype.getCategory = function (type) {
	        switch (type) {
	            // 接口请求
	            case EVENTTYPES.XHR:
	            case EVENTTYPES.FETCH:
	                return BREADCRUMBTYPES.HTTP;
	            // 用户点击
	            case EVENTTYPES.CLICK:
	                return BREADCRUMBTYPES.CLICK;
	            // 路由变化
	            case EVENTTYPES.HISTORY:
	            case EVENTTYPES.HASHCHANGE:
	                return BREADCRUMBTYPES.ROUTE;
	            // 加载资源
	            case EVENTTYPES.RESOURCE:
	                return BREADCRUMBTYPES.RESOURCE;
	            // Js代码报错
	            case EVENTTYPES.UNHANDLEDREJECTION:
	            case EVENTTYPES.ERROR:
	                return BREADCRUMBTYPES.CODEERROR;
	            // 用户自定义
	            default:
	                return BREADCRUMBTYPES.CUSTOM;
	        }
	    };
	    Breadcrumb.prototype.bindOptions = function (options) {
	        // maxBreadcrumbs 用户行为存放的最大容量
	        // beforePushBreadcrumb 添加用户行为前的处理函数
	        var maxBreadcrumbs = options.maxBreadcrumbs, beforePushBreadcrumb = options.beforePushBreadcrumb;
	        validateOption(maxBreadcrumbs, 'maxBreadcrumbs', 'number') && (this.maxBreadcrumbs = maxBreadcrumbs || 20);
	        validateOption(beforePushBreadcrumb, 'beforePushBreadcrumb', 'function') && (this.beforePushBreadcrumb = beforePushBreadcrumb);
	    };
	    return Breadcrumb;
	}());
	var breadcrumb = _support.breadcrumb || (_support.breadcrumb = new Breadcrumb());

	var HandleEvents = {
	    // 处理xhr、fetch回调
	    handleHttp: function (data, type) {
	        var result = httpTransform(data);
	        // 请求状态码error的时候上报错误
	        if (result.status === 'error') {
	            // 上报接口错误
	            transportData.send(__assign(__assign({}, result), { type: type, status: STATUS_CODE.ERROR }));
	        }
	    },
	    // 以error为例
	    handleError: function (ev) {
	        var target = ev.target;
	        if (!target || (ev.target && !ev.target.localName)) {
	            // vue和react捕获的报错使用ev解析，异步错误使用ev.error解析
	            var stackFrame = ErrorStackParser.parse(!target ? ev : ev.error)[0];
	            var fileName = stackFrame.fileName, columnNumber = stackFrame.columnNumber, lineNumber = stackFrame.lineNumber;
	            var errorData = {
	                type: EVENTTYPES.ERROR,
	                status: STATUS_CODE.ERROR,
	                time: getTimestamp(),
	                message: ev.message,
	                fileName: fileName,
	                line: lineNumber,
	                column: columnNumber,
	            };
	            breadcrumb.push({
	                type: EVENTTYPES.ERROR,
	                category: breadcrumb.getCategory(EVENTTYPES.ERROR),
	                data: errorData,
	                time: getTimestamp(),
	                status: STATUS_CODE.ERROR,
	            });
	            var hash = getErrorUid("".concat(EVENTTYPES.ERROR, "-").concat(ev.message, "-").concat(fileName, "-").concat(columnNumber));
	            // 开启repeatCodeError第一次报错才上报
	            if (!options.repeatCodeError || (options.repeatCodeError && !hashMapExist(hash))) {
	                return transportData.send(errorData);
	            }
	        }
	        // 资源加载报错
	        if (target === null || target === void 0 ? void 0 : target.localName) {
	            // 提取资源加载的信息
	            var data = resourceTransform(target);
	            return transportData.send(__assign(__assign({}, data), { type: EVENTTYPES.RESOURCE, status: STATUS_CODE.ERROR }));
	        }
	    },
	    handleUnhandleRejection: function (ev) {
	        console.log(ev);
	        var stackFrame = ErrorStackParser.parse(ev.reason)[0];
	        var fileName = stackFrame.fileName, columnNumber = stackFrame.columnNumber, lineNumber = stackFrame.lineNumber;
	        var message = unknownToString(ev.reason.message || ev.reason.stack);
	        var data = {
	            type: EVENTTYPES.UNHANDLEDREJECTION,
	            status: STATUS_CODE.ERROR,
	            time: getTimestamp(),
	            message: message,
	            fileName: fileName,
	            line: lineNumber,
	            column: columnNumber,
	        };
	        var hash = getErrorUid("".concat(EVENTTYPES.UNHANDLEDREJECTION, "-").concat(message, "-").concat(fileName, "-").concat(columnNumber));
	        // 开启repeatCodeError第一次报错才上报
	        if (!options.repeatCodeError || (options.repeatCodeError && !hashMapExist(hash))) {
	            transportData.send(data);
	        }
	    },
	};

	var HTTPTYPE;
	(function (HTTPTYPE) {
	    HTTPTYPE["XHR"] = "xhr";
	    HTTPTYPE["FETCH"] = "fetch";
	})(HTTPTYPE || (HTTPTYPE = {}));
	var EMethods;
	(function (EMethods) {
	    EMethods["Get"] = "GET";
	    EMethods["Post"] = "POST";
	    EMethods["Put"] = "PUT";
	    EMethods["Delete"] = "DELETE";
	})(EMethods || (EMethods = {}));

	// 订阅发布模式，先订阅事件，然后错误时发布通知，存储handler这个对象，然后在适当的时机调用，回调主要是对数据进行上报以及简单的处理
	var handlers = {};
	// subscribeEvent 设置标识，并将处理的方法放置到handlers中，{ xhr: [ funtion ] }
	function subscribeEvent(handler) {
	    var _a;
	    if (!handler || getFlag(handler.type))
	        return false;
	    setFlag(handler.type, true);
	    handlers[handler.type] = handlers[handler.type] || [];
	    (_a = handlers[handler.type]) === null || _a === void 0 ? void 0 : _a.push(handler.callback);
	    return true;
	}
	function notify(type, data) {
	    var _a;
	    if (!type || !handlers[type])
	        return;
	    // 获取对应事件的回调函数并执行，回调函数为addReplaceHandler事件中定义的事件
	    (_a = handlers[type]) === null || _a === void 0 ? void 0 : _a.forEach(function (callback) {
	        nativeTryCatch(function () {
	            callback(data);
	        }, function () {
	            // console.error(
	            //   `web-see 重写事件notify的回调函数发生错误\nType:${type}\nName: ${getFunctionName(
	            //     callback
	            //   )}\nError: ${e}`
	            // );
	        });
	    });
	}

	function addReplaceHandler(handler) {
	    if (!subscribeEvent(handler))
	        return;
	    replace(handler.type);
	}
	// 订阅发布，然后进行拦截，适当的时机上报
	function replace(type) {
	    switch (type) {
	        case EVENTTYPES.XHR:
	            xhrReplace();
	            break;
	        case EVENTTYPES.FETCH:
	            fetchReplace();
	            break;
	        case EVENTTYPES.ERROR:
	            listenError();
	            break;
	        case EVENTTYPES.UNHANDLEDREJECTION:
	            unhandledrejectionReplace();
	            break;
	    }
	}
	function xhrReplace() {
	    if (!('XMLHttpRequest' in _global)) {
	        return;
	    }
	    var originalXhrProto = XMLHttpRequest.prototype;
	    // 拦截请求方法，请求地址，时间戳
	    replaceAop(originalXhrProto, 'open', function (originalOpen) {
	        return function () {
	            var args = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                args[_i] = arguments[_i];
	            }
	            this.websee_xhr = {
	                method: variableTypeDetection.isString(args[0]) ? args[0].toUpperCase() : args[0],
	                url: args[1],
	                sTime: getTimestamp(),
	                type: HTTPTYPE.XHR,
	            };
	            originalOpen.apply(this, args);
	        };
	    });
	    replaceAop(originalXhrProto, 'send', function (originalSend) {
	        return function () {
	            var args = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                args[_i] = arguments[_i];
	            }
	            var _a = this.websee_xhr, method = _a.method, url = _a.url;
	            // 监听loadend事件，接口成功或失败都会执行
	            on(this, 'loadend', function () {
	                // isSdkTransportUrl 判断当前接口是否为上报的接口
	                // isFilterHttpUrl 判断当前接口是否为需要过滤掉的接口
	                if ((method === EMethods.Post && transportData.isSdkTransportUrl(url)) || isFilterHttpUrl(url))
	                    return;
	                var _a = this, responseType = _a.responseType, response = _a.response, status = _a.status;
	                this.websee_xhr.requestData = args[0];
	                var eTime = getTimestamp();
	                // 设置该接口的time，用户用户行为按时间排序
	                this.websee_xhr.time = this.websee_xhr.sTime;
	                this.websee_xhr.Status = status;
	                if (['', 'json', 'text'].indexOf(responseType) !== -1) {
	                    // 用户设置handleHttpStatus函数来判断接口是否正确，只有接口报错时才保留response
	                    if (options.handleHttpStatus && typeof options.handleHttpStatus == 'function') {
	                        this.websee_xhr.response = response && JSON.parse(response);
	                    }
	                }
	                // 接口的执行时长
	                this.websee_xhr.elapsedTime = eTime - this.websee_xhr.sTime;
	                // 执行之前注册的xhr回调函数
	                notify(EVENTTYPES.XHR, this.websee_xhr);
	            });
	            originalSend.apply(this, args);
	        };
	    });
	}
	function fetchReplace() {
	    if (!('fetch' in _global)) {
	        return;
	    }
	    replaceAop(_global, EVENTTYPES.FETCH, function (originalFetch) {
	        return function (url, config) {
	            if (config === void 0) { config = {}; }
	            var sTime = getTimestamp();
	            var method = (config && config.method) || 'GET';
	            var fetchData = {
	                type: HTTPTYPE.FETCH,
	                method: method,
	                requestData: config && config.body,
	                url: url,
	                response: '',
	            };
	            // 获取配置的headers
	            var headers = new Headers(config.headers || {});
	            Object.assign(headers, {
	                setRequestHeader: headers.set,
	            });
	            config = Object.assign({}, config, headers);
	            return originalFetch.apply(_global, [url, config]).then(function (res) {
	                // 克隆一份，防止被标记已消费
	                var tempRes = res.clone();
	                var eTime = getTimestamp();
	                fetchData = Object.assign({}, fetchData, {
	                    elapsedTime: eTime - sTime,
	                    Status: tempRes.status,
	                    time: sTime,
	                });
	                tempRes.text().then(function (data) {
	                    // 同理，进接口进行过滤
	                    if ((method === EMethods.Post && transportData.isSdkTransportUrl(url)) || isFilterHttpUrl(url))
	                        return;
	                    // 用户设置handleHttpStatus函数来判断接口是否正确，只有接口报错时才保留response
	                    if (options.handleHttpStatus && typeof options.handleHttpStatus == 'function') {
	                        fetchData.response = data;
	                    }
	                    notify(EVENTTYPES.FETCH, fetchData);
	                });
	                return res;
	            }, 
	            // 接口报错
	            function (err) {
	                var eTime = getTimestamp();
	                if ((method === EMethods.Post && transportData.isSdkTransportUrl(url)) || isFilterHttpUrl(url))
	                    return;
	                fetchData = Object.assign({}, fetchData, {
	                    elapsedTime: eTime - sTime,
	                    status: 0,
	                    time: sTime,
	                });
	                notify(EVENTTYPES.FETCH, fetchData);
	                throw err;
	            });
	        };
	    });
	}
	function listenError() {
	    on(_global, 'error', function (e) {
	        e.preventDefault();
	        notify(EVENTTYPES.ERROR, e);
	    }, true);
	}
	function unhandledrejectionReplace() {
	    on(_global, EVENTTYPES.UNHANDLEDREJECTION, function (ev) {
	        ev.preventDefault(); // 阻止默认行为后，控制台就不会再报红色错误
	        notify(EVENTTYPES.UNHANDLEDREJECTION, ev);
	    });
	}
	// 判断当前接口是否为需要过滤掉的接口
	function isFilterHttpUrl(url) {
	    return options.filterXhrUrlRegExp && options.filterXhrUrlRegExp.test(url);
	}

	function setupReplace() {
	    // 重写XMLHttpRequest
	    addReplaceHandler({
	        callback: function (data) {
	            HandleEvents.handleHttp(data, EVENTTYPES.XHR);
	        },
	        type: EVENTTYPES.XHR,
	    });
	    // 重写fetch
	    addReplaceHandler({
	        callback: function (data) {
	            HandleEvents.handleHttp(data, EVENTTYPES.FETCH);
	        },
	        type: EVENTTYPES.FETCH,
	    });
	    // 捕获错误
	    addReplaceHandler({
	        callback: function (error) {
	            HandleEvents.handleError(error);
	        },
	        type: EVENTTYPES.ERROR,
	    });
	    // 添加handleUnhandleRejection事件
	    addReplaceHandler({
	        callback: function (data) {
	            HandleEvents.handleUnhandleRejection(data);
	        },
	        type: EVENTTYPES.UNHANDLEDREJECTION,
	    });
	}

	// 作为插件的形式插入到Vue中，当使用Vue.use(Websee)时，就会调用Websee的这个方法
	function install(Vue, options) {
	    var handler = Vue.config.errorHandler;
	    // vue项目在Vue.config.errorHandler中上报错误, 在初始化的时候去注册事件
	    Vue.config.errorHandler = function (err, vm, info) {
	        console.log(err);
	        HandleEvents.handleError(err);
	        if (handler)
	            handler.apply(null, [err, vm, info]);
	    };
	    init(options);
	}
	// 初始化配置
	function init(options) {
	    if (!options.dsn || !options.apikey) {
	        return console.error("web-mon \u7F3A\u5C11\u5FC5\u987B\u914D\u7F6E\u9879\uFF1A".concat(!options.dsn ? 'dsn' : 'apikey', " "));
	    }
	    if (!('fetch' in _global) || options.disabled)
	        return;
	    // 初始化配置
	    handleOptions(options);
	    // 初始化事件的拦截
	    setupReplace();
	}
	// 插件
	function use(plugin, option) {
	    var instance = new plugin(option);
	    nativeTryCatch(function () {
	        instance.core({ transportData: transportData, options: options });
	    });
	}
	function captureError(_a) {
	    var message = _a.message, lineNumber = _a.lineNumber, columnNumber = _a.columnNumber;
	    var errorData = {
	        type: EVENTTYPES.ERROR,
	        status: STATUS_CODE.ERROR,
	        time: getTimestamp(),
	        message: message,
	        line: lineNumber,
	        column: columnNumber,
	    };
	    transportData.send(errorData);
	}
	var index = {
	    install: install,
	    use: use,
	    init: init,
	    captureError: captureError,
	};

	return index;

}));
//# sourceMappingURL=index.js.map
