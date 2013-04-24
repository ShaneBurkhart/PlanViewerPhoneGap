var app = app || {};

app.PageItemView = Backbone.View.extend({
	tagName : "li",
	id : function(){
		return this.model.id;
	},

	className : "page-container row-fluid",
	template : _.template(app.Templates["page-item"]),

	events : {
		"click .controls .move" : "toggleMove",
		"click .controls .remove" : "deletePage",
		"click .controls .upload" : "upload",
		"keypress .page-num-text" : "moveKey"
	}, 

	initialize : function(){
	},

	upload : function(e){
		e.preventDefault();
		$("#upload-page-id").val(this.model.id);
		$("#upload-file").trigger("click");
	},

	deletePage : function(e){
		e.preventDefault();
		this.model.destroy();
		this.remove();
	},

	toggleMove : function(e){
		e.preventDefault();
		var parent = this.getParent(e),
			form = $(parent).find(".page-num-form"),
			num = $(parent).find(".page-num");
		form.toggle();
		num.toggle();
		if(num.is(":hidden"))
			form.find(".page-num-text").focus();
		else
			this.move(e);
	},

	moveKey : function(e){
		if((e.keycode || e.which) == 13){
            e.preventDefault();	
			this.move(e);
        }
	},

	move : function(e){
		var parent = this.getParent(e),
			form = $(parent).find(".page-num-form"),
			num = $(parent).find(".page-num"),
			newPageNum = form.find(".page-num-text").val(),
			oldPageNum = this.model.get("pageNum");
		if(isNaN(newPageNum))
			return;
		newPageNum = newPageNum < 1 ? 1 : newPageNum;
		this.model.set("pageNum", newPageNum);
		var data = this.model.toJSON();
		data = _.extend(data, {oldPageNum : oldPageNum});
		var self = this;
		app.showLoading();
		this.model.save(data, {
			success : function(){
				self.collection.fetch({
					reset : true, 
					success : app.hideLoading
				});
			}
		});
		num.find(".page-num-text").val("");
		this.toggleMove(e);
	},

	getParent : function(e){
		var pageContainer = $(e.target);
		while(pageContainer.attr("class") != this.className)
			pageContainer = pageContainer.parent();
		return pageContainer;
	},

	render : function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});