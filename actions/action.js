"use strict"

class Action {
    constructor(app) {
        this.eventEmitter = app.eventEmitter;
    }
};

module.exports = Action;