Snoopy
=======

Snoopy is a view-source and page info bookmarklet for Mobile Safari-based browsers, where it's not so easy to 'view source' to poke around under the hood of pages. Provides page source, generated source and an overview panel that surfaces page items of interest at a glance.

It's potentially useful in desktop based browsers as a quick view-source alternative.

**Snoopy is still under very active development and should not be considered stable as yet!**


Browser Support
---------------

This is intended to be used in Mobile Safari-based browsers, although it should work in other modern browsers.
I am not currently intending to support any versions of IE (although IE9 *may* be supported in the future... but don't hold your breath).


Bookmarklet version notes
-------------------------

The bookmarklet injects a version of the snoopy.js and snoopy.css files into the page that it is called from. **Until a stable release is converged upon there is no guarantee that these will be the latest versions available in the repo**. If you want the latest versions you are best off hosting your own copies and amending the bookmarklet code to pull them from your own server.


Currently implemented page info checks:
---------------------------------------

* Page info: Doctype, page encoding
* JavaScript libraries: jQuery, jQuery UI, Prototype, Mootools
* Analytics: Google, Reinvigorate, Piwik


Ideas/things to add/things to do
--------------------------------

* Implement some sort of cross-domain cookie so that Snoopy can have persistent settings
* Syntax highlighting on source code
* Microformat detection
* Make Snoopy window drag-able
* Ajax-powered HTML validation


