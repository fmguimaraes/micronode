"use strict"

var Model = require('./model.js');

class Users extends Model {
  constructor() {
    super();
    this.collection = 'users';

    this.schema = {
      login: String,
      password: String,
      token: String,
      profile: Object,
    };
  }
};

module.exports = Users;
