var app = app || {};

app.JobItemView = Backbone.View.extend({
	tagName : "li",
	className : "job-item",
	template : _.template(app.Templates["job-item"]),

	initialize : function(){
	},

	events : {
		"click .delete" : "deleteJob",
		"click .rename" : "toggleRenameForm",
		"click .rename-job-close" : "toggleRenameForm",
		"keypress .rename-job-form input" : "renameJob"
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

	getParent : function(e){
		var jobContainer = $(e.target);
		while(jobContainer.attr("class") != this.className)
			jobContainer = jobContainer.parent();
		return jobContainer;
	},

	toggleRenameForm : function(e){
		e.preventDefault();
		var jobContainer = this.getParent(e),
			jobName = jobContainer.find(".job-name"),
			renameForm = jobContainer.find(".rename-job-form");
		jobName.toggle();
		renameForm.toggle();
		renameForm.find("input").val(jobName.text());
		renameForm.find("input").focus();
	},

	deleteJob : function(e){
		e.preventDefault();
		this.model.destroy();
		this.remove();
	},

	render : function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});