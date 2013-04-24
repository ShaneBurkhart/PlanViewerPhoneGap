var app = app || {};

app.Templates = (function(){
	var tempNames = ["page_container", "list_item"],
	baseUrl = "js/templates/",
	extension = ".mustache",
	temps = {};
	$.each(tempNames, function(index, name){
		$.ajax({
			url : baseUrl + name + extension,
			async : false,
			success : function(data){
				temps[name] = data;
			}
		});	
	});
	return temps;
})();