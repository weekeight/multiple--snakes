var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , path = require('path');

app.use(express.static('public-v2'));
server.listen(80);

app.get('/', function (req, res) {
	var indexPath = path.resolve('/index.html');
	res.sendfile(indexPath);
});


var allPlayerNum = 0,
	color = 1,
	playerGrp = {};  //游戏群组列表

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
				color : '#'+color+color+color
			}];

			socket.emit('msg',{
				signal : 'wait',
				content : 'you are the first player,please wait for another one'
			});
		}else{
			io.sockets.emit('msg',{
				signal : 'ready',
				content : 'ready to play game'
			});
		}
	});
});