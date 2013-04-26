var app = app || {};

app.Templates = {
	tempNames : ["page_container", "list_item", "credentials"],
	temps : {},
	load : function(){
		var baseUrl = "js/templates/",
		extension = ".mustache",
		self = this;
		this.temps = {};
		$.each(this.tempNames, function(index, name){
			$.ajax({
				url : baseUrl + name + extension,
				async : false,
				success : function(data){
					self.temps[name] = data;
				}
			});	
		});
	},

	get : function(name){
		return this.temps[name];
	}
};