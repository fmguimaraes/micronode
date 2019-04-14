

var formidable = require('formidable');
var SETTINGS = require('../../setting');

class FileUploader {
    constructor() {
        let MB = 1024 * 1024;

        this.form = new formidable.IncomingForm();
        this.form.encoding = SETTINGS.upload.encoding;
        this.form.maxFileSize = 1000 * MB;
        this.form.path = SETTINGS.upload.path;
        this.form.multiples = true;
        this.form.uploadDir = SETTINGS.upload.path;
        this.form.keepExtensions = true;

        this.form.on('fileBegin', this.onFileBegin.bind(this));
        this.form.on('file', this.onFile.bind(this));
        this.form.on('progress', this.onProgress.bind(this));
        this.form.on('error', this.onError.bind(this));
    }

    onFileBegin(name, file) {
        console.log('onFileBegin:', name);
        file.path = SETTINGS.upload.path + file.name;
    }

    onFile(name, file) {
        console.log('onFile:', file.name);
    }

    onProgress(bytesReceived, bytesExpected) {
        console.log('onProgress: received:', bytesReceived, ' expected:', bytesExpected);
    }

    onError(err) {
        console.log('oError:', err);
    }

    async parseAndUpload(req, res) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.form.parse(req, (err, fields, files) => {
                resolve({ ...fields, ...files});
            });
        });
    }

    isUploadForm(req) {
        return  Object.keys(req.body).length === 0;
    }

    async start(req, res) {
        let isUpload = this.isUploadForm(req);

        if (isUpload) {
            let body = await this.parseAndUpload(req, res);
            req.body = body;
        }

        return req;
    }
}

module.exports = FileUploader;