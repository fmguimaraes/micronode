"use strict"
var M2Object = require('../M2Object.js');
var FileUploader = require('../utils/FileUploader');
var Auth = require('../auth/AuthController')
var SETTINGS = require('../../setting');
class Router extends M2Object {
  constructor(app) {
    super(app);
    this.route = app.httpServer.createRouter();
    this.model = null;
    this.result = null;
    this.response = null;
    this.writeFile = null;
    this.auth = Auth;

    this.init();
    this.configureRest();
  }
  init() {
    this.routers = [];
  }

  configureRest() {
    let self = this;
    this.routers.forEach(function (routeInfo, index, array) {

      console.log('[Router] configureRest /' + routeInfo.path);

      this.processRouter(routeInfo, 'get');
      this.processRouter(routeInfo, 'post');
      this.processRouter(routeInfo, 'put');
      this.processRouter(routeInfo, 'delete');
    });
  }


  processRouter(routeInfo, method) {
    let isTokenRequired = !!routeInfo.tokenRequired ? this.auth.tokenRequired : (req, res, next) => { next() };

    if (!!routeInfo[method]) {
      this.route.route('/' + routeInfo.path)[method](isTokenRequired, function (req, res) {
        routeInfo[method](req, res);
      });
    }
  }

  createRouters() {
    return [];
  }

  async create(req, res) {
    if (SETTINGS.upload.formidable) {
      let fileUploader = new FileUploader();
      req.body = await fileUploader.start(req, res);
    }

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
