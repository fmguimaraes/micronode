"use strict"
var Router = require('./router.js');
var UserModel = require('../models/user.model.js');

class Users extends Router {
  constructor(node) {
    super(node);
  }

  init() {
    this.model = new UserModel();

    this.routers = [
      { path: "users/authenticate", post: this.authenticate.bind(this), tokenRequired: false },
      { path: "users/forgot", post: this.forgot.bind(this), tokenRequired: false },
      { path: "users/signout/:id", get: this.signout.bind(this), tokenRequired: true },
      { path: "users/:id", put: this.update.bind(this), tokenRequired: true },
      { path: "users/:id", delete: this.delete.bind(this), tokenRequired: true },
      { path: "users/:query", get: this.read.bind(this), tokenRequired: false },
      { path: "users/", post: this.create.bind(this), tokenRequired: false },
    ];
  }

  forgot(req, res) {
    res.status(200).send({message:"message successfully sent", login: req.body.login})
  }

  create(req, res) {
    this.eventEmitter.emit('users.create', req, res);
  }

  read(req, res) {
    this.eventEmitter.emit('users.read', req, res);
  }

  signout(req, res) {
    this.eventEmitter.emit('users.signout', req, res);
  }

  authenticate(req, res) {
    this.eventEmitter.emit('users.authenticate', req, res);
  }

  update(req, res) {
    this.eventEmitter.emit('users.update', req, res);
  }

  delete(req, res) {
    this.eventEmitter.emit('users.delete', req, res);
  }
};

module.exports = Users;
