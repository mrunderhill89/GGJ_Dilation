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

    var ShipCommonView = Backbone.View.extend({
        initialize: function(params){
            this.el = new Pixi.DisplayObjectContainer();
            this.ship = params.ship || new Ship();
        },
        render: function(){
            this.sprites = _.map(xy_pairings, function(coords, name){
                var graphics = new Pixi.Graphics();
                graphics.beginFill(0xFFFFFF);
                // set the line style to have a width of 5 and set the color to red
                graphics.lineStyle(5, 0x000000);
                // draw a rectangle
                graphics.drawRect(coords.x, coords.y, 100, 100);
                this.el.addChild(graphics);
                return graphics;
            }.bind(this));
            return this;
        }
    })
    return ShipCommonView;
})