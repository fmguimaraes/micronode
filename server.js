"use strict"

const HTTPServer = require('./utils/httpServer');
const RESTFacade = require('./routes/restFacade');
const Socket = require('./utils/socket.js');
const EventDispatcher = require('./utils/EventDispatcher');
const Log = require('./utils/Log.js');
const Auth = require('./auth/auth');
const Errors = require('./constants/errors');
const Docker = require('dockerode');

class Server {
    constructor(settings, permissions) {
        if (!settings) {
            throw Errors.INVALID_SETTINGS;
        }
        if (!permissions) {
            throw Errors.INVALID_PERMISSIONS;
        }

        this.settings = settings;
        this.docker = new Docker({ socketPath: this.settings.Servers.docker});
        this.auth = new Auth(settings, permissions);
        this.socket = new Socket(this);
        this.httpServer = new HTTPServer(this);
        this.log = new Log(this);
        this.eventEmitter = new EventDispatcher(this);
    }

    isValidInput(actions, routes) {
        if (!actions) {
            throw Errors.INVALID_ACTIONS;
        } else if (!routes) {
            throw Errors.INVALID_ROUTES;
        }

        return true;
    }

    init(actions, routes) {
        if (this.isValidInput(actions, routes)) {
            this.routes = routes;
            this.actions = actions;

            this.rest = new RESTFacade(this);

            this.httpServer.start();
        }
    }
}

module.exports = Server;