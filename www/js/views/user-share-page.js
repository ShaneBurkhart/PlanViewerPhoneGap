var app = app || {};

app.UserShareView = Backbone.View.extend({
    children : {},
	id : "user-share-pages",
    template : _.template(app.Templates["user-share-page"]),

    events : {
        "click #user-share-save" : "saveAssignments"
    },

	initialize: function() {
        this.children.userShareListView = new app.UserShareListView({userId : this.options.userId});
        this.children.userView = new app.UserView({userId : this.options.userId});
    },

    saveAssignments : function(e){
        this.children.userShareListView.collection.each(function(model){
            if(model.hasChanged())
                model.save();
        }, this);
    },

    render : function(){
        this.$el.html(this.template());
        this.$el.find("#content").prepend(this.children.userView.render().el);
        this.$el.find("#content").append(this.children.userShareListView.render().el);
    }
});