var app = app || {};

app.PagesView = Backbone.View.extend({
	tagName : "div",
	className : "page",
	container : "page_container",
	template : "list_item",

	initialize : function(){
		_.bindAll(this, "renderAll");
    },

    events : {
		"click div.item" : "openFile"
	},

	openFile : function(e){
		e.preventDefault();
		var target = $(e.target);
		while(target.prop("tagName") != "DIV")
			target =  target.parent();
		var val = target.find("p").html();
		var id = target.attr("id");
		app.File.open(this.options.job, val);
	},

	renderAll : function(files){
		var i = 0,
			items = [];
		for(i = 0 ; i < files.length ; i ++)
			items.push({title : files[i]});
		var body = Mustache.to_html(app.Templates.get(this.template), {items : items});
		this.$el.find("#content").append(body);
	},

	render : function(){
		this.$el.html(Mustache.render(app.Templates.get(this.container), {content : ""}));
		var self = this;
		app.File.getFiles(this.options.job, self.renderAll);
		return this;
	}
});