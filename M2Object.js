"use strict"

class M2Object {
  constructor (app) {
    this.app = app;
    if(!!app) {
      this.docker = app.docker;
      this.log = app.log;
      this.socket = app.socket;
      this.httpServer = app.httpServer;
      this.eventEmitter = app.eventEmitter;
    }
  }
};

module.exports = M2Object;
