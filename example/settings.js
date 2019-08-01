"use strict"

module.exports = {
    Server: {
        name: 'Example Service',
        host: '0.0.0.0',
        port: '8081',
    },
    Authentication: {
        secret: 'supersecret'
    },
    Features : {
        upload : true
    },
    Folders : {
        tmp: '/tmp', /* should be placed inside application's file */
        static: [
            { alias: '/files', location: '../../files/' }
        ],
    },
    Database: {
        test: {
            name: 'haliodx-test',
            host: 'localhost:27017/',
            user: "gateKeeper",
            password: "16c81a6c4ebcd09151720a4285dd74a5",
        },
        dev: {
            name: 'haliodx-test',
            host: 'localhost:27017/',
            user: "gateKeeper",
            password: "16c81a6c4ebcd09151720a4285dd74a5",
        },
        prod: {

        }
    },

} 
