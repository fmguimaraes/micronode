"use strict"

module.exports = {
    Features : {
        upload:false
    },
    Server: {
        host:'0.0.0.0',
        port:'8080',
    },
    Folders :{
        results: '../files/',
        tmp: '/tmp',
        staticFolders: [
            { alias: '/files', location: '/../../../files/public' }
        ],
    },
    Database : {
        name:'machtwo',
        host:'localhost:27017/',
        user: "gateKeeper",
        password: "16c81a6c4ebcd09151720a4285dd74a5",
    }
} 