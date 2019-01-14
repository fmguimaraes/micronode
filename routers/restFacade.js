"use strict"
var Users = require('./users.router.js');


class RestFacade {
  constructor(node) {
    this.node = node;
    this.httpServer = node.httpServer;
    this.list = this.initList(node);

    for(let name in this.list) {
        this.httpServer.use(this.list[name].router);
    }

    console.log('RestFacade.constructor');
  }

  initList(node) {
    let list = [];
    list.push(new Users(node));

    return list;
  }
}


module.exports = RestFacade;
