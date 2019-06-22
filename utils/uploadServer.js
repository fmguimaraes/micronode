'use strict';

const path = require('path');
const assert = require('assert');
const express = require('express');
const atob = require('atob');
const tus = require('tus-node-server');
const data_store = 'FileStore';
const EVENTS = require('tus-node-server').EVENTS;

const server = new tus.Server();
class UploadServer {
    constructor(settings) {
        this.settings = settings;
        this.callbacks = []
        this.initDataStore();

        this.uploadApp = express();
        this.uploadApp.all('*', server.handle.bind(server));

    }

    static decodeObject(event) {
        let list = event.split(',');
        let decodedObject = {};

        list.forEach((token, index) => {
            let list = token.split(' ');
            let value = !!list[1] ? atob(list[1]) : null;

            decodedObject[list[0]] = value;
        });

        return decodedObject;
    }

    static parseUploadMetadata(event) {
        let metadata = this.decodeObject(event.file.upload_metadata);
        const splitFilename = metadata.filename.split('.');
        metadata.extension = (!!splitFilename[splitFilename.length - 1] ? splitFilename[splitFilename.length - 1] : '');
        metadata.originalFilename = metadata.filename;
        delete metadata.filename;

        return {
            id: event.file.id,
            filename: `${event.file.id}.${metadata.extension}`,
            upload_length: event.file.upload_length,
            metadata: metadata
        };
    };

    use(router, routerInfo, app) {
        app.use(router, [this.uploadApp]);
        console.log(routerInfo.onUploaded);
        server.on(EVENTS.EVENT_UPLOAD_COMPLETE, routerInfo.onUploaded);
    }

    initDataStore() {
        switch (data_store) {
            case 'GCSDataStore':
                server.datastore = new tus.GCSDataStore({
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

                server.datastore = new tus.S3Store({
                    path: this.settings.Folders.tmp,
                    bucket: process.env.AWS_BUCKET,
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                    region: process.env.AWS_REGION,
                    partSize: 8 * 1024 * 1024, // each uploaded part will have ~8MB,
                });
                break;

            default:
                console.log(this.settings.Folders.tmp);
                server.datastore = new tus.FileStore({
                    path: this.settings.Folders.tmp,
                });
        }
    }
}


module.exports = UploadServer;