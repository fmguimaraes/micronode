"use strict"

var UsersAction = require('./users.js');

class Actions {
  constructor(app) {
    this.user = new UsersAction(app);
  }
};

module.exports = Actions;