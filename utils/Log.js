"use strict"
var io = require('socket.io-client');
class Log {
    constructor(app) {
        this.settings = app.settings;
        this.app = app;
    }
    onSocketConnected() {
        this.debug('connected to log server')
    }

    debug(message, data = {}) {
        this.log('log', { level: 0, producer: this.settings.Server.name, message: message, ...data });
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
        if (!!this.app.socket) {
            this.app.socket.emit(event, data);
        }

    }
}

module.exports = Log;
