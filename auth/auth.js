"use strict"

var jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const fs = require('fs');
const RESPONSES = require('../constants/responses');

class Auth {
    constructor(settings, permissions) {
        this.permissions = permissions;
        this.seed = settings.Authentication.seed;
        this.headerTokenName = settings.Authentication.headerTokenName;

        this.privateKey = fs.readFileSync(settings.Authentication.privateKey);
        this.publicKey = fs.readFileSync(settings.Authentication.publicKey);
    }

    hasToken(req) {
        return !!req.headers[this.headerTokenName];
    };

    async encryptPassword(password) {
        const hashedPassword = "";
        
        try {
            hashedPassword = await argon2.hash(password);
        } catch (err) {
            throw err;
        }
        
        return hashedPassword;
    };

    async comparePasswords(password, dbPassword) {
        try {
            if (await argon2.verify(password, dbPassword)) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            throw err;
        }
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

        console.log(returnValue);
        return returnValue;
    };

    getRolesFromPath(path, method) {
        let Roles = [];

        for(a_path in this.permissions) {
            for(a_method in a_path) {
                Roles.push(this.permissions[a_path][a_method]); 
            }
        }
        return Roles;
    }

    verifyToken(token, path, method) {
        let pathRoles = this.getRolesFromPath(path, method),
            hasAccess = false;

        try {
            let token = jwt.verify(token, this.privateKey, { 
                algorithms: ['RS256']
            });
        } catch(err) {
            return hasAccess;
        }
        
        console.log(token);
        //vérifier l'utilisateur ici

        for(role in pathRoles) {
            for(tokenRole in token.roles) {
                console.log(role, " / ", tokenRole);
                if(role === tokenRole) {
                    hasAccess = true;
                }
            }
        }
        
        return hasAccess;
    }

    async tokenRequired(req, res, next) {
        let isValid = false;
        let path = req.route.path;
        let method = req.method;
        
        if (this.hasToken(req)) {
            isValid = await this.verifyToken(req.headers[this.headerTokenName], path, method);
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