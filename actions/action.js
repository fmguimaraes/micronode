"use strict"
var M2Object = require('../M2Object.js');

class Action extends M2Object {
    constructor(app) {
        super(app)
        this.eventEmitter = app.eventEmitter;
        this.socket = app.socket;
    }
};

module.exports = Action;