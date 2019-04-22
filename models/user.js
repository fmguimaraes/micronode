"use strict"

var Model = require('./model.js');

class Users extends Model {
  constructor() {
    super();
    this.collection = 'users';

    this.schema = {
      timestamp: Date,
      login: String,
      password: String,
      token: String,
      fakeProfile: {
        name: String,
        firstName: String,
        email:String,
      },
      profile: {
        name: String,
        firstName: String,
        email:String,
      },
    };
  }
};

module.exports = Users;
