var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var users = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket, options){
  var username = "";
  if (options.username) {
    io.emit('new user', options.username);
    username = options.username;
  } else {
    io.emit('new user', 'User #' + (++users));
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
