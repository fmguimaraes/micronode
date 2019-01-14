"use strict"
let HTTPServer = require('./utils/httpServer.js');
let RESTFacade = require('./routers/restFacade.js');
let Socket = require('./utils/socket.js');
let Actions = require('./actions/actions.js');
let Events = require('events');

class ApplicationService {
  constructor() {
    this.httpServer = new HTTPServer();
    this.socket = Socket();
    this.eventEmitter = new Events.EventEmitter();

    this.rest =  new RESTFacade(this);
    this.actions =  new Actions(this);

    this.httpServer.start(); 
    this.socket.init(this);
  }
}

let application = new ApplicationService();

