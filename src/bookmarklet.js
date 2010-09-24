(function(){
    
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