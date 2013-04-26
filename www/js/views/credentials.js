var app = app || {};

app.CredentialsView = Backbone.View.extend({
	tagName : "div",
	className : "page",
	container : "page_container",
	template : "credentials",

	initialize : function(){
    },

    events : {
		"click #update-button" : "update"
	},

	update : function(e){
		e.preventDefault();
		var username = $("#username"),
			password = $("#password"),
			form = $("#credential-form"),
			loading = $("#loading"),
			u = "Shane",
			p = "kFj5agh4";
		form.hide();
		loading.show();
		app.Sync.getData(u, p, function(data){
			if(data)
				console.log(data);
			else
				app.Dialog.alert("Username or password is incorrect.");
		});
	},

	render : function(){
		var body = Mustache.to_html(app.Templates.get(this.template));
		this.$el.html(Mustache.render(app.Templates.get(this.container), {content : body}));
		return this;
	}
});