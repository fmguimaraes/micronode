var io = require('socket.io');
var path = require("path");
var M2Object = require('../M2Object.js');
class Socket extends M2Object {
    constructor(app) {
        super(app)
        this.socket = null;
        this.signature = '[Socket]';
        this.socketMap = {};
    }

    init() {
        let self = this;
        this.socket = io(this.httpServer.server);
        console.log('[SOCKET] initialized');
        this.socket.on('connection', this.onConnected.bind(self));
        this.socket.on('disconnect', this.onDisconnect.bind(this));
    }
    setupBasicListeners(socket) {

        socket.on("log.debug",function(event,data) {
            console.log(event);
            console.log(data);
        });

    }

    onConnected(socket) {
        console.log(socket.id, 'connected');
        this.socketMap[socket.id] = socket;
        this.setupBasicListeners(socket);
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
        this.socket.emit(message, data);
    };
};

module.exports = Socket;
