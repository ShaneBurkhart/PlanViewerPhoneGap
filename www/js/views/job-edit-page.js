var app = app || {};

app.JobEditView = Backbone.View.extend({
    children : {},
	id : "job-pages",
    template : _.template(app.Templates["job-edit"]),

	initialize: function() {
        this.children.pageListView = new app.PageListView({jobId : this.options.jobId});
        this.children.jobView = new app.JobView({jobId : this.options.jobId});
        this.children.jobEditSideBar = new app.JobEditSideBarView({parentView : this});
    },

    addPage : function(pagename){
        app.showLoading();
        this.children.pageListView.collection.create({jobId : this.options.jobId, pageName : pagename}, {wait : true, success : app.hideLoading});
    },

    render : function(){
        this.$el.html(this.template());
        this.$el.find("#content").prepend(this.children.jobView.render().el);
        this.$el.find("#content").append(this.children.pageListView.render().el);

        this.$el.find("#side-bar").html(this.children.jobEditSideBar.render().el);
    }
});