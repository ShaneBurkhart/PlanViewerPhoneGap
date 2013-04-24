var app = app || {};

app.UserListCollection = Backbone.Collection.extend({
	model : app.UserItemModel,
	url : "api/user", 
});