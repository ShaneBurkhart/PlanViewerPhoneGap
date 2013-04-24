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
		navigator.notification.confirm("Are you sure you want to update your files?", function(){}, "Update Files?", ["Update", "Cancel"]);
	},

	alert : function(message, callback, title, buttons){
		navigator.notification.alert(message, callback, title, buttons);
	}
};

app.File = {
	open : function(job, fid){
		app.Dialog.alert(job + " " + fid, function(){}, "openFile");
	},

	mkdir : function(dir, success, fail){ 
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
            console.log("Root = " + fs.root.fullPath);
            fs.root.getDirectory(dir, {create: true, exclusive: false}, success, fail);
		}, function (error) {
			alert(error.code);
		});
	}
};

document.addEventListener("deviceready", function(){
	app.Templates.load();
	new app.Router(app);
	Backbone.history.start();
	app.File.mkdir("Test");
}, false);