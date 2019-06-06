"use strict"
let Docker = require('dockerode');
const Settings = require('../settings');
let HTTPServer = require('./utils/httpServer.js');
let RESTFacade = require('./routes/restFacade.js');
let Socket = require('./utils/socket.js');
let Actions = require('../actions/actions.js');
let EventDispatcher = require('./utils/EventDispatcher.js');
let Log = require('./utils/Log.js');
class ApplicationService {
  constructor() {
    this.docker = new Docker({socketPath: Settings.Servers.docker || '/var/run/docker.sock'});
    this.httpServer = new HTTPServer(this);
    this.log = new Log(this);
    this.eventEmitter = new EventDispatcher(this);
    this.socket = new Socket(this);

    this.rest =  new RESTFacade(this);
    this.actions =  new Actions(this);

    this.httpServer.start(); 
  }

  getHttpServer() {
    return this.httpServer;
  }
}

let application = new ApplicationService();

module.exports = application.getHttpServer();