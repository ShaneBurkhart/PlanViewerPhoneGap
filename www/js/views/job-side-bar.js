var app = app || {};

app.JobSideBarView = Backbone.View.extend({
    children : {},
    id : "job-side-bar",
    tagName : "div",
    template : _.template(app.Templates["job-page-side-bar"]),

	initialize: function() {

    },

    events : {
        "click #add-a-job-button" : "addJob",
        "keypress #jobname" : "addJobKey"
    },


    addJobKey : function(e){
        if((e.keycode || e.which) == 13)
            this.addJob(e);
        
    },

    addJob : function(e){
        e.preventDefault();
        var jobname = this.$el.find("#jobname").val();
        if(!jobname)
            return;
        this.options.parentView.addJob(jobname);
        this.$el.find("#jobname").val("");
    },

    render : function(){
        this.$el.html(this.template());
        return this;
    }
});