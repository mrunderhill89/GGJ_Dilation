define(['backbone_streams','bacon'], function(Backbone, Bacon){
    var Response = Backbone.Model.extend({
        initialize: function(params){
            params || (params = {});
            this.stream("state").onValue(function(ship){
                if (this.get("check")(ship)){
                        return this.get("apply")(ship);
                };
            }.bind(this));
        },
        defaults:{
            check: _.constant(false),
            apply: null,
        },
        fetch: function(){},
        save: function(){},
        load: function(){}
    },{
        conditions: {
            time_passed: function(station, time){
                return function(ship){
                    if (ship[station].get("relative_time") > time) return true;
                    return false;
                }
            },
        },
        actions: {
            send_message: function(params){
                return function(ship){
                    ship.messenger.send(params);
                    return Bacon.noMore;
                };
            },
            check_message: function(station, message_reader){
                return function(ship){
                    ship[station].stream("message")
                    .map(function(msg){return [msg, ship]})
                    .onValue(message_reader);
                    return Bacon.noMore;
                };
            }
        }
    });
    return Response;
});