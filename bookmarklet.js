// bookmarklet source: paste this into a bookmark URL field to add as a bookmarklet
javascript:(function()%7Bvar%20d%3Ddocument%2Cs%2Ce%3Bvar%20el%3Dd.getElementById('snpy')%3Bif(typeof%20Snoopy!%3D'undefined')%7BSnoopy.toggle()%3Breturn%7Delse%20if(el)%7Bel.className%3D%2Fclosed%2F.test(el.className)%3Fel.className.replace('closed'%2C'')%3Ael.className%2B'%20closed'%3Breturn%7Ds%3Dd.createElement('link')%3Bs.setAttribute('href'%2C'http%3A%2F%2Fsnoopy-assets.allmarkedup.com%2Fsnoopy-min.css')%3Bs.setAttribute('rel'%2C'stylesheet')%3Bs.setAttribute('type'%2C'text%2Fcss')%3Bd.getElementsByTagName('head')%5B0%5D.appendChild(s)%3Be%3Dd.createElement('script')%3Be.setAttribute('src'%2C'http%3A%2F%2Fsnoopy-assets.allmarkedup.com%2Fsnoopy-min.js')%3Bd.getElementsByTagName('body')%5B0%5D.appendChild(e)%7D)()%3B

// Uncompressed bookmarklet code:
javascript:(function(){
    
    var d = document, s, e;
    
    var el = d.getElementById('snpy');
    
    if ( typeof Snoopy != 'undefined' )
    {
        Snoopy.toggle();
        return;
    }
    else if ( el )
    {
        // legacy display toggle
        el.className = /closed/.test(el.className) ? el.className.replace('closed','') : el.className + ' closed';
        return;
    }
    
    // append styles
    s = d.createElement('link');
    s.setAttribute('href','http://snoopy-assets.allmarkedup.com/snoopy-min.css');
    s.setAttribute('rel','stylesheet');
    s.setAttribute('type','text/css');
    d.getElementsByTagName('head')[0].appendChild(s);
    
    // append script
    e = d.createElement('script');
    e.setAttribute('src', 'http://snoopy-assets.allmarkedup.com/snoopy-min.js');
    d.getElementsByTagName('body')[0].appendChild(e);
    
})();