"use strict"
var Routes = require('../../routes/routes.js');


class RestFacade {
  constructor(node) {
    this.node = node;
    this.httpServer = node.httpServer;
    this.routes = new Routes(node);
    console.log('RestFacade.constructor');

    this.routes.list.forEach((router) => {
      router.initialize(this.httpServer);
    });
  }
}


module.exports = RestFacade;
