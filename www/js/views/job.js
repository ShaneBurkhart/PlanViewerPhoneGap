var app = app || {};

app.JobView = Backbone.View.extend({
	tagName : "div",
	className : "job",
	template : _.template("<div>Test</div>"),

	initialize : function(){
    },

	render : function(){
		this.$el.html(this.template());
		return this;
	}
});