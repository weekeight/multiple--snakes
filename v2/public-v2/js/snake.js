KISSY.add("snake", function(S,Node,Base){

	var $ = Node.all;
	function Snake(config){
		var config = config || {};
		this.name = config.name || 'none';
		this.color = config.color || "#f00";
		this.canvas = config.canvas || document.getElementById('main-canvas');
		this.ctx = this.canvas.getContext("2d");
		this.ctx.fillStyle = this.color;
		
		this.fatWidth = config.fatWidth || 3;
		this.direction = config.direction || "right";
		this.speed = config.speed || 500;
		this.initX = config.initX || 30;
		this.initY = config.initY || 30;
		this.bodyData = config.bodyData || [[30+this.fatWidth*2,30], [30+this.fatWidth,30],[30,30]];
	
		this.init();
	}
	Snake.prototype.init = function(){
		this.draw();
		// this.move();
	}

	Snake.prototype.draw = function(){

		// this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		for(var i = 0; i < this.bodyData.length; i++){
			var oBodyItem = this.bodyData[i];
			if(i == 0){
				this.ctx.fillStyle = "#987";
				this.ctx.fillRect(oBodyItem[0],oBodyItem[1],this.fatWidth, this.fatWidth);
				continue;
			}

			this.ctx.fillStyle = this.color;
			this.ctx.fillRect(oBodyItem[0],oBodyItem[1],this.fatWidth, this.fatWidth);
		}
	}

	Snake.prototype.move = function(){
		var oBodyData = this.bodyData,
			newBodyData = [];
		var this$ = this;
		clearInterval(this$.timer);
		this$.timer = setInterval(function(){
			switch(this$.derection){
				case "up" : 
					var x = this$.bodyData[0][0];
					var y = this$.bodyData[0][1] - this$.fatWidth;
					this$.checkNextStep(x, y);
					
					break;
				case "right" :
					var x = this$.bodyData[0][0] + this$.fatWidth;
					var y = this$.bodyData[0][1];
					this$.checkNextStep(x, y);
					break;
				case "down" :
					var x = this$.bodyData[0][0];
					var y = this$.bodyData[0][1] + this$.fatWidth;
					this$.checkNextStep(x, y);
					break;
				case "left" :
					var x = this$.bodyData[0][0] - this$.fatWidth;
					var y = this$.bodyData[0][1];
					this$.checkNextStep(x, y);
					break;
			}
		},this$.speed);
	}

	return Snake;
},{requires:['node','base','anim']})