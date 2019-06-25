"use strict"

let Route = require('@fmguimaraes/micronode').Route;
let UploadUtils = require('@fmguimaraes/micronode').UploadUtils;

class Upload extends Route {
    constructor(server) {
        super(server);

        this.routes = [
            { path: "/upload", onUploaded: this.onUploaded.bind(this), tokenRequired: false },
        ];
    }

    async onUploaded(evt) {
        let metadata = await UploadUtils.parseUploadMetadata(evt);

        console.log(metadata);
    }
};

module.exports = Upload;
