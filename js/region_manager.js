var app = app || {};

app.RegionManager = {

	el : "#content",

	show : function(view){
		if(this.current)
			this.current.close();
		this.current = view;
		this.current.render();
		$(this.el).html(this.current.el);
	}
};