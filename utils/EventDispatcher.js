"use strict"

let Events = require('events');

class EventDispatcher {
    constructor(app) {
        this.socket = app.socket;
        this.eventEmitter = new Events.EventEmitter();
    };

    emit(event, ...args) {
        this.eventEmitter.emit(event, args);
    }

    on(event, listener) {
        this.eventEmitter.on(event, listener);
    }
}

module.exports = EventDispatcher;