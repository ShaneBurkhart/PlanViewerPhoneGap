var app = app || {};

app.Router = Backbone.Router.extend({	
	routes :{
		"" : "showJobs",
		":job" : "showPages"
	},

	initialize : function(app){
		this.RM = app.RegionManager;
		window.location.hash = "";
	},

	showJobs : function(){
		this.RM.show(new app.JobsView());
	},

	showPages : function(job){
		console.log(job);
		this.RM.show(new app.PagesView({job : job}));
	}
});
