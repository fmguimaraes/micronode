"use strict"

let Model = require('@fmguimaraes/micronode').Model;

class Dummy extends Model {
  constructor() {
    super();
    this.collection = 'dummy';

    this.schema = {
      name: String,
    };
  }
};

module.exports = Dummy;
