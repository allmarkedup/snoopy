Snoopy
=======

Snoopy is a bookmarklet for snooping on web pages. It's intended for use on mobile browsers where you can't view-source to poke around under the hood of sites to see how they're built, but you might find it useful for your desktop browser too.

Using the bookmarklet will give you an overlay that shows you information such as what Doctype the page has, what JS libraries are used in the page, what analytics, etc. It also gives you the ability to view the raw and/or generated source of the page.

**Please note that Snoopy is still very much under active development and shouldn't be considered as stable yet... you have been warned.**

For full details and installation instructions please see (http://snoopy.allmarkedup.com)[http://snoopy.allmarkedup.com/]

Browser Support
---------------

This is intended to be used in modern, mobile browsers, although it's intended to work in modern *desktop* browsers too.
At the moment it is only really being actively tested in Mobile Safari, although I'll hopefully get some more complete browser testing done at some point soon.
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


