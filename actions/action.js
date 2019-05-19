"use strict"

class Action {
    constructor(app) {
        this.eventEmitter = app.eventEmitter;
        this.socket = app.socket;
    }
};

module.exports = Action;