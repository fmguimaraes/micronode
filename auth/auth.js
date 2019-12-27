"use strict"

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const RESPONSES = require('../constants/responses')
const {
    AUTH_TOKEN_NAME,
    AUTH_SECRET,
    AUTH_SEED,
    AUTH_PUB_KEY,
    AUTH_PRIVATE_KEY,
  } = process.env;

class Auth {
    constructor(settings, customAuthentication) {
        this.customAuthentication = customAuthentication;
    }

    hasToken(req) {
        return !!req.headers['authorization'];;
    };

    encrypt(text) {
        const hashPassword = bcrypt.hashSync(text);

        return hashPassword
    };


    comparePasswords(password, dbPassword) {
        return (!!password && !!dbPassword) ? bcrypt.compareSync(password, dbPassword) : false;
    }

    decrypt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    };

    create24hToken(id) {
        var returnValue = null;

        try {
            returnValue = jwt.sign({ _id: id }, AUTH_SECRET, {
                expiresIn: 86400
            });
        } catch (err) {
            throw err;
        }

        return returnValue;
    };

    async  verifyToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, AUTH_SECRET, function (err, decoded) {
                if (err) {
                    reject(err)
                } else {
                    resolve(decoded)
                }
            });

        });
    }

    async  decryptToken(token) {
        var tokenData = null;

        try {
            tokenData = await this.verifyToken(token)
        }
        catch (err) {
            //  console.log(err);
        }

        return tokenData;
    }


    async  validateToken(token) {
        let tokenData = await this.decryptToken(token);

        if (tokenData && this.customAuthentication) {
            tokenData = await this.customAuthentication(tokenData);
        }

        return tokenData;
    }

    async tokenRequired(req, res, next) {
        let isValid = false;

        if (this.hasToken(req)) {
            isValid = await this.validateToken(req.headers['authorization']);
        }

        if (!this.hasToken(req)) {
            res.status(401).send(RESPONSES.TOKEN_NOT_PROVIDED)
        } else if (!isValid) {
            res.status(401).send(RESPONSES.INVALID_TOKEN)
        } else {
            next()
        }
    };
}

module.exports = Auth;