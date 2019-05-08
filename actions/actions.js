"use strict"

var UserActions = require('./user.actions.js');

class Actions {
  constructor(app) {
    this.user = new UserActions(app);
  }
};

module.exports = Actions;