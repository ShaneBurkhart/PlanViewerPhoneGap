var app = app || {};

app.RegionManager = {

	el : "body",

	show : function(view){
		if(this.current)
			this.current.close();
		this.current = view;
		this.current.render();
		$(this.el).html(this.current.el);
	}
};