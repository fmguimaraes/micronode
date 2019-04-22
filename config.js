"use strict"
var os = require('os');
var ifaces = os.networkInterfaces();
var SETTINGS = require('../setting');

class Config {
  constructor() {
    this.host = this.getIP();

    this.port =  SETTINGS.serverPort;
    this.mongoConnectionAddress = SETTINGS.databaseHost;
    this.user =  SETTINGS.user;
    this.password  = SETTINGS.password;
  };

  getIP() {
    var ifaceList = [];

    Object.keys(ifaces).forEach(function (ifname) {
      var alias = 0;
      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          return;
        }

        ifaceList.push(iface.address);
        ++alias;
      });
    });
    return ifaceList[0];
  }
}

module.exports = Config;
