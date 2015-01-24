require.config({
  paths: {
    jquery: 'libs/jquery/jquery',
    underscore: 'libs/underscore/underscore',
    bacon:'libs/bacon/bacon',
    pixi:'libs/pixi/pixi.dev'
  }
});

require(['jquery', 'pixi'],
    function($, Pixi){
        var stage = new Pixi.Stage(0x66FF99);
        var renderer = Pixi.autoDetectRenderer(800,600);
        $("#view").empty().append(renderer.view);
        
        requestAnimFrame(main_loop);
        function main_loop(){
            requestAnimFrame(main_loop);
            renderer.render(stage);
        }
    }
);