<?php
/**
 * Plugin Name: Roadblocker
 * Plugin URI:  http://funkhaus.us/
 * Description: Display a roadblock overlay
 * Version:     1.1
 * Author:      Drew Baker, John Robson, Funkhaus
 * Author URI:  http://funkhaus.us
 */

// Don't allow this file to be accessed directly
! defined( 'ABSPATH' ) and exit;

/*
 * Helper functions to always reference this plugin directory or paths
 */
    function roadblocker_path() {
        return trailingslashit( dirname( __FILE__ ) );
    }
    function roadblocker_dir() {
        return trailingslashit( plugin_dir_url( __FILE__ ) );
    }    

/* 
 * Add this plugin to menu
 */
	function roadblocker_add_menu_settings() {
		add_submenu_page( 'tools.php', 'Roadblocker', 'Roadblocker', 'manage_options', 'roadblocker_settings', 'roadblocker_settings_page' );
	}
	add_action('admin_menu','roadblocker_add_menu_settings');


/*
 * Enqueue Custom Scripts
 */
    function roadblocker_scripts() {
        wp_register_script('roadblocker', roadblocker_dir() . 'js/roadblocker.js', 'jquery', '1.0');
        wp_register_script('jquery.cookie', roadblocker_dir() . 'js/jquery-cookie/jquery.cookie.js', 'jquery', '1.4.1');

        wp_enqueue_script('jquery.cookie', 'jquery');
        wp_enqueue_script('roadblocker', 'jquery');
		
		// Get timestamp for injection in JS
		$template_name = get_option('roadblocker_template');		
		$timestamp_key = 'roadblocker_'.$template_name.'_timestamp';
		$timestamp = get_option($timestamp_key);
		
        // Setup JS variables in scripts        
		wp_localize_script('roadblocker', 'roadblocker_vars', 
			array(
				'closeCount' 		=> get_option('roadblocker_close_count', 3),
				'closeDaysCount'  	=> get_option('roadblocker_close_days_count', 30),
				'submitDaysCount'	=> get_option('roadblocker_submit_days_count', 365),
				'forceDisplay'		=> get_option('roadblocker_force_display', 0),
				'activeTemplate'	=> get_option('roadblocker_template', 'none'),
				'activeTimestamp'	=> $timestamp
			)
		);

    }
    add_action('wp_enqueue_scripts', 'roadblocker_scripts', 20);


/* 
 * Register Takeover Settings 
 */
	function roadblocker_settings_init(){
		register_setting('roadblocker_settings', 'roadblocker_close_count');
		register_setting('roadblocker_settings', 'roadblocker_close_days_count');
		register_setting('roadblocker_settings', 'roadblocker_submit_days_count');
		register_setting('roadblocker_settings', 'roadblocker_overlay_location');
		register_setting('roadblocker_settings', 'roadblocker_template');
		register_setting('roadblocker_settings', 'roadblocker_reset_tracking');
		register_setting('roadblocker_settings', 'roadblocker_force_display');
	}
	add_action('admin_init', 'roadblocker_settings_init');



/* 
 * These run when options are saved
 */	
	function roadblocker_save_settings() {
		
		// Get template name
		if( isset($_POST['roadblocker_template']) ){
			$template_name = $_POST['roadblocker_template'];			
			
			// Save time stamp for active template
			if( $_POST['roadblocker_reset_tracking'] ) {
				$key = 'roadblocker_'.$template_name.'_timestamp';
				delete_option($key);
				add_option( $key, time() );
			}
		}
	}
	add_action('update_option', 'roadblocker_save_settings');




/*
 * Build settings page HTML for plugin
 */
	function roadblocker_settings_page() 
	{
		include( roadblocker_path() . 'settings.php' );
	}


/*
 * Start a session, used to force disable cache
 */
    function roadblocker_start_session(){
        if(!session_id()) {
            session_start();       
        }        
    }
    add_action( 'init', 'roadblocker_start_session' ); 


	
/*
 * Insert selected template HTML/PHP into footer
 */
	function roadblocker_insert_template() {
    	
    	// Reset post data
        wp_reset_postdata();
    	
		// Get selected template
		$template_name = get_option('roadblocker_template');
		$filepath = get_stylesheet_directory().'/roadblocks/'.$template_name.'.php';
        
        if( roadblocker_conditonal_display_roadblock() ) {
            roadblocker_include_file($filepath);
        }
	}
	add_action('wp_footer', 'roadblocker_insert_template');



/*
 * Handle including the correct template
 */
 	function roadblocker_include_file( $filepath = false ) {
		// Include file if it exists  	
		if( is_file($filepath) ) {
	        include $filepath;
		}
 	}



/*
 * Conditonal - Test if the previous page a user visted was on the same domain.
 */
	function roadblocker_previous_page_was_same_domain() {
		$self = parse_url( get_bloginfo('url') );
		$self = $self['host'];
		
		// Set referrer host var
		if( isset($_SERVER["HTTP_REFERER"]) ) {
			$ref = parse_url( $_SERVER["HTTP_REFERER"] );			
			$ref = $ref['host'];			
		} else {
			$ref = false;
		}

		// Compare and return match
		if( $self == $ref ) {
			
			// Check that ref wasn't the admin
			if( strpos($_SERVER["HTTP_REFERER"], 'wp-admin') ) {
				return false;
			} else {
				return true;
			}

		} else {
			return false;
		}		
	}
	

/*
 * Conditonal - Determine if roadblock should be displayed
 */	
	function roadblocker_conditonal_display_roadblock() {

		// Get selected template
		$template_name = get_option('roadblocker_template');
		$filepath = get_stylesheet_directory().'/roadblocks/'.$template_name.'.php';

		// Get setting of where to display
		$location = get_option('roadblocker_overlay_location', 'is_home');

		// Get template timestamp setting
		$timestamp_key = 'roadblocker_'.$template_name.'_timestamp';
		$timestamp = get_option($timestamp_key);
		
		// Get timestamp from cookie
		if( isset($_COOKIE[$timestamp_key]) ){
			$cookieTimestamp = $_COOKIE[$timestamp_key];
		} else {
			$cookieTimestamp = 0;
		}
		
		// Get disabled status from cookie (this means the roadblock was submitted once already)
		if( isset($_COOKIE['roadblocker_'.$template_name.'_disabled']) ){
			$disabled = $_COOKIE['roadblocker_'.$template_name.'_disabled'];			
		} else {
			$disabled = false;
		}

		// Get force display setting
		$force_display = get_option('roadblocker_force_display', 0);

		// Always show Roadblock if force_display setting is true.
		if( $force_display ) {
			return true;
		}

		// Should we respect the cookies disabled value? 
		if($cookieTimestamp < $timestamp){
			// Server has been reset, so ignore the disabled value.
			$disabled = false;
			
			// Expire cookie
			setcookie($timestamp_key, '', time() - 3600);			
		}

		// Abort if cookie says so (has closed a certain amount of times, or has been submitted)
		if( $disabled ) {
			return false;			
		}

		// Finally, figure out where/when to include template HTML based on settings
		switch (true) {

		    case $location == 'any' :
                
                return true;
		        break;

		    case $location == 'second_page' :

				if( roadblocker_previous_page_was_same_domain() ) {
                    return true;
				}
		        break;

		    default :

				// Get setting value and use that as a function ( like is_home() )
				if( call_user_func($location) ) {
                    return true;
				} else {
    				return false;
				}
		        break;
		}

	}
