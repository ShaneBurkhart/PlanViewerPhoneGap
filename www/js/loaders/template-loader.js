var app = app || {};

app.Templates = (function(){
	var tempNames = ["job-page", "job-item", "user-item", "user-page", "job-edit", "page-item",
					 "job", "job-page-side-bar", "job-edit-side-bar", "user-page-side-bar", "user",
					 "user-share-page", "user-share-item", "user-share-list"],
	baseUrl = "js/templates/",
	temps = {};
	$.each(tempNames, function(index, name){
		$.ajax({
			url : baseUrl + name + ".html",
			async : false,
			success : function(data){
				temps[name] = data;
			}
		});	
	});
	return temps;
})();