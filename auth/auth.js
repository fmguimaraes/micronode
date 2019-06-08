"use strict"

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const RESPONSES = require('../constants/responses')


class Auth {
    constructor(settings, customAuthentication) {
        this.customAuthentication = customAuthentication;
        this.secret = settings.Authentication.secret;
    }

    hasToken(req){
        return !!req.headers['authorization'];;
    };

    encrypt(text) {
        const hashPassword = bcrypt.hashSync(text);

        return hashPassword
    };


    decrypt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    };

    create24hToken(id) {
        var returnValue = null;

        try {
            returnValue = jwt.sign({ _id: id }, this.secret, {
                expiresIn: 86400
            });
        } catch (err) {
            throw err;
        }

        return returnValue;
    };

    async  verifyToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secret, function (err, decoded) {
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
            throw err;
        }

        return tokenData;
    }


    async  validateToken(token) {
        let tokenData = await this.decryptToken(token);
        console.log(tokenData);

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