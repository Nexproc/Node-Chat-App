var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var users = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  ++users;
  var username = "hacker";
  var current_team = "-1";
  // get user info
  socket.emit('user info request');
  socket.on('user info response', function (uname, team_id) {
    username = uname;
    current_team = !!team_id ? team_id : "-1";
    socket.join(current_team);
    socket.broadcast.to(current_team).emit('new user');
    socket.emit('udpate room', current_team);
  });

  socket.on('switch team', function (team_id) {
    socket.leave(current_team);
    current_team = team;
    socket.join(current_team);
    socket.emit('udpate room', current_team);
  });

  socket.on('chat message', function(msg) {
    if (!msg) msg = "";
    var message = username + ": " + msg;
    // pastMessages.push(msg);
    socket.broadcast.to(current_team).emit('chat message', message);
  });

  socket.on('disconnect', function() {
    --users;
    socket.broadcast.to(current_team).emit('disconnect', username + " has disconnected.");
  });
});

server.listen(port, function(){
  console.log('listening on *:' + port);
});
