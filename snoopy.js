// Snoopy - info about the page you are on, at a glance.
// Written by Mark Perkins, mark@allmarkedup.com
// License: http://unlicense.org/ (i.e. do what you want with it!)

;(function( window, document ){
    
    var doc  = document,
        body = doc.getElementsByTagName('body')[0],
        snoopy, modules, config, templates;
        
    config = {
        VERSION     : '0.1 alpha',
        WRAPPER_ID  : 'snoopy'
    };
    
    snoopy = {
        
        body : '',
        
        init : function()
        {
            var el = this.elem = create('div'),
                bindStack = [];
                
            el.id = config.WRAPPER_ID;
            el.className = 'cleanslate';
            
            for ( m in modules )
            {
                if ( modules.hasOwnProperty(m) )
                {
                    this.addModule(m, modules[m].run());
                    if ( typeof modules[m].bind === 'function' ) bindStack.push(modules[m].bind);
                }
            }
            
            this.elem.innerHTML = tim(templates.snoopy, {
                                        version: config.VERSION,
                                        body : this.body
                                    });
            
            body.appendChild(this.elem);
            
            for ( var d, i = -1; d = bindStack[++i]; ) d(); // run modules' bind operations here
            
            var close = doc.getElementById('snoopy_close').addEventListener( 'click', function(e){
                el.className += ' closed';
                e.preventDefault();
                e.stopPropagation();
            }, true);
            
        },
        
        addModule : function( module_name, result )
        {
            var title = result.menu ? result.name +'<span class="snoopy_menu">'+result.menu+'</span>' : result.name;
            this.body += tim(templates.module, {
                                    name        : title,
                                    output      : result.content,
                                    className   : module_name
                                });
        }
        
    };
    
    /*
     * each module must return a JSON object with the following definition:
     *
     * {
     *      name    : 'The module name'
     *      content : 'The HTML content to render in the module'
     * }
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
                return '<strong>Doctype:</strong> <span>'+definition+'</span>';
            },
            
            getCharset : function()
            {
                return '<strong>Character Set:</strong> <span>'+document.characterSet+'</span>';
            },
            
            run : function()
            {                
                var content = '<li>'+this.getDoctype()+'</li>';
                content += '<li>'+this.getCharset()+'</li>';
                
                return {
                    name    : 'Page Information',
                    menu    : '<a id=\"snoopy_viewsource\" href=\"#\">view source</a> <a class="snoopy_validate" href="http://validator.w3.org/check?verbose=1&uri='+location.href+'">validate</a>',
                    content : '<ul>'+content+'</ul>'
                }
            },
            
            bind : function()
            {
                var close = doc.getElementById('snoopy_viewsource').addEventListener( 'click', function(e){
                    
                }, true);
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
                    if ( v ) content += '<li class="snoopy_active">'+lib.name+' <span class="snoopy_version">(v'+v+')</span></li>';
                    else content += '<li class="snoopy_disabled">'+lib.name+'</li>';
                }
                
                return {
                    name    : 'JavaScript libraries',
                    content : '<ul class="cols">'+content+'</ul>'
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
                    if ( v.check() ) content += '<li class="snoopy_active">'+v.name+'</li>';
                    else content += '<li class="snoopy_disabled">'+v.name+'</li>';
                }
                
                return {
                    name    : 'Analytics',
                    content : '<ul class="cols">'+content+'</ul>'
                }
            }
            
        }
        
    };
    
    templates = {
        
        snoopy : "\
<div class=\"snoopy_header\">\
    <h1>Snoopy <span class=\"snoopy_version\">v{{version}}</span> <a id=\"snoopy_close\" href=\"#\">&#10005; CLOSE</a></h1>\
</div>\
<div class=\"snoopy_body\">{{body}}</div>\
<div class=\"snoopy_footer\"></div>",

        module : "\
<div class=\"snoopy_module snoopy_{{className}}\">\
    <h2>{{name}}</h2>\
    <div class=\"snoopy_inner\">{{output}}</div>\
</div>"

    };
    
    // helper functions
    
    function create(type)
    {
        return doc.createElement(type);
    }
    
    function trim(str)
    {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
    
    // tim - A tiny JavaScript micro-templating script.
    // http://gist.github.com/521352
    var tim = (function(){
        var starts  = "{{",
            ends    = "}}",
            path    = "[a-z0-9_][\\.a-z0-9_]*", // e.g. config.person.name
            pattern = new RegExp(starts + "("+ path +")" + ends, "gim"),
            length  = "length",
            undef;

        return function(template, data){
            return template.replace(pattern, function(tag){
                var ref = tag.slice(starts[length], 0 - ends[length]),
                    path = ref.split("."),
                    len = path[length],
                    lookup = data,
                    i = 0;

                for (; i < len; i++){
                    if (lookup === undef){
                        break;
                    }
                    lookup = lookup[path[i]];

                    if (i === len - 1){
                        return lookup;
                    }
                }
            });
        };
    }());
    
    // kick things off...
        
    snoopy.init();
  
})( window, document );