"use strict"
let Micronode = require('@fmguimaraes/micronode').Server;

const Actions = require('./actions/actions');
const Routes = require('./routes/routes');
const Settings = require('./settings');
class MicroServiceExample {
  constructor() { 
    let uService = new Micronode(Settings);

    let routes = new Routes(uService);
    let actions  = new Actions(uService); 

    uService.init(actions, routes);
  }
}
 
let exampleService = new MicroServiceExample();