"use strict"

let Dummy = require('./dummy');
let Upload = require('./upload');

class Routes {
  constructor(server) {
    this.list = [];
    this.list.push(new Dummy(server));
    this.list.push(new Upload(server));
  }
}

module.exports = Routes;