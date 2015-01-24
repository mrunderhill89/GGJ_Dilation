define(['underscore', 'backbone_streams', 'bacon',
       'models/station'],function(_, Backbone, Bacon, Station){
    var Stations = Backbone.Collection.extend({
        model:Station, 
        url: '/', //Not using a server yet.
    });
    function Ship(params){
        params || (params = {});
        this.stations = new Stations({});
        //this.routes = new Backbone.Collection({model:Route});
        //Set up our initial ship.
        this.command = this.stations.create({
            dilation_rate: 0.6,
            messages:[
            
               {
               	from:"SYS_AI",
               	received:0.0,
               	content:" SYSTEM DAMAGED"
               },
               {
               	from:"SYS_AI",
               	received:100.0,
               	content:" AUTOPILOT UNABLE TO ENGAGE"
               },
               {
               	from:"SYS_AI",
               	received:200.0,
               	content:" MANUAL OVERRIDE ACTIVATED"
               },
               {
               	from:"SYS_AI",
               	received:300.0,
               	content:" BACKUP COMM STATUS ONLINE"
               },
               {
               	from:"SYS_AI",
               	received:400.0,
               	content:" PROCEDE WITH ORDERS"
               },
               {
               	from:"Sensors",
               	received:405.0,
               	content:" Captain, we need to navigate through this debris. Advise we set thrusters to 75% and 25% respectively"
               },
               {
               	from:"Left Engine",
               	received:0.0,
               	content:" Orders Captain?"
               },
               {
               	from:"Right Engine",
               	received:0.0,
               	content:" Orders Captain?"
               },
               {
               	from:"Left Engine",
               	received:0.0,
               	content:" Right away!"
               },
               {
               	from:"Right Engine",
               	received:0.0,
               	content:" Performing necesary callibrations now."
               },
               {
               	from:"Sensors",
               	received:0.0,
               	content:" We need to straighten the ship's course, lest we ram into debris. Advise we set thrusters to 50% each."
               },
               {
               	from:"Left Engine",
               	received:0.0,
               	content:" Right away!"
               },
               {
               	from:"Right Engine",
               	received:0.0,
               	content:" Performing necesary callibrations now."
               },
               {
               	from:"Sensors",
               	received:0.0,
               	content:" We'll need to make another turn to avoid more debris. Advise we set thrusters to 60% and 40%."
               },
               {
               	from:"Left Engine",
               	received:0.0,
               	content:" Orders recieved!"
               },
               {
               	from:"Right Engine",
               	received:0.0,
               	content:" Right thruster set to 40%!"
               },
               {
               	from:"Sensors",
               	received:0.0,
               	content:" Rogue piece of debris incoming! We won't be able to avoid this one! Use of shields advised, Tier 2!"
               },
               {
               	from:"Shields",
               	received:0.0,
               	content:" Shields online, setting to Tier 2"
               },
               {
               	from:"Shields",
               	received:0.0,
               	content:" Shields intact, damage is minimal"
               },
               {
               	from:"Sensors",
               	received:0.0,
               	content:" The rogue debris is no more Captain"
               },
               {
               	from:"Power Core",
               	received:0.0,
               	content:" Our power supply is limited Captain, we can't keep this shield on forever."
               },
               {
               	from:"Sensors",
               	received:0.0,
               	content:" Advise we procede with a straight course for 20 seconds"
               },
               {
               	from:"Left Engine",
               	received:0.0,
               	content:" Normalizing thrust for straight course."
               },
               {
               	from:"Right Engine",
               	received:0.0,
               	content:" Copy that."
               },
               {
               	from:"Sensors",
               	received:0.0,
               	content:" Captain, I've found a way out. Our time frame is closing fast though. We'll need to divert more power to the engines for full speed."
               },
               {
               	from:"Power Core",
               	received:0.0,
               	content:" Diverting power from shields to engines."
               },
               {
               	from:"Left Engine",
               	received:0.0,
               	content:" Maximizing thrust"
               },
               {
               	from:"Right Engine",
               	received:0.0,
               	content:" Right Engine set to 100%"
               },
               {
               	from:"SYS_AI",
               	received:0.0,
               	content:" SAFE DISTANCE FROM EVENT HORIZON REACHED"
               },
               {
               	from:"SYS_AI",
               	received:0.0,
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
            dilation_rate: 0.6,
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
                });
            }
        }.bind(this));
    }
    return Ship;
});
