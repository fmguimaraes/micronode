"use strict"

var Route = require('../base-service/routes/route.js');

class SomeModelRoutes extends Route {
    constructor(node) {
        super(node);
    }

    init() {
        this.routes = [
            { path: "some-model/", post: this.create.bind(this), tokenRequired: false },
            { path: "some-model/", get: this.read.bind(this), tokenRequired: false },
            { path: "some-model/", update: this.put.bind(this), tokenRequired: false },
            { path: "some-model/", delete: this.delete.bind(this), tokenRequired: false },
        ];
    }
};

module.exports = SomeModelRoutes;
