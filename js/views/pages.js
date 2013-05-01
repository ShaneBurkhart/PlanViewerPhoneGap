var app = app || {};

app.PagesView = Backbone.View.extend({
	tagName : "div",
	className : "page",
	container : "page_container",
	template : "list_item",

	initialize : function(){
		_.bindAll(this, "renderAll");
		var self = this;
		app.File.getData(self.renderAll);
    },

    events : {
		"click div.item" : "openFile"
	},

	job : [],

	openFile : function(e){
		e.preventDefault();
		var target = $(e.target);
		while(target.prop("tagName") != "DIV")
			target =  target.parent();
		var val = target.find("p").html();
		var id = target.attr("id");
		var i = 0;
		for(i = 0 ; i < this.job.pages.length ; i ++){
			if(this.job.pages[i].pageName == val){
				app.File.open(this.options.job, app.File.createName(this.job.pages[i].id, this.job.pages[i].filename));
				break;
			}
		}
	},

	renderAll : function(d){
		var p = d.split("\n"),
			data = JSON.parse(p[2]);
		var i = 0, job;
		for(i = 0 ; i < data.length ; i ++){
			if(data[i].name == this.options.job){
				this.job = data[i];
				break;
			}
		}
		var pageNums = [];
		for(i = 0 ; i < this.job.pages.length ; i ++){
			pageNums.push(this.job.pages[i].pageNum);
		}
		pageNums.sort();
		var items = [], j = 0;
		for(i = 0 ; i < pageNums.length ; i ++){
			for(j = 0 ; j < this.job.pages.length ; j ++){
				if(this.job.pages[j].pageNum == pageNums[i]){
					items.push({title : this.job.pages[j].pageName});
					break;
				}
			}
		}
		var body = Mustache.to_html(app.Templates.get(this.template), {items : items});
		this.$el.find("#content").append(body);
	},

	render : function(){
		this.$el.html(Mustache.render(app.Templates.get(this.container), {content : ""}));
		return this;
	}
});