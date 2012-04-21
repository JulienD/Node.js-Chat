/**
 * Module dependencies.
 */

var express = require('express')
  , chat    = require('./routes/chat');

var app = module.exports = express.createServer();

// Configuration
// ------

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// Routes
// ------

app.get('/', chat.home);

app.post('/', chat.home_post_handler);

app.get('/chat', chat.chat);

app.get('/logout', chat.logout);


// Socket.io
// ------

var messages = new Array();
messages.push({'nickname' : 'a', 'text' : 'a' });
messages.push({'nickname' : 'b', 'text' : 'b' });

var io = require('socket.io');
io = io.listen(app);
io.sockets.on('connection', function (socket) {

  socket.emit('getChatMessage', messages);

  socket.on('sendMessage', function (data) {
    console.log('sendMessage');
    messages.push(data);
    socket.broadcast.emit('updateChatMessage', data);
  });

  socket.on('sendAnnouncement', function (a) {
    console.log('sendAnnouncement');
    socket.broadcast.emit('announcement', a);
    socket.broadcast.emit('connected', socket.id);
  });

});

// The application is listening on port 3000.
app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);