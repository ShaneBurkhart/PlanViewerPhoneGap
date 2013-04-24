var app = app || {};

app.PageModel = Backbone.Model.extend({
	defaults : {
		id : null,
		filename : "No filename",
		date : "No Date",
		job_id : null,
		pageNum : null,
		pageName : "No pageName",
		version : null
	}
});