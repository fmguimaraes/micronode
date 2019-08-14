"use strict"

module.exports = {
    Servers: {
        docker: '/var/run/docker.sock',
    },
    Authentication: {
        seed: 'something long',
        publicKey: './path/to/public/key.pem',
        privateKey: './path/to/private/key.pem',
        headerTokenName : 'a name you want'
    },

    Database : {
        test : {
            name: 'name-test',
            host: 'ip:port',
            user: "a guardian",
            password: "a strong password",
        },
        dev : {
            name: 'name',
            host: 'ip:port',
            user: "a guardian",
            password: "a strong password",
        },
    }
} 
