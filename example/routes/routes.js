"use strict"

let Dummy = require('./dummy');

class Routes {
  constructor(server) {
    this.list = [];
    this.list.push(new Dummy(server));
  }
}

module.exports = Routes;