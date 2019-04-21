"use strict"

module.exports = {
    HOST:'0.0.0.0',
    PORT:'8081',
    STATIC_FILES:'/static',
    upload : {
        formidable: true,
        encoding: 'utf-8',
        path: "/m2/uploads/"
    },

    user: "gateKeeper",
    password: "16c81a6c4ebcd09151720a4285dd74a5",
    databaseHost: 'localhost:27017/',
    serverPort: 8081
}
