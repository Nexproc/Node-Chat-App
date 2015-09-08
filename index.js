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
  // get user info
  socket.emit('user info request');
  socket.on('user info response', function (response) {
    username = response;
    io.emit('new user', username);
  });

  socket.on('chat message', function(msg) {
    if (!msg) msg = "";
    var message = username + ": " + msg;
    // pastMessages.push(msg);
    io.emit('chat message', message);
  });

  socket.on('disconnect', function() {
    --users;
    io.emit('disconnect', username + " has disconnected.");
  });
});

server.listen(port, function(){
  console.log('listening on *:' + port);
});
