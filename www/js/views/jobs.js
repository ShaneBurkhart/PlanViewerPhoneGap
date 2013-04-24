var app = app || {};

app.JobsView = Backbone.View.extend({
	tagName : "div",
	className : "page",
	container : "page_container",
	template : "list_item",

	initialize : function(){
    },

    events : {
		"click div.item" : "navigateToJobDir"
	},

	navigateToJobDir : function(e){
		e.preventDefault();
		var target = $(e.target);
		while(target.prop("tagName") != "DIV")
			target =  target.parent();
		var val = target.find("p").html();
		window.location.hash = "#" + val;
	},

	render : function(){
		var body = Mustache.to_html(app.Templates[this.template], {items : [{title : "None"}, {title : "Text"}]});
		this.$el.html(Mustache.render(app.Templates[this.container], {body : body}));
		return this;
	}
});