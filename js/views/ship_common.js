define(['underscore', 'backbone_streams','pixi',
        'collections/ship'], function(
       _, Backbone, Pixi,
        Ship
       ){
    var xy_pairings = {
        command: {x: 400, y:200},
        sensors: {x: 350, y: 300},
        life_support: {x:450, y: 300},
        left_engine:{x:300,y:400},
        power_core:{x:400,y:400},
        right_engine:{x:500,y:400}
    }
    var station_properties = {
        width: 80,
        height: 80,
        fill_color: 0xFFFFFF,
        line_color: 0x000000,
        line_width: 5,
    }
    var ShipCommonView = Backbone.View.extend({
        initialize: function(params){
            //Create a Pixi stage and set the renderer.
            this.stage = new Pixi.Stage(0x403B34);
            this.renderer = Pixi.autoDetectRenderer(800,600);
            this.ship = params.ship || new Ship(params);
            this.stream("dt").onValue(function(dt){
                this.renderer.render(this.stage);
            }.bind(this))
            if (params.update){
                this.stream("dt").plug(params.update);
            }
        },
        render: function(){
            this.sprites = _.map(xy_pairings, function(coords, name){
                var group = new Pixi.DisplayObjectContainer();
                
                var box = new Pixi.Graphics();
                box.beginFill(station_properties.fill_color);
                box.lineStyle(station_properties.line_width, station_properties.line_color);
                box.drawRect(coords.x, coords.y, station_properties.width, station_properties.height);
                group.addChild(box);
                
                var label = new Pixi.Text(name, {font:"14px Arial", fill:"black"});
                label.position.x = coords.x+5;
                label.position.y = coords.y+5;
                group.addChild(label);
                
                this.ship[name].relative_time.onValue(function(rt){
                    label.setText(Math.floor(rt)/1000);
                })
                
                this.stage.addChild(group);
                return group;
            }.bind(this));
            this.$el.empty().append(this.renderer.view);
            return this;
        }
    })
    return ShipCommonView;
})