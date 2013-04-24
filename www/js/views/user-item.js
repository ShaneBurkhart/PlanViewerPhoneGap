var app = app || {};

app.UserItemView = Backbone.View.extend({
	tagName : "li",
	className : "user-container row-fluid",
	template : _.template(app.Templates["user-item"]),

	events : {
		"click .remove" : "deleteUser"
	},

	renameJob : function(e){
		if((e.keycode || e.which) == 13){
            e.preventDefault();	
			var jobContainer = this.getParent(e),
				name = jobContainer.find(".rename-job-form input").val();
			this.model.set("name", name);
			this.model.save();
            this.toggleRenameForm(e);
        }
	},

	deleteUser : function(e){
		e.preventDefault();
		this.model.destroy({success : function(data){console.log(data);}});
		this.remove();
	},

	render : function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});