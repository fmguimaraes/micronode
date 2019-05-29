"use strict"

let Dummy = require('./dummy');

class Routes {
  constructor(node) {
    this.list = [];
    this.list.push(new Dummy(node));
  }
}

module.exports = Routes;