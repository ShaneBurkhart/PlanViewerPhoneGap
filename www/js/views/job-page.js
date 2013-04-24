var app = app || {};

app.JobPageView = Backbone.View.extend({
    children : {},
    id : "job-page",
    tagName : "div",
    template : _.template(app.Templates["job-page"]),

    initialize: function() {
        this.children.jobListView = new app.JobListView({parent : this});
        this.children.jobSideBarView = new app.JobSideBarView({parentView : this});
    },

    addJob : function(jobname){
        app.collections.jobListCollection.create({name : jobname}, {wait : true});
    },
    
    render : function(){
        this.$el.html(this.template());
        this.$el.find("#content").append(this.children.jobListView.render().$el);
        this.$el.find("#side-bar").append(this.children.jobSideBarView.render().$el);    
    }
});