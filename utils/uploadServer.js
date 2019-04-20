'use strict';

const path = require('path');
const fs = require('fs');
const assert = require('assert');
const express = require('express');

const Server = require('../tus-node-server/index').Server;
const FileStore = require('../tus-node-server/index').FileStore;
const GCSDataStore = require('../tus-node-server/index').GCSDataStore;
const S3Store = require('../tus-node-server/index').S3Store;
const EVENTS = require('../tus-node-server/index').EVENTS;


const data_store = process.env.DATA_STORE || 'FileStore';
const server = new Server();

class UploadServer {
    constructor(httpServer) {
        httpServer.all('*', server.handle.bind(server));
    }

    writeFile(req, res) {
        filename = path.join(process.cwd(), '/node_modules/tus-js-client', filename);


        return new Promise(function (resolve, reject) {
            fs.readFile(filename, 'binary', (err, file) => {
                if (err) {
                    reject(reject);
                }

                file = file.replace('https://master.tus.io/files/', `http://${host}:${port}/files/`)
                //  res.writeHead(200);
                //  res.write(file);
                //  res.end();

                resolve({ filename: filename, file: file });
            });
        });
    }
    initDataStore() {
        switch (data_store) {
            case 'GCSDataStore':
                server.datastore = new GCSDataStore({
                    path: '/files',
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
                    path: '/files',
                    bucket: process.env.AWS_BUCKET,
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                    region: process.env.AWS_REGION,
                    partSize: 8 * 1024 * 1024, // each uploaded part will have ~8MB,
                });
                break;

            default:
                server.datastore = new FileStore({
                    path: '/files',
                });
        }
    }
}


module.exports = UploadServer;