var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , path = require('path');

app.use(express.static('public-v2'));
server.listen(80);

// app.get('/', function (req, res) {
// 	console.log('hre.........');
// 	var indexPath = path.resolve('/index.html');
// 	console.log(indexPath);
// 	res.sendfile(indexPath);
// });
// app.get('/playgame', function(req, res){
// 	console.log('here.......');
// 	var playgamePath = path.resolve('/playgame.html');
// 	console.log(playgamePath);
// 	res.sendfile(playgamePath);
// })

var allPlayerNum = 0,
	color = ['#222', '#55D', '#f40'],
	colorIndex = 0,
	playerGrp = {},  //游戏群组列表
	socreGrp = {};

io.sockets.on('connection', function (socket) {
	allPlayerNum++;

	socket.on('register', function (data) {
		// io.sockets.emit('msg',{
		// 	test : 'just a test...'
		// });
		if(!playerGrp[data.roomkey]){
			var sRoomKey = data.roomkey;
			playerGrp[sRoomKey] = {};
			playerGrp[sRoomKey].playerCount = 1;
			playerGrp[sRoomKey].playerData = [{
				name : data.name,
				color : color[colorIndex++],
				bodyData : [[36,30], [33,30], [30,30]]
			}];
			socket.emit('msg',{
				signal : 'wait',
				content : 'you are the first player,please wait for another one'
			});

			socreGrp[sRoomKey] = {};
			socreGrp[sRoomKey][data.name] = 0;
		}else{
			var sRoomKey = data.roomkey;
			playerGrp[sRoomKey].playerCount ++;
			playerGrp[sRoomKey].playerData.push({
				name : data.name,
				color : color[colorIndex++],
				bodyData : [[66,60],[63,60],[60,60]]
			});
			io.sockets.emit('msg',{
				signal : 'ready',
				content : 'ready to play game',
				playerData : playerGrp[sRoomKey].playerData,
				randomFood : Math.random()
			});

			socreGrp[sRoomKey][data.name] = 0;
		}

	});

	socket.on('changeDirection', function(data){
		io.sockets.emit('msg',{
			signal : 'changeDirection',
			content : 'someone changeDirection',
			playerMsg : data
		});
	});

	socket.on('foodeated', function(data){
		socreGrp[data.grp][data.player] ++;
		io.sockets.emit('msg',{
			signal : 'foodeated',
			randomFood : Math.random()
		})
	});

	socket.on('gameover', function(data){
		io.sockets.emit('msg',{
			signal : 'gameover',
			playername : data.playername
		})
	})
});