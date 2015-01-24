define(['backbone_streams'], function(Backbone){
    var Message = Backbone.Model.extend({
        defaults:{
            from: "CATS",
            received: 0.0,
            change_view: null
        },
        fetch: function(){},
        save: function(){},
        load: function(){}
    });
    return Message;
})