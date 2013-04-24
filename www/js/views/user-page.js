var app = app || {};

app.UserPageView = Backbone.View.extend({
    children : {},
    id : "user-page",
    template : _.template(app.Templates["user-page"]),

    initialize: function() {
        this.children.userListView = new app.UserListView();
        this.children.userSideBar = new app.UserSideBarView({parentView : this});
    },

    addUser : function(username, email){   
        console.log(username + email);
        app.showLoading(); 
        app.collections.userListCollection.create({name : username, email : email}, {wait : true, success : app.hideLoading});
    },

    render : function(){
        this.$el.html(this.template());
        this.$el.find("#content").append(this.children.userListView.$el);
        this.$el.find("#side-bar").append(this.children.userSideBar.render().$el);
    }
});