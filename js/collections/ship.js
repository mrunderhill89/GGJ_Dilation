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
            dilation_rate: 0.8
        });
        this.sensors = this.stations.create({
            dilation_rate: 0.8
        });
        this.life_support = this.stations.create({
            dilation_rate: 0.9
        });
        this.power_core = this.stations.create({
            dilation_rate: 0.9
        });
        this.left_engine = this.stations.create({
            dilation_rate: 0.8
        });
        this.right_engine = this.stations.create({
            dilation_rate: 1.0
        });
        //Set the player in the command center first
        this.player_station = this.command;
    }
    return Ship;
});
