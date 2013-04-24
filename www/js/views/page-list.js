var app = app || {};

app.PageListView = Backbone.View.extend({
    children : {},
    tagName : "ul",
	id : "page-list-container",
    className : "unstyled list-view",

	initialize: function() {
        this.collection = new app.PageListCollection(0, {url : "api/page/" + this.options.jobId});
        app.showLoading();
        this.collection.fetch({success : app.hideLoading});
        this.render();
        this.listenTo(this.collection, "reset", this.render);
        this.listenTo(this.collection, "change", this.render);
        this.listenTo(this.collection, "add", this.renderOne);
    },

    render : function(){
        this.$el.html("");
        this.renderAll();
        return this;
    },

    renderAll : function(){
        this.collection.each(function(item){
            this.renderOne(item);
        }, this);
    },

    renderOne : function(item){
        var pageView = new app.PageItemView({
            model : item,
            collection : this.collection
        });
        this.$el.append(pageView.render().el);
    }
});