"use strict"
let Route = require('@fmguimaraes/micronode').Route;
let DummyModel = require('../models/dummy');

class Dummy extends Route {
    constructor(server) {
        super(server);

        this.model = new DummyModel(server);
    }

    init() {
        this.routes = [
            { path: "/dummy/hello", post: this.hello.bind(this) },
            { path: "/dummy/auth", post: this.authenticate.bind(this) },
            { path: "/dummy/", post: this.create.bind(this), tokenRequired:true },
            { path: "/dummy/", get: this.read.bind(this) },
            { path: "/dummy/", update: this.update.bind(this) },
            { path: "/dummy/", delete: this.delete.bind(this) },
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
