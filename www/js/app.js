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
            fs.root.getDirectory(dir, {create: true, exclusive: false}, success, this.fileError);
		}, this.fileError);
	},

	getJobDir : function(success){
		this.getDir(this.jobDir, success);
	},

	createJob : function(job, success){
		this.getJobDir(function(dir){
			dir.getDirectory(job, {create: true, exclusive: false}, success, this.fileError);
		});
	},

	getJobs : function(success){
		this.getJobDir(function(folder){
			folder.createReader().readEntries(function(entries){
				var i, 
				jobs = [];				
			    for (i = 0 ; i < entries.length ; i++) {
			        if(entries[i].isDirectory())
			        	jobs.push(entries[i]);
			    }
			    success(jobs);
			}, this.fileError);
		});
	},

	fileError : function(error){
		app.Dialog.alert("Sorry but the filesystem could not be accessed." + error.code);
	}
};

document.addEventListener("deviceready", function(){
	app.Templates.load();
	new app.Router(app);
	Backbone.history.start();
	app.File.createJob("TestJob", function(){
		app.File.getJobs(function(jobs){
			/*var s = "", i = 0;
			for(i = 0 ; i < jobs.length ; i ++)
				s += jobs[i].name;*/
			app.Dialog.alert("Got jobs:");
		});
	});
}, false);