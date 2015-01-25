define([], function(){
    var Response = Backbone.Model.extend({
        initialize: function(params){
            params || (params = {});
            this.streams("state").onValue(function(ship){
                if (this.get("check")(ship){
                        return this.get("apply")(ship);
                });
            });
        },
        defaults:{
            check: _.constant(false),
            apply: null,
            ship: null
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
            }
        },
        actions: {
            send_message: function(params){
                return function(ship){
                    ship.messenger.create(params);
                }
            }
        }
    });
    return Response;
});