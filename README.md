Snoopy
=======

Snoopy is a bookmarklet that displays some useful information about the current page in an overlaid window. It's intended for use with Mobile Safari based browsers where it's not so easy to 'view source' to poke around under the hood of pages, but is potentially useful as a general shortcut to getting a quick overview of how a page is built.

**Snoopy is still under very active development and should not be considered stable as yet.**


Bookmarklet version notes
-------------------------

The bookmarklet injects a version of the snoopy.js and snoopy.css files into the page that it is called from. **Until a stable release is converged upon there is no guarantee that these will be the latest versions available in the repo**. If you want the latest versions you are best off hosting your own copies and amending the bookmarklet code to pull them from your own server.

Drag this link to your bookmarks bar to install the bookmarklet: <a href="javascript:(function()%7Bvar%20d%3Ddocument%2Cs%2Ce%3Bvar%20el%3Dd.getElementById('snoopy')%3Bif(el)%7Bel.className%3Del.className.replace('closed'%2C'')%3Breturn%7Ds%3Dd.createElement('link')%3Bs.setAttribute('href'%2C'http%3A%2F%2Fsnoopy-js.s3.amazonaws.com%2Fsnoopy.css')%3Bs.setAttribute('rel'%2C'stylesheet')%3Bs.setAttribute('type'%2C'text%2Fcss')%3Bd.getElementsByTagName('head')%5B0%5D.appendChild(s)%3Be%3Dd.createElement('script')%3Be.setAttribute('src'%2C'http%3A%2F%2Fsnoopy-js.s3.amazonaws.com%2Fsnoopy.js')%3Bd.getElementsByTagName('body')%5B0%5D.appendChild(e)%7D)()%3B">Snoopy</a>


Currently implemented checks:
----------------------------

* Doctype
* JavaScript libraries: jQuery, jQuery UI, Prototype, Mootools
* Analytics: Google, Reinvigorate, Piwik

