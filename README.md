Snoopy
=======

Snoopy is a bookmarklet that displays some useful information about the current page in an overlaid window. It's intended for use with Mobile Safari based browsers where it's not so easy to 'view source' to poke around under the hood of pages, but is potentially useful as a general shortcut to getting a quick overview of how a page is built.

**Snoopy is still under very active development and should not be considered stable as yet.**


Bookmarklet version notes
-------------------------

The bookmarklet injects a version of the snoopy.js and snoopy.css files into the page that it is called from. **Until a stable release is converged upon there is no guarantee that these will be the latest versions available in the repo**. If you want the latest versions you are best off hosting your own copies and amending the bookmarklet code to pull them from your own server.


Currently implemented checks:
----------------------------

* Doctype
* JavaScript libraries: jQuery, jQuery UI, Prototype, Mootools
* Analytics: Google, Reinvigorate, Piwik

