define(['backbone_streams'], function(Backbone){
    var Message = Backbone.Model.extend({
        defaults:{
            to: null,
            from: null,
            sent: 0.0,
            received: 0.0,
            content: ""
        }
    });
    return Message;
})