var app = app || {};

app.UserShareListCollection = Backbone.Collection.extend({
	model : app.UserItemModel,
	url : "api/assignment"
});