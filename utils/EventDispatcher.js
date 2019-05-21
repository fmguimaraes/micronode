"use strict"

let Events = require('events');

class EventDispatcher {
    constructor(app) {
        this.app = app;
        this.eventEmitter = new Events.EventEmitter();
    };

    emit(event, arg1, arg2, arg3) {
        this.eventEmitter.emit(event, arg1, arg2, arg3);
    }

    on(event, listener) {
        this.app.socket.on(event, listener);
        this.eventEmitter.on(event, listener);
    }
}

module.exports = EventDispatcher;