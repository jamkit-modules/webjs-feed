const module = (function() {
    var _web_loaded = false, _contexts = {}

    function _get_context(name) {
        if (!_contexts[name]) {
            _contexts[name] = {};
        }
    
        return _contexts[name];
    }
    
    return {  
        feed: function(name) {
            return new Promise((resolve, reject) => {
                const context = _get_context(name);
        
                if (_web_loaded) {
                    resolve(context["next-token"]);
                } else {
                    context["handler"] = resolve;
                }    
            });
        },
        
        reset: function() {
            _web_loaded = false, _contexts = {}
        },
        
        on_feed_done: function(name, next_token) {
            const context = _get_context(name);
        
            if (context["handler"]) {
                delete context["handler"];
            }
        
            context["next-token"] = next_token;
        },
        
        on_web_loaded: function() {
            _web_loaded = true;
        
            Object.keys(_contexts).forEach((name) => {
                const context = _get_context(name);
                
                if (context["handler"]) {
                    context["handler"](context["next-token"]);
                }
            });
        },
        
        is_web_loaded: function() {
            return _web_loaded;
        },    
    }
})();

__MODULE__ = module;
