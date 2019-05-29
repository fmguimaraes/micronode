"use strict"

var DummyModel = require('../models/model.js');

class DummyModel extends Model {
  constructor() {
    super();
    this.collection = 'DummyModel';
    this.schema = {
      firstName: String, 
      lastName:String,
      timestamp: String,
    };
  }
};

module.exports = DummyModel;
