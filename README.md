roadblock-js
==========

###What
jQuery plugin to show a DIV after a certain amount of time on a site. The div will be shown X amount of times during a session (from when the user first accesses the site to when they close the browser) and Y amount of times total. There will also be a list of URL pathnames to ignore.

Example (check the source code and your cookies!): http://sander.funkhaus.us/test/

Definitions of terms: 

`roadblock` - the jQuery element that will appear when correct conditions are met.

`session` - From the first time a `roadblocker-session` cookie is created until the user closes their browser.

###How
Include jQuery first, then include jquery.roadblocker.js:

```html
<script src="path/to/jquery"></script>
<script src="path/to/roadblocker"></script>
```

Then, pick your level of customization:

####Default Options

`$('.selector').roadblocker();`

#### In-Depth Options

```javascript
$('.selector').roadblocker({
    timesPerSession: 1, // Maximum number of times to show roadblock during session
    totalTimesToShow: 3, // Maxiumum number of times to show roadblock ever
    waitTime: 10000, // How long to wait before roadblock action is triggered
    ignorePaths: ['/'], // Relative paths to be ignored by roadblock. The default, '/', refers to the homepage of the site
    singleCloseButton: '.roadblock-close', // Selector for the element used to close the roadblock. Searches the roadblock's children first, then the rest of the document.
    permanentCloseButton: '.roadblock-permanent-hide', // Selector for the element used to prevent the roadblock from ever appearing again (ie, the 'sign up' button for a mailing list). Searches the roadblock's children first, then the rest of the document.
    onShow: null, // Function to call when roadblock appears
    onClose: null, // Function to call when user closes roadblock
    log: false, // Whether or not roadblocker should log its exit logic
    openClass: 'roadblocker-open', // Class to add to roadblock when it appears (removed when it is hidden)
    closeClass: 'roadblocker-closed', // Class to add to roadblock when it is hidden
    defaultDisplayToggle: true // If the roadblock should automatically show and hide itself via setting and removing display: none
});
```

####Under The Hood

When you access a page with Roadblocker on it, the script will:

1. Set `display: none` on its selected element(s).
2. Look for a `roadblocker-session` cookie. If one is found, check if `roadblocker-session.timesDisplayed >= options.timesPerSession` or `roadblocker-permanent.neverShow == true`. If either condition is met, `return`.
3. Check if this location's pathname (`http://site-url.com/PATHNAME`) is present in the list of paths to ignore. If it is, `return`.
4. Create a `roadblocker-session` cookie if none exists with value `timesDisplayed` set to 0.
5. Create a `roadblocker-permanent` cookie if none exists with value `timesDisplayed` set to 0.
6. `setTimeout` for `options.waitTime` ms, running the next step on complete.
7. Set `$(roadblock).css('display', '')` if `defaultDisplayToggle` is on. Call `onShow` if set. Increment `roadblocker-session.timesDisplayed` and `roadblocker-permanent.totalTimesDisplayed`. If `roadblocker-permanent.totalTimesDisplayed >= options.totalTimesToShow`, set `roadblocker-permanent.neverShow` to `true`.
8. Wait for the close-once or close-permanently buttons to be clicked and set the appropriate classes, fire the appropriate callbacks, etc. when clicked.