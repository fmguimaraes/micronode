"use strict"
var Settings = require('../../settings');
var io = require('socket.io-client');
class Log {
    constructor(app) {
        this.socket = io(Settings.MessageBrokerServer);
        this.socket.on('connect', this.onSocketConnected.bind(this));
    }

    onSocketConnected() {
        this.debug('connected to log server')
    }
    info(message, data = {}) {
        this.log('log.info', { message: message, ...data });
    }

    warn(message, data = {}) {
        this.log('log.warn', { message: message, ...data });
    }

    error(message, data = {}) {
        this.log('log.error', { message: message, ...data });
    }

    debug(message, data = {}) {
        this.log('log.debug', { producer: Settings.Server.name, message: message, ...data });
    }

    log(event, data) {
        console.log(event, data);
        this.socket.emit(event, data);
    }

}

module.exports = Log;
