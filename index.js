WebJSFeed = (function() {
    return {
        _contexts: {},
        _web_loaded: false
    }
})();

WebJSFeed.feed = function(name, handler) {
    var context = this._get_context(name);

    if (this._web_loaded) {
        handler(context["next-token"]);
    } else {
        context["handler"] = handler;
    }
}

WebJSFeed.reset = function() {
    this._web_loaded = false
    this._contexts = {}
}

WebJSFeed.on_feed_done = function(name, next_token) {
    var context = this._get_context(name);

    if (context["handler"]) {
        delete context["handler"];
    }

    context["next-token"] = next_token;
}

WebJSFeed.on_web_loaded = function() {
    var self = this;

    this._web_loaded = true;

    Object.keys(this._contexts).forEach(function(name) {
        var context = self._get_context(name);
        
        if (context["handler"]) {
            context["handler"](context["next-token"]);
        }
    });
}

WebJSFeed.is_web_loaded = function() {
    return WebJSFeed._web_loaded;
}

WebJSFeed._get_context = function(name) {
    if (!this._contexts[name]) {
        this._contexts[name] = {};
    }

    return this._contexts[name];
}

__MODULE__ = WebJSFeed;
