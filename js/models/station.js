define(['underscore','backbone_streams'], function(_, Backbone){
    function place_message(msg, messages, front, back){
        front || (front = 0);
        back || (back = messages.length-1);
        var msg_time = msg.get("received");
        var first = messages[front];
        //Sanity check: if our message belongs in the front, put it there.
        if (msg_time < first.get("received")){
            return messages.splice(front,0, msg);
        }
        var last = messages[back];
        //Sanity check: if our message belongs in the back, put it there.
        if (msg_time > last.get("received")){
            return messages.splice(back,0, msg);
        }
        var middle = (back-front)/2;
        if (middle <= 0){
            //Front and back are identical, so just insert in place.
            return messages.splice(front,0, msg);
        } else {
            var center = messages[middle];
            if (msg_time > center.get("received")){
                return place_message(msg, messages, center, back);
            }else{
                return place_message(msg, messages, front, center);
            }
        }
    }
    var Station = Backbone.Model.extend({
        initialize: function(params){
            this.dilation_rate = this.stream("dilation_rate").toProperty(params.dilation_rate || 1.0);
            this.dilation_rate.onValue(function(dr){this.set("dilation_rate", dr)}.bind(this));

            this.relative_time = this.dilation_rate
                .sampledBy(this.stream("dt"), function(dr, dt){return {r:dr, t:dt};})
                .scan(params.relative_time || 0.0, function(rt, d){
                    return rt + (d.r * d.t);
                });
            this.relative_time.onValue(function(rt){
                this.set("relative_time", rt);
            });
            this.messages = this.relative_time
                .sampledBy(this.stream("messages"), function(t, msg){return {t:t, msg:msg};}) //Every time we get a message, check the time.
                .filter(function(tm){return tm.t < tm.msg.get("received")}).map(".msg") //Ignore messages that go backwards in time.
                .scan([], function(messages, msg){
                    place_message(msg,messages);
                    return messages;
                });
            this.messages.onValue(messages){
                this.set("messages", messages);
            }
        }
    });
    return Station;
})