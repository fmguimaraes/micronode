var io = require('socket.io');
var path = require("path");

class Socket {
    constructor(node) {
        this.socketIO = null;
        this.node = node;
        this.signature = '[Socket]';
    }

    init() {
        this.socketIO = io(this.node.httpServer.server);
        console.log('[SOCKET] initialized');
        this.socketIO.on('connection', this.onConnected.bind(this));
        this.socketIO.on('event', this.onEvent.bind(this));
        this.socketIO.on('disconnect', this.onDisconnect.bind(this));
    }

    onConnected(socket) {
        console.log('connected');
        this.broadcast('log',{message:"welcome!"});
    }

    onEvent(data) {
        console.log('event', data);
    }

    onDisconnect() {
        console.log('disconneted');
    }

    send(message, userId, data) {
        if (self.clientMap.hasOwnProperty(userId)) {
            var sessionId = self.clientMap[userId].session;
            if (self.clients.hasOwnProperty(sessionId)) {
                var socket = self.clients[sessionId];
                socket.emit(message, data);
            }
        }

        if (message != "message") {
            //    self.send("message", userId, data);
        }
    };

    broadcast(message, data) {
        console.log('[SOCKET]', message, data);
        this.socketIO.emit(message, data);
    };
};

module.exports = Socket;
