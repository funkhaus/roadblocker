roadblock-js
==========

####What
jQuery plugin to show a DIV after a certain amount of time on a site. The div will be shown X amount of times during a session (from when the user first accesses the site to when they close the browser) and Y amount of times total. There will also be a list of URL pathnames to ignore.

Definitions of terms: 

`roadblock` - the jQuery element that will appear when correct conditions are met.

`session` - From the first time a `roadblocker-session` cookie is created until the user closes their browser.

####How
Include jQuery first, then include jquery.roadblocker.js:

```html
<script src="path/to/jquery"></script>
<script src="path/to/roadblocker"></script>
```

Then, pick your level of customization:

`$('.selector').roadblocker();`

Default options.

```javascript
$('.selector').roadblocker({
    timesPerSession: 1, // Maximum number of times to show roadblock during session
    totalTimesToShow: 3, // Maxiumum number of times to show roadblock ever
    waitTime: 10000, // How long to wait before roadblock action is triggered
    ignorePaths: ['/'], // Relative paths to be ignored by roadblock. The default, '/', refers to the homepage of the site
    closeButton: '.roadblock-close', // Selector for the element used to close the roadblock. Searches the roadblock's children first, then the rest of the document.
    signupButton: '.roadblock-permanent-hide' // Selector for the element used to prevent the roadblock from ever appearing again (ie, the 'sign up' button for a mailing list)
});```

####Under The Hood

When you access a page with Roadblocker on it, the script will:

1. Set `display: none` on its selected element(s).
2. Look for a `roadblocker-session` cookie. If one is found, check if `roadblocker-session.timesDisplayed >= options.timesPerSession` or `roadblocker-permanent.neverShow == true`. If either condition is met, `return`.
3. Check if this location's pathname (`http://site-url.com/PATHNAME`) is present in the list of paths to ignore. If it is, `return`.
4. Create a `roadblocker-session` cookie if none exists with value `timesDisplayed` set to 0.
5. Create a `roadblocker-permanent` cookie if none exists with value `totalTimesDisplayed` set to 0 and `neverShow` set to `false`.
6. `setTimeout` for `options.waitTime` ms, running `activateRoadblock` on complete.
7. Call `activateRoadblock`. Increment `roadblocker-session.timesDisplayed` and `roadblocker-permanent.totalTimesDisplayed`. If `roadblocker-permanent.totalTimesDisplayed >= options.totalTimesToShow`, set `roadblocker-permanent.neverShow` to `true`.


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
		jQuery(this).trigger('roadblocker.closed');

	});
	
	// Submitted event (or this could be fired in callback from forms submitted with JS)
	jQuery('.submit-button').click(function(){

		// Close the roadblock	
		jQuery('#roadblock-overlay').fadeOut();
		
		// Send the roadblock.submitted event
		jQuery(this).trigger('roadblocker.submitted');

	});
```

## Using with MailChimp

See this for help onsending a MailChimp to thier server via JSON: http://stackoverflow.com/questions/8425701/ajax-mailchimp-signup-form-integration