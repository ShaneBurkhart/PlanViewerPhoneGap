var app = app || {};

app.UserListView = Backbone.View.extend({
    id : "user-list-container",
    tagName : "ul",
    className : "unstyled list-view",

    children : {},

	initialize: function() {
        app.collections.userListCollection = new app.UserListCollection();
        app.showLoading();
        app.collections.userListCollection.fetch({success : app.hideLoading});
        this.listenTo(app.collections.userListCollection, "add", this.render);
        this.listenTo(app.collections.userListCollection, "reset", this.render);
        this.listenTo(app.collections.userListCollection, "change", this.render);
    },

    render : function(){
        this.$el.html("");
        this.renderAll();
        return this;
    },

    renderAll : function(){
    	app.collections.userListCollection.each(function(item){
    		this.renderOne(item);
    	}, this);
    },

    renderOne : function(item){
    	var userView = new app.UserItemView({
    		model : item
    	});
    	this.$el.append(userView.render().el);
    }
});