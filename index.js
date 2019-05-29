"use strict"
const Errors = require('./constants/errors')
let HTTPServer = require('./utils/httpServer.js');
let RESTFacade = require('./routes/restFacade.js');
let Socket = require('./utils/socket.js');
let EventDispatcher = require('./utils/EventDispatcher.js');
let Log = require('./utils/Log.js');

const isValidInput = (settings, actions, routes) => {
    if (!settings) {
        throw Errors.INVALID_SETTINGS;
    } else if (!actions) {
        throw Errors.INVALID_ACTIONS;
    } else if (!routes) {
        throw Errors.INVALID_ROUTES;
    }

    return true;
}

module.exports = function micronode(settings, actions, routes) {

    if (isValidInput(settings, actions, routes)) {
        this.routes = routes;
        this.actions = actions;
        this.settings =  settings;
        
        this.socket = new Socket(this);
        this.httpServer = new HTTPServer(this);
        this.log = new Log(this);
        this.eventEmitter = new EventDispatcher(this);

        this.rest = new RESTFacade(this);

        this.httpServer.start();
    }

};