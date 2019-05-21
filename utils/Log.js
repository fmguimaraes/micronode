"use strict"
var Settings = require('../../settings');
var io = require('socket.io-client');
class Log {
    constructor(app) {
        this.socket = io(Settings.Servers.messageBroker);
        this.socket.on('connect', this.onSocketConnected.bind(this));
    }

    onSocketConnected() {
        this.debug('connected to log server')
    }

    debug(message, data = {}) {
        this.log('log', { level: 0, producer: Settings.Server.name, message: message, ...data });
    }

    info(message, data = {}) {
        this.log('log', { level: 1, message: message, ...data });
    }

    warn(message, data = {}) {
        this.log('log', { level: 2, message: message, ...data });
    }

    error(message, data = {}) {
        this.log('log', { level: 3, message: message, ...data });
    }

    log(event, data) {
        this.socket.emit(event, data);
    }

}

module.exports = Log;
