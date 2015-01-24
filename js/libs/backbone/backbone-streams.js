(function(root, factory) {
    // Set up Backbone-associations appropriately for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
        define(['underscore', 'backbone', 'bacon'], function(_, Backbone, Bacon) {
            // Export global even in AMD case in case this script is loaded with
            // others that may still expect a global Backbone.
            return factory(root, Backbone, Bacon, _);
        });

    // Next for Node.js or CommonJS.
    } else if (typeof exports !== 'undefined') {
        var _ = require('underscore'),
            Backbone = require('backbone'),
            Bacon = require('bacon');
        factory(root, Backbone, Bacon, _);
        if (typeof module !== 'undefined' && module.exports) {
            module.exports = Backbone;
        }
        exports = Backbone;

    // Finally, as a browser global.
    } else {
        factory(root, root.Backbone, root.Bacon, root._);
    }

}(this, function(root, Backbone, Bacon, _) {
    // Backbone.Streams
  // ---------------

  // An extension of the event system for Backbone.js using Functional Reactive Programming
  // through Bacon.js. API should be the same as the default Backbone.Events module.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Streams = Backbone.Streams = {

      init_streams: function(){
          this._streams || (this._streams = {
            new_stream: new Bacon.Bus(),
            all: new Bacon.Bus()
        });
      },
      stream: function(name, stream){
        this.init_streams();
        var s = this._streams[name];
        if (!s){
            s = this._streams[name] = (stream || new Bacon.Bus());
            s._unsubs = [];
            s.onValue(function(){
                this.stream("all").push({stream:s, name:name, result:arguments});
            }.bind(this));
            this._streams.new_stream.push({stream:s,name:name});
        }
        return s;
      },
      has_stream: function(name){
          this.init_streams();
          return !!this._streams[name];
      },
    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
        var stream = this.stream(name);
        var wrap = function(){
            var result = callback.apply(this,arguments);
            if (result === Bacon.noMore){
                this.off(name, wrap);
            }
            return result;
        }.bind(this);
        stream._unsubs.push({
            unsub: stream.onValue(wrap),
            callback: callback,
            context: context,
            ctx: context || this
        });
        return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var once = _.once(function() {
          callback.apply(this, arguments);
          return Bacon.noMore;
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      if (!this._streams || !eventsApi(this, 'off', name, [callback, context])) return this;
        var streams = name? ({}[name] = this.stream(name)):this._streams;
        _.each(streams, function(stream, n){
            if(!name || name === n){
                _.each(stream._unsubs, function(event, i){
                   if (!context || event.context === context){
                        if (!callback || event.callback === callback){
                            event.unsub();
                            stream._unsubs.splice(i, 1);
                            delete event;
                        }
                   }
                });
            }
        });
      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      var args = [].slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var stream = this.stream(name);
      stream.push.apply(stream,args);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && typeof name === 'object') callback = this;
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      for (var id in listeningTo) {
        obj = listeningTo[id];
        obj.off(name, callback, this);
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, length = names.length; i < length; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };
    
  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Streams[method] = function(obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      listeningTo[id] = obj;
      if (!callback && typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Streams.bind   = Streams.on;
  Streams.unbind = Streams.off;
  Streams.fire = Streams.trigger;
    _.extend(Backbone.Model.prototype, Streams);
    _.extend(Backbone.View.prototype, Streams);
    _.extend(Backbone.Collection.prototype, Streams);
    return Backbone;
}))