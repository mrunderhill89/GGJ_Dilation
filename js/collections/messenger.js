define(['backbone_streams','models/message'], function(Backbone, Message){
    var MessageBox = Backbone.Collection.extend({
        model: Message,
        url: '/', //Not using a server yet.
    });
    var Messenger = Backbone.View.extend({
        initialize: function(params){
            params || (params = {});
            this.ship = params.ship;
            this.stream("update").onValue(this.update.bind(this));
            if (params.update){
                this.stream("update").plug(params.update);
            }
            this.messages = new MessageBox();
        },
        update: function(){
            this.messages.each(function(message){
                if (message){
                    var to = message.get("to");
                    var receive_time = message.get("received");
                    var station_time = to.get("relative_time");
                    if (receive_time < station_time){
                        to.stream("message").push(message);
                        this.messages.remove(message);
                    };
                };
            }.bind(this));
        },
        send: function(params){
            var from = this.ship[params.from];
            var to = this.ship[params.to];
            var sent = (params.sent || from.get("relative_time"));
            var delay = (from.get("dilation_rate")/to.get("dilation_rate"))*1000.0;
            var received = params.received || Math.max(sent + delay, to.get("relative_time"));
            var message = this.messages.create({
                from: from,
                to:to,
                content: params.content,
                sent: sent,
                received: received
            });
            if (from !== to) from.stream("message").push(message);
        }
    });
    return Messenger;
})