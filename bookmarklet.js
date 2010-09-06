// bookmarklet source: paste this into a bookmark URL field to add as a bookmarklet
javascript:(function()%7Bvar%20d%3Ddocument%2Cs%2Ce%3Bvar%20el%3Dd.getElementById('snoopy')%3Bif(el)%7Bel.className%3Del.className.replace('closed'%2C'')%3Breturn%7Ds%3Dd.createElement('link')%3Bs.setAttribute('href'%2C'http%3A%2F%2Fsnoopy-js.s3.amazonaws.com%2Fsnoopy.css')%3Bs.setAttribute('rel'%2C'stylesheet')%3Bs.setAttribute('type'%2C'text%2Fcss')%3Bd.getElementsByTagName('head')%5B0%5D.appendChild(s)%3Be%3Dd.createElement('script')%3Be.setAttribute('src'%2C'http%3A%2F%2Fsnoopy-js.s3.amazonaws.com%2Fsnoopy.js')%3Bd.getElementsByTagName('body')%5B0%5D.appendChild(e)%7D)()%3B

// Uncompressed bookmarklet code:
(function(){
    
    var d = document, s, e;
    
    var el = d.getElementById('snoopy');
    
    if ( el )
    {
        el.className = el.className.replace('closed','');
        return;
    }
    
    // append styles
    s = d.createElement('link');
    s.setAttribute('href','http://snoopy-js.s3.amazonaws.com/snoopy.css');
    s.setAttribute('rel','stylesheet');
    s.setAttribute('type','text/css');
    d.getElementsByTagName('head')[0].appendChild(s);
    
    // append script
    e = d.createElement('script');
    e.setAttribute('src', 'http://snoopy-js.s3.amazonaws.com/snoopy.js');
    d.getElementsByTagName('body')[0].appendChild(e);
    
})();