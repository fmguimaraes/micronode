var io = require('socket.io');
var middleware = require('socketio-wildcard')();
var M2Object = require('../M2Object.js');
var Settings = require('../../settings');
class Socket extends M2Object {
    constructor(app) {
        super(app)
        this.signature = '[Socket]';
        this.socketMap = {};
    }

    init() {
        this.socket = io(this.httpServer.server);

        this.socket.use(middleware);
        this.socket.on('connection', this.onConnected.bind(this));
        this.socket.on('disconnect', this.onDisconnect.bind(this));

        console.log('[SOCKET] initialized');
    }
    setupBasicListeners(socket, self) {
        socket.on('*', function (packet) {
            let event = packet.data[0];
            let data = packet.data[1];

            self.eventEmitter.emit(event, data);
            if (Settings.Server.messageBroker) {
                self.broadcast(event, data);
            }
        });   
    }
 
    onConnected(socket) {
        console.log(socket.id, 'connected');
        this.socketMap[socket.id] = socket;
        this.broadcast('log',{message:"welcome!"});
        let self = this;
        this.setupBasicListeners(socket, self);
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
