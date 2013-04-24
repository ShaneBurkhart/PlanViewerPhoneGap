var app = app || {};

app.JobEditSideBarView = Backbone.View.extend({
    children : {},
    id : "job-edit-side-bar",
    template : _.template(app.Templates["job-edit-side-bar"]),

	initialize: function() {
    },

    events : {
        "click #add-a-page-button" : "addPage",
        "keypress #pagename" : "addPageKey",
        "change #upload-file" : "uploadFile"
    },

    uploadFile : function(e){
        app.showLoading();
        $("#upload-submit").trigger("click");
        var file = $("#upload-file").val(),
            p = file.split("\\"),
            n = p[p.length - 1],
            id = $("#upload-page-id").val(),
            model;
        if(model = this.options.parentView.children.pageListView.collection.get(id))
            model.set({filename : n});
        $("#upload-file").val("");
    },

    addPageKey : function(e){
        if((e.keycode || e.which) == 13)
            this.addPage(e);
    },

    addPage : function(e){
        e.preventDefault();
        var pagename = this.$el.find("#pagename").val();
        if(!pagename)
            return;
        this.options.parentView.addPage(pagename);
        this.$el.find("#pagename").val("");
    },

    render : function(){
        this.$el.html(this.template());
        return this;
    }
});