define(['underscore', 'backbone_streams', 'bacon',
       'models/station'],function(_, Backbone, Bacon, Station){
    var Stations = Backbone.Collection.extend({
        model:Station, 
        url: '/', //Not using a server yet.
    });
    function dilation(e_dt, dt){
    	y = e_dt + dt^1.02 -208;
    	return y;
    }
    function Ship(params){
        params || (params = {});
        this.stations = new Stations({});
        //this.routes = new Backbone.Collection({model:Route});
        //Set up our initial ship.
        this.command = this.stations.create({
            dilation_rate: 0.7,
            messages:[
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
                {
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
            ]
        });
        this.sensors = this.stations.create({
            dilation_rate: 0.6
        });
        this.shields = this.stations.create({
            dilation_rate: 0.8
        });
        this.power_core = this.stations.create({
            dilation_rate: 0.7,
        });
        this.left_engine = this.stations.create({
            dilation_rate: 0.6
        });
        this.right_engine = this.stations.create({
            dilation_rate: 1.0
        });
        //Set the player in the command center first
        var player_station = this.player_station = this.command;
        //Speed up time relative to wherever the player is, then propagate the new dT
        //to each room.
        var player_dilation = player_station.dilation_rate;
        var real_dt = this.real_dt = new Bacon.Bus();
        if (params.update) this.real_dt.plug(params.update);
        real_dt.onValue(function(dt){
            var player_dilation = player_station.get("dilation_rate");
            if (player_dilation > 0.0){
                this.stations.each(function(station){
                    var rdt = dt * station.get("dilation_rate") / player_dilation;
                    station.stream("dt").push(rdt);
                    station.stream("dilation_rate").push(station.get("dilation_rate"))
                    var nd = dilation(station.get("dilation_rate"), rdt)
                });
            }
        }.bind(this));
    }
    return Ship;
});
