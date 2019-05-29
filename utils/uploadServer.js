'use strict';

const path = require('path');
const assert = require('assert');
const express = require('express');

var atob = require('atob');
const Server = require('../tus-node-server/index').Server;
const FileStore = require('../tus-node-server/index').FileStore;
const GCSDataStore = require('../tus-node-server/index').GCSDataStore;
const S3Store = require('../tus-node-server/index').S3Store;
const EVENTS = require('../tus-node-server/index').EVENTS;


const data_store = process.env.DATA_STORE || 'FileStore';
const server = new Server();


class UploadServer {
    constructor(httpServer, settings) {
        this.settings = settings;
        this.callbackMap = {};
        this.initDataStore();

        this.uploadApp = express();
        this.uploadApp.all('*', server.handle.bind(server));

    }

    static parseUploadMetadata(event) {
        let list = event.split(',');
        let decodedObject = {};

        list.forEach((token, index) => {
            let list = token.split(' ');
            let value = !!list[1] ?  atob(list[1]) : null;
 
            decodedObject[list[0]] = value;
        });

        return  decodedObject;
    };

    use(router, routerInfo, app) {
        app.use(router, [this.uploadApp]);
        server.on(EVENTS.EVENT_UPLOAD_COMPLETE, routerInfo.onUploaded);
    }

    initDataStore() {
        switch (data_store) {
            case 'GCSDataStore':
                server.datastore = new GCSDataStore({
                    path: this.settings.Folders.tmp,
                    projectId: 'vimeo-open-source',
                    keyFilename: path.resolve(__dirname, '../keyfile.json'),
                    bucket: 'tus-node-server',
                });
                break;

            case 'S3Store':
                assert.ok(process.env.AWS_ACCESS_KEY_ID, 'environment variable `AWS_ACCESS_KEY_ID` must be set');
                assert.ok(process.env.AWS_SECRET_ACCESS_KEY, 'environment variable `AWS_SECRET_ACCESS_KEY` must be set');
                assert.ok(process.env.AWS_BUCKET, 'environment variable `AWS_BUCKET` must be set');
                assert.ok(process.env.AWS_REGION, 'environment variable `AWS_REGION` must be set');

                server.datastore = new S3Store({
                    path: this.settings.Folders.tmp,
                    bucket: process.env.AWS_BUCKET,
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                    region: process.env.AWS_REGION,
                    partSize: 8 * 1024 * 1024, // each uploaded part will have ~8MB,
                });
                break;

            default:
                server.datastore = new FileStore({
                    path: this.settings.Folders.tmp,
                });
        }
    }
}


module.exports = UploadServer;