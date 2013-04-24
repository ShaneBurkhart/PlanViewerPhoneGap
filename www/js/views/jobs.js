var app = app || {};

app.JobsView = Backbone.View.extend({
	tagName : "div",
	className : "page",
	container : "page_container",
	template : "list_item",

	initialize : function(){
		_.bindAll(this, "renderAll");
    },

    events : {
    	"click .sync" : "confirm",
		"click div.item" : "navigateToJobDir"
	},

	confirm : function(e){
		e.preventDefault();
		app.Dialog.confirm();
	},

	navigateToJobDir : function(e){
		e.preventDefault();
		var target = $(e.target);
		while(target.prop("tagName") != "DIV")
			target =  target.parent();
		var val = target.find("p").html();
		window.location.hash = "#" + val;
	},

	renderAll : function(jobs){
		var i = 0,
			items = [];
		for(i = 0 ; i < jobs.length ; i ++)
			items.push({title : jobs[i]});
		var body = Mustache.to_html(app.Templates.get(this.template), {items : items});
		this.$el.find("#content").append(body);
	},

	render : function(){
		this.$el.html(Mustache.render(app.Templates.get(this.container), {content : ""}));
		var self = this;
		app.File.getJobs(self.renderAll);
		return this;
	}
});