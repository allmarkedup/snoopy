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
        VERSION         : '0.1',
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

            this.runModules();
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
                    
        runModules : function( module_name, result )
        {
            for ( m in modules )
            {
                if ( modules.hasOwnProperty(m) )
                {
                    var result = modules[m].run();
                    this.modules_html += tim(templates.module, {
                                            module_title : result.name,
                                            module_body  : result.content,
                                            module_id    : m
                                        });
                                        
                    if ( typeof modules[m].bind === 'function' ) bind_stack.push(modules[m].bind);
                }
            }
        },
        
        getRawSource : function()
        {
            var self = this;
            ajax({
                type        : 'GET',
                url         : location.href,
                onSuccess   : function( data ){
                     self.raw_source = prepSource(data);
                     $('#snpy_rawsource code.html').html(self.raw_source);
                }
            }); 
        },
        
        getGeneratedSource : function()
        {
            this.gen_source = prepSource(doc.documentElement.innerHTML.toString());
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
    
    /*
     * Modules display content in the 'overview' tab.
     * Each module must return a JSON object with the following definition:
     *
     * { name : 'The module name', content : 'The HTML content to render in the module' }
     *
     */
    modules = {
        
        pageinfo : {
            
            // NOTE: doesn't check for MathML or SVG doctypes. Not sure it is worth including these?
            
            doctypes : [
            
                // source: http://www.w3.org/QA/2002/04/valid-dtd-list.html
            
                { publicId : '-//W3C//DTD HTML 4.01//EN', desc : 'HTML 4.01 Strict' },
                { publicId : '-//W3C//DTD HTML 4.01 Transitional//EN', desc : 'HTML 4.01 Transitional' },
                { publicId : '-//W3C//DTD HTML 4.01 Frameset//EN', desc : 'HTML 4.01 Frameset' },
                
                { publicId : '-//W3C//DTD XHTML 1.0 Strict//EN', desc : 'XHTML 1.0 Strict' },
                { publicId : '-//W3C//DTD XHTML 1.0 Transitional//EN', desc : 'XHTML 1.0 Transitional' },
                { publicId : '-//W3C//DTD XHTML 1.0 Frameset//EN', desc : 'XHTML 1.0 Frameset' },
                  
                { publicId : '-//W3C//DTD XHTML 1.1//EN', desc : 'XHTML 1.1' },
                  
                { publicId : '-//IETF//DTD HTML 2.0//EN', desc : 'HTML 2.0' },
                { publicId : '-//W3C//DTD HTML 3.2 Final//EN', desc : 'HTML 3.0' },
                { publicId : '-//W3C//DTD XHTML Basic 1.0//EN', desc : 'XHTML 1.0 Basic' },
                
                { publicId : '', desc : 'HTML5' }
                
            ],
            
            getDoctype : function()
            {
                var doctype  = document.doctype,
                    definition = 'None detected';

                if ( doctype )
                {   
                    var type     = doctype.name,
                        publicId = doctype.publicId;
                        
                    if ( type.toLowerCase() === 'html' )
                    {
                        for ( var d, i = -1; d = this.doctypes[++i]; )
                        {
                            if ( publicId === d.publicId )
                            {
                                definition = d.desc;
                                break;
                            }
                        }
                    }
                    else
                    {
                        definition = 'Not recognised';
                    }
                }
                return '<dt>Doctype:</dt> <dd>'+definition+'</dd>';
            },
            
            getCharset : function()
            {
                return '<dt>Character Set:</dt> <dd>'+document.characterSet+'</dd>';
            },
            
            run : function()
            {                
                var content = this.getDoctype() + this.getCharset();
                
                return {
                    name    : 'General Page Information',
                    content : '<dl>'+content+'</dl>'
                }
            }
        },
        
        jslibs : {
            
            libs : [
                {
                    name : 'jQuery',
                    version : function(){ return window.jQuery ? jQuery.fn.jquery : null; }
                },
                {
                    name : 'jQuery UI',
                    version : function(){ return window.jQuery && jQuery.ui ? jQuery.ui.version : null; }
                },
                {
                    name : 'Prototype',
                    version : function(){ return window.Prototype ? Prototype.Version : null; }
                },
                {
                    name : 'MooTools',
                    version : function(){ return window.MooTools ? MooTools.version : null; }
                }
            ],
            
            run : function()
            {
                var content = '';
                
                for ( var lib, i = -1; lib = this.libs[++i]; )
                {
                    var v = lib.version();
                    if ( v ) content += '<li class="positive">'+lib.name+' <span class="version">(v'+v+')</span></li>';
                    else content += '<li class="negative">'+lib.name+'</li>';
                }
                
                return {
                    name    : 'JavaScript libraries',
                    content : '<ul class="tests">'+content+'</ul>'
                }
            }
        },
        
        analytics : {
            
            vendors : [
                {
                    name : 'Google Analytics',
                    check : function(){ return window._gat }
                },
                {
                     name : 'Reinvigorate',
                     check : function(){ return window.reinvigorate }
                },
                {
                    name : 'Piwik',
                    check : function(){ return window.Piwik }
                }
            ],
            
            run : function()
            {
                var content = '';
                
                for ( var v, i = -1; v = this.vendors[++i]; )
                {
                    if ( v.check() ) content += '<li class="positive">'+v.name+'</li>';
                    else content += '<li class="negative">'+v.name+'</li>';
                }
                
                return {
                    name    : 'Analytics',
                    content : '<ul class="tests">'+content+'</ul>'
                }
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
        <li class=\"active\"><a href=\"#snpy_overview\">Overview</a></li>\
        <li><a href=\"#snpy_rawsource\">View Source</a></li>\
        <li><a href=\"#snpy_gensource\"><span class=\"no320\">View</span> Generated Source</a></li>\
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
</div>",

    module : "\
<div class=\"module {{module_id}}\">\
    <h2>{{module_title}}</h2>\
    {{module_body}}\
</div>"

    };
    
    //////////// HELPER FUNCTIONS ////////////////
    
    //= require "../lib/tim"
    
    //= require "snoopquery"
    
    //= require "utils"
    
    snoopy.init(); /* kick things off... */
  
})( window, document );