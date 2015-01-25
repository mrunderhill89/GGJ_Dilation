define(['backbone_streams', 'pixi'], function(Backbone, Pixi){
    var positions = {
        background: {x:350, y: 350},
        bg_size: {x: 100, y: 120},
        l_engine: {x:15, y:100},
        r_engine: {x:55, y:100},
        bar_size: 30,
        label: {x:350, y:330}
    };
    var CommandEngineView = Backbone.View.extend({
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
            var left_engine = new Pixi.Graphics();
            group.addChild(left_engine);
            var right_engine = new Pixi.Graphics();
            group.addChild(right_engine);
            
            this.ship["left_engine"].power.onValue(function(p){
                left_engine.clear();
                left_engine.beginFill(0x0000FF);
                left_engine.lineStyle(3, 0xFFFFFF);
                left_engine.drawRect(
                    positions.background.x + positions.l_engine.x, 
                    positions.background.y + positions.l_engine.y, 
                    positions.bar_size, 
                    -0.8 * p);
            });
            
            this.ship["right_engine"].power.onValue(function(p){
                right_engine.clear();
                right_engine.beginFill(0x0000FF);
                right_engine.lineStyle(3, 0xFFFFFF);
                right_engine.drawRect(
                    positions.background.x + positions.r_engine.x, 
                    positions.background.y + positions.r_engine.y, 
                    positions.bar_size, 
                    -0.8 * p);
            });
            
            var label = new Pixi.Text("Engine Status", {font:"14px Arial", fill:"white"});
            label.position.x = positions.label.x;
            label.position.y = positions.label.y;
            group.addChild(label);
        }        
    });
    return CommandEngineView;
});