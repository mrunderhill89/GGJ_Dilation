define(['jquery', 'bacon', 'backbone_streams', 'models/station', 'models/message'], function(
      $, Bacon, Backbone, Station, Message){
    var ChatWindowView = Backbone.View.extend({
        initialize: function(params){
            params || (params = {});
            var station = this.station = params.station;
            var messenger = this.messenger = params.messenger;
            var message_box = this.message_box = this.$el.find("#messages");
            var receiver = this.receiver = this.$el.find("#receiver");
            var send_text = this.send_text = this.$el.find("#send_text");
            var send_button = this.send_button = this.$el.find("#send_button");
            var latency = this.latency = this.$el.find("#latency");
            
            var receiver_stream = receiver.asEventStream("change").map(".target.value"
            ).toProperty("sensors");
            receiver_stream.onValue(function(e){
                latency.val(messenger.delay(this.station, messenger.ship[e]).toFixed(1)+"ms");
            }.bind(this));
            
            message_box.empty();
            station.stream("message").onValue(function(msg){
                if (msg.get("content")){
                        var label;
                        if (msg.get("from") === msg.get("to")){
                            label = msg.get("from").get("name");
                        } else {
                            label = msg.get("from").get("name")+"->"+msg.get("to").get("name");
                        }
                        message_box.append(
                            label
                            +" @("+(Math.floor(msg.get("sent"))/1000).toFixed(4)+"):\n "
                            +msg.get("content")+"\n");
                        message_box.scrollTop(message_box[0].scrollHeight);                    
                };
            });
            
            send_button.click(this.send_message.bind(this));
            send_text.keypress(function(e){
                if (e.which == 13){
                    this.send_message();
                }
            }.bind(this));
        },
        send_message: function(){
            this.messenger.send({
                from: this.station.get("key"),
                to: this.receiver.val(),
                sent: this.station.get("relative_time"),
                content: this.send_text.val()
            });
            this.send_text.val("");
        }
    });
    return ChatWindowView;
});