var app = app || {};

app.PageContainerView = Backbone.View.extend({
	tagName : "div",
	className : "job",
	template : "page_container",

	initialize : function(){
    },

	render : function(){
		this.$el.html(Mustache.to_html(app.Templates[this.template], {}));
		return this;
	}
});