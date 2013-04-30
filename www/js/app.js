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

	open : function(job, name){
		app.File.getJob(job, function(dir){
			var path = encodeURI(dir.fullPath + "/" + name);
			var ref = window.open(path);
		});
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

	deleteJob : function(job, success){
		this.getJob(job, function(dir){
			dir.removeRecursively(success, this.fileError);
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
	fileTransfer : function(){
		if(!this.fileTransferObject)
			this.fileTransferObject = new FileTransfer();
		return this.fileTransferObject;
	},
	fileTransferObject : undefined,
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

	getOutstanding : function(data, success){
		app.File.getJobDir(function(folder){
			folder.createReader().readEntries(function(entries){
				var i = 0, j = 0, d = 1, 
				outstanding = [];				
			    for (i = 0 ; i < entries.length ; i ++) {
			    	d = 1;
			        for(j = 0 ; j < data.length ; j ++){
			        	if(data[j].name == entries[i].name){
			        		d = 0;
			        		break;
			        	}
			        }
			        if(d == 1)
			        	outstanding.push(entries[i].name);
			    }
			    success(outstanding);
			}, app.File.fileError);
		});
	},

	update : function(data, success){
		var getOutstandingCallback = function(out){
			var i = 0,
				recursiveCallback = function(){
					i++;
					if(i < out.length)
						app.File.deleteJob(out[i], recursiveCallback);
					else
						app.Sync.syncJobs(data, success);
				};
			if(out.length > 0)
				app.File.deleteJob(out[i], recursiveCallback);
			else
				app.Sync.syncJobs(data, success);
		};
		app.Sync.getOutstanding(data, getOutstandingCallback);
	},

	syncJobs : function(data, success){
		var i = 0,
			callback = function(){
				i++;
				if(i < data.length)
					app.Sync.downloadFiles(data[i], callback);
				else
					success();
			};
		if(data.length > 0)
			app.Sync.downloadFiles(data[i], callback);
		else
			success();
	},

	downloadFiles : function(jobData, success){
		var getDirCallback = function(dir){
			var i = 0, pages = jobData.pages,
				recursiveDownloadCallback = function(){
					i++;
					while(i < pages.length && pages[i].filename == "")
						i++;
					if(i < pages.length)
						app.Sync.fileTransfer().download(encodeURI("http://theplanviewer.com/_files/" + pages[i].id), dir.fullPath + "/" + pages[i].filename,  recursiveDownloadCallback, this.syncError);
					else
						success();
				};
			while(i < pages.length && pages[i].filename == "")
				i++;
			if(pages.length > 0 && i < pages.length)
				app.Sync.fileTransfer().download(encodeURI("http://theplanviewer.com/_files/" + pages[i].id), dir.fullPath + "/" + pages[i].filename,  recursiveDownloadCallback, this.syncError);
			else
				success();
		};
		app.File.getJob(jobData.name, getDirCallback);
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