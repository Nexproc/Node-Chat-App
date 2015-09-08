var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var users = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  var username = "user";

  // get user info
  socket.emit('user info request');
  socket.on('user info response', function (response) {
    username = response;
  });

  socket.on('chat message', function(msg){
    var message = username + ": " + msg;
    pastMessages.push(msg);
    msg && msg !== "" && io.emit('chat message', message);
  });

  socket.on('disconnect', function(){
    io.emit('disconnect', username + " has disconnected.");
  });
});

server.listen(port, function(){
  console.log('listening on *:' + port);
});
