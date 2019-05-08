"use strict"

var Model = require('./model.js');

class File extends Model {
  constructor() {
    super();
    this.collection = 'files';

    this.schema = {
      file: String,
      resultId: String,
      error: String,
      meta: String,
    };
  }
};

module.exports = Users;
