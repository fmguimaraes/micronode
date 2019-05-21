var ioserver = require('socket.io');
var middleware = require('socketio-wildcard')();
var M2Object = require('../M2Object.js');
var Settings = require('../../settings');
var io = require('socket.io-client');
class Socket extends M2Object {
    constructor(app) {
        super(app)
        this.signature = '[Socket]';
        this.socketMap = {};
        this.lazyInitializationCallbacks = [];
        this.lazyBroadcast = [];
    }

    init() {
        if (Settings.Server.messageBroker) {
            this.startServer();
        } else {
            this.startClient();
        }

        for (var event in this.lazyInitializationCallbacks) {
            this.socket.on(event, this.lazyInitializationCallbacks[event]);
        }


    }

    startServer() {
        this.socket = ioserver(this.httpServer.server);

        this.socket.use(middleware);
        this.socket.on('connection', this.onConnected.bind(this));
        this.socket.on('disconnect', this.onDisconnect.bind(this));

        console.log('socket server initialized');
    }

    startClient() {
        console.log(Settings.Server.name, 'start client');
        this.socket = io(Settings.Servers.messageBroker);
        this.socket.on('connect', this.onSocketConnected.bind(this));

        for (var event in this.lazyBroadcast) {
            this.socket.emit(event, this.lazyBroadcast[event]);
        }
    }

    onSocketConnected() {
        console.debug('service connected to message broker server')
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
        socket.emit('log', { message: "welcome!" });
        let self = this;
        this.setupBasicListeners(socket, self);
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

    on(event, callback) {
        if (!this.socket) {
            this.lazyInitializationCallbacks[event] = callback;

        } else {
            this.socket.on(event, callback);
        }
    }

    broadcast(message, data) {
        if (!this.socket) {
            this.lazyBroadcast[message] = data;

        } else {
            console.log('[SOCKET][BROADCAST]', message, data);
            this.socket.emit(message, data);
        }
    };
};

module.exports = Socket;
