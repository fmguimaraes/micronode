"use strict"

var SomeModelRouter = require('./example_router.js');

class Routes {
  constructor(node) {
    this.list = [];
    this.list.push(new SomeModelRouter(node));
  }
}


module.exports = Routes;