var app = app || {};

app.UserView = Backbone.View.extend({
	tagName : "div",
	className : "user",
	template : _.template(app.Templates["user"]),

	initialize : function(){
		if(!app.collections.userListCollection || !(this.model = app.collections.userListCollection.get(this.options.userId))){
			this.model = new app.UserItemModel(0, {url : "api/user/" + this.options.userId});
			app.showLoading();
			this.model.fetch({success : app.hideLoading});
		}else
			this.render();
        this.listenTo(this.model, "change", this.render);
    },

	render : function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});