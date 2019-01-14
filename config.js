"use strict"
var os = require('os');
var ifaces = os.networkInterfaces();

class Config {
  constructor(user, password, databaseHost, port) {
    this.host = this.getIP();

    this.port = port | 8080;
    this.mongoConnectionAddress = databaseHost |  this.host + ':27017/machtwo';
    this.user =  user | "gateKeeper";
    this.password  = password | "16c81a6c4ebcd09151720a4285dd74a5"
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
