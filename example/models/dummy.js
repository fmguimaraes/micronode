"use strict"
let Model = require('@fmguimaraes/micronode').Model;

class DummyModel extends Model {
  constructor(server) {
    super(server);
    this.collection = 'DummyModel';
    this.schema = {
      firstName: String, 
      lastName:String,
      timestamp: String,
    };
  }
};

module.exports = DummyModel;
