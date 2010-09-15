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