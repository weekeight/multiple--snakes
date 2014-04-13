

KISSY.use("node,io,snake", function(S, Node, Io, Snake){
	var $ = Node.all;

	$('#sendInfo').on('click', function(ev){
		var sName = $('#name').val(),
			sRoomKey = $('#key').val(),
			sSnakeId = sName;

		var Snakes = {}
		window.gFood = {};
		//连接服务器开启websocket
		var host = "http://10.68.200.98";
		var socket = io.connect(host);

		socket.emit('register', {
			name : sName,
			roomkey : sRoomKey
		});
		socket.on("msg",function(data){
			switch(data.signal){
				case 'wait' :
					$('#main').css('display','none');
					$('#playgame').css('display','block');
					$('#content').html(data.content);
					$('body').css('background','#eae9e5');
					break;
				case 'ready' :
					startGame(data);
					break;
				case 'changeDirection' :
					Snakes.family[data.playerMsg.playerId].direction = data.playerMsg.direction;
					Snakes.move();
					break;
				case 'foodeated' :
					gFood.createNewOne(data.randomFood);
				case 'gameover' :
					alert('gameover!' + data.playername + 'failed..');
			}
		});

		function startGame(data){
			$('#main').css('display','none');
			$('#playgame').css('display','block');
			$('#content').html(data.content);
			$('body').css('background','#eae9e5');
			var timer = false,
				canvas = document.getElementById('main-canvas'),
				ctx = canvas.getContext("2d");
			Snakes.family = {};

			function Food(randomFood){
				this.count = 0;
				this.createNewOne(randomFood);
			}
			Food.prototype.createNewOne = function(randomFood){
				this.x = Math.round(randomFood*canvas.width/3) * 3;
				this.y = Math.round(randomFood*canvas.height/3) * 3;
				ctx.fillStyle = "#00f";
				this.draw();
			}
			Food.prototype.draw = function(){
				ctx.fillStyle = "#00f";
				ctx.fillRect(this.x, this.y, 3, 3);
			}

			gFood = new Food(data.randomFood);

			//显示贪吃蛇的颜色对应信息
			var playerData = data.playerData;
			for(var i = 0; i < playerData.length; i++){
				var snakeData = playerData[i];
				$('#content').append('<div>' + snakeData.name + '\'s color is <span style="display:inline-block;width:30px;height:10px;background:' + snakeData.color + ';"></span></div>');
				
				var snakeInstance = new Snake({
					name : snakeData.name,
					color : snakeData.color,
					bodyData : snakeData.bodyData
				})
				Snakes.family[snakeData.name] = snakeInstance;
			}

			Snakes.move = function(){
				clearInterval(timer);
				timer = setInterval(function(){
							for(snakeItemName in Snakes.family){
								var snakeItem = Snakes.family[snakeItemName];
								switch(snakeItem.direction){
									case "up" : 
										var x = snakeItem.bodyData[0][0];
										var y = snakeItem.bodyData[0][1] - snakeItem.fatWidth;
										
										break;
									case "right" :
										var x = snakeItem.bodyData[0][0] + snakeItem.fatWidth;
										var y = snakeItem.bodyData[0][1];
										break;
									case "down" :
										var x = snakeItem.bodyData[0][0];
										var y = snakeItem.bodyData[0][1] + snakeItem.fatWidth;
										break;
									case "left" :
										var x = snakeItem.bodyData[0][0] - snakeItem.fatWidth;
										var y = snakeItem.bodyData[0][1];
										break;
								}
								Snakes.checkNextStep(snakeItem,x,y);
							}
							Snakes.draw();
						},1000);
			}

			Snakes.draw = function(){
				ctx.clearRect(0,0,canvas.width,canvas.height);
				window.gFood.draw();
				for(snakeItemName in Snakes.family){
					var snakeItem = Snakes.family[snakeItemName];
					snakeItem.draw();
				}
			}
			Snakes.checkNextStep = function(snakeItem,x,y){
				if(x < 0 || x > canvas.width || y < 0 || y > canvas.height){
					socket.emit('gameover',{
						playername : snakeItem.name,
						grp : sRoomKey
					})
					this.stop();
				}else if(x == window.gFood.x && y == window.gFood.y){
					snakeItem.bodyData.unshift([x,y]);
					socket.emit('foodeated',{
						grp : sRoomKey,
						player : snakeItem.name
					});
				}else{
					snakeItem.bodyData.unshift([x,y]);
					snakeItem.bodyData.pop();
					window.gFood.draw();
				}
			}
			Snakes.stop =function(){
				clearInterval(timer);
			}

			Snakes.move();
			
			
			$("#control").delegate("click", "a", function(e){
				e.preventDefault();
				var currentTarget$ = $(e.currentTarget);
				var _sDirection = currentTarget$.attr("direction");
				socket.emit('changeDirection',{
					playerId : sSnakeId,
					direction : _sDirection
				})
			})
		}
		

	})
})