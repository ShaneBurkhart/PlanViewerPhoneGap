var app = app || {};

app.JobItemView = Backbone.View.extend({
	tagName : "div",
	className : "row-fluid",
	template : "list_item",

	events : {
		"click .item" : "navigateToJobDir"
	},

	navigateToJobDir : function(e){
		e.preventDefault();
		var val = $(e.target).html();
		console.log(val);
	},

	initialize : function(){
    },

	render : function(){
		this.$el.html(Mustache.to_html(app.Templates[this.template], this.model));
		return this;
	}
});