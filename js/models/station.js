define(['underscore','backbone_streams', 'collections/inbox'], function(_, Backbone, Inbox){
    var Station = Backbone.Model.extend({
        initialize: function(params){
            this.dilation_rate = this.stream("dilation_rate").toProperty(params.dilation_rate || this.get("dilation_rate"));
            this.dilation_rate.onValue(function(dr){this.set("dilation_rate", dr)}.bind(this));

            this.relative_time = this.stream("dt").scan(0, function(t, dt){
                if (!_.isNaN(dt))
                    return t + dt;
                return t;
            })
            this.relative_time.onValue(function(rt){
                this.set("relative_time", rt);
            }.bind(this));
            
            this.inbox = new Inbox();
            if (params.messages){
                _.each(params.messages, function(msg){
                    this.inbox.create(msg);
                }.bind(this))
            }
        },
        defaults:{
            dilation_rate: 1.0,
            relative_time: 0.0,
            power: 1.0,
            messages: []
        },
        fetch: function(){},
        save: function(){},
        load: function(){}
    });
    return Station;
});