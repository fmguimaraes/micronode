"use strict"
let HTTPServer = require('./utils/httpServer.js');
let RESTFacade = require('./routes/restFacade.js');
let Socket = require('./utils/socket.js');
let Actions = require('../actions/actions.js');
let EventDispatcher = require('./utils/EventDispatcher.js');
let Log = require('./utils/Log.js');

class ApplicationService {
  constructor() {
    this.httpServer = new HTTPServer(this);
    this.log = new Log(this);
    this.eventEmitter = new EventDispatcher(this);
    this.socket = new Socket(this);

    this.rest =  new RESTFacade(this);
    this.actions =  new Actions(this);
  
    this.httpServer.start(); 
  }
}

let application = new ApplicationService();

