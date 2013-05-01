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

	fileTransferObject : undefined,
	fileTransfer : function(){
		if(!this.fileTransferObject)
			this.fileTransferObject = new FileTransfer();
		return this.fileTransferObject;
	},
	reader : null,
	getReader : function(){
		if(!this.reader)
			this.reader = new FileReader();
		return this.reader;
	},

	open : function(job, name){
		console.log(name);
		if(window.device.platform == "iOS")
			app.File.openiPhone(job, name);
		else if(window.device.platform == "Android")
			app.File.openAndroid(job, name);
	},

	openAndroid : function(job, name){
		app.File.getJob(job, function(dir){
			var path = encodeURI(dir.fullPath + "/" + name);
			window.plugins.fileOpener.open(path, function(error){app.Dialog.alert(error);});
		});
	},

	openiPhone : function(job, name){
        app.File.getJob(job, function(dir){
            var ref = window.open(encodeURI(dir.fullPath + "/" + name), "_blank", "location=no");
        });
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

	deleteFile : function(job, file, success){
		this.getJob(job, function(dir){
			dir.getFile(file, {create : false}, function(f){
				f.remove(success, app.File.fileError);
			}, app.File.fileError);
		});
	},
	downloadFile : function(job, serverName, destName, success){
		app.File.getJob(job, function(dir){
			app.File.fileTransfer().download(encodeURI("http://theplanviewer.com/_files/" + serverName), dir.fullPath + "/" + destName,  success, this.syncError);
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

	dataFilename : "data.txt",

	getData : function(success){
		app.File.getJobDir(function(dir){
			dir.getFile(app.File.dataFilename, {create : true}, function(file){
				file.file(function(f){
					var reader = app.File.getReader();
			        reader.onloadend = function(evt){
			            success(reader.result);
			        };
			        reader.readAsText(f);
				}, app.File.fileError);
			}, app.File.fileError);
		});
	},

	saveData : function(u, p, data){
		app.File.getJobDir(function(dir){
			dir.getFile(app.File.dataFilename, {create: true}, function(file){
				file.createWriter(function(writer){
					writer.write(u + "\n" + p + "\n" + JSON.stringify(data));
				});
			}, app.File.fileError);
		});
	},

	createName : function(id, filename){
		var p = filename.split("\.");
		if(p.length > 1)
			return id + "." + p[p.length - 1];
		else
			return id;
	},

	fileError : function(error){
		app.Dialog.alert("Sorry but the filesystem could not be accessed.");
	}
};

app.Sync = {
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

	setTotal : function(num){
		this.currentPage = 0;
		this.totalPages = num;
	},

	getRemovedFiles : function(data, prevData){
		if(!prevData)
			return [];
		var dataFiles = app.Sync.convertJobsToFiles(data),
			prevDataFiles = app.Sync.convertJobsToFiles(prevData),
			remove = [];
		var i = 0, j = 0, b = 1;
		for(i = 0 ; i < prevDataFiles.length ; i ++){
			b = 1;
			for(j = 0 ; j < dataFiles.length ; j ++){
				if(prevDataFiles[i].id == dataFiles[j].id)
					b = 0;
			}
			if(b == 1)
				remove.push(prevDataFiles[i]);
		}
		return remove;
	},
	getAddedFiles : function(data, prevData){
		var add = [],
			dataFiles = app.Sync.convertJobsToFiles(data);
		if(prevData == null)
			return dataFiles;
		var i = 0, j = 0, b = 1,
			prevDataFiles = app.Sync.convertJobsToFiles(prevData);
		for(i = 0 ; i < dataFiles.length ; i ++){
			b = 1;
			for(j = 0 ; j < prevDataFiles.length ; j ++){
				if(dataFiles[i].id == prevDataFiles[j].id){
					if(dataFiles[i].version <= prevDataFiles[j].version)
						b = 0;
					break;
				}
			}
			if(b == 1)
				add.push(dataFiles[i]);
		}
		return add;
	},
	convertJobsToFiles : function(data){
		var i = 0, j = 0, files = [];
		for(i = 0 ; i < data.length ; i ++){
			if(!data[i].pages)
					continue;
			for(j = 0 ; j < data[i].pages.length ; j ++){
				if(data[i].pages[j].filename != "")
					files.push({id : data[i].pages[j].id, job : data[i].name, filename : data[i].pages[j].filename, version : data[i].pages[j].version});
			}
		}
		return files;
	},
	determineDelta : function(data, prevData){
		return {
			remove : app.Sync.getRemovedFiles(data, prevData),
			add : app.Sync.getAddedFiles(data, prevData)
		};
	},
	deleteFiles : function(files, success){
		if(!files){
			success();
			return;
		}
		var i = 0,
			recursiveCallback = function(){
				app.Sync.incrementProgress();
				i++;
				if(i < files.length)
					app.File.deleteFile(files[i].job, app.File.createName(files[i].id, files[i].filename), recursiveCallback);
				else
					success();
			}
		if(files.length > 0)
			app.File.deleteFile(files[i].job, app.File.createName(files[i].id, files[i].filename), recursiveCallback);
		else
			success();
	},
	addFiles : function(files, success){
		if(!files){
			success();
			return;
		}
		var i = 0,
			recursiveCallback = function(){
				app.Sync.incrementProgress();
				i++;
				if(i < files.length)
					app.File.downloadFile(files[i].job, files[i].id, app.File.createName(files[i].id, files[i].filename), recursiveCallback);
				else
					success();
			}
		if(files.length > 0)
			app.File.downloadFile(files[i].job, files[i].id, app.File.createName(files[i].id, files[i].filename), recursiveCallback);
		else
			success();
	},
	deleteEmpty : function(success){
		app.File.getJobDir(function(dir){
			dir.createReader().readEntries(function(entries){
				var i = 0,
					recursiveCallback = function(){
						i++;
						while(i < entries.length && !entries[i].isDirectory)
							i++;
						if(i < entries.length)
							entries[i].remove(recursiveCallback, recursiveCallback);
						else
							success();
					};
				while(i < entries.length && !entries[i].isDirectory)
					i++;
				if(i < entries.length)
					entries[i].remove(recursiveCallback, recursiveCallback);
				else
					success();
			}, app.File.fileError);
		});
	},
	update : function(data, prevData, success){
		var delta = this.determineDelta(data, prevData);
		app.Sync.setTotal(delta.add.length + delta.remove.length);
		app.Sync.deleteFiles(delta.remove, function(){
			app.Sync.addFiles(delta.add, function(){
				app.Sync.deleteEmpty(success);
			});
		});
	},

	incrementProgress : function(){
		this.currentPage++;
		app.Dialog.Loading.setLoadingPercent(this.currentPage / this.totalPages);
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