"use strict"
var UserModel = require('../models/user.model.js')
const Action = require('./action')
const RESPONSES = require('../consts/responses')
var Auth = require('../auth/AuthController')

class UserActions extends Action {
    constructor(app) {
        super(app)
        this.model = new UserModel();

        this.eventEmitter.on('users.authenticate', this.authenticate.bind(this));
        this.eventEmitter.on('users.signout', this.signout.bind(this));
        this.eventEmitter.on('users.create', this.create.bind(this));
        this.eventEmitter.on('users.update', this.update.bind(this));
        this.eventEmitter.on('users.delete', this.delete.bind(this));
        this.eventEmitter.on('users.read', this.read.bind(this));
    }

    async authenticate(req, res) {
        let user, reason, passwordIsValid, tokenUpdated;

        try {
            user = await this.model.readOne({ email: req.body.email })
            if (!!user) {
                passwordIsValid = Auth.comparePasswords(req.body.password, user.password);
                if (passwordIsValid) {
                    delete user.password;
                    user = Object.assign(user, { token: Auth.create24hToken(user._id) });
                    tokenUpdated = await this.model.update({ _id: user._id }, { token: Auth.create24hToken(user._id) });
                }
            }
        } catch (err) {
            reason = err;
        }

        this.authenticateResponse(res, reason, user, passwordIsValid, tokenUpdated);
    }

    authenticateResponse(res, reason, user, passwordIsValid, tokenUpdated) {
        if (reason) {
            res.status(500).send(Object.assign(RESPONSES.DATABASE_ERROR, { raw: reason }))
        } else if (!user) {
            res.status(404).send(RESPONSES.UNKNOW_USER)
        } else if (!passwordIsValid) {
            res.status(200).send(RESPONSES.INVALID_PASSWORD)
        } else if (!!tokenUpdated) {
            res.status(200).send({ result: user })
        }
    }

    async read(req, res) {
        let code, result, reason;
        let query = this.model.createQuery( req.query);
        try {
            result = await this.model.readOne(query);
            code = !!result ? 200 : 404
            result = !!result ? result : RESPONSES.UNKNOW_USER
        } catch (err) {
            reason = err
            code = 500
            result = Object.assign(RESPONSES.DATABASE_ERROR, { raw: reason })
        }

        res.status(code).send(result)


    }

    async  signout(req, res) {
        let code, result, reason;
        try {
            try {
                result = await this.model.update({ _id: req.params.id }, { token: null });
                console.log(result);
            } catch (e) {
                console.log(e);
            }
            code = !!result ? 200 : 404
            result = !!result ? result : RESPONSES.UNKNOW_USER
        } catch (err) {
            reason = err
            code = 500
            result = Object.assign(RESPONSES.DATABASE_ERROR, { raw: reason })
        }

        res.status(code).send(result)
    }


    async create(req, res) {
        let userAlreadExists, reason, user;
        user = await this.model.readOne(req.params)
        userAlreadExists = !!user;

        if (!userAlreadExists) {
            let creationResponse = await this.createUser(Object.assign({}, req.body));
            user = Object.assign({}, creationResponse.user);
            delete user.password;
            delete user.token;
        }

        if (reason || !user) {
            res.status(500).send(Object.assign(RESPONSES.UNABLE_TO_CREATE_USER, { raw: reason }))
        } else if (userAlreadExists) {
            res.status(409).send(RESPONSES.USER_ALREADY_EXISTS)
        } else {
            res.status(200).send(user)
        }
    }

    async  update(req, res) {
        let code, result, reason;
        try {
            try {
                let query = this.model.createQuery(req.params);
                let body = req.body;
                body = this.sanitizeUserData(body);
                result = await this.model.update(query, body);

            } catch (e) {
                console.log(e);
            }
            code = !!result ? 200 : 404
            result = !!result ? result : RESPONSES.UNKNOW_USER
        } catch (err) {
            reason = err
            code = 500
            result = Object.assign(RESPONSES.DATABASE_ERROR, { raw: reason })
        }

        res.status(code).send(result)
    }

    async  delete(req, res) {
        /*
            TODO: delete ocurrence and mark as deleted in related services
        */
        let user, reason, result, code;
        let query = { _id: req.params.id }

        try {
            result = await this.model.delete(query);
            result = { accountId: result._id }
            code = !!result ? 200 : 404
            result = !!result ? result : RESPONSES.UNKNOW_USER
        } catch (err) {
            reason = err
            code = 500
        }

        res.status(code).send(result)
    }

    async createUser(body) {
        body.password = Auth.encrypt(body.password);
        //body.email = Auth.encrypt(body.email);
        let reason, user;

        try {
            user = await this.model.create(body)
        } catch (err) {
            reason = err
        }

        return { user: user, reason: reason }
    }

    removerUserPassword(users) {
        return users.map((user) => {
            return {
                _id: user._id,
            };
        });
    }

    sanitizeUserData(body) {
        for (let name in body) {
            if (!body[name]) {
                delete body[name];
            }
        }

        delete body.token;
        if (!!body.password) {
            body.password = !!body.password ? Auth.encrypt(body.password) : body.password;
        }

        return body;
    }
};

module.exports = UserActions;