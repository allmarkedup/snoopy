// Snoopy - View-source and page info bookmarklet for Mobile Safari-based browsers
// Written by Mark Perkins, mark@allmarkedup.com
// License: http://unlicense.org/ (i.e. do what you want with it!)

;(function( window, document, undefined ){
    
    var doc     = document,
        body    = doc.body,
        q_cache = {},
        isMobile = (function(){
            var ua = navigator.userAgent;
            return (ua.match(/iPhone/i) || ua.match(/iPod/i) || ua.match(/iPad/i)) ? true : false;
        })(),
        viewport = getViewportDimensions(),
        snoopy, modules, config, templates, snoopQuery;
        
    config = {
        NAME            : 'Snoopy',
        VERSION         : '0.2',
        START_OFFSET    : { top : '0', left : '0' }
    };
    
    snoopy = {
        
        elem            : null,
        modules_html    : '',
        raw_source      : '',
        gen_source      : '',
        bind_stack      : [],
        position        : config.START_OFFSET,
        
        init : function()
        {
            var self = this,
                el = this.elem = $('<div />'),
                snpy;

            el.attr('id', 'snpy').addClass('cleanslate');
            
            if ( isMobile ) el.addClass('MobileSafari');
            
            el.style('top', this.position.top, true);
            el.style('left', this.position.left, true);
            
            if ( viewport.width == 320 || viewport.width == 480 )
            {
                body.scrollTop = 0;
                hideURLBar();  
            } 

            this.runTests();
            this.getRawSource();
            this.getGeneratedSource();

            el.html(tim(templates.snoopy, {
                        name             : config.NAME,
                        modules          : this.modules_html,
                        version          : config.VERSION,
                        generated_source : this.gen_source
                    }));
                    
            $(body).append(el);
            
            this.setMaxDimensions();
            this.bindEvents();
        },
                    
        runTests : function()
        {
            var results = Sniffer.run(),
                output;
            
            for ( group in results )
            {
                var positive = 0;
                    
                output = '<h2>'+results[group].description+'</h2><ul class="tests">';
                
                for ( test in results[group].results )
                {
                    var res = results[group].results[test];
                    output += '<li class="'+( res ? 'positive' : 'negative' )+'">';
                    output += '<span class="test_for">'+test+'</span>';
                    output += '<span class="test_result '+( res === true ? 'true_no_detail' : (!!res).toString() )+'">'+( res === true ? '-' : res.toString() )+'</span></li>';
                    if ( res ) positive++;
                }
                output += '</ul>';
                this.modules_html += '<div class="module'+( positive ? '' : ' empty' )+' type_'+group+' output_'+results[group].return_type+'">'+output+'</div>';
            }
        },
        
        getRawSource : function()
        {
            var self = this;
            ajax({
                type        : 'GET',
                url         : location.href,
                onSuccess   : function( data ){
                     self.raw_source = floodlight(floodlight.decode(data));
                     $('#snpy_rawsource code.html').html(self.raw_source);
                }
            }); 
        },
        
        getGeneratedSource : function()
        {
            this.gen_source = floodlight(floodlight.decode(doc.documentElement.innerHTML.toString()));
        },
        
        bindEvents : function( bindStack )
        {
            var self = this,
                el   = this.elem;
            
            //////////// general snoopy events ////////////
            
            $('#snpy .close').bind('click', function(){
                el.addClass('closed');
                return false;
            });
            
            $(window).bind('resize', function(){
                self.setMaxDimensions();
            });
            
            // tabs & panels
            
            var tabs = $('#snpy .menu li'),
                panels = $('#snpy .panel');
            
            tabs.each(function(){
                $(this).bind('click', function(e){
                    var self = $(this);
                    tabs.removeClass('active');
                    panels.removeClass('active');
                    self.addClass('active');
                    $($(e.target).attr('href')).addClass('active');
                    return false;
                 }); 
             });
            
            //////////// module-specific events ////////////
            
            for ( var d, i = -1; d = this.bind_stack[++i]; ) d();
        },
        
        setMaxDimensions : function()
        {
            viewport = getViewportDimensions();
            if ( isMobile ) this.elem.style('max-width', (viewport.width - parseInt(config.START_OFFSET.left)*2)+'px', true);
            // if it is a mobile-optimised site, don't try and fit the source size to screen as it won't work properly
            if ( viewport.width != 320 && viewport.width != 480 )
            {
                // TODO: really need to implement some proper browser capability and type detection instead of one-off tests like this
                $('#snpy pre.source').style('max-height', (viewport.height - 180 - parseInt(config.START_OFFSET.top)*2)+'px', true);   
            }
            else if (viewport.width == 320)
            {
                $('#snpy pre.source').style('height', '300px', true);
            }
            else if (viewport.width == 480)
            {
                $('#snpy pre.source').style('height', '150px', true);
            }
        }

    };
    
    templates = {
        
        snoopy : "\
<div class=\"head\">\
    <a class=\"close\" href=\"#\">close</a>\
    <h1>{{name}}</h1>\
</div>\
<div class=\"body\">\
    <ul class=\"menu tabs\">\
        <li class=\"active\"><a href=\"#snpy_overview\">overview</a></li>\
        <li><a href=\"#snpy_rawsource\">view source</a></li>\
        <li><a href=\"#snpy_gensource\"><span class=\"no320\">view</span> generated source</a></li>\
    </ul>\
    <div class=\"panels\">\
        <div id=\"snpy_overview\" class=\"panel active\">{{modules}}</div>\
        <div id=\"snpy_rawsource\" class=\"panel\">\
<p class=\"tip MobileSafari\">Tip: Use a two fingered drag to scroll the code.</p>\
        <pre class=\"source raw\"><code class=\"html\">loading source code...</code></pre></div>\
        <div id=\"snpy_gensource\" class=\"panel\">\
<p class=\"tip MobileSafari\">Tip: Use a two fingered drag to scroll the code.</p>\
<pre class=\"source generated\"><code class=\"html\">{{generated_source}}</code></pre></div>\
    </div>\
</div>\
<div class=\"footer\">\
    <p><a href=\"http://github.com/allmarkedup/Snoopy\">Snoopy <span class=\"version\">v{{version}}</span></a>. Created by <a href=\"http://allmarkedup.com/\">Mark Perkins</a>.</p>\
</div>"

    };
    
    //////////// HELPER FUNCTIONS ////////////////
    
    //= require "lib/sniffer"
    
    //= require "lib/tim"
    
    //= require "lib/floodlight"
    
    //= require "snoopquery"
    
    //= require "utils"
    
    snoopy.init(); /* kick things off... */
  
})( window, document );