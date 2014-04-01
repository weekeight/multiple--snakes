var express = require('express'),
	app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    path = require("path");
app.use(express.static('public'));
server.listen(80);

app.get('/', function (req, res) {
	var tmpPath = path.resolve("/index.html");
	console.log(tmpPath);
  res.sendfile(tmpPath);
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});