define(['underscore','bacon', 'backbone_streams','models/response'], function(_, Bacon, Backbone, Response){
    /*
        {
        from:"SYS_AI",
        received:0.0,
        sent:0.0,
        content:" SYSTEM DAMAGED"
       },
       {
        from:"SYS_AI",
        received:2000.0,
        sent:2000.0,
        content:" AUTOPILOT UNABLE TO ENGAGE"
       },
       {
        from:"SYS_AI",
        received:3000.0,
        sent:3000.0,
        content:" MANUAL OVERRIDE ACTIVATED"
       },
       {
        from:"SYS_AI",
        received:4000.0,
        content:" BACKUP COMM STATUS ONLINE"
       },
       {
        from:"SYS_AI",
        received:5000.0,
        content:" PROCEDE WITH ORDERS"
       },
        Right_Engine_Orders: {
        from:"Right Engine",
        received:12000.0,
        content:" Orders Captain?"
       },
       {
        from:"Left Engine",
        received:18000.0,
        content:" Orders Captain?"
       },
       {
        from:"Sensors",
        received:20500.0,
        content:"Captain, according to our readings, we've entered the gravity well of a black hole."
       },
        {
            from:"Sensors",
            received: 25000.0,
            content:"Advise we set left and right thrusters to 75% and 25%, respectively."
        },
        {
            from:"Sensors",
            received: 30000.0,
            content:"Be advised, time dilation across the ship is already affecting the crew's reaction times."
        },
        {
            from:"Sensors",
            received: 32000.0,
            content:"Time in the red sections of the ship is running slower than in the rest of the ship."
        },
       {
        from:"Right Engine",
        received:60000.0,
        content:" Right away!"
       },
       {
        from:"Left Engine",
        received:65000.0,
        content:" Performing necesary callibrations now."
       },
       {
        from:"Sensors",
        received:80000.0,
        content:" We need to straighten the ship's course, lest we ram into debris. Advise we set thrusters to 50% each."
       },
       {
        from:"Right Engine",
        received:90000.0,
        content:" Right away!"
       },
       {
        from:"Left Engine",
        received:95000.0,
        content:" Performing necesary callibrations now."
       },
       {
        from:"Sensors",
        received:100000.0,
        content:" We'll need to make another turn to avoid more debris. Advise we set thrusters to 60% and 40%."
       },
       {
        from:"Right Engine",
        received:120000.0,
        content:" Orders recieved!"
       },
       {
        from:"Left Engine",
        received:140000.0,
        content:" Right thruster set to 40%!"
       },
       {
        from:"Sensors",
        received:150000.0,
        content:" Rogue piece of debris incoming! We won't be able to avoid this one! Use of shields advised, Tier 2!"
       },
       {
        from:"Shields",
        received:180000.0,
        content:" Shields online, setting to Tier 2"
       },
       {
        from:"Shields",
        received:190000.0,
        content:" Shields intact, damage is minimal"
       },
       {
        from:"Sensors",
        received:200000.0,
        content:" The rogue debris is no more, Captain."
       },
       {
        from:"Power Core",
        received:210000.0,
        content:" Our power supply is limited Captain, we can't keep this shield on forever."
       },
       {
        from:"Sensors",
        received:220000.0,
        content:" Advise we procede with a straight course for 20 seconds"
       },
       {
        from:"Left Engine",
        received:230000.0,
        content:" Normalizing thrust for straight course."
       },
       {
        from:"Right Engine",
        received:230000.0,
        content:" Copy that."
       },
       {
        from:"Sensors",
        received:250000.0,
        content:" Captain, I've found a way out. Our time frame is closing fast though. We'll need to divert more power to the engines for full speed."
       },
       {
        from:"Power Core",
        received:260000.0,
        content:" Diverting power from shields to engines."
       },
       {
        from:"Left Engine",
        received:270000.0,
        content:" Maximizing thrust"
       },
       {
        from:"Right Engine",
        received:280000.0,
        content:" Right Engine set to 100%"
       },
       {
        from:"SYS_AI",
        received:290000.0,
        content:" SAFE DISTANCE FROM EVENT HORIZON REACHED"
       },
       {
        from:"SYS_AI",
        received:300000.0,
        content:" EXECUTING SOS PROTOCOLS"
       },
           ];
           */
    var ResponseList = Backbone.Collection.extend({
        model: Response
    });
    var Script = Backbone.View.extend({
        initialize: function(){
            var responses = this.responses =  new ResponseList;
            responses.on("add", function(model){
                console.log("Script.add:"+model);
            });
            this.stream("state").onValue(this.update.bind(this));
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
<<<<<<< HEAD
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"command",
                    received:2000.0,
                    sent:0.0,
                    content:" AUTOPILOT UNABLE TO ENGAGE"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"command",
                    received:3000.0,
                    sent:9000.0,
                    content:" MANUAL OVERRIDE ACTIVATED"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"command",
                    received:4000.0,
                    sent:0.0,
                    content:" BACKUP COMM STATUS ONLINE"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"command",
                    received:5000.0,
                    sent:0.0,
                    content:" PROCEED WITH ORDERS"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"right_engine",
                    received:12000.0,
                    sent:0.0,
                    content:" Orders Captain?"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"left_engine",
                    received:18000.0,
                    sent:0.0,
                    content:" Orders Captain?"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"sensors",
                    received:20500.0,
                    sent:0.0,
                    content:" Captain, according to our readings, we've entered the gravity well of a black hole."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"sensors",
                    received:25000.0,
                    sent:0.0,
                    content:" Be advised, time dilation across the ship is already affecting the crew's reaction times."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"sensors",
                    received:30000.0,
                    sent:0.0,
                    content:" Time in the red sections of the ship is running slower than in the rest of the ship."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"sensors",
                    received:32000.0,
                    sent:0.0,
                    content:" Advise we set left and right thrusters to 75% and 25%, respectively."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"right_engine",
                    received:60000.0,
                    sent:0.0,
                    content:" Right away!"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"left_engine",
                    received:65000.0,
                    sent:0.0,
                    content:" Performing necesary callibrations now."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"sensors",
                    received:100000.0,
                    sent:0.0,
                    content:" We'll need to make another turn to avoid more debris. Advise we set thrusters to 60% and 40%."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"right_engine",
                    received:120000.0,
                    sent:0.0,
                    content:" Orders recieved!"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"right_engine",
                    received:140000.0,
                    sent:0.0,
                    content:" Right thruster set to 40%!"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"sensors",
                    received:150000.0,
                    sent:0.0,
                    content:" Rogue piece of debris incoming! We won't be able to avoid this one! Use of shields advised, Tier 2!"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"shields",
                    received:180000.0,
                    sent:0.0,
                    content:" Shields online, setting to Tier 2!"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"shields",
                    received:190000.0,
                    sent:0.0,
                    content:" Shields intact, damage is minimal."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"sensors",
                    received:200000.0,
                    sent:0.0,
                    content:" The rogue debris is no more, Captain."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"power_core",
                    received:210000.0,
                    sent:0.0,
                    content:" Our power supply is limited Captain, we can't keep this shield on forever."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"sensors",
                    received:220000.0,
                    sent:0.0,
                    content:" Advise we proceed with a straight course for 20 seconds."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"left_engine",
                    received:230000.0,
                    sent:0.0,
                    content:" Normalizing thrust for straight course."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"sensors",
                    received:250000.0,
                    sent:0.0,
                    content:" Captain, I've found a way out. Our time frame is closing fast though. We'll need to divert more power to the engines for full speed."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"power_core",
                    received:260000.0,
                    sent:0.0,
                    content:" Diverting power from shields to engines."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"left_engine",
                    received:270000.0,
                    sent:0.0,
                    content:" Maximizing thrust."
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"right_engine",
                    received:280000.0,
                    sent:0.0,
                    content:" Right Engine set to 100%"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"command",
                    received:290000.0,
                    sent:0.0,
                    content:" SAFE DISTANCE FROM EVENT HORIZON ACHIEVED"
                })
            });
            script.responses.create({
                check: Response.conditions.time_passed("command", 0.0),
                apply: Response.actions.send_message({
                    to:"command",
                    from:"command",
                    received:300000.0,
                    sent:0.0,
                    content:" EXECUTING SOS PROTOCOLS"
/*                check: _.constant(true),
                apply: Response.actions.check_message("sensors", function(args){
                    var msg = args[0], ship = args[1];
                    if (msg.get("from").get("key") === "command"){
                        if (msg.get("content").indexOf("hi") != -1){
                            ship.messenger.send({
                                from:"sensors",
                                to:"command",
                                content:"Hello, command."
                            })
                            return Bacon.noMore;
                        }
                    }*/
                })
            });
            return script;
        }
    });
    return Script;
});
