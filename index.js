"use strict"
const Route = require('./routes/route')
const Action = require('./actions/action')
const Model = require('./models/model')
const Auth = require('./auth/auth')

const Errors = require('./constants/errors')
let HTTPServer = require('./utils/httpServer');
let RESTFacade = require('./routes/restFacade');
let Socket = require('./utils/socket.js');
let EventDispatcher = require('./utils/EventDispatcher');
let Log = require('./utils/Log.js');

const isValidInput = (actions, routes) => {
    if (!actions) {
        throw Errors.INVALID_ACTIONS;
    } else if (!routes) {
        throw Errors.INVALID_ROUTES;
    }

    return true;
}

class Server {
    init(actions, routes) {
        if (isValidInput(actions, routes)) {
            this.routes = routes;
            this.actions = actions;

            this.rest = new RESTFacade(this);

            this.httpServer.start();
        }
    }

    constructor(settings, customAuth) {
        if (!settings) {
            throw Errors.INVALID_SETTINGS;
        }
 
        this.settings = settings;
        this.auth = new Auth(settings, customAuth);
        this.socket = new Socket(this);
        this.httpServer = new HTTPServer(this);
        this.log = new Log(this);
        this.eventEmitter = new EventDispatcher(this);
    }
}
module.exports = {
    Server,
    Route,
    Model,
    Action,
    Auth,
};
