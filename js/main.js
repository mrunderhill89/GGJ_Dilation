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

require(['jquery', 'pixi', 'bacon', 
         'collections/ship','collections/script',
         'views/ship_common','views/chat_window'],
    function($, Pixi, Bacon, Ship, Script, ShipCommonView, ChatWindowView){

    //Create a "real time" stream to pass time values to from the main loop.
        var real_time = new Bacon.Bus();
        var dt = real_time.scan({}, function(memo, time){
            memo.dt = memo.time? time-memo.time:0;
            memo.time = time;
            return memo;
        }).map(".dt");
    //Create the main view and attach it to the stage.
        var ship = new Ship({update:dt});
        var ship_view = new ShipCommonView({
            el: "#view",
            update: dt,
            ship: ship
        }).render();
    //Create the chat window view and attach to the HTML
        var chat_window = new ChatWindowView({
            el:"#chat_window",
            station: ship.command,
            messenger: ship.messenger,
            update: dt
        }).render();
    //Set up the script object
        var script = Script.default_script({
            view: ship_view
        });
        dt.onValue(function(dt){
            script.stream("state").push(ship);
        });
    //Set the main loop
        requestAnimFrame(main_loop);
        function main_loop(){
            requestAnimFrame(main_loop);
            real_time.push(performance.now());
        }
    }
);