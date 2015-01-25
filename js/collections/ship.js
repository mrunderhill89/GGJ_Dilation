define(['underscore', 'backbone_streams', 'bacon',
       'models/station', 'collections/messenger'],function(_, Backbone, Bacon, Station, Messenger){
    var Stations = Backbone.Collection.extend({
        model:Station, 
        url: '/', //Not using a server yet.
    });
    function dilation(e_dt, dt){
    	y = e_dt;
    	return y;
    }
    function Ship(params){
        params || (params = {});
        this.stations = new Stations({});
        //this.routes = new Backbone.Collection({model:Route});
        //Set up our initial ship.
        this.command = this.stations.create({
            name: "Command",
            key: "command",
            dilation_rate: 0.7,
        });
        this.sensors = this.stations.create({
            name: "Sensors",
            key: "sensors",
            dilation_rate: 0.6
        });
        this.shields = this.stations.create({
            name: "Shields",
            key: "shields",
            dilation_rate: 0.8,
            power: 1.0,
        });
        this.power_core = this.stations.create({
            name: "Power Core",
            key: "power_core",
            dilation_rate: 0.7,
        });
        this.left_engine = this.stations.create({
            name: "Left Engine",
            key: "left_engine",
            dilation_rate: 0.6,
            power: 0.0,
        });
        this.right_engine = this.stations.create({
            name: "Right Engine",
            key: "right_engine",
            dilation_rate: 1.0,
            power: 0.0,
        });
        this.stream_x = new Bacon.Bus();
        this.x = this.stream_x.toProperty(660);
        this.stream_y = new Bacon.Bus();
        this.y = this.stream_y.toProperty(250);
        this.stream_r = new Bacon.Bus();
        this.r = this.stream_r.toProperty(0.0);
        
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
        this.messenger = new Messenger({ship:this, update:this.real_dt});
    }
    return Ship;
});
