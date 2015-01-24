define(['underscore', 'backbone_streams','pixi',
        'collections/ship'], function(
       _, Backbone, Pixi,
        Ship
       ){
    var xy_pairings = {
        command: {x: 75, y:225},
        sensors: {x: 50, y: 275},
        shields: {x:100, y: 275},
        left_engine:{x:25,y:325},
        power_core:{x:75,y:325},
        right_engine:{x:125,y:325}
    }
    var station_properties = {
        width: 50,
        height: 50,
        fill_color: 0xFFFFFF,
        line_color: 0x000000,
        line_width: 5,
    }
    function componentToHex(c) {
        var hex = Math.floor(c*255).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return "0x" + componentToHex(r) + componentToHex(g) + componentToHex(b);
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
                    label.setText(Math.floor(rt/10)/100);
                })
                this.ship[name].dilation_rate.onValue(function(dr){
                    //Red is constant, so reduce green and blue as dilation gets worse.
                    var value = Math.pow(dr,2.0);
                    var color = rgbToHex(1.0, value,value);
                    box.clear();
                    box.beginFill(color);
                    box.lineStyle(station_properties.line_width, station_properties.line_color);
                    box.drawRect(coords.x, coords.y, station_properties.width, station_properties.height);
                });
                this.stage.addChild(group);
                return group;
            }.bind(this));
            this.$el.empty().append(this.renderer.view);
            return this;
        }
    })
    return ShipCommonView;
})