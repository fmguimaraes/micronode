"use strict"
let Route = require('../routes/route.js');

class Dummy extends Route {
    constructor(app) {
        super(app);
    }

    init() {
        this.routes = [
            { path: "dummy/auth", post: this.authenticate.bind(this), tokenRequired: false },
            { path: "dummy/", post: this.create.bind(this), tokenRequired: false },
            { path: "dummy/", get: this.read.bind(this), tokenRequired: false },
            { path: "dummy/", update: this.put.bind(this), tokenRequired: false },
            { path: "dummy/", delete: this.delete.bind(this), tokenRequired: false },
        ];
    }

    authenticate(req,res) {
        this.eventEmitter.emit('users.authenticate', req, res);
    }
};

module.exports = Dummy;
