var app = app || {};

app.UserSideBarView = Backbone.View.extend({
    children : {},
    id : "user-page-side-bar",
    template : _.template(app.Templates["user-page-side-bar"]),

	initialize: function() {
    },

    events : {
        "click #add-a-user-button" : "addPage",
        "keypress #username, #email, #email-confirm" : "addPageKey"
    },

    addPageKey : function(e){
        if((e.keycode || e.which) == 13)
            this.addPage(e);
    },

    addPage : function(e){
        e.preventDefault();
        var username = this.$el.find("#username").val(),
            email = this.$el.find("#email").val(),
            emailConf = this.$el.find("#email-confirm").val();
        if(!username || !email || !emailConf || (emailConf != email))
            return;
        this.options.parentView.addUser(username, email);
        this.$el.find("#username").val("");
        this.$el.find("#email").val("");
        this.$el.find("#email-confirm").val("");
    },

    render : function(){
        this.$el.html(this.template());
        return this;
    }
});