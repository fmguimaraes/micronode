"use strict"
const Action = require('../action/action')

class DummyActions extends Action {
    constructor(app) {
        super(app)
        this.eventEmitter.on('user.authenticate', this.authenticate.bind(this));
    }

    async authenticate(req, res) {
        res.send({token:'grESTxDE4WQMloRNYt5L', message:'welcome'})
    }

};

module.exports = DummyActions;