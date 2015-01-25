define(['underscore','backbone_streams'], function(_, Backbone){
    var Station = Backbone.Model.extend({
        initialize: function(params){
            this.dilation_rate = this.stream("dilation_rate").toProperty(params.dilation_rate || this.get("dilation_rate"));
            this.dilation_rate.onValue(function(dr){
                this.set("dilation_rate", dr);
            }.bind(this));

            this.relative_time = this.stream("dt").scan(0, function(t, dt){
                if (!_.isNaN(dt))
                    return t + dt;
                return t;
            });
            this.relative_time.onValue(function(rt){
                this.set("relative_time", rt);
            }.bind(this));
            this.power = this.stream("power").scan(this.get("power"), function(op, np){
                return np;
            });
            this.power.onValue(function(p){this.set("power", p);}.bind(this));
        },
        defaults:{
            name: "station",
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