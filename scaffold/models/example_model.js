"use strict"

var Model = require('../base-service/models/model.js');

class SomeModel extends Model {
  constructor() {
    super();
    this.collection = 'someModelCollection';

    this.schema = {
      firstName: String, 
      lastName:String,
      timestamp: String,
    };
  }
};

module.exports = SomeModel;
