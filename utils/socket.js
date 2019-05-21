var ioserver = require('socket.io');
var middleware = require('socketio-wildcard')();
var M2Object = require('../M2Object.js');
var Settings = require('../../settings');
var io = require('socket.io-client');
class Socket extends M2Object {
    constructor(app) {
        super(app)
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
            this.emit(event, this.lazyBroadcast[event]);
        }
    }

    onSocketConnected() {
        console.debug('service connected to message broker server')
    }


    onConnected(socket) {
        console.log(socket.id, 'connected');
        this.socketMap[socket.id] = socket;
        let self = this;

        socket.on('*', function (packet) {
            let event = packet.data[0];
            let data = packet.data[1];
            console.log(event, 'received from', data.producer);
            self.emit(event, data);
            self.eventEmitter.emit(event, data);
        });

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

    emit(message, data) {
        if(!!this.socket) {
            console.log('[SOCKET][EMIT]', message, data);

            if (!data.producer) {
                data.producer = Settings.Server.name;
            }
            
            this.socket.emit(message, data);
        } else {
            this.lazyBroadcast[message] = data;
        }
    };
};

module.exports = Socket;
