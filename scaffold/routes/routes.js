"use strict"

var Upload = require('./upload.js');

class Routes {
  constructor(node) {
    this.list = [];
    this.list.push(new Upload(node));
  }
}


module.exports = Routes;