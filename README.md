Roadblocker
==========

A Wordpress plugin for developers. Allows you setup a roadblock overlay on your site, and config it to only show a certain amount of times, or on specific pages.

####Steps to set up:

1. Download master
2. Unzip and upload to the plugins folder of a Wordpress installation
3. Add a template in your theme folder (it looks for files in /roadblock/)
4. Activate Roadblocker through the WordPress admin
5. Go to Tools > Roadblocker and select a template from one or both dropdown menus
6. That's it!


## Building Roadblock templates

Create a directory in your theme folder called /roadblocks/. Any PHP files you place in this directory will be shown in the drop down menu on the settings panel.

## Displaying Roadblock

You'll want to style your roadblock to display always. It will not be included on the page unless the right conditions are met.

## JS Events

The plugin uses JS events to keep track of when the roadblock is "closed" or "submitted". You will need ot bind these events to buttons in your templates. 

Example:
```javascript
	// Close event
	jQuery('.close-button').click(function(){
		
		// Close the roadblock
		jQuery('#roadblock-overlay').fadeOut();
		
		// Send the roadblock.closed event
		jQuery(this).trigger('roadblock.closed');

	});
	
	// Submitted event (or this could be fired in callback from forms submitted with JS)
	jQuery('.submit-button').click(function(){

		// Close the roadblock	
		jQuery('#roadblock-overlay').fadeOut();
		
		// Send the roadblock.submitted event
		jQuery(this).trigger('roadblock.submitted');

	});
```

## Using with MailChimp

See this for help onsending a MailChimp to thier server via JSON: http://stackoverflow.com/questions/8425701/ajax-mailchimp-signup-form-integration