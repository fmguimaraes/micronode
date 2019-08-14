"use strict"
var M2Object = require('../M2Object.js');
var path = require('path');
class Router extends M2Object {
  constructor(server) {
    super(server);
    this.router = server.httpServer.createRouter();
    this.model = null;
    this.result = null;
    this.response = null;
    this.upload = false;
    this.auth = server.auth;
  }

  initialize(httpServer) {
    let self = this;
    this.routes.forEach(function (routerInfo, index, array) {

      self.processRoute(routerInfo, self, 'get');
      self.processRoute(routerInfo, self, 'post');
      self.processRoute(routerInfo, self, 'put');
      self.processRoute(routerInfo, self, 'delete');
      self.processRoute(routerInfo, self, 'use');

      httpServer.use(self.router, routerInfo);
    });
  }

  processRoute(routerInfo, self, method) {
    let isTokenRequired = !!routerInfo.tokenRequired ? self.auth.tokenRequired : (req, res, next) => { next() };

    if (!!routerInfo[method]) {
      console.log('[Router]', method, routerInfo.path);

      if(method === "use") {
        self.router.use(routerInfo.path, routerInfo[method]);
        self.router.route(routerInfo.path)[routerInfo.callBackFunctionType](
          isTokenRequired.bind(self.auth),
          routerInfo.callBackFunction
        );
      } else {
        self.router.route(routerInfo.path)[method](isTokenRequired.bind(self.auth), function (req, res, next) {
          routerInfo[method](req, res, next);
        });
      }
      
    }
  }

  createRouters() {
    return [];
  }

  async create(req, res) {
    this.model.create(req.body)
      .then(result => {
        console.log("Router Create Success.", result);
        res.send(result);
      }, reason => {
        console.log("Router Create Error", reason);
        res.send(reason);
      });
  }

  read(req, res) {
    let query = Object.keys(req.params).length != 0 ? req.params : req.query;
    query = this.model.createQuery(query);

    this.model.read(query)
      .then(result => {
        console.log("Router GET Success", result.length);
        res.send(result);
      }, reason => {
        console.log("Router GET Error - Router", reason);
        res.send(result);
      });
  }

  update(req, res) {
    var query = this.model.createQuery(req.params);
    console.log(query);
    this.model.update(query, req.body)
      .then(result => {
        console.log("Router Update Success", result);
        res.send(result);
      }, reason => {
        console.log("Router Update Error", reason);
        res.send(reason);
      });
  }

  async delete(req, res) {
    let user, reason, result, code;
    let query = { _id: req.body._id }

    try {
      result = await this.model.delete(query);
      code = !!result ? 200 : 404
      result = !!result ? result : RESPONSES.UNKNOW_USER
    } catch (err) {
      reason = err
      code = 500
    }

    res.status(code).send(result)
  }
};

module.exports = Router;
