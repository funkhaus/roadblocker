### What
roadblocker is a jQuery plugin to trigger an action after a certain amount of time on a site. The action will be triggered X times during a session and Y times total. There will also be a list of URL pathnames to ignore - pages on the site that will never trigger the action.

Definitions of terms:

`session` - From the first time a `roadblocker-session` cookie is created until the user closes their browser.

### How
Include jQuery first, then include jquery.roadblocker.js:

```html
<script src="path/to/jquery"></script>
<script src="path/to/roadblocker"></script>
```

Then call `roadblocker()` on any element(s) you want to hold roadblocker triggers. `body` is the most common container.

```javascript
jQuery('body').roadblocker();
```

#### Options (defaults shown)

```javascript
$('.selector').roadblocker({
    timesPerSession: 1, // Maximum number of times to show roadblock during session
    totalTimesToShow: 3, // Maxiumum number of times to show roadblock ever (technically maximum number of times to show roadblock over 10 years)
    waitTime: 10000, // How long, in ms, to wait before roadblock action is triggered
    ignorePaths: [], // Relative paths to be ignored by roadblock. For example, '/' for the home page, or '/posts/' for a posts page.
    onlyPaths: [], // Relative paths to show the roadblock on, excluding unlisted paths. Same format as ignorPaths.
    onShow: function(){ jQuery('body').addClass('roadblock-activated'); }, // Function to call when roadblock appears
    onClose: function(){ jQuery('body').removeClass('roadblock-activated'); }, // Function to call when user closes roadblock,
    closeElement: null, // Selector string for the element that triggers jQuery('body').roadblocker('close') when clicked
    log: false, // Whether or not roadblocker should log its exit logic
});
```

#### Commands
```javascript
$('.selector').roadblocker('close'); // Fire the onClose event on an initialized roadblock
$('.selector').roadblocker('close-permanently'); // Fire the onClose event and never show the roadblock again
$('.selector').roadblocker('cancel'); // Cancel the countdown timer and prevent `onShow` from firing automatically
```

#### Under The Hood

When you access a page with Roadblocker on it, the script will:

1. Look for a `roadblocker-session` cookie. If one is found, check if `roadblocker-session.timesDisplayed >= options.timesPerSession` or `roadblocker-permanent.neverShow == true`. If either condition is met, `return`.
1. Check if this location's pathname (`http://site-url.com/PATHNAME`) is present in the list of paths to ignore. If it is, `return`.
1. Create a `roadblocker-session` cookie if none exists with value `timesDisplayed` set to 0.
1. Create a `roadblocker-permanent` cookie if none exists with value `timesDisplayed` set to 0.
1. `setTimeout` for `options.waitTime` ms, running the next step on complete.
1. Call `onShow`. Increment `roadblocker-session.timesDisplayed` and `roadblocker-permanent.totalTimesDisplayed` cookies. If `roadblocker-permanent.totalTimesDisplayed >= options.totalTimesToShow`, set `roadblocker-permanent.neverShow` to `true`.
1. Wait for the close-once or close-permanently buttons to be clicked and call `onClose`.

-------

Version 1.4

http://funkhaus.us
