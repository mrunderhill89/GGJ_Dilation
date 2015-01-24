define(['underscore', 'backbone_streams', 'bacon',
       'models/station'],function(_, Backbone, Bacon, Station){
    var Stations = Backbone.Collection.extend({
        model:Station, 
        url: '/', //Not using a server yet.
    })
    function Ship(params){
        params || (params = {});
        this.stations = new Stations({});
        //this.routes = new Backbone.Collection({model:Route});
        //Set up our initial ship.
        this.command = this.stations.create({
            dilation_rate: 0.6,
            messages:[
                {
                    received:0.0,
                    content:"How are you, gentlemen!!"
                },
                {
                    received:5000.0,
                    content:"All your base are belong to us."
                },
                {
                    received:10000.0,
                    content:"You are on the way to destruction."
                },
                {
                    received:20000.0,
                    content:"You have no chance to survive make your time."
                },
                {
                    received:30000.0,
                    content:"Ha ha ha ha"
                },
            ]
        });
        this.sensors = this.stations.create({
            dilation_rate: 0.6
        });
        this.life_support = this.stations.create({
            dilation_rate: 0.8
        });
        this.power_core = this.stations.create({
            dilation_rate: 0.8,
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
                })
            }
        }.bind(this))
    }
    return Ship;
});
