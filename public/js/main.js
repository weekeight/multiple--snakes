KISSY.use("snake,node",function(S, Snake, Node){
	var canvas = document.getElementById("main-canvas"),
		ctx = canvas.getContext("2d");
	function Food(){
		this.count = 0;
		this.createNewOne();
	}
	Food.prototype.createNewOne = function(){
		this.x = Math.round(Math.random()*canvas.width/3) * 3;
		this.y = Math.round(Math.random()*canvas.height/3) * 3;
		ctx.fillStyle = "#00f";
		this.draw();
	}
	Food.prototype.draw = function(){
		ctx.fillStyle = "#00f";
		ctx.fillRect(this.x, this.y, 3, 3);
	}
	window.gFood = new Food();
	var snake1 = new Snake();
	var $ = Node.all;

	$("#control").delegate("click", "a", function(e){
		e.preventDefault();
		var currentTarget$ = $(e.currentTarget);
		var _sDerection = currentTarget$.attr("derection");
		snake1.changeDerection(_sDerection);
		e.stopProgragation();
	})
})