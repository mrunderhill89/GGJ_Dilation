define(['backbone_streams', 'pixi'], function(Backbone, Pixi){
    var positions = {
        background: {x:470, y: 350},
        bg_size: {x: 100, y: 120},
        shield_sizes: {
            1: 10,
            2: 25,
            3: 40
        },
        label: {x:470, y:330}
    };
    var CommandShieldView = Backbone.View.extend({
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
            group.addChild(bg);
            
            var shield = new Pixi.Graphics();
            group.addChild(shield);
            
            var center = {
                x: positions.background.x + (positions.bg_size.x/2),
                y: positions.background.y + (positions.bg_size.y/2),
            }
            this.ship["shields"].power.onValue(function(p){
                shield.clear();
                shield.lineStyle(p*2, 0x0000FF);
                var radius = positions.shield_sizes[p]
                shield.drawEllipse(center.x, center.y, radius, radius);
            });
            
            var label = new Pixi.Text("Shield Status", {font:"14px Arial", fill:"white"});
            label.position.x = positions.label.x;
            label.position.y = positions.label.y;
            group.addChild(label);
        }        
    });
    return CommandShieldView;
})