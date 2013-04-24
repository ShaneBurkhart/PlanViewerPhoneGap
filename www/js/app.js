var app = app || {};

Backbone.View.prototype.close = function(){
	this.remove();
	this.unbind();
	if(this.onClose)
		this.onClose();
}

app = _.extend(app, {collections : {}});

app.Dialog = {
	showLoading : function(){
		$("#loading-container").show();
	},

	hideLoading : function(){
		$("#loading-container").hide();
	},

	confirm : function(){
		navigator.notification.confirm("This is a test.", function(){}, "Title", "Done");
	},

	alert : function(){
		navigator.notification.alert("This is a test.", function(){}, "Title", "Done");
	}
};

new app.Router(app);
Backbone.history.start();