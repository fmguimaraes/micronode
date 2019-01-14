var IO = require('socket.io');
var path = require("path");

var Socket = function() {
	var self = {};
	self.socketIO = null;
	self.signature = '[Socket]';
    self.clientMap = {};
    self.clients = {};

 	self.init =  function(node) { 
 		var httpServer =  node.httpServer;
		self.socketIO = IO(httpServer.http).listen(httpServer.server);
		self.socketIO.on('connection', self.userConnected);
        console.log('[SOCKET] initialized');
 	} 

    self.userConnected = function(socket) {
        self.attachListeners(socket);
        self.clients[socket.id] = socket;
        console.log('[SOCKET] user connected', socket.id);
    }

 	self.attachListeners =  function(socket) {
        socket.on('[SOCKET] register-user', self.registerUser);
 	};

    self.registerUser = function(data) {
        /*
        console.log('registering user: ' + data.userId, ' session:', data.session);
        self.clientMap[data.userId] = {};
        self.clientMap[data.userId].session = data.session;

        var socket = self.clients[data.session];
        socket.emit('server message', 'welcome ' +  data.userId + '!');
        */
    };

    self.send = function(message, userId, data){
       if( self.clientMap.hasOwnProperty(userId)) {
            var sessionId = self.clientMap[userId].session;
            if(self.clients.hasOwnProperty(sessionId)) {
                var socket = self.clients[sessionId];
                socket.emit(message, data);
            }
        }

        if(message != "message") {
         //    self.send("message", userId, data);
        }
    };

    self.broadcast = function(message, data){
        console.log('[SOCKET]', message, data);
        self.socketIO.emit(message, data);
    };

 	self.start =  function() { }

  return {
  	init : self.init,
  	start : self.start,
  	broadcast: self.broadcast,
    send : self.send,
  };
};

module.exports = Socket;
