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
            power_too_low: function(station, limit){
                return function(ship){
                    if (ship[station].get("power") < limit) return true;
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
            },
            engine_response: function(station){
                var reader = function(args){
                    var msg = args[0], ship = args[1];
                    if (msg.get("from").get("key") === "command"){
                        var content = msg.get("content");
                        var matchNumber = content.match(/\d+/);
                        if (matchNumber){
                            var value = matchNumber[0];
                            if (value >= 0.0 && value <= 100.0){
                                ship.messenger.send({
                                    from:station,
                                    to:"command",
                                    content:"Copy. Setting "+msg.get("to").get("name")+" to "+value+"%."
                                });
                                ship[station].set("power", value);
                            } else {
                                ship.messenger.send({
                                    from:station,
                                    to:"command",
                                    content:"Cannot comply, Command. She can only go from 0-100%, not "+value+"."
                                });
                            }
                        } else {
                            ship.messenger.send({
                                from:station,
                                to:"command",
                                content:"Did not copy, Command. Please respond with engine values."
                            });
                        }
                    };
                };
                return Response.actions.check_message(station, reader);
            },
            shield_response: function(){
                var reader = function(args){
                    var msg = args[0], ship = args[1];
                    if (msg.get("from").get("key") === "command"){
                        var content = msg.get("content");
                        var matchNumber = content.match(/\d+/);
                        if (matchNumber){
                            var value = matchNumber[0];
                            if (value >= 1.0 && value <= 3.0){
                                ship.messenger.send({
                                    from:"shields",
                                    to:"command",
                                    content:"Understood. Shields set to tier "+value+"."
                                })
                                ship["shields"].set("power", value);
                            } else {
                                ship.messenger.send({
                                    from:"shields",
                                    to:"command",
                                    content:"Negative, Command. Shields can only be set from tiers 1-3."
                                })
                            }
                        } else {
                            ship.messenger.send({
                                from:"shields",
                                to:"command",
                                content:"Sorry, Command. I need a shield tier number."
                            })
                        }
                    };
                };
                return Response.actions.check_message("shields", reader);
            },
            command_afk: function(station, limit, message){
                return function(ship){
                    var station_model = ship[station];
                    var trigger_time = station_model.get("relative_time")+limit;
                    var cancel = station_model.relative_time.onValue(function(t){
                        if (t > trigger_time){
                            ship.messenger.send({
                                from:station,
                                to:"command",
                                content: message
                            })
                            return Bacon.noMore;
                        }
                    });
                    station_model.stream("message").onValue(cancel);
                    return Bacon.noMore;
                }
            }
        }
    });
    return Response;
});