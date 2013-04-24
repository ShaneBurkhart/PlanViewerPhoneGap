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
	jobDir : "jobs",

	open : function(job, fid){
		app.Dialog.alert(job + " " + fid, function(){}, "openFile");
	},

	getDir : function(dir, success){ 
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
            console.log("Root = " + fs.root.fullPath);
            fs.root.getDirectory(dir, {create: true, exclusive: false}, success, fileError);
		}, fileError);
	},

	getJobDir : function(success){
		this.getDir(this.jobDir, success);
	},

	fileError : function(error){
		app.Dialog.alert("Sorry but the filesystem could not be accessed." + error.code);
	}
};

document.addEventListener("deviceready", function(){
	app.Templates.load();
	new app.Router(app);
	Backbone.history.start();
	app.File.getJobDir(function(fs){app.Dialog.alert(fs);});
}, false);