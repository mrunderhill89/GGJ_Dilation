define(['backbone_streams'], function(Backbone){
    var Message = Backbone.Model.extend({
        defaults:{
            from: null,
            to: null,
            sent: 0.0,
            received: 0.0
        },
        fetch: function(){},
        save: function(){},
        load: function(){}
    });
    return Message;
})