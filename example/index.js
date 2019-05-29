"use strict"
let MicroNode = require('@fmguimaraes/micronode');
const Settings = require('./settings');
const Actions = require('./actions/actions');
const Routes = require('./routes/routes');

class MicroServiceExample {
  constructor() { 
    let routes = new Routes();
    let actions  = new Actions(); 

    this.uService = new MicroNode(Settings, actions, routes);
  }
}
 
let exampleService = new MicroServiceExample();