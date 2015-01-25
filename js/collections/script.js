define(['underscore','bacon', 'backbone_streams','models/response'], function(_, Bacon, Backbone, Response){
    var ResponseList = Backbone.Collection.extend({
        model: Response
    });
    var Script = Backbone.View.extend({
        initialize: function(params){
            var responses = this.responses =  new ResponseList;
            responses.on("add", function(model){
                console.log("Script.add:"+model);
            });
            this.stream("state").onValue(this.update.bind(this));
            this.view = params.view;
        },
        update: function(ship){
            this.responses.each(function(rsp){
                rsp.stream("state").push(ship);
            });
        }
    },{
        default_script: function(params){
            var script = new Script(params);
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"command",
                    received:0.0,
                    sent:0.0,
                    content:" SYSTEM DAMAGED"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 2000.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"command",
                    received:2000.0,
                    sent:0.0,
                    content:" AUTOPILOT UNABLE TO ENGAGE"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 3000.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"command",
                    received:3000.0,
                    sent:0.0,
                    content:" MANUAL OVERRIDE ACTIVATED"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 4000.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"command",
                    received:4000.0,
                    sent:0.0,
                    content:" BACKUP COMM STATUS ONLINE"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 5000.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"command",
                    received:5000.0,
                    sent:0.0,
                    content:" PROCEED WITH ORDERS"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 12000.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"right_engine",
                    received:12000.0,
                    sent:0.0,
                    content:" Orders Captain?"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 18000.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"left_engine",
                    received:18000.0,
                    sent:0.0,
                    content:" Orders Captain?"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 20500.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"sensors",
                    received:20500.0,
                    sent:0.0,
                    content:" Captain, according to our readings, we've entered the gravity well of a black hole."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 25000.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"sensors",
                    received:25000.0,
                    sent:0.0,
                    content:" Be advised, time dilation across the ship is already affecting the crew's reaction times."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 30000.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"sensors",
                    received:30000.0,
                    sent:0.0,
                    content:" Time in the red sections of the ship is running slower than in the rest of the ship."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 32000.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"sensors",
                    received:32000.0,
                    sent:0.0,
                    content:" Advise we set left and right thrusters to 75% and 25%, respectively."
                })
            });
            //60k Right Engine awaits response
            //65k Left Engine awaits orders
            script.responses.create({
                check: Response.conditions.time_passed("command", 100000.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"sensors",
                    received:100000.0,
                    sent:0.0,
                    content:" We'll need to make another turn to avoid more debris. Advise we set thrusters to 60% and 40%."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 100000.0),
                apply: Response.actions.change_ship_position(this.view, 120, 70, 1.0)
            });

            //120k Right needs orders
            //140k Engine awaits orders
            script.responses.create({
                check: Response.conditions.time_passed("command", 150000.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"sensors",
                    received:150000.0,
                    sent:0.0,
                    content:" Rogue piece of debris incoming! We won't be able to avoid this one! Use of shields advised, Tier 2 or higher!"
                })
            });
            //180k Shields
            script.responses.create({
                check: Response.conditions.time_passed("command", 200000.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"sensors",
                    received:200000.0,
                    sent:0.0,
                    content:" The rogue debris is no more, Captain."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 210000.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"power_core",
                    received:210000.0,
                    sent:0.0,
                    content:" Our power supply is limited Captain, we can't keep this shield on forever."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 220000.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"sensors",
                    received:220000.0,
                    sent:0.0,
                    content:" Advise we proceed with a straight course for 20 seconds."
                })
            });
            //230k Left engine orders
            //240k Right engine orders
            script.responses.create({
                check: Response.conditions.time_passed("command", 250000.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"sensors",
                    received:250000.0,
                    sent:0.0,
                    content:" Captain, I've found a way out. Our time frame is closing fast though. We'll need to divert more power to the engines for full speed."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 260000.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"power_core",
                    received:260000.0,
                    sent:0.0,
                    content:" Diverting power from shields to engines."
                })
            });
            //270k Left Engine Order
            //280k Right Engine Order
            script.responses.create({
                check: Response.conditions.time_passed("command", 290000.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"command",
                    received:290000.0,
                    sent:0.0,
                    content:" SAFE DISTANCE FROM EVENT HORIZON ACHIEVED"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 290000.0),
                apply: Response.actions.change_dilation({
                    command: 1.0,
                    sensors: 1.0,
                    shields: 1.0,
                    left_engine: 1.0,
                    power_core: 1.0,
                    right_engine: 1.0,
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 305000.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"command",
                    received:300000.0,
                    sent:0.0,
                    content:" EXECUTING SOS PROTOCOLS"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command",300000.0),
                apply: Response.actions.stop_timer()
            });
            script.responses.create({
                check: _.constant(true),
                apply: Response.actions.engine_response("left_engine")
            });
            script.responses.create({
                check: _.constant(true),
                apply: Response.actions.engine_response("right_engine")
            });
            script.responses.create({
                check: _.constant(true),
                apply: Response.actions.shield_response()
            });
            script.responses.create({
                check: Response.conditions.time_passed("left_engine",10000.0),
                apply: Response.actions.command_afk("left_engine", 30000.0, 
                    "Command, are you still online? You've been pretty quiet.")
            });
            return script;
        }
    });
    return Script;
});
