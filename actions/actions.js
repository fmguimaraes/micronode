"use strict"

var UserActions = require('./user.actions.js');
var ServiceLevelActions = require('../../actions/actions');
class Actions {
  constructor(app) {
    this.serviceActions = new ServiceLevelActions(app);
    this.user = new UserActions(app);
  }
};

module.exports = Actions;