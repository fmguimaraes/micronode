"use strict"
var os = require('os');
var ifaces = os.networkInterfaces();

class SystemProperties {
  constructor() {
    this.workflowStatus = {
      IDLE: 0,
      STARTED: 1,
      IN_PROGRESS: 2,
      ERROR: 3,
      REPORT_AVAILABLE: 4
    }; 
    this.analysisStatus = {
      IDLE: 0,
      STARTED: 1,
      IN_PROGRESS: 2,
      ERROR: 3,
      ENDED: 4
    }; 
    this.HOST = 'localhost';
    this.DATABASE = "haliodx"
    this.MONGO_URL = this.HOST + ':27017/';
    this.USERDB =  "gateKeeper";
    this.PASSWORD_DB  = "16c81a6c4ebcd09151720a4285dd74a5";

    this.LAMBDA_URL = 'localhost';
    this.LAMBDA_PORT = '8081';
    this.LAMBDA_PATH = '/lambda';

    this.API_URL = 'localhost';
    this.API_PORT = '8080';
  }

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
};

module.exports = new SystemProperties();
