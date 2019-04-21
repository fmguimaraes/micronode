"use strict"

var Model = require('../crud-service/models/model.js');

class Result extends Model {
  constructor() {
    super();
    this.collection = 'results';

    this.schema = {
      date: Date,
      userId: String, 
      laboratory:String,
      demandingDoctor: String,
      responsibleDoctor:String,
      public: Boolean,
      timestamp: String,
      typeId: String,
      parameters: Object,
    };
  }
};

module.exports = Result;
