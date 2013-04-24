var app = app || {};

app.JobsView = Backbone.View.extend({
	tagName : "div",
	className : "page",
	container : "page_container",
	template : "list_item",

	initialize : function(){
		app.File.getJobs(this.renderAll);
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
		var body = Mustache.to_html(app.Templates.get(this.template), {items : [{title : "Cover"}, {title : "Elevation"}]});
		$(".content").append(body);
	},

	render : function(){
		this.$el.html(Mustache.render(app.Templates.get(this.container), {content : ""}));
		return this;
	}
});