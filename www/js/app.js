var app = app || {};

Backbone.View.prototype.close = function(){
	this.remove();
	this.unbind();
	if(this.onClose)
		this.onClose();
}

app = _.extend(app, {collections : {}});

app.showLoading = function(){
	$("#loading-container").show();
};
app.hideLoading = function(){
	$("#loading-container").hide();
};

new app.Router(app);
Backbone.history.start();