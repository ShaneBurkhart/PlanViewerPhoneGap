var app = app || {};

app.Router = Backbone.Router.extend({	
	routes :{
		"" : "showJobs",
		"credentials" : "showCredentials",
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
		this.RM.show(new app.PagesView({job : job}));
	},

	showCredentials : function(){
		this.RM.show(new app.CredentialsView());
	}
});
