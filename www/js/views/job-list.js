var app = app || {};

app.JobListView = Backbone.View.extend({
    children : {},
    id : "job-list-container",
    tagName : "ul",
    className : "unstyled list-view",

	initialize: function() {
        if(!app.collections.jobListCollection)
            app.collections.jobListCollection = new app.JobListCollection();
        app.showLoading();
        app.collections.jobListCollection.fetch({success : app.hideLoading});

        this.listenTo(app.collections.jobListCollection, "add", this.renderOne);
        this.listenTo(app.collections.jobListCollection, "reset", this.render);
        this.listenTo(app.collections.jobListCollection, "change", this.render);
    },

    render : function(){
        this.$el.html("");
        this.renderAll();
        return this;
    },

    renderAll : function(){
    	app.collections.jobListCollection.each(this.renderOne, this);
    },

    renderOne : function(item){
    	var jobView = new app.JobItemView({
    		model : item
    	});
    	this.$el.prepend(jobView.render().el);
    }
});