"use strict"
var M2Object = require('../M2Object.js');

var Auth = require('../auth/AuthController')

class Router extends M2Object {
  constructor(app) {
    super(app);
    this.router = app.httpServer.createRouter();
    this.model = null;
    this.result = null;
    this.response = null;
    this.auth = Auth;

    this.init();
    this.configureRest();
  }
  init() {
    this.routers = [];
  }

  configureRest() {
    let self = this;
    this.routers.forEach(function (routerInfo, index, array) {

      console.log('[Router] configureRest /' + routerInfo.path);

      self.processRouter(routerInfo, self, 'get');
      self.processRouter(routerInfo, self, 'post');
      self.processRouter(routerInfo, self, 'put');
      self.processRouter(routerInfo, self, 'delete');
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

  create(req, res) {
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

  delete(req, res) {
    req.params = this.model.createQuery(req.body);
    this.model.delete(req.params)
      .then(result => {
        console.log("Router Delete Success", result);
        res.send(result);
        return new Promise(function (resolve, reject) {
          resolve({ message: "ok" });
        });
      }, reason => {
        console.log("Router Delete Error");
        res.send(reason);
      });
  }
};

module.exports = Router;
