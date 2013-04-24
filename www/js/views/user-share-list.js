var app = app || {};

app.UserShareListView = Backbone.View.extend({
    children : {},
    id : "user-share-list-container",
    tagName : "div",
    className : "row-fluid",
    template : _.template(app.Templates["user-share-list"]),

	initialize: function() {
        this.collection = new app.UserShareListCollection(0, {url : "api/assignment/" + this.options.userId});
        app.showLoading();
        this.collection.fetch({success : app.hideLoading});

        this.listenTo(this.collection, "add", this.renderOne);
        this.listenTo(this.collection, "reset", this.render);
    },

    render : function(){
        this.state = 0;
        this.$el.html(this.template());
        this.renderAll();
        return this;
    },

    renderAll : function(){
    	this.collection.each(this.renderOne, this);
    },

    state : 0,

    renderOne : function(item){
        var cont = "#left-column";
        if(this.state == 1)
            cont = "#middle-column";
        else if(this.state == 2)
            cont = "#right-column";

    	var userView = new app.UserShareItemView({
    		model : item
    	});
    	this.$el.find(cont).prepend(userView.render().el);
        this.state++;
        if(this.state == 3)
            this.state = 0;
    }
});