"use strict"
var UserModel = require('../models/user.model.js')
var config = require('../consts/config');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const RESPONSES = require('../consts/responses')

function encrypt(text) {
    const hashPassword = bcrypt.hashSync(text);

    return hashPassword
};

function create24hToken(id) {
    var returnValue = null;

    try {
        returnValue = jwt.sign({ id: id }, config.secret, {
            expiresIn: 86400
        });
    } catch (e) {
        console.log(e);
        returnValue = e;
    }

    return returnValue;
};

function comparePasswords(password, dbPassword) {
    return (!!password && !!dbPassword) ? bcrypt.compareSync(password, dbPassword) : false;
}

async function verifyToken(token) {
    if (!token) {
        return false;
    }

    return new Promise(function (resolve, reject) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                reject(err)
            } else {
                resolve(decoded)
            }
        });
    });
}

function hasToken(req) {
    return !!req.headers['authorization'];;
};

async function validToken(req) {
    var authenticated = false;
    var token = hasToken(req) ? req.headers['authorization'] : null;

    let result, reason;

    try {
        result = await verifyToken(token)
        authenticated = result
    }
    catch (err) {
        reason = err;
    }

    return authenticated;
}


async function validateStoredToken(req) {
    let model = new UserModel();
    var headerToken = hasToken(req) ? req.headers['authorization'] : null;
    let response = await model.read({ _id: req.params.id });
    let isStoredToken = !!response[0] && !!response[0].token &&
        response[0].token === headerToken;

    return isStoredToken
}

async function tokenRequired(req, res, next) {
    let isValidToken = await validToken(req);
    let isStoredToken = await validateStoredToken(req);

    if (!hasToken(req)) {
        res.status(401).send(RESPONSES.TOKEN_NOT_PROVIDED)
    } else if (!isValidToken || !isStoredToken) {
        res.status(401).send(RESPONSES.INVALID_TOKEN)
    } else {
        next()
    }
};

module.exports = { tokenRequired, comparePasswords, encrypt, create24hToken };