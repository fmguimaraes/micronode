"use strict"

var Route = require('../base-service/routes/route.js');
var UploadServer = require('../base-service/utils/uploadServer.js');

const path = require('path');
const fs = require('fs');

class Upload extends Route {
    constructor(node) {
        super(node);
    }

    init() {
        this.routes = [
            { path: "upload/", onUploaded: this.onUploaded.bind(this), tokenRequired: false },
        ];
    }

    onUploaded(res) {
       console.log(res);
    }
};

module.exports = Upload;
