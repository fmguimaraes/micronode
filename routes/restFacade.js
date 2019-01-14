"use strict"
var Routes = require('../../routes/routes.js');


class RestFacade {
  constructor(node) {
    this.node = node;
    this.httpServer = node.httpServer;
    this.routes = new Routes(node);

    for(let name in this.routes.list) {
        this.httpServer.use(this.routes.list[name].router);
    }

    console.log('RestFacade.constructor');
  }
}


module.exports = RestFacade;
