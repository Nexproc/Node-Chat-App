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

  // get user info
  socket.emit('user info request');
  socket.on('user info response', function (uname, team_id) {
    socket.username = uname;
    if(team_id) {
      socket.leave(socket.room);
      socket.room = team_id;
      socket.join(socket.room);
    }
    socket.broadcast.in(socket.room).emit('new user', socket.username);
    socket.emit('update room', socket.room);
  });

  socket.on('switch team', function (teamid, teamName) {
    socket.leave(socket.room);
    socket.room = teamid;
    socket.join(socket.room);
    socket.emit('update room', socket.room, teamName);
  });

  socket.on('chat message', function (msg) {
    if(msg) {
      var message = socket.username + ": " + msg;
      socket.broadcast.in(socket.room).emit('chat message', message);
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
