"use strict"
class RestFacade {
  constructor(node) {
    this.node = node;
    this.httpServer = node.httpServer;
    this.routes = node.routes;
    console.log('RestFacade.constructor');

    this.routes.list.forEach((router) => {
      router.initialize(this.httpServer);
    });
  }
}


module.exports = RestFacade;
