define(['jquery', 'backbone_streams', 'models/station', 'models/message'], function(
      $, Backbone, Station, Message){
    var ChatWindowView = Backbone.View.extend({
        initialize: function(params){
            params || (params = {});
            var station = this.station = params.station;
            var inbox = this.inbox = station.inbox;
            var message_box = this.message_box = this.$el.find("#messages");
            var receiver = this.receiver = this.$el.find("#receiver");
            var send_text = this.send_text = this.$el.find("#send_text");
            var send_button = this.send_button = this.$el.find("#send_button");
            var latency = this.latency = this.$el.find("#latency");
            var time = station.relative_time;
            time.onValue(function(t){
                if (inbox.length > 0){
                    var next_message = inbox.first();
                    if (t > next_message.get("received")){
                        this.stream("reveal").push(next_message);
                        inbox.shift();
                    }
                }
            }.bind(this));
            var output = this.output = this.stream("reveal").scan([],function(msgs,msg){
                msgs.push(msg);
                return msgs;
            });
            output.onValue(function(messages){
                message_box.empty();                
                _.each(messages, function(msg){
                    var content = msg.get("content");
                    if (content){
                        message_box.append(msg.get("from")+"->"+msg.get("to")+" @("+(Math.floor(msg.get("received"))/1000).toFixed(4)+"):\n "+msg.get("content")+"\n");
                        message_box.scrollTop(message_box[0].scrollHeight);
                    }
                })
            })
            
            send_button.click(this.send_message.bind(this));
            send_text.keypress(function(e){
                if (e.which == 13){
                    this.send_message();
                }
            }.bind(this));
        },
        send_message: function(){
            var target = this.receiver.val();
            var new_message = new Message({
                from: "Command",
                to: target,
                received: this.station.get("relative_time"),
                content: this.send_text.val()
            });
            this.stream("reveal").push(new_message);
            this.send_text.val("");
        }
    });
    return ChatWindowView;
});