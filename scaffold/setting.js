"use strict"

module.exports = {
    HOST:'0.0.0.0',
    PORT:'8081',
    UPLOAD_FOLDER: '/../files/tmp',
    
    STATIC_FOLDERS: [
        { alias: '/files', location: '/../../../files/public' }
    ],

    user: "gateKeeper",
    password: "16c81a6c4ebcd09151720a4285dd74a5",
    databaseHost: 'localhost:27017/',
    serverPort: 8081
}
