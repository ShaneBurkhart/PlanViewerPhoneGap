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

	getJob : function(job, success){
		this.getJobDir(function(dir){
			dir.getDirectory(job, {create: true, exclusive: false}, success, this.fileError);
		});
	},

	getJobs : function(success){
		this.getJobDir(function(folder){
			folder.createReader().readEntries(function(entries){
				var i = 0, 
				jobs = [];				
			    for (i = 0 ; i < entries.length ; i ++) {
			        if(entries[i].isDirectory)
			        	jobs.push(entries[i].name);
			    }
			    success(jobs);
			}, this.fileError);
		});
	},

	getFiles : function(job, success){
		this.getJob(job, function(folder){
			folder.createReader().readEntries(function(entries){
				var i = 0, files = [];
				for(i = 0 ; i < entries.length ; i ++){
					if(entries[i].isFile)
						files.push(entries[i].name);
				}
				success(files);
			}, this.fileError);
		});
	},

	createFile : function(){

	},

	fileError : function(error){
		app.Dialog.alert("Sorry but the filesystem could not be accessed." + error.code);
	}
};

app.Sync = {
	bound : 0,
	hasConnection : function(){
		var type = navigator.connection.type;
		return type != Connection.NONE && type != Connection.UNKNOWN;
	},

	getData : function(username, password, success){
		if(!this.hasConnection()){
			this.noConnectionError();
			return;
		}
		if(!this.bound){
			_.bindAll(this, "syncError");
			this.bound = 1;
		}
		$.ajax({
			url : "http://theplanviewer.com/api/mobile",
			type : "POST",
			data : {username : username, password : password},
			dataType : "json",
			success : success,
			error : this.syncError
		});
	},

	update : function(data, success){
		/*var d = JSON.parse(data),
			i = 0,
			callback = function(){
				i++;
				if(i < d.length)
					app.getJob(d[i].name, callback);
				else
					success();
			};*/
		app.Dialog.alert("Foo");
		//app.getJob(d[i].name, callback);
	},

	syncError : function(error){
		console.log("Fail");
		app.Dialog.alert("Sorry but the server is not responding\n" + error.code);
	},

	noConnectionError : function(){
		app.Dialog.alert("Sorry but you don't currently have connection.");
	}
};

document.addEventListener("deviceready", function(){
	app.Templates.load();
	new app.Router(app);
	Backbone.history.start();
}, false);