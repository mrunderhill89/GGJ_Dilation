define(['backbone_streams', 'pixi'], function(Backbone, Pixi){
    var positions = {
        background: {x:200, y: 200},
        bg_size: {x: 600, y: 400}
    }
    var CommandPositionView = Backbone.view.extend({
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
        }
    });
    return CommandView;
})