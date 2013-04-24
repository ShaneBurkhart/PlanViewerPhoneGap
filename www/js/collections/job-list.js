var app = app || {};

app.JobListCollection = Backbone.Collection.extend({
	model : app.JobItemModel,
	url : "api/job"
});