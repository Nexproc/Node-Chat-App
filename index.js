var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var users = 0;

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  socket.username = "hacker";
  socket.room = "-1";
  socket.join(socket.room);

  // get user inf
  socket.emit('user info request');
  socket.on('user info response', function (uname, team_id) {
    socket.username = uname;
    if(team_id) socket.room = team_id;
    socket.join(socket.room);
    socket.broadcast.to(socket.room).emit('new user');
    socket.emit('udpate room', socket.room);
  });

  socket.on('switch team', function (team_id) {
    socket.leave(socket.room);
    socket.room = team_id;
    socket.join(socket.room);
    socket.emit('udpate room', socket.room);
  });

  socket.on('chat message', function (msg) {
    if(msg) {
      var message = socket.username + ": " + msg;
      socket.broadcast.to(socket.room).emit('chat message', message);
    }
  });

  socket.on('disconnect', function () {
    // socket.broadcast.to(socket.room).emit('disconnect', socket.username + " has disconnected.");
    socket.leave(socket.room);
  });
});

server.listen(port, function(){
  console.log('listening on *:' + port);
});
