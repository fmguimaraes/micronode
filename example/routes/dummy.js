"use strict"
let Route = require('../../routes/route.js');

class Dummy extends Route {
    constructor(app) {
        super(app);
    }

    init() {
        this.routes = [
            { path: "dummy/hello", post: this.hello.bind(this) },
            { path: "dummy/auth", post: this.authenticate.bind(this) },
            { path: "dummy/", post: this.create.bind(this) },
            { path: "dummy/", get: this.read.bind(this) },
            { path: "dummy/", update: this.put.bind(this) },
            { path: "dummy/", delete: this.delete.bind(this) },
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
