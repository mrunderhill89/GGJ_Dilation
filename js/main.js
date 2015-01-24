require.config({
  paths: {
    jquery: 'libs/jquery/jquery',
    underscore: 'libs/underscore/underscore',
    backbone: 'libs/backbone/backbone',
    backbone_associations: 'libs/backbone/backbone-associations',
    backbone_streams: 'libs/backbone/backbone-streams',
    bacon:'libs/bacon/bacon',
    pixi:'libs/pixi/pixi.dev'
  },
    shims:{
        backbone_associations:{
            deps:["backbone"],
            exports:"Backbone"
        },
        backbone_streams:{
            deps:["backbone","bacon"],
            exports:"Backbone"
        },
    }
});

require(['jquery', 'pixi', 'views/ship_common'],
    function($, Pixi, ShipCommonView){
        var stage = new Pixi.Stage(0x403B34);
        var renderer = Pixi.autoDetectRenderer(800,600);
        $("#view").empty().append(renderer.view);
        var ship_view = new ShipCommonView({}).render();
        console.log(ship_view.sprites);
        stage.addChild(ship_view.el);
        requestAnimFrame(main_loop);
        function main_loop(){
            requestAnimFrame(main_loop);
            renderer.render(stage);
            console.log(performance.now());
        }
    }
);