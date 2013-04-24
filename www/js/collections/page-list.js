var app = app || {};

app.PageListCollection = Backbone.Collection.extend({
	model : app.PageModel,
	url : ""
});