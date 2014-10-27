var roadblocker = {

	closeCount: Number(roadblocker_vars.closeCount),
	closeDaysCount: Number(roadblocker_vars.closeDaysCount),
	submitDaysCount: Number(roadblocker_vars.submitDaysCount),
	forceDisplay: Number(roadblocker_vars.forceDisplay),
	
    init: function() {
		//Bind events
		roadblocker.initEvents();
    },

    initEvents: function(){
		
		// Listen to close event
		jQuery(document).on( 'roadblock.closed', function(){
			roadblocker.onClose();
		});
		
		// Listen to submitted event
		jQuery(document).on( 'roadblock.submitted', function(){
			roadblocker.onSubmit()			
		});
    },
    
    onClose: function(){

		// Abort if Forced Display is active
		if(roadblocker.forceDisplay == true) {
			return false;
		}

		// On close roadblock, increment cookie closeCount		
		var cookieCloseCount = jQuery.cookie('roadblock_close_count');

		// Set default, if no cookie present
		if( typeof cookieCloseCount === 'undefined' ) {
			cookieCloseCount = 0;
		} else {
			cookieCloseCount++;
		}

		// Incrment close count, and save
		jQuery.cookie('roadblock_close_count', cookieCloseCount, { 
			expires: roadblocker_vars.closeDaysCount,
			path: '/'
		});	
		
		// If closed more times than settings, disable roadblock for X days.
		if( cookieCloseCount >= roadblocker_vars.closeCount ) {
			jQuery.cookie('roadblock_disabled', true, {
				expires: roadblocker_vars.closeDaysCount,
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
		jQuery.cookie('roadblock_disabled', true, { 
			expires: roadblocker_vars.submitDaysCount,
			path: '/'
		});

    }

};
jQuery(document).ready(function($){
    roadblocker.init();
});