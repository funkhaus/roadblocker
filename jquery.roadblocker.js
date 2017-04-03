/* Roadblocker 1.4 */

(function($) {

    // Rolled-in version of js-cookie 2.1.2
    !function(e){if("function"==typeof define&&define.amd)define(e);else if("object"==typeof exports)module.exports=e();else{var n=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=n,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var t=arguments[e];for(var o in t)n[o]=t[o]}return n}function n(t){function o(n,r,i){var c;if("undefined"!=typeof document){if(arguments.length>1){if(i=e({path:"/"},o.defaults,i),"number"==typeof i.expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*i.expires),i.expires=a}try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(s){}return r=t.write?t.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=encodeURIComponent(String(n)),n=n.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent),n=n.replace(/[\(\)]/g,escape),document.cookie=[n,"=",r,i.expires?"; expires="+i.expires.toUTCString():"",i.path?"; path="+i.path:"",i.domain?"; domain="+i.domain:"",i.secure?"; secure":""].join("")}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],u=/(%[0-9A-Z]{2})+/g,d=0;d<p.length;d++){var f=p[d].split("="),l=f.slice(1).join("=");'"'===l.charAt(0)&&(l=l.slice(1,-1));try{var m=f[0].replace(u,decodeURIComponent);if(l=t.read?t.read(l,m):t(l,m)||l.replace(u,decodeURIComponent),this.json)try{l=JSON.parse(l)}catch(s){}if(n===m){c=l;break}n||(c[m]=l)}catch(s){}}return c}}return o.set=o,o.get=function(e){return o(e)},o.getJSON=function(){return o.apply({json:!0},[].slice.call(arguments))},o.defaults={},o.remove=function(n,t){o(n,"",e(t,{expires:-1}))},o.withConverter=n,o}return n(function(){})});

    $.fn.roadblocker = function(options, onClose) {

        var callback = null;

        var command = null;
        if( typeof options == 'string' ){
            command = options;
            options = null;
        }

        if( typeof options == 'function' ){
            callback = options;
            options = null;
        }

        // Defaults
        var settings = $.extend({
            timesPerSession: 1,
            totalTimesToShow: 3,
            waitTime: 10000,
            ignorePaths: [],
            onlyPaths: [],
            onShow: callback || function(){
                jQuery('body').addClass('roadblock-activated');
            },
            onClose: onClose || function(){
                jQuery('body').removeClass('roadblock-activated');
            },
            closeElement: null,
            log: false
        }, options);

        return this.each(function() {

            var permanentCookie = 'roadblocker-permanent';
            var permanentCookieContent;
            var sessionCookie = 'roadblocker-session';
            var sessionCookieContent;
            var timesDisplayed = 'timesDisplayed:';
            var neverShow = 'neverShow';
            var timesDisplayedThisSession = 0, timesDisplayedAllTime = 0;

            // Look for roadblocker-session
            var session = Cookies.get(sessionCookie);
            if ( session != undefined ) {
                // Cache session cookie content
                sessionCookieContent = session.replace(sessionCookie + '=', '').replace(/;.*/, '');

                // Has the roadblock been displayed enough times this session?
                timesDisplayedThisSession = sessionCookieContent.match(/timesDisplayed:(\d*)/)[1];
                timesDisplayedThisSession = parseInt(timesDisplayedThisSession);
                if (!command && timesDisplayedThisSession >= settings.timesPerSession ) {
                    if (settings.log) {
                        console.log('Maximum times to show per session reached, exiting roadblocker...');
                    }
                    return this;
                }
            }

            // Look for roadblocker-permanent
            var permanent = Cookies.get(permanentCookie);
            if ( permanent != undefined ) {
                // Cache permanent cookie content
                permanentCookieContent = permanent.replace(permanentCookie + '=', '').replace(/;.*/, '');

                if ( !command && permanent.includes(neverShow) ) {
                    if (settings.log) {
                        console.log('Permanent cookie has \'never show\' flag set, exiting roadblocker...');
                    }
                    return this;
                }

                // Has the roadblock been displayed enough times over all time?
                timesDisplayedAllTime = permanentCookieContent.match(/timesDisplayed:(\d*)/)[1];
                timesDisplayedAllTime = parseInt(timesDisplayedAllTime);

                if ( !command && timesDisplayedAllTime >= settings.totalTimesToShow ) {
                    if (settings.log) {
                        console.log('Maximum times to show over all time reached, exiting roadblocker...');
                    }
                    return this;
                }
            }

            // Parse commands
            if( command != null ){

                if (command == 'close-once' || command == 'close') { // 'close-once' for backwards compatibility
                    if( $(this).data && typeof $(this).data.onClose == 'function' ){
                        $(this).data.onClose();
                    }
                    return this;
                }

                if (command == 'close-permanently'){
                    Cookies.set(sessionCookie, sessionCookieContent + neverShow);
                    Cookies.set(permanentCookie, permanentCookieContent + neverShow, { expires: 3650 });
                    if( $(this).data && typeof $(this).data.onClose == 'function' ){
                        $(this).data.onClose();
                    }
                    return this;
                }

                if( command == 'cancel' ){
                    if( $(this).data('roadblocker-timer') ){
                        clearTimeout( $(this).data('roadblocker-timer') );
                        console.log('Timeout cleared');
                        $(this).data('roadblocker-timer', null);
                    }
                }
            }

            // Check pathname
            var pathname = location.pathname;
            // Ignoring paths
            for (var i = 0; i < settings.ignorePaths.length; i++) {
                if ( settings.ignorePaths[i] == pathname ) {
                    if (settings.log) {
                        console.log(settings);
                        console.log('Path name matches a name in the ignorePaths list, exiting roadblocker...');
                    }
                    return this;
                }
            }
            // Only paths
            for( var i = 0; i < settings.onlyPaths.length; i++ ){
                if( settings.onlyPaths[i] != pathname ){
                    if (settings.log) {
                        console.log('Path name does not match a name in the onlyPaths list, exiting roadblocker...');
                    }
                    return this;
                }
            }

            // Create cookies if necessary and cache their content
            if ( session == undefined ) {
                session = Cookies.set(sessionCookie, timesDisplayed + '0');
                sessionCookieContent = session.replace(sessionCookie + '=', '').replace(/;.*/, '');
            }
            if ( permanent == undefined ) {
                permanent = Cookies.set(permanentCookie, timesDisplayed + '0', { expires: 3650 });
                permanentCookieContent = permanent.replace(permanentCookie + '=', '').replace(/;.*/, '');
            }

            if( typeof( settings.onClose ) == 'function' ){
                $(this).data.onClose = settings.onClose;
            }

            // Set up timeout and roadblock spawn function
            var timer = setTimeout(function() {
                // Increment roadblocker-session and roadblocker-permanent counts when roadblock appears
                timesDisplayedThisSession++;
                timesDisplayedAllTime++;
                Cookies.set(sessionCookie, sessionCookieContent.replace(/timesDisplayed:\d/, timesDisplayed + timesDisplayedThisSession));
                Cookies.set(permanentCookie, permanentCookieContent.replace(/timesDisplayed:\d/, timesDisplayed + timesDisplayedThisSession), { expires: 3650 });

                if (settings.onShow != null) {
                    settings.onShow();
                }
            }, settings.waitTime);

            // Save to element
            $(this).data('roadblocker-timer', timer);

            // Set up close trigger
            if( settings.closeElement !== null ){
                jQuery('body').on('click', settings.closeElement, function(){
                    if( settings.onClose != null ){
                        settings.onClose();
                    }
                });
            }

            return this;

        });

    }

}(jQuery));
