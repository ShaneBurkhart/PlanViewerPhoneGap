var app = app || {};

app.PagesView = Backbone.View.extend({
	tagName : "div",
	className : "page",
	container : "page_container",
	template : "list_item",

	initialize : function(){
		this.renderAll();
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
		app.File.open(this.options.job, id);
	},

	renderAll : function(){
		var body = Mustache.to_html(app.Templates.get(this.template), {items : [{title : "Cover"}, {title : "Elevation"}]});
		$(".content").append(body);
	},

	render : function(){
		this.$el.html(Mustache.render(app.Templates.get(this.container), {content : ""}));
		return this;
	}
});