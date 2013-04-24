var app = app || {};

app.UserShareItemView = Backbone.View.extend({
	tagName : "div",
	template : _.template(app.Templates["user-share-item"]),

	events : {
		"click .assignment-checkbox" : "update"
	},

	update : function(e){
		if($(e.target).is(":checked"))
			this.model.set({assignment : 1});
		else
			this.model.set({assignment : 0});
		console.log(this.model.get("assignment"));
	},

	render : function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});