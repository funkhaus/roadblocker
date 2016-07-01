(function($) {

    // Rolled-in version of js-cookie 2.1.2
    !function(e){if("function"==typeof define&&define.amd)define(e);else if("object"==typeof exports)module.exports=e();else{var n=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=n,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var t=arguments[e];for(var o in t)n[o]=t[o]}return n}function n(t){function o(n,r,i){var c;if("undefined"!=typeof document){if(arguments.length>1){if(i=e({path:"/"},o.defaults,i),"number"==typeof i.expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*i.expires),i.expires=a}try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(s){}return r=t.write?t.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=encodeURIComponent(String(n)),n=n.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent),n=n.replace(/[\(\)]/g,escape),document.cookie=[n,"=",r,i.expires?"; expires="+i.expires.toUTCString():"",i.path?"; path="+i.path:"",i.domain?"; domain="+i.domain:"",i.secure?"; secure":""].join("")}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],u=/(%[0-9A-Z]{2})+/g,d=0;d<p.length;d++){var f=p[d].split("="),l=f.slice(1).join("=");'"'===l.charAt(0)&&(l=l.slice(1,-1));try{var m=f[0].replace(u,decodeURIComponent);if(l=t.read?t.read(l,m):t(l,m)||l.replace(u,decodeURIComponent),this.json)try{l=JSON.parse(l)}catch(s){}if(n===m){c=l;break}n||(c[m]=l)}catch(s){}}return c}}return o.set=o,o.get=function(e){return o(e)},o.getJSON=function(){return o.apply({json:!0},[].slice.call(arguments))},o.defaults={},o.remove=function(n,t){o(n,"",e(t,{expires:-1}))},o.withConverter=n,o}return n(function(){})});

    $.fn.roadblocker = function(options, submitButton) {



        // Defaults
        var settings = $.extend({
            timesPerSession: 1,
            totalTimesToShow: 3,
            waitTime: 10000,
            ignorePaths: ['/'],
            singleCloseButton: '.close-roadblock',
            permanentCloseButton: '.signup',
            onRoadblockAppear: null
        }, options);

        var permanentCookie = 'roadblocker-permanent';
        var sessionCookie = 'roadblocker-session';
        var timesDisplayed = 'timesDisplayed=';
        var neverShow = 'neverShow';

        return this.each(function() {
            // Hide roadblock
            $(this).css('display', 'none');

            var timesDisplayedThisSession = 0, timesDisplayedAllTime = 0;

            // Look for roadblocker-session
            var session = Cookies.get(sessionCookie);
            if ( session != undefined ) {
                // Has the roadblock been displayed enough times this session?
                timesDisplayedThisSession = session.match(/timesDisplayed=(\d*)/)[1];
                timesDisplayedThisSession = parseInt(timesDisplayedThisSession);
                // Also, does the session cookie have the 'neverShow' flag?
                if (timesDisplayedThisSession >= settings.timesPerSession || session.includes(neverShow)) {
                    return;
                }
            }

            // Look for roadblocker-permanent
            var permanent = Cookies.get(permanentCookie);
            if ( permanent != undefined ) {
                if ( permanent.includes(neverShow) ) {
                    return;
                }
            }

            // Check pathname
            var pathname = location.pathname;
            for (var i = 0; i < settings.ignorePaths.length; i++) {
                if ( settings.ignorePaths[i] == pathname ) {
                    return;
                }
            }

            // Create cookies if necessary
            if ( session == undefined ) {
                session = Cookies.set(sessionCookie, timesDisplayed + '0');
            }
            if ( permanent == undefined ) {
                permanent = Cookies.set(permanentCookie, timesDisplayed + '0');
            }

            // Set up close button
            var $closeButton = $(this).children(settings.singleCloseButton);
            // Search DOM if child closeButton isn't found
            if ( ! $closeButton.length ) $closeButton = $(settings.singleCloseButton);
            // Increment roadblocker-session and roadblocker-permanent counts on close button click
            $closeButton.on('click', function() {
                timesDisplayedThisSession++;
                timesDisplayedAllTime++;
                Cookies.set(sessionCookie, session.replace(/(timesDisplayed=\d)/, timesDisplayed + timesDisplayedThisSession));
                Cookies.set(permanentCookie, permanent.replace(/(timesDisplayed=\d)/, timesDisplayed + timesDisplayedThisSession));
            });

            // Set up permanent close button
            var $permanentClose = $(this).children(settings.permanentCloseButton);
            // Search DOM if child permanent close button isn't found
            if ( ! $permanentClose.length ) $permanentClose = $(settings.permanentCloseButton);
            // Add 'never-show' flag to cookies on permanentClose click
            $permanentClose.on('click', function() {
                Cookies.set(sessionCookie, session + neverShow);
                Cookies.set(permanentCookie, permanent + neverShow);
            });

            // Set up timeout and roadblock spawn function
            setTimeout(function() {


                // TODO: Start here - set up action

                if (settings.onRoadblockAppear != null) {
                    settings.onRoadblockAppear.call();
                }
            }, settings.waitTime);

        });

    }

}(jQuery));