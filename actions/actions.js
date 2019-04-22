"use strict"

var UserAction = require('./user.action.js');

class Actions {
  constructor(app) {
    this.user = new UserAction(app);
  }
};

module.exports = Actions;