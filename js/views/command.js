define(['underscore','backbone_streams', 'pixi', 'views/command_position', 'views/command_engines','views/command_shields'], function(_, Backbone, Pixi, CommandPositionView, CommandEngineView, CommandShieldView){
    var CommandView = Backbone.View.extend({
        initialize: function(params){
            params || (params = {});
            var group = this.el = new Pixi.DisplayObjectContainer();
            this.ship = params.ship || new Ship(params);
            var sub_views = this.sub_views = {
                position: new CommandPositionView(params),
                engines: new CommandEngineView(params),
                shields: new CommandShieldView(params)
            }
            _.each(sub_views, function(sub_view){
                sub_view.render();
                group.addChild(sub_view.el);
            })
        }
    });
    return CommandView;
})