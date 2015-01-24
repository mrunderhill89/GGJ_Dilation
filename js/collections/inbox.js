define(['backbone_streams','models/message'], function(Backbone, Message){
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

    var Inbox = Backbone.Collection.extend({
        initialize: function(params){
            
        },
        model: Message,
        url: '/', //Not using a server yet.
    });
    return Inbox;
})