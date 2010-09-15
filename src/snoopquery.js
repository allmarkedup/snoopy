    /*
     * 'snoopQuery' - mini jQuery-style DOM helper functions.
     * Only intended to work in newer browsers (eg. with querySelectorAll support),
     * VERY limited, not intended for extraction, only useful in a Snoopy-specific context
     * Methods should be ab API match for jQuery so that it could be dropped in as a replacement if necessary later on.
     */
    snoopQuery = function( selector )
    {
        return new snoopQuery.fn.init(selector);
    }

    snoopQuery.fn = snoopQuery.prototype = {
    
        length : 0,
        selector : '',
            
        init : function( selector )
        {
            var elem,
                tagExp = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
                match;

            if ( ! selector ) return this;
        
            if ( selector.nodeType )
            {
                this[0] = selector;
                this.length = 1;
                return this;
            }
        
            if ( selector === window )
            {
               this[0] = selector;
               this.length = 1;
               return this;
            }
        
            match = tagExp.exec(selector);
        
            if ( match )
            {
                // deal with very basic element creation here
                selector = [doc.createElement(match[1])];
                merge( this, selector );
                return this;
            }
            else if ( /^#[\w+]$/.test( selector ) )
            {
                // ID
                elem = doc.getElementById(selector);
                if ( elem )
                {
                    this.length = 1;
                    this[0] = elem;
                }
                this.selector = selector;
                this.context = document;
                return this;
            }
            else if ( /^\w+$/.test( selector ) )
            {
                // TAG
                this.selector = selector;
                this.context = document;
                selector = document.getElementsByTagName( selector );
                return merge( this, selector );
            }
            else if ( typeof selector === 'string' )
            {
                // else use generic querySelectorAll
                this.selector = selector;
                this.context = document;
                selector = document.querySelectorAll( selector );
                return merge( this, selector );
            }
                    
            if (selector.selector !== undefined)
            {
                this.selector = selector.selector;
                this.context = selector.context;
            }
                    
            return merge( selector, this );
        },
    
        // internal iterator 
        each : function( callback )
        {
            var i = 0,
                length = this.length;
        
            for ( var value = this[0]; i < length && callback.call( value, i, value ) !== false; value = this[++i] ) {}  
        },
    
        // very simple event binding function
        bind : function( event, callback )
        {
            for ( var i = 0, l = this.length; i < l; i++ )
            {
                this[i].addEventListener( event, function(e){
                    if ( callback.call(this, e) === false )
                    {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }, false );
            }
            return this;
        },

        addClass : function( value )
        {
            var cn = (value || '').split(/\s/);
            this.each(function(){
                for ( var i = 0, l = cn.length; i < l;  i++ )
                {
                    if ( ! snoopQuery(this).hasClass( cn[i] ) ) this.className += this.className ? ' '+cn[i] : cn[i];
                }
            });
            return this;
        },
    
        removeClass : function( value )
        {
            var cn = (value || '').split(/\s/);
        
            this.each(function(){
                for ( var i = 0, l = cn.length; i < l;  i++ )
                {
                    this.className = trim(this.className.replace( this.className.match(' '+cn[i]) ? ' '+ cn[i] : cn[i], '' ));
                }
            });
            return this;
        },
    
        hasClass : function( value )
        {
            return this[0] ? new RegExp('\\b'+value+'\\b').test(this[0].className) : false;
        },
    
        // get/set attributes
    
        attr : function( key, val )
        {
            if ( val !== undefined )
            {
                this.each(function(){
                    this.setAttribute( key, val );
                });
                return this;
            }
            else
            {
                return this[0] ? this[0].getAttribute( key ) : null;
            }
        },
    
        // VERY basic HTML function, no cleanup or anything yet.
        html : function( html )
        {
            if ( html !== undefined )
            {
                this.each(function(){
                    this.innerHTML = html;
                });
                return this;
            }
            return this[0] ? this[0].innerHTML : null;
        },
    
        // DOM insertion methods
    
        append : function( elem )
        {
            if ( elem !== undefined )
            {
                elem = elem[0] ? elem[0] : elem;
                this.each(function(){
                    this.appendChild(elem);
                });
                return this; 
            }
        }

    };

    snoopQuery.fn.init.prototype = snoopQuery.fn;
    $ = snoopQuery;

    ////// snoopQuery methods that don't match the jQuery API are implemented as jQuery compatible plugins /////

    // add important styles inline
    (function() {
    
        var styles_regexp = /([\w-]+)\s*:\s*([^;!]+)\s?(!\s?important?)?\s?[;|$]?/i;

        $.fn.style = function( prop, val, important )
        {
            if ( val !== undefined )
            {
                // setting a value
                important = important || false;
                return this.each(function(){
                
                    var dconst_rules = [];
                
                    var self = $(this);
                    split(dconst_rules, self.attr('style')); // split up the rules
                    set(dconst_rules, prop, val, important);
                    self.attr('style', combine(dconst_rules) );
                });
            }
            else
            {
                // getting a value
                var self = $(this[0]),
                    dconst_rules = [];
                
                split(dconst_rules, self.attr('style')); // split up the rules
                return get(dconst_rules, prop);
            }
        }
    
        function get( dconst_rules, prop )
        {
            for ( var rule, i = -1; rule = dconst_rules[++i]; )
            {
                if ( prop === rule.prop ) return rule.val;
            }
            return null;
        }

        function set( dconst_rules, prop, val, important )
        {
            prop = trim(prop);
        
            for ( var rule, i = -1; rule = dconst_rules[++i]; )
            {
                if ( prop === rule.prop )
                {
                    dconst_rules[i].val = val;
                    dconst_rules[i].important = important;
                    return;
                }
            }
            dconst_rules.push({ prop : prop, val : val, important : important });
        }
    
        function combine( dconst_rules )
        {
            var rule_string = '';
            for ( var rule, i = -1; rule = dconst_rules[++i]; )
            {
                rule_string += rule.prop + ' : '+ rule.val;
                if ( rule.important ) rule_string += ' !important';
                rule_string += ';';
            }
            return rule_string;
        }

        function split( dconst_rules, rule_string )
        {
            if ( typeof rule_string === 'string' )
            {
                var rules = rule_string.split(/;/);

                for ( i= 0, l = rules.length; i < l; i++ )
                {
                    var r = trim(rules[i]);
                    if ( r !== '' )
                    {
                        var match = r.match(styles_regexp);
                        dconst_rules.push({ prop : trim(match[1]), val : trim(match[2]), important : !! match[3] });
                    }
                }
            }
        }

    })();