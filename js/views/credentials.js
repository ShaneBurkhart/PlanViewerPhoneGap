var app = app || {};

app.CredentialsView = Backbone.View.extend({
	tagName : "div",
	className : "page",
	container : "page_container",
	template : "credentials",

	initialize : function(){
		var self = this;
		app.File.getCredentials(function(data){
			if(!data){
				self.renderForm();
				return;
			}
			var creds = data.split("\n");
			self.executeUpdate(creds[0], creds[1]);
		});
    },

    events : {
		"click #update-button" : "update"
	},

	executeUpdate : function(u, p){
		app.Sync.getData(u, p, function(data){
			app.Dialog.Notification.hide();
			if(!data){
				app.Dialog.alert("Invalid username or password.");
				return;
			}
			app.Sync.update(data, function(){
				
				app.File.saveCredentials(u, p);
				console.log("After");
				app.Dialog.Loading.hide();
				window.location.hash = "#";
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
		this.executeUpdate(u, p);
	},

	renderForm : function(){
		var body = Mustache.to_html(app.Templates.get(this.template));
		this.$el.html(Mustache.render(app.Templates.get(this.container), {content : body}));
	},

	render : function(){
		return this;
	}
});