"use strict"
let Route = require('@fmguimaraes/micronode').Route;
let DummyModel = require('../models/dummy');

class Dummy extends Route {
    constructor(server) {
        super(server);
        this.model = new DummyModel(server);
        this.routes = [
            { path: "/dummy/hello", post: this.hello.bind(this) },
            { path: "/dummy/auth", post: this.authenticate.bind(this) },
            {
                path: "/dummy/", tokenRequired: true,
                post: this.create.bind(this),
                get: this.read.bind(this),
                put: this.update.bind(this),
                delete: this.delete.bind(this)
            },
        ];
    }

    authenticate(req, res) {
        this.eventEmitter.emit('users.authenticate', req, res);
    }

    hello(req, res) {
        res.status(200).send('hi');
    }
};

module.exports = Dummy;
