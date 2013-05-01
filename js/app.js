var app = app || {};

Backbone.View.prototype.close = function(){
	this.remove();
	this.unbind();
	if(this.onClose)
		this.onClose();
}

app = _.extend(app, {collections : {}});

app.Dialog = {
	hideAll : function(){
		app.Dialog.Loading.hide();
		app.Dialog.Notification.hide();	
	},

	confirm : function(){
		navigator.notification.confirm("Are you sure you want to update your files?", function(){}, "Update Files?", ["Update", "Cancel"]);
	},

	alert : function(message, callback, title, buttons){
		navigator.notification.alert(message, callback, title, buttons);
	},

	Loading : {
		show : function(){
			$("#loading").show();
		},

		hide : function(){
			$("#loading").hide();
		},

		setMessage : function(msg){
			$("#loading-msg").html(msg);
		},

		setLoadingPercent : function(percent){
			$("#loading-bar").css("width", (percent * 100) + "%");
		}
	},

	Notification : {
		show : function(){
			$("#notification").show();
		},

		hide : function(){
			$("#notification").hide();
		},

		setMessage : function(msg){
			$("#notification-msg").html(msg);
		}
	}
};

app.File = {
	jobDir : "jobs",

	open : function(job, name){
		if(window.device.platform == "iOS")
			app.File.openiPhone(job, name);
		else if(window.device.platform == "Android")
			app.File.openAndroid(job, name);
	},

	openAndroid : function(job, name){
		app.File.getJob(job, function(dir){
			var path = encodeURI(dir.fullPath + "/" + name);
			console.log("This is where we do it");
			window.plugins.fileOpener.open(path, function(error){app.Dialog.alert(error);});
		});
	},

	openiPhone : function(job, name){
		app.Dialog.alert("Opening Job: " + job + "  File: " + name);
	},

	getDir : function(dir, success){ 
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
            fs.root.getDirectory(dir, {create: true, exclusive: false}, success, app.Dialog.fileError);
		}, app.Dialog.fileError);
	},

	getJobDir : function(success){
		this.getDir(this.jobDir, success);
	},

	getJob : function(job, success){
		this.getJobDir(function(dir){
			dir.getDirectory(job, {create: true, exclusive: false}, success, app.Dialog.fileError);
		});
	},

	deleteJob : function(job, success){
		this.getJob(job, function(dir){
			dir.removeRecursively(success, app.Dialog.fileError);
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
			}, app.Dialog.fileError);
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
			}, app.Dialog.fileError);
		});
	},

	credFilename : "credentials.txt",

	getCredentials : function(success){
		app.File.getJobDir(function(dir){
			dir.getFile(app.File.credFilename, {create : true}, function(file){
				file.file(function(f){
					var reader = new FileReader();
			        reader.onloadend = function(evt){
			            success(reader.result);
			        };
			        reader.readAsText(f);
				}, app.File.fileError);
			}, app.File.fileError);
		});
	},

	saveCredentials : function(username, password){
		var data = username + "\n" + password;
		app.File.getJobDir(function(dir){
			dir.getFile(app.File.credFilename, {create: true}, function(file){
				file.createWriter(function(writer){
					writer.write(data);
				});
			}, app.File.fileError);
		});
	},

	fileError : function(error){
		app.Dialog.alert("Sorry but the filesystem could not be accessed.");
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
	totalPages : 0,
	currentPage : 0,
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

	setTotal : function(data){
		this.currentPage = 0;
		app.Dialog.Loading.setLoadingPercent(0);
		var i = 0, t = 0, j = 0;
		for(i = 0 ; i < data.length ; i ++){
			for(j = 0 ; j < data[i].pages.length ; j ++)
				t++;
		}
		this.totalPages = t;
	},

	update : function(data, success){
		app.Sync.setTotal(data);
		app.Dialog.Loading.setMessage("Downloading Files...");
		app.Dialog.Loading.show();
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

	incrementProgress : function(){
		this.currentPage++;
		app.Dialog.Loading.setLoadingPercent(this.currentPage / this.totalPages);
	},

	downloadFiles : function(jobData, success){
		var getDirCallback = function(dir){
			var i = 0, pages = jobData.pages,
				recursiveDownloadCallback = function(){
					i++;
					app.Sync.incrementProgress();
					while(i < pages.length && pages[i].filename == ""){
						i++;
						app.Sync.incrementProgress();
					}
					console.log("Before");
					if(i < pages.length)
						app.Sync.fileTransfer().download(encodeURI("http://theplanviewer.com/_files/" + pages[i].id), dir.fullPath + "/" + pages[i].filename,  recursiveDownloadCallback, this.syncError);
					else
						success();
				};
			while(i < pages.length && pages[i].filename == ""){
				i++;
				app.Sync.incrementProgress();
			}
			if(pages.length > 0 && i < pages.length)
				app.Sync.fileTransfer().download(encodeURI("http://theplanviewer.com/_files/" + pages[i].id), dir.fullPath + "/" + pages[i].filename,  recursiveDownloadCallback, this.syncError);
			else
				success();
		};
		app.File.getJob(jobData.name, getDirCallback);
	},

	syncError : function(error){
		app.Dialog.alert("Sorry but the server is not responding");
	},

	noConnectionError : function(){
		app.Dialog.hideAll();
		app.Dialog.alert("Sorry but you don't currently have connection.");
	}
};

document.addEventListener("deviceready", function(){
	app.Templates.load();
	new app.Router(app);
	Backbone.history.start();
}, false);