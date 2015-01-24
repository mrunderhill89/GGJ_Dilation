define(['jquery', 'backbone_streams', 'models/station'], function(
      $, Backbone, Station){
    var ChatWindowView = Backbone.View.extend({
        initialize: function(params){
            params || (params = {});
            var station = this.station = params.station;
            var inbox = this.inbox = this.station.inbox;
            var message_box = this.message_box = this.$el.find("#messages");
            var receiver = this.receiver = this.$el.find("#receiver");
            var send_text = this.send_text = this.$el.find("#send_text");
            var send_button = this.send_button = this.$el.find("#send_button");
            var latency = this.latency = this.$el.find("#latency");
        },
        render: function(){
            this.message_box.empty().append("Hello World!");
        }
    })
    return ChatWindowView;
})