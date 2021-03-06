define(['underscore', 'backbone_streams','pixi',
        'collections/ship',
       'views/command'], function(
       _, Backbone, Pixi,
        Ship,
        CommandView
       ){
    var xy_pairings = {
        command: {x: 141, y:320}, //75, 230
        sensors: {x: 116, y: 370}, //20, 280
        shields: {x:166, y: 370}, //100, 280
        left_engine:{x:91,y:420}, //25, 330
        power_core:{x:141,y:420}, //75, 330
        right_engine:{x:191,y:420} //125, 330
    };
    var station_properties = {
        width: 50,
        height: 50,
        fill_color: 0xFFFFFF,
        line_color: 0x000000,
        line_width: 5,
    };
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
            }.bind(this));
            if (params.update){
                this.stream("dt").plug(params.update);
            }
            this.sub_views = {
                command: new CommandView({ship: this.ship})
            };
            this.current_view = this.stream("current_view").scan(null, function(prev, name){
                if (prev){
                    this.stage.removeChild(prev.el);
                }
                var next = this.sub_views[name];
                if (next){
                    this.stage.addChild(next.el);
                }
                return next;
            }.bind(this));
            this.current_view.onValue();//Don't ask me why, but the stream won't work without this.
            this.stream("current_view").push("command");
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
                });
                this.ship[name].dilation_rate.onValue(function(dr){
                    //Red is constant, so reduce green and blue as dilation gets worse.
                    var value = Math.pow(dr,2.0);
                    //var value = (300000 - dt)/300000; //A nice value between 0-1  that SHOULD help with displaying the changing color, but...
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
    });
    return ShipCommonView;
});