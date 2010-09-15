    //// Ajax Helper functions //////
    
    // Generic ajax helper functions. Could probably be cut down if the only use case turns out
    // to be for returning the source of the current page (i.e. remove type tests from ajaxData etc)
    function ajax( options )
    {
        options = {
            type        : options.type          || 'GET',
            url         : options.url           || '',
            timeout     : options.timeout       || 5000,
            onComplete  : options.onComplete    || function(){},
            onError     : options.onError       || function(){},
            onSuccess   : options.onSuccess     || function(){},
            data        : options.data          || ''
        }
    
        var r    = new XMLHttpRequest(),
            done = false;

        r.open(options.type, options.url, true);
    
        setTimeout(function(){
            done = true;
        }, options.timeout);
    
        r.onreadystatechange = function()
        {
            if ( r.readyState == 4 && ! done )
            {
                if ( ajaxSuccess( r ) )
                {
                    options.onSuccess( ajaxData( r, options.type ) );
                }
                else
                {
                    options.onError();
                }
            
                options.onComplete();
            
                r = null;
            }
        }
    
        r.send();
    }

    function ajaxSuccess( r )
    {
        try {
            return ! r.status && location.protocol == "file:" ||
                ( r.status >= 200 && r.status < 300 ) ||
                r.status == 304 || 
                navigator.userAgent.indexOf("Safari") >= 0 && typeof r.status == 'undefined';
                // could take out safari check here but better to keep it cross browser I think.
        } catch(e) {}
        return false;
    }

    function ajaxData( r, type )
    {
        var ct = r.getResponseHeader('content-type'),
            data = ! type && ct && ct.indexOf('xml') >= 0;
    
        data = type == 'xml' || data ? r.responseXML : r.responseText;
        if ( type == 'script' ) eval.call(window, data);
        return data;
    }

    function getViewportDimensions()
    {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }

    function prepSource( source )
    {
        return source.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;');
    }

    function trim(str)
    {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    function isArray( obj )
    {
        return toString.call(obj) === "[object Array]";
    }

    // merge two arrays
    function merge( first, second )
    {
        var i = first.length,
            j = 0;

        if ( typeof second.length === "number" )
        {
            for ( var l = second.length; j < l; j++ )
            {
                first[i++] = second[j];
            }
        }
        else
        {
            while ( second[j] !== undefined )
            {
                first[i++] = second[j++];
            }
        }

        first.length = i;

        return first;
    }

    /// some iphone/ipod/ipad specific helpers

    function hideURLBar()
    {
    	setTimeout(function() {
    		window.scrollTo(0, 1);
    	}, 0);
    }