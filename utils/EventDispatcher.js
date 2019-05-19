"use strict"

let Events = require('events');

class EventDispatcher {
    constructor(app) {
        this.socket = app.socket;
        this.eventEmitter = new Events.EventEmitter();
    };

    emit(event, arg1, arg2, arg3) {
        this.eventEmitter.emit(event, arg1, arg2, arg3);
    }

    on(event, listener) {
        this.eventEmitter.on(event, listener);
    }
}

module.exports = EventDispatcher;