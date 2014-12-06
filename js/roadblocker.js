var roadblocker = {

	closeCount: Number(roadblocker_vars.closeCount),
	closeDaysCount: Number(roadblocker_vars.closeDaysCount),
	submitDaysCount: Number(roadblocker_vars.submitDaysCount),
	activeTemplate: roadblocker_vars.activeTemplate,
	forceDisplay: Number(roadblocker_vars.forceDisplay),
	activeTimestamp: roadblocker_vars.activeTimestamp,

	cookieTimestampKey: 'roadblocker_'+roadblocker_vars.activeTemplate+'_timestamp',
	cookieTimestamp: null,
	cookieCloseCountKey: 'roadblocker_'+roadblocker_vars.activeTemplate+'_close_count',
	cookieCloseCount: null,
	cookieDisabledKey: 'roadblocker_'+roadblocker_vars.activeTemplate+'_disabled',

    init: function() {

	    // Abort if template disabled
	    if( roadblocker.activeTemplate == 'none' ){
		    return false;
	    }
	    
		// Uncomment to delete cookies (good for testing)
		/*
		jQuery.removeCookie(roadblocker.cookieCloseCountKey, { 
			path: '/'
		});			
		jQuery.removeCookie(roadblocker.cookieDisabledKey, {
			path: '/'
		});
		jQuery.removeCookie(roadblocker.cookieTimestampKey, { 
			path: '/'
		});			
		*/

	    // Set counts
	    roadblocker.setCounts();

		//Bind events
		roadblocker.initEvents();

    },

    setCounts: function(){

		// Depending on active template and timestamp, set default count
		roadblocker.cookieCloseCount = jQuery.cookie(roadblocker.cookieCloseCountKey);
		if( typeof roadblocker.cookieCloseCount === 'undefined' ) {
			roadblocker.cookieCloseCount = 0;
		}

		// get cookie timestamp
		roadblocker.cookieTimestamp = jQuery.cookie(roadblocker.cookieTimestampKey);
		if( typeof roadblocker.cookieTimestamp === 'undefined' ) {
			roadblocker.cookieTimestamp = 0;
		}

		// Reset cookies if Servers reset timestamp is newer than the cookie timestamp
		if( roadblocker.activeTimestamp > roadblocker.cookieTimestamp ) {

			// Reset cookies
			jQuery.removeCookie(roadblocker.cookieCloseCountKey, {
				path: '/'
			});
			jQuery.removeCookie(roadblocker.cookieDisabledKey, {
				path: '/'
			});

			// Set cookie timestamp to the same as server
			jQuery.cookie(roadblocker.cookieTimestampKey, roadblocker.activeTimestamp, { 
				expires: roadblocker.closeDaysCount,
				path: '/'
			});

			// Set values for now
			roadblocker.cookieCloseCount = 0;
			roadblocker.cookieDisabledKey = false;
		}

    },

    initEvents: function(){
		
		// Listen to close event
		jQuery(document).on( 'roadblocker.closed', function(){
			roadblocker.onClose();
		});

		// Listen to submitted event
		jQuery(document).on( 'roadblocker.submitted', function(e){
			roadblocker.onSubmit();
		});
    },
    
    onClose: function(){

		// Abort if Forced Display is active
		if(roadblocker.forceDisplay == true) {
			return false;
		}
		
		// Incrment close count, and save
		roadblocker.cookieCloseCount++;		
		jQuery.cookie(roadblocker.cookieCloseCountKey, roadblocker.cookieCloseCount, { 
			expires: roadblocker.closeDaysCount,
			path: '/'
		});
		
		// If closed more times than settings, disable roadblock for X days.
		if( roadblocker.cookieCloseCount >= roadblocker.closeCount ) {
			jQuery.cookie(roadblocker.cookieDisabledKey, true, {
				expires: roadblocker.closeDaysCount,
				path: '/'
			});
		}
    },

    onSubmit: function(){
	    
		// Abort if Forced Display is active
		if(roadblocker.forceDisplay) {
			return false;
		}

		// Disable roadblock for X days
		jQuery.cookie(roadblocker.cookieDisabledKey, true, {
			expires: roadblocker.submitDaysCount,
			path: '/'
		});

    }

};
jQuery(document).ready(function($){
    roadblocker.init();
});