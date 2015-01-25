define(['backbone_streams', 'pixi'], function(Backbone, Pixi){
    var positions = {
        background: {x:350, y: 13},
        bg_size: {x: 400, y: 300},
        disc_size: {x: 150, y:150},
        eh_size: {x:80, y:80},
        ship_initial: {x:660, y:250},
        ship_path: [10.0,0.0,
                    0.0,-20.0,
                    -10.0,0.0,
                    0.0,-5.0,
                   10.0, 0.0]
    }
    var CommandPositionView = Backbone.View.extend({
        initialize: function(params){
            params || (params = {});
            this.el = new Pixi.DisplayObjectContainer();
            this.ship = params.ship || new Ship(params);
        },
        render: function(){
            var group = this.el;
            var bg = new Pixi.Graphics();
            bg.beginFill(0x000000);
            bg.lineStyle(5, 0xFFFFFF);
            bg.drawRect(positions.background.x, positions.background.y, positions.bg_size.x, positions.bg_size.y);
            bg.endFill();
            var center = {
                x: positions.background.x + (positions.bg_size.x/2),
                y: positions.background.y + (positions.bg_size.y/2)
            }
            bg.drawEllipse(center.x, center.y, positions.disc_size.x, positions.disc_size.y);
            bg.lineStyle(5, 0xFF0000);
            bg.drawEllipse(center.x, center.y, positions.eh_size.x, positions.eh_size.y);
            
            var ship_icon = new Pixi.Graphics();
            ship_icon.lineStyle(5, 0xFFFFFF);
            ship_icon.drawPolygon(positions.ship_path);
            this.stream("ship_x").toProperty(positions.ship_initial.x).onValue(function(x){
                ship_icon.position.x = x;
            })
            this.stream("ship_x").plug(this.ship.stream_x);
            this.stream("ship_y").toProperty(positions.ship_initial.y).onValue(function(y){
                ship_icon.position.y = y;
            })
            this.stream("ship_y").plug(this.ship.stream_y);
            this.stream("ship_r").toProperty(0.0).onValue(function(r){
                ship_icon.rotation = r;
            })
            this.stream("ship_r").plug(this.ship.stream_r);
            group.addChild(bg);
            group.addChild(ship_icon);
        }
    });
    return CommandPositionView;
})