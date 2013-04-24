var app = app || {};

app.Router = Backbone.Router.extend({	
	routes :{
		"" : "showJob"
	},

	initialize : function(app){
		this.RM = app.RegionManager;
	},

	showJob : function(){
		this.RM.show(new app.PageContainerView());
	}
});
