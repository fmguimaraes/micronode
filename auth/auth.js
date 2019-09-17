"use strict"

var jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const fs = require('fs');
const RESPONSES = require('../constants/responses');

class Auth {
    constructor(settings, permissions) {
        this.permissions = permissions.permissions;
        this.seed = settings.Authentication.seed;
        this.headerTokenName = settings.Authentication.headerTokenName.toLowerCase();

        this.privateKey = fs.readFileSync(settings.Authentication.privateKey);
        this.publicKey = fs.readFileSync(settings.Authentication.publicKey);
    }

    hasToken(req) {
        return !!req.headers[this.headerTokenName];
    };

    async encryptPassword(password) {
        let hashedPassword = "";
        
        try {
            hashedPassword = await argon2.hash(password);
        } catch (err) {
            throw err;
        }
        
        return hashedPassword;
    };

    async comparePasswords(password, stockedPassword) {
        try {
            if (await argon2.verify(stockedPassword, password)) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            throw err;
        }
    }

    async decryptToken(token) {
        let decryptedToken = {};

        try {
            decryptedToken = await jwt.verify(token, this.privateKey, {
                algorithms: ['ES256']
            });
        } catch (err) {
            throw err;
        }
        
        return decryptedToken;
    }

    create24hToken(id, roleArray) {
        var returnValue = null;
        var content = {
            _id: id,
            roles: roleArray
        };

        try {
            returnValue = jwt.sign(content, this.publicKey, {
                algorithm: 'ES256',
                expiresIn: 86400
            });
        } catch (err) {
            throw err;
        }

        return returnValue;
    };

    async checkIfTokenHasRole(hasAccess, pathRoles, tokenRoles) {
        for(let role in pathRoles) {
            for(let tokenRole in tokenRoles) {
                if(pathRoles[role] === tokenRoles[tokenRole]) {
                    hasAccess = true;
                }
            }
        }

        return hasAccess;
    }

    async verifyToken(token, path, method) {
        let pathRoles = null,
            hasAccess = false;

        if(!!this.permissions[path] && !!this.permissions[path][method]) {
            pathRoles = this.permissions[path][method];
        } else {
            return hasAccess;
        }
        
        try {
            token = await jwt.verify(token, this.privateKey, { 
                algorithms: ['ES256']
            });
        } catch(err) {
            return hasAccess;
        }
        
        if(pathRoles && token.roles) {
            hasAccess = this.checkIfTokenHasRole(hasAccess, pathRoles, token.roles);
        }
        
        return hasAccess;
    }

    async tokenRequired(req, res, next) {
        let isValid = false,
            path = req.route.path,
            method = req.method,
            token = null;
        
        if (this.hasToken(req)) {
            token = req.headers[this.headerTokenName];
            isValid = await this.verifyToken(token, path, method);
        }

        if (!this.hasToken(req)) {
            res.status(RESPONSES.HTTP_STATUS.UNAUTHORIZED).send(RESPONSES.TOKEN_NOT_PROVIDED)
        } else if (!isValid) {
            res.status(RESPONSES.HTTP_STATUS.UNAUTHORIZED).send(RESPONSES.INVALID_TOKEN)
        } else {
            next()
        }
    };
}

module.exports = Auth;