var app = app || {};

app.UserItemModel = Backbone.Model.extend({
	defaults : {
		id : null,
		name : "None",
		assignment : "None",
		userId : null
	}
});