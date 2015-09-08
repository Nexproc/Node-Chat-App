var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var users = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  var username = "";
  if (arguments[0].username) {
    io.emit('new user', arguments[0].username);
    username = arguments[0].username;
  } else {
    io.emit('new user', arguments);
    username = "User " + users;
  }
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    var message = username + ": " + msg;
    pastMessages.push(msg);
    msg && msg !== "" && io.emit('chat message', message);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

server.listen(port, function(){
  console.log('listening on *:' + port);
});