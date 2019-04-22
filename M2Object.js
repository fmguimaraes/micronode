"use strict"

class M2Object {
  constructor (app) {
    this.app = app;
    if(!!app) {
      this.socket = app.socket;
      this.eventEmitter = app.eventEmitter;
    }
  }
};

module.exports = M2Object;
