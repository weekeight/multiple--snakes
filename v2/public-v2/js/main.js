

KISSY.use("node,io", function(S, Node, Io){
	var $ = Node.all;

	$('#sendInfo').on('click', function(ev){
		var sName = $('#name').val(),
			sRoomKey = $('#key').val();

		//连接服务器开启websocket
		var socket = io.connect("http://10.68.200.98");

		socket.emit('register', {
			name : sName,
			roomkey : sRoomKey
		});
		socket.on("msg",function(data){
			switch(data.signal){
				case 'wait' :
					$("#main").append(data.content);
					break;
				case 'ready' :
					console.log(data.content);
					break;
			}
		})

	})
})