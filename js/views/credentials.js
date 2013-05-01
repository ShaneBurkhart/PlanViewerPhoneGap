var app = app || {};

app.CredentialsView = Backbone.View.extend({
	tagName : "div",
	className : "page",
	container : "page_container",
	template : "credentials",

	initialize : function(){
		var self = this;
		app.File.getData(function(data){
			if(!data){
				self.renderForm();
				return;
			}
			var creds = data.split("\n");
			self.executeUpdate(creds[0], creds[1], JSON.parse(creds[2]));
		});
    },

    events : {
		"click #update-button" : "update"
	},

	executeUpdate : function(u, p, prevData){
		app.Dialog.Loading.setMessage("Getting Data...");
		app.Dialog.Loading.setLoadingPercent(0);
		app.Dialog.Loading.show();
		app.Sync.getData(u, p, function(data){
			if(!data){
				app.Dialog.alert("Invalid username or password.");
				return;
			}
			app.Sync.update(data, prevData, function(){
				app.File.saveData(u, p, data);
				app.Dialog.Loading.hide();
				window.location.hash = "#";
				app.Dialog.alert("Your files are now up to date!\nIt might take a minute for files to fully refresh.");
			});	
		});
	},

	update : function(e){
		e.preventDefault();
		var username = $("#username"),
			password = $("#password"),
			u = "Shane",
			p = "kFj5agh4";
		password.val("");
		this.executeUpdate(u, p, null);
	},

	renderForm : function(){
		var body = Mustache.to_html(app.Templates.get(this.template));
		this.$el.html(Mustache.render(app.Templates.get(this.container), {content : body}));
	},

	render : function(){
		return this;
	}
});