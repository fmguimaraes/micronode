"use strict"

module.exports = {
    HOST:'0.0.0.0',
    PORT:'8081',
    UPLOAD_FOLDER:'/mach-two/tmp',
    STATIC_FOLDERS: [
        {alias:'public',location:'/mach-two/public'}
    ],
    upload : {
        formidable: true,
        encoding: 'utf-8',
        path: "/m2/uploads/"
    },

    user: "gateKeeper",
    password: "Sw0rdf15h",
    databaseHost: 'localhost:27017/',
    serverPort: 3000
}
