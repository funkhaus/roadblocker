var roadblocker = {

	closeCount: roadblocker_vars.closeCount,
	closeDaysCount: roadblocker_vars.closeDaysCount,
	submitDaysCount: roadblocker_vars.submitDaysCount,
	forceDisplay: roadblocker_vars.forceDisplay,
	
    init: function() {
		//Bind events
		roadblocker.initEvents();
    },

    initEvents: function(){

		// Listen to close event
		jQuery(document).on( 'roadblock.closed', roadblocker.onClose() );
		
		// Listen to submitted event
		jQuery(document).on( 'roadblock.submitted', roadblocker.onSubmit() );

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
		
    },
    
    onClose: function(){
    	
		// Abort if Forced Display is active
		if(roadblocker.forceDisplay) {
			return false;
		}
    
		// On close roadblock, increment cookie closeCount		
		var cookieCloseCount = jQuery.cookie('roadblock_close_count');
		
		// Setd efault, if no cookie present
		if( typeof cookieCloseCount === 'undefined' ) {
			cookieCloseCount = 0
		}
		
		// Incrment close count, and save
		jQuery.cookie('roadblock_close_count', cookieCloseCount++, { 
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
    }

};
jQuery(document).ready(function($){
    roadblocker.init();
});