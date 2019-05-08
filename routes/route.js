"use strict"
var M2Object = require('../M2Object.js');
var Auth = require('../auth/AuthController')

class Router extends M2Object {
  constructor(node) {
    super(node);
    this.callbackMap = []
    this.router = node.httpServer.createRouter();
    this.model = null;
    this.result = null;
    this.response = null;
    this.upload = false;
    this.auth = Auth;

    this.init();
  }

  configureRest() {
    let self = this;
    this.routes.forEach(function (routerInfo, index, array) {
      let router = node.httpServer.createRouter();
      console.log('[Router] configureRest /' + routerInfo.path);

      self.processRouter(routerInfo, self, 'get');
      self.processRouter(routerInfo, self, 'post');
      self.processRouter(routerInfo, self, 'put');
      self.processRouter(routerInfo, self, 'delete');


    });
  }

  initialize(httpServer) {
    let self = this;
    this.routes.forEach(function (routerInfo, index, array) {
      let router = httpServer.createRouter();
      console.log('[Router] configureRest /' + routerInfo.path);

      self.processRouter(routerInfo, self, 'get');
      self.processRouter(routerInfo, self, 'post');
      self.processRouter(routerInfo, self, 'put');
      self.processRouter(routerInfo, self, 'delete');

      httpServer.use(router, routerInfo);

    });
  }

  processRouter(routerInfo, self, method) {
    let isTokenRequired = !!routerInfo.tokenRequired ? self.auth.tokenRequired : (req, res, next) => { next() };

    if (!!routerInfo[method]) {
      self.router.route('/' + routerInfo.path)[method]

        (isTokenRequired, function (req, res) {
          routerInfo[method](req, res);
        });
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
