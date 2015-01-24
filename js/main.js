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

require(['jquery', 'pixi', 'bacon', 'views/ship_common'],
    function($, Pixi, Bacon, ShipCommonView){
    //Create a Pixi stage and set the renderer.
        var stage = new Pixi.Stage(0x403B34);
        var renderer = Pixi.autoDetectRenderer(800,600);
        $("#view").empty().append(renderer.view);
    //Create a "real time" stream to pass time values to from the main loop.
        var real_time = new Bacon.Bus();
        var dt = real_time.scan({}, function(memo, time){
            memo.dt = memo.time? time-memo.time:0;
            memo.time = time;
            return memo;
        }).map(".dt");
    //Create the main view and attach it to the stage.
        var ship_view = new ShipCommonView({
            update: dt
        }).render();
        stage.addChild(ship_view.el);
    //Set the main loop
        requestAnimFrame(main_loop);
        function main_loop(){
            requestAnimFrame(main_loop);
            real_time.push(performance.now());
            renderer.render(stage);
        }
    }
);